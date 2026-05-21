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

describe("Immediate binding tests.", () => {
	test("Signal updates immediately on input.", () => {
		let obs = dot.state("initial");
		
		dot(document.body).input({ id: "my-input", bind: obs } as any);
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		expect(input.value).toBe("initial");

		input.value = "changed";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		
		// Should be immediate now, but we might still need flushSync if the scheduler is involved
		(dot as any).flushSync();

		expect(obs.value).toBe("changed");
	});

	test("Cursor position is preserved during immediate update.", () => {
		let obs = dot.state("abc");
		
		dot(document.body).input({ id: "my-input", bind: obs } as any);
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		input.focus();
		input.value = "a1bc";
		// Simulate cursor being after '1'
		input.setSelectionRange(2, 2);
		
		input.dispatchEvent(new Event("input", { bubbles: true }));
		(dot as any).flushSync();

		expect(obs.value).toBe("a1bc");
		// In a real browser, if the framework re-renders the value, the cursor might jump.
		// We want to ensure our implementation doesn't cause a jump if the value hasn't changed 
		// or if we handle it correctly.
		expect(input.selectionStart).toBe(2);
	});

	test("IME composition prevents immediate update.", () => {
		let obs = dot.state("initial");
		
		dot(document.body).input({ id: "my-input", bind: obs } as any);
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		// Start composition
		input.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }));
		
		input.value = "n";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		(dot as any).flushSync();
		expect(obs.value).toBe("initial"); // Should NOT update yet

		input.value = "ni";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		(dot as any).flushSync();
		expect(obs.value).toBe("initial"); // Should NOT update yet

		// End composition
		input.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true }));
		
		// Now it should update (either on compositionend or next input)
		// Most frameworks update on compositionend or the input event immediately following it.
		// Let's assume we want it to update on compositionend.
		(dot as any).flushSync();
		expect(obs.value).toBe("ni");
	});
});
