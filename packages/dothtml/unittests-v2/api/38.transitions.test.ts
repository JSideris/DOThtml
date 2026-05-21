import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("VDOM Transitions and Lifecycle Hooks", () => {

	test("onEnter hook is called when element is rendered", () => {
		let entered = false;
		dot(document.body).div("Hello").onEnter(() => {
			entered = true;
		});
		expect(entered).toBe(true);
	});

	test("onLeave hook is called when element is unrendered", async () => {
		let left = false;
		const show = dot.state(true);
		dot(document.body).when(show, 
			dot.div("Hello").onLeave(() => {
				left = true;
			})
		);
		
		expect(left).toBe(false);
		show.value = false;
		
		// Wait for the async unrender to finish
		await new Promise(r => setTimeout(r, 0));
		
		expect(left).toBe(true);
	});

	test("onLeave with Promise delays removal in ConditionalVdom", async () => {
		let resolveLeave: () => void;
		const leavePromise = new Promise<void>(resolve => {
			resolveLeave = resolve;
		});

		const show = dot.state(true);
		dot(document.body).when(show, 
			dot.div("Hello").onLeave(() => leavePromise)
		);

		expect(document.body.innerHTML).toContain("Hello");
		
		// Trigger leave
		show.value = false;
		
		// Should still be in DOM because promise hasn't resolved
		expect(document.body.innerHTML).toContain("Hello");

		// Resolve leave
		resolveLeave!();
		await leavePromise;
		
		// Need to wait for the VDOM to finish its async unrender
		// Since we don't have a built-in way to wait for VDOM internal async ops in tests yet,
		// we might need to wait a tick or use a helper.
		await new Promise(r => setTimeout(r, 0));

		expect(document.body.innerHTML).not.toContain("Hello");
	});

	test("onLeave with Promise delays removal in CollectionVdom", async () => {
		let resolveLeave: () => void;
		const leavePromise = new Promise<void>(resolve => {
			resolveLeave = resolve;
		});

		const list = dot.state(["a", "b"]);
		dot(document.body).each(list, item => 
			dot.div(item).onLeave(() => item === "a" ? leavePromise : undefined)
		);

		expect(document.body.innerHTML).toContain("a");
		expect(document.body.innerHTML).toContain("b");

		// Remove "a"
		list.value = ["b"];

		// "a" should still be in DOM
		expect(document.body.innerHTML).toContain("a");

		// Resolve leave
		resolveLeave!();
		await leavePromise;
		await new Promise(r => setTimeout(r, 0));

		expect(document.body.innerHTML).not.toContain("a");
		expect(document.body.innerHTML).toContain("b");
	});

	test("Interrupted transition: condition toggles back to true before leave finishes", async () => {
		let resolveLeave: () => void;
		const leavePromise = new Promise<void>(resolve => {
			resolveLeave = resolve;
		});

		const show = dot.state(true);
		let enterCount = 0;
		dot(document.body).when(show, 
			dot.div("Hello")
				.onEnter(() => { enterCount++; })
				.onLeave(() => leavePromise)
		);

		expect(enterCount).toBe(1);

		// Start leave
		show.value = false;
		expect(document.body.innerHTML).toContain("Hello");

		// Toggle back to true before leave finishes
		show.value = true;
		
		// Should still be in DOM, and shouldn't have re-entered yet (or should it?)
		// Ideally, if it's the same vnode, it just stays.
		expect(document.body.innerHTML).toContain("Hello");
		
		resolveLeave!();
		await leavePromise;
		await new Promise(r => setTimeout(r, 0));

		expect(document.body.innerHTML).toContain("Hello");
		// If it stayed, enterCount should still be 1. 
		// If it was removed and re-added, it would be 2.
		// For now, let's see what the implementation does.
	});

	test("fade() helper applies transitions", async () => {
		const show = dot.state(true);
		let animateCalled = false;
		
		// Mock animate
		const originalAnimate = HTMLElement.prototype.animate;
		HTMLElement.prototype.animate = function() {
			animateCalled = true;
			return { finished: Promise.resolve() } as any;
		};

		try {
			dot(document.body).when(show, 
				dot.div("Fading").fade(100)
			);

			expect(animateCalled).toBe(true);
			animateCalled = false;

			show.value = false;
			await new Promise(r => setTimeout(r, 0));
			expect(animateCalled).toBe(true);
		} finally {
			HTMLElement.prototype.animate = originalAnimate;
		}
	});

	test("slide() helper applies transitions", async () => {
		const show = dot.state(true);
		let animateCalled = false;
		
		// Mock animate
		const originalAnimate = HTMLElement.prototype.animate;
		HTMLElement.prototype.animate = function() {
			animateCalled = true;
			return { finished: Promise.resolve() } as any;
		};

		try {
			dot(document.body).when(show, 
				dot.div("Sliding").slide(100)
			);

			expect(animateCalled).toBe(true);
			animateCalled = false;

			show.value = false;
			await new Promise(r => setTimeout(r, 0));
			expect(animateCalled).toBe(true);
		} finally {
			HTMLElement.prototype.animate = originalAnimate;
		}
	});

	test("Component onEnter and onLeave hooks", async () => {
		let entered = false;
		let left = false;
		let resolveLeave: () => void;
		const leavePromise = new Promise<void>(resolve => {
			resolveLeave = resolve;
		});

		class MyComponent {
			onEnter() { entered = true; }
			onLeave() { return leavePromise; }
			build() { return dot.div("Comp"); }
		}

		const show = dot.state(true);
		dot(document.body).when(show, dot.mount(new MyComponent() as any));

		expect(entered).toBe(true);
		const host = Array.from(document.body.childNodes).find(n => n.nodeName.startsWith("DOTHTML-")) as any;
		expect(host.shadowRoot!.innerHTML).toContain("Comp");

		show.value = false;
		expect(host.parentNode).toBe(document.body); // Still in DOM

		resolveLeave!();
		await leavePromise;
		await new Promise(r => setTimeout(r, 0));

		expect(host.parentNode).toBeNull(); // Removed from DOM
	});
});
