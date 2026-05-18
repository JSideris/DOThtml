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

describe("Two-way binding safety.", () => {
	test("Race Condition: Unrender during debounce should not throw or set undefined.", () => {
		let obs = dot.state("initial");
		
		dot(document.body).input({ id: "my-input", value: obs });
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		input.value = "new value";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		
		// Unrender before debounce fires
		const root = document.body[DOT_VDOM_PROP_NAME];
		root.children._unrender();
		
		expect(() => {
			jest.runAllTimers();
		}).not.toThrow();
		
		expect(obs.value).toBe("initial");
	});

	test("Stale Closure: Swapping binding should update the new signal.", () => {
		let obs1 = dot.state("obs1");
		let obs2 = dot.state("obs2");
		
		// We'll manually call setAttr to simulate a binding swap
		dot(document.body).input({ id: "my-input", value: obs1.bind() });
		
		let input = document.getElementById("my-input") as HTMLInputElement;
		let vdom = input[DOT_VDOM_PROP_NAME];
		
		expect(input.value).toBe("obs1");

		// Start typing
		input.value = "typing...";
		input.dispatchEvent(new Event("input", { bubbles: true }));

		// Swap binding before debounce fires
		vdom.setAttr("value", obs2.bind());
		(dot as any).flushSync();
		expect(input.value).toBe("obs2");

		// Type again into the new binding
		input.value = "new typing";
		input.dispatchEvent(new Event("input", { bubbles: true }));

		jest.runAllTimers();
		(dot as any).flushSync();
		
		expect(obs1.value).toBe("obs1"); // Should not have been updated
		expect(obs2.value).toBe("new typing"); // Should have been updated
	});

	test("Global State Isolation: Multiple inputs should not interfere.", () => {
		let obs1 = dot.state("v1");
		let obs2 = dot.state("v2");
		
		dot(document.body)
			.input({ id: "input1", value: obs1.bind() })
			.input({ id: "input2", value: obs2.bind() });
			
		let i1 = document.getElementById("input1") as HTMLInputElement;
		let i2 = document.getElementById("input2") as HTMLInputElement;
		
		i1.value = "new1";
		i1.dispatchEvent(new Event("input", { bubbles: true }));
		
		// Wait 100ms (halfway through debounce)
		jest.advanceTimersByTime(100);
		
		i2.value = "new2";
		i2.dispatchEvent(new Event("input", { bubbles: true }));
		
		// Wait another 100ms (i1 should fire now)
		jest.advanceTimersByTime(100);
		(dot as any).flushSync();
		expect(obs1.value).toBe("new1");
		expect(obs2.value).toBe("v2"); // i2 still has 100ms left
		
		// Wait remaining 100ms
		jest.advanceTimersByTime(100);
		(dot as any).flushSync();
		expect(obs2.value).toBe("new2");
	});

	test("Memory Management: Timers should be cleared on unrender.", () => {
		let obs = dot.state("initial");
		dot(document.body).input({ value: obs.bind() });
		let input = document.querySelector("input") as HTMLInputElement;
		
		input.value = "changed";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		
		expect(jest.getTimerCount()).toBe(1);
		
		const root = document.body[DOT_VDOM_PROP_NAME];
		root.children._unrender();
		
		expect(jest.getTimerCount()).toBe(0);
	});
});
