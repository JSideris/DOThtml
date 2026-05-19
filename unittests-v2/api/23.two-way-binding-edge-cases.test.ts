
import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Two-way binding edge cases.", () => {
	test("Basic two-way binding.", () => {
		const name = dot.state("John");
		dot(document.body).input({ value: name });
		const input = document.body.querySelector("input") as HTMLInputElement;
		
		expect(input.value).toBe("John");
		
		input.value = "Jane";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		
		expect(name.value).toBe("Jane");
	});

	test("Redundant binding (Signal + manual onInput).", () => {
		const name = dot.state("John");
		let manualCallCount = 0;
		
		dot(document.body).input({ 
			value: name, 
			onInput: (e: any) => {
				manualCallCount++;
				name.value = e.target.value;
			}
		});
		
		const input = document.body.querySelector("input") as HTMLInputElement;
		
		input.value = "Jane";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		
		// The manual listener should have updated the signal
		expect(name.value).toBe("Jane");
		// The input value should still be Jane (not clobbered)
		expect(input.value).toBe("Jane");
		expect(manualCallCount).toBe(1);
	});

	test("Attribute ordering: value before onInput.", () => {
		const name = dot.state("John");
		dot(document.body).input({ 
			value: name, 
			onInput: (e: any) => { name.value = e.target.value; }
		});
		
		const input = document.body.querySelector("input") as HTMLInputElement;
		input.value = "Jane";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		
		expect(name.value).toBe("Jane");
		expect(input.value).toBe("Jane");
	});

	test("Attribute ordering: onInput before value.", () => {
		const name = dot.state("John");
		// We use a raw object to ensure order if the engine respects it
		dot(document.body).input({ 
			onInput: (e: any) => { name.value = e.target.value; },
			value: name
		} as any);
		
		const input = document.body.querySelector("input") as HTMLInputElement;
		input.value = "Jane";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		
		expect(name.value).toBe("Jane");
		expect(input.value).toBe("Jane");
	});

	test("The new 'bind' attribute logic.", () => {
		const name = dot.state("John");
		dot(document.body).input({ bind: name } as any);
		
		const input = document.body.querySelector("input") as HTMLInputElement;
		expect(input.value).toBe("John");
		
		input.value = "Jane";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		
		expect(name.value).toBe("Jane");
	});

	test("Checkbox two-way binding with 'bind'.", () => {
		const checked = dot.state(false);
		dot(document.body).input({ type: "checkbox", bind: checked } as any);
		
		const input = document.body.querySelector("input") as HTMLInputElement;
		expect(input.checked).toBe(false);
		
		input.checked = true;
		input.dispatchEvent(new Event("input", { bubbles: true }));
		
		expect(checked.value).toBe(true);
	});

	test("Attribute ordering: bind before type (checkbox).", () => {
		const checked = dot.state(false);
		// Order matters here!
		dot(document.body).input({ bind: checked, type: "checkbox" } as any);
		
		const input = document.body.querySelector("input") as HTMLInputElement;
		expect(input.type).toBe("checkbox");
		
		input.checked = true;
		input.dispatchEvent(new Event("input", { bubbles: true }));
		
		expect(checked.value).toBe(true);
	});
});
