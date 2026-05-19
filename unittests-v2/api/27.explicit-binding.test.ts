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

describe("Explicit two-way binding (Phase 2).", () => {
	test("dot.input({ bind: signal }) provides two-way binding.", () => {
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

	test("dot.input({ value: signal }) provides two-way binding (backward compatibility).", () => {
		const name = dot.state("Initial");
		dot(document.body).input({ id: "my-input", value: name } as any);
		const input = document.getElementById("my-input") as HTMLInputElement;

		expect(input.value).toBe("Initial");

		// DOM -> Signal
		input.value = "Manual";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		dot.flushSync();
		expect(name.value).toBe("Manual");
	});

	test("dot.input({ value: signal, onInput: ... }) provides one-way binding for value.", () => {
		const name = dot.state("Initial");
		let manualFired = false;
		dot(document.body).input({ 
			id: "my-input", 
			value: name, 
			onInput: (e: any) => {
				manualFired = true;
				// We explicitly DO NOT update the signal here to prove the framework doesn't do it either.
			}
		} as any);
		const input = document.getElementById("my-input") as HTMLInputElement;

		input.value = "Manual";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		dot.flushSync();

		expect(manualFired).toBe(true);
		expect(name.value).toBe("Initial"); // Should NOT have changed automatically
	});

	test("dot.input({ bind: signal, onInput: ... }) provides coordinated two-way binding.", () => {
		const name = dot.state("Initial");
		let manualValue = "";
		dot(document.body).input({ 
			id: "my-input", 
			bind: name, 
			onInput: (e: any) => {
				manualValue = e.target.value;
			}
		} as any);
		const input = document.getElementById("my-input") as HTMLInputElement;

		input.value = "Manual";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		dot.flushSync();

		expect(manualValue).toBe("Manual");
		expect(name.value).toBe("Manual"); // 'bind' should still work even with onInput
	});

	test("Checkbox bind: signal works.", () => {
		const checked = dot.state(true);
		dot(document.body).input({ id: "my-check", type: "checkbox", bind: checked } as any);
		const input = document.getElementById("my-check") as HTMLInputElement;

		expect(input.checked).toBe(true);

		input.checked = false;
		input.dispatchEvent(new Event("input", { bubbles: true }));
		dot.flushSync();
		expect(checked.value).toBe(false);
	});
});
