import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

describe("Two-way binding race condition reproduction", () => {
	beforeEach(() => {
		document.body.innerHTML = '';
		if (document.body[DOT_VDOM_PROP_NAME]) {
			document.body[DOT_VDOM_PROP_NAME] = null;
		}
	});

	test("Unmounting an input immediately after input should not push undefined to the signal", async () => {
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
				bind: name 
			} as any)
		);
		dot.flushSync();

		const input = document.getElementById("test-input") as HTMLInputElement;
		expect(input).toBeTruthy();
		expect(input.value).toBe("Initial");

		// Simulate typing: change the value and trigger the input event
		input.value = "Changed";
		input.dispatchEvent(new Event('input', { bubbles: true }));

		// IMMEDIATELY unmount the input by changing the condition
		showInput.value = false;
		dot.flushSync();

		// The input is now gone from the DOM and its VNode is unrendered
		expect(document.getElementById("test-input")).toBeNull();

		// With immediate updates, the signal is updated as soon as the event is dispatched.
		expect(lastValueReceived).not.toBeUndefined();
		expect(lastValueReceived).toBe("Changed");
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
				bind: name 
			} as any)
		);
		dot.flushSync();

		const input = document.getElementById("test-input") as HTMLInputElement;
		input.value = "Changed";
		input.dispatchEvent(new Event('input', { bubbles: true }));

		// Rapidly unmount and remount
		showInput.value = false;
		dot.flushSync();
		showInput.value = true;
		dot.flushSync();

		expect(lastValueReceived).not.toBeUndefined();
		expect(lastValueReceived).toBe("Changed");
	});
});
