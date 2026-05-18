import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

describe("Two-way binding race condition reproduction", () => {
	beforeEach(() => {
		document.body.innerHTML = '';
		if (document.body[DOT_VDOM_PROP_NAME]) {
			document.body[DOT_VDOM_PROP_NAME] = null;
		}
	});

	test("Unmounting an input within the 200ms debounce window should not push undefined to the signal", async () => {
		const name = dot.state("Initial");
		const showInput = dot.state(true);
		
		let lastValueReceived: any = "Initial";
		name.subscribe((val) => {
			lastValueReceived = val;
		});

		// Render an input inside a conditional block
		dot(document.body).when(showInput, 
			dot.input({ 
				id: "test-input",
				value: name 
			})
		);
		dot.flushSync();

		const input = document.getElementById("test-input") as HTMLInputElement;
		expect(input).toBeTruthy();
		expect(input.value).toBe("Initial");

		// Simulate typing: change the value and trigger the input event
		input.value = "Changed";
		input.dispatchEvent(new Event('input', { bubbles: true }));

		// The framework now has a 200ms timer pending to set name.value = "Changed"

		// Wait 100ms
		await new Promise(resolve => setTimeout(resolve, 100));

		// IMMEDIATELY unmount the input by changing the condition
		showInput.value = false;
		dot.flushSync();

		// The input is now gone from the DOM and its VNode is unrendered
		expect(document.getElementById("test-input")).toBeNull();

		// Wait for the 200ms debounce timer to fire (total 350ms from input)
		await new Promise(resolve => setTimeout(resolve, 250));

		// PROOF: If the bug exists, lastValueReceived will be undefined because 
		// the dangling timer fired after unrender and read from a null element.
		// If the bug is fixed, it should either still be "Initial" (because the timer was cleared)
		// or "Changed" (if it managed to fire before unrender, though unlikely in this sync flow).
		// It should CERTAINLY NOT be undefined.
		
		if (lastValueReceived === undefined) {
			console.log("BUG CONFIRMED: lastValueReceived is undefined");
		} else {
			console.log("BUG NOT DETECTED: lastValueReceived is " + lastValueReceived);
		}

		expect(lastValueReceived).not.toBeUndefined();
		expect(lastValueReceived).not.toBe(undefined);
	});

	test("Flicker reproduction: rapid unmount and remount", async () => {
		const name = dot.state("Initial");
		const showInput = dot.state(true);
		
		let lastValueReceived: any = "Initial";
		name.subscribe((val) => {
			lastValueReceived = val;
		});

		dot(document.body).when(showInput, 
			dot.input({ 
				id: "test-input",
				value: name 
			})
		);
		dot.flushSync();

		const input = document.getElementById("test-input") as HTMLInputElement;
		input.value = "Changed";
		input.dispatchEvent(new Event('input', { bubbles: true }));

		await new Promise(resolve => setTimeout(resolve, 100));

		// Rapidly unmount and remount
		showInput.value = false;
		dot.flushSync();
		showInput.value = true;
		dot.flushSync();

		await new Promise(resolve => setTimeout(resolve, 250));

		if (lastValueReceived === undefined) {
			console.log("FLICKER CONFIRMED: lastValueReceived is undefined");
		} else {
			console.log("FLICKER NOT DETECTED: lastValueReceived is " + lastValueReceived);
		}

		expect(lastValueReceived).not.toBeUndefined();
	});
});
