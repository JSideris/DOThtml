import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => { 
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Explicit two-way binding (Phase 3).", () => {
	test("dot.input({ value: signal }) is now ONE-WAY.", () => {
		const name = dot.state("Initial");
		dot(document.body).input({ id: "my-input", value: name } as any);
		const input = document.getElementById("my-input") as HTMLInputElement;

		expect(input.value).toBe("Initial");

		// Signal -> DOM (still works)
		name.value = "Changed";
		dot.flushSync();
		expect(input.value).toBe("Changed");

		// DOM -> Signal (should NO LONGER work)
		input.value = "Manual";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		dot.flushSync();
		expect(name.value).toBe("Changed"); // Still "Changed", not "Manual"
	});

	test("dot.input({ bind: signal }) is TWO-WAY.", () => {
		const name = dot.state("Initial");
		dot(document.body).input({ id: "my-input", bind: name } as any);
		const input = document.getElementById("my-input") as HTMLInputElement;

		expect(input.value).toBe("Initial");

		// Signal -> DOM
		name.value = "Changed";
		dot.flushSync();
		expect(input.value).toBe("Changed");

		// DOM -> Signal
		input.value = "Manual";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		dot.flushSync();
		expect(name.value).toBe("Manual");
	});

	test("Checkbox { checked: signal } is now ONE-WAY.", () => {
		const checked = dot.state(true);
		dot(document.body).input({ id: "my-check", type: "checkbox", checked: checked } as any);
		const input = document.getElementById("my-check") as HTMLInputElement;

		expect(input.checked).toBe(true);

		// DOM -> Signal (should NO LONGER work)
		input.checked = false;
		input.dispatchEvent(new Event("input", { bubbles: true }));
		dot.flushSync();
		expect(checked.value).toBe(true); // Still true
	});

	test("Checkbox { bind: signal } is TWO-WAY.", () => {
		const checked = dot.state(true);
		dot(document.body).input({ id: "my-check", type: "checkbox", bind: checked } as any);
		const input = document.getElementById("my-check") as HTMLInputElement;

		expect(input.checked).toBe(true);

		// DOM -> Signal
		input.checked = false;
		input.dispatchEvent(new Event("input", { bubbles: true }));
		dot.flushSync();
		expect(checked.value).toBe(false);
	});
});
