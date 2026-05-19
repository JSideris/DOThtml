import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

describe("Idempotent binding and listener coordination", () => {
	beforeEach(() => {
		document.body.innerHTML = '';
		if (document.body[DOT_VDOM_PROP_NAME]) {
			document.body[DOT_VDOM_PROP_NAME] = null;
		}
	});

	test("Manual onInput setting same value results in exactly one signal update", () => {
		const mySignal = dot.state("initial");
		let signalUpdates = 0;
		mySignal.subscribe(() => {
			signalUpdates++;
		});

		dot(document.body).input({ 
			id: "test-input",
			value: mySignal, 
			onInput: (e: any) => {
				mySignal.value = e.target.value;
			}
		});
		dot.flushSync();

		const input = document.getElementById("test-input") as HTMLInputElement;
		
		// Reset counter after initial render update
		signalUpdates = 0;

		// Simulate typing 'a'
		input.value = "a";
		input.dispatchEvent(new Event('input', { bubbles: true }));
		dot.flushSync();

		// Currently, this fails and returns 2 because:
		// 1. Framework internal listener fires (native, first) -> sets signal to 'a'
		// 2. Manual listener fires (delegated, second) -> sets signal to 'a' again
		// Even if Signal has an equality check, the Binding._set might be called twice.
		// We want it to be 1.
		expect(mySignal.value).toBe("a");
		expect(signalUpdates).toBe(1);
	});

	test("bindAs transform with manual onInput does not cause state loss", () => {
		const mySignal = dot.state("abc");
		
		dot(document.body).input({ 
			id: "test-input",
			value: mySignal.bindAs({
				display: (v) => v.toUpperCase(),
				read: (v) => v.toLowerCase()
			}),
			onInput: (e: any) => {
				// Developer manually syncs
				mySignal.value = e.target.value.toLowerCase();
			}
		});
		dot.flushSync();

		const input = document.getElementById("test-input") as HTMLInputElement;
		expect(input.value).toBe("ABC");

		// Simulate typing 'd' at the end -> "abcd" -> should become "ABCD"
		input.value = "ABCd";
		input.dispatchEvent(new Event('input', { bubbles: true }));
		dot.flushSync();

		// If the internal listener fires first and reads "ABCd", it might push "abcd" to signal.
		// Then manual listener fires and pushes "abcd" to signal.
		// If they both happen, it might be okay, but if the internal one reads a mid-reconciliation state, it breaks.
		expect(mySignal.value).toBe("abcd");
		expect(input.value).toBe("ABCD");
	});

	test("Manual listeners 'win' when they set a different value than raw DOM input", () => {
		const mySignal = dot.state("");
		
		dot(document.body).input({ 
			id: "test-input",
			value: mySignal,
			onInput: (e: any) => {
				// Force uppercase regardless of what was typed
				mySignal.value = e.target.value.toUpperCase();
			}
		});
		dot.flushSync();

		const input = document.getElementById("test-input") as HTMLInputElement;

		// Type 'a'
		input.value = "a";
		input.dispatchEvent(new Event('input', { bubbles: true }));
		dot.flushSync();

		// Internal listener would set it to 'a'.
		// Manual listener sets it to 'A'.
		// We want 'A' to be the final state.
		expect(mySignal.value).toBe("A");
		expect(input.value).toBe("A");
	});

	test("Manual listener can prevent signal update", () => {
		const mySignal = dot.state("initial");
		let signalUpdates = 0;
		mySignal.subscribe(() => {
			signalUpdates++;
		});

		dot(document.body).input({ 
			id: "test-input",
			value: mySignal, 
			onInput: (e: any) => {
				if(e.target.value === "forbidden"){
					e.target.value = "initial";
					// We don't want the signal to ever see "forbidden"
					mySignal.value = "initial";
				}
			}
		});
		dot.flushSync();

		const input = document.getElementById("test-input") as HTMLInputElement;
		signalUpdates = 0;

		input.value = "forbidden";
		input.dispatchEvent(new Event('input', { bubbles: true }));
		dot.flushSync();

		// Currently, the framework listener fires FIRST (native).
		// It sees "forbidden" and sets the signal.
		// Then the manual listener fires and sets input.value back to "initial".
		// But the signal might have already triggered side effects with "forbidden".
		
		// If we fix the order, the manual listener runs first, sets it back to "initial",
		// and the framework listener (running second) sees "initial", which matches the signal,
		// so it does nothing.
		
		expect(mySignal.value).toBe("initial");
		// It should have 0 updates because it was already "initial"
		expect(signalUpdates).toBe(0);
	});
});
