import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

beforeEach(() => {
	jest.useFakeTimers();
});

afterEach(() => { 
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
	jest.useRealTimers();
});

describe("Binding safety.", () => {
	test("Computed signal in input value should not crash on user input.", () => {
		const s = dot.state("initial");
		const c = dot.computed(() => s.value.toUpperCase());
		
		dot(document.body).input({ id: "my-input", value: c });
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		expect(input.value).toBe("INITIAL");

		// Simulate user input
		input.value = "changed";
		
		// This should NOT throw TypeError: Cannot set property value of #<Computed> which has only a getter
		expect(() => {
			input.dispatchEvent(new Event("input", { bubbles: true }));
			jest.runAllTimers();
		}).not.toThrow();

		// The computed value should still be based on the original state (since it's one-way)
		// Note: The DOM value might be "changed" until the next render, but the reactive state shouldn't have changed.
		expect(s.value).toBe("initial");
	});

	test("Computed signal in checkbox should not crash on user input.", () => {
		const s = dot.state(true);
		const c = dot.computed(() => !s.value);
		
		dot(document.body).input({ id: "my-check", type: "checkbox", checked: c });
		let input = document.getElementById("my-check") as HTMLInputElement;
		
		expect(input.checked).toBe(false);

		// Simulate user interaction
		input.checked = true;
		
		expect(() => {
			input.dispatchEvent(new Event("input", { bubbles: true }));
			jest.runAllTimers();
		}).not.toThrow();

		expect(s.value).toBe(true);
	});

	test("Binding with only display transform should be read-only.", () => {
		const s = dot.state("abc");
		const b = s.bindAs(v => v + "!");
		
		dot(document.body).input({ id: "my-input", value: b });
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		expect(input.value).toBe("abc!");

		input.value = "xyz";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		jest.runAllTimers();

		// Should NOT have updated the source signal because there was no 'read' transform
		expect(s.value).toBe("abc");
	});

	test("Binding with both display and read transforms should be writable.", () => {
		const s = dot.state(10);
		const b = s.bindAs({
			display: v => `$${v}`,
			read: v => parseInt(v.replace("$", ""))
		});
		
		dot(document.body).input({ id: "my-input", bind: b } as any);
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		expect(input.value).toBe("$10");

		input.value = "$20";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		jest.runAllTimers();

		expect(s.value).toBe(20);
	});
});
