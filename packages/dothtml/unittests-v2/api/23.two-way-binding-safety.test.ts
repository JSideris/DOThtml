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

describe("Two-way binding safety.", () => {
	test("Race Condition: Unrender after input should not throw or set undefined.", () => {
		let obs = dot.state("initial");
		
		dot(document.body).input({ id: "my-input", bind: obs } as any);
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		input.value = "new value";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		
		// Unrender immediately after input
		const root = document.body[DOT_VDOM_PROP_NAME];
		root.children._unrender();
		
		expect(() => {
			(dot as any).flushSync();
		}).not.toThrow();
		
		// With immediate updates, the signal is updated as soon as the event is dispatched.
		expect(obs.value).toBe("new value");
	});

	test("Stale Closure: Swapping binding should update the new signal.", () => {
		let obs1 = dot.state("obs1");
		let obs2 = dot.state("obs2");
		
		// We'll manually call setAttr to simulate a binding swap
		dot(document.body).input({ id: "my-input", bind: obs1.bind() } as any);
		
		let input = document.getElementById("my-input") as HTMLInputElement;
		let vdom = input[DOT_VDOM_PROP_NAME];
		
		expect(input.value).toBe("obs1");

		// Start typing
		input.value = "typing...";
		input.dispatchEvent(new Event("input", { bubbles: true }));

		// Swap binding immediately
		vdom.setAttr("bind", obs2.bind());
		(dot as any).flushSync();
		expect(input.value).toBe("obs2");

		// Type again into the new binding
		input.value = "new typing";
		input.dispatchEvent(new Event("input", { bubbles: true }));

		(dot as any).flushSync();
		
		expect(obs1.value).toBe("typing..."); // Updated by the first event
		expect(obs2.value).toBe("new typing"); // Updated by the second event
	});

	test("Global State Isolation: Multiple inputs should not interfere.", () => {
		let obs1 = dot.state("v1");
		let obs2 = dot.state("v2");
		
		dot(document.body)
			.input({ id: "input1", bind: obs1.bind() } as any)
			.input({ id: "input2", bind: obs2.bind() } as any);
			
		let i1 = document.getElementById("input1") as HTMLInputElement;
		let i2 = document.getElementById("input2") as HTMLInputElement;
		
		i1.value = "new1";
		i1.dispatchEvent(new Event("input", { bubbles: true }));
		
		i2.value = "new2";
		i2.dispatchEvent(new Event("input", { bubbles: true }));
		
		(dot as any).flushSync();
		expect(obs1.value).toBe("new1");
		expect(obs2.value).toBe("new2");
	});
});
