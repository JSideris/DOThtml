
import { dot, IDotComponent, IDotCore, IDotDocument } from "../../src";
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

describe("Advanced Refs.", () => {
	test("Method proxying.", () => {
		let ref = (dot as any).ref();
		let focused = false;
		dot(document.body).input({ 
			ref: ref, 
			onFocus: () => { focused = true; } 
		} as any);
		
		// Ensure the element is rendered and reachable
		expect(ref.element).toBeTruthy();
		
		// Call focus directly on the ref
		ref.focus();
		
		expect(focused).toBe(true);
	});

	test("Method proxying with arguments.", () => {
		let ref = (dot as any).ref();
		dot(document.body).div({ ref: ref } as any, "test");
		
		expect(ref.element.getAttribute("data-test")).toBeNull();
		
		// Call setAttribute directly on the ref
		ref.setAttribute("data-test", "value");
		
		expect(ref.element.getAttribute("data-test")).toBe("value");
	});

	test("Ref.ready() promise.", async () => {
		let ref = (dot as any).ref();
		let condition = dot.state(false);
		
		let readyResolved = false;
		let readyElement: HTMLElement | null = null;
		
		ref.ready().then(el => {
			readyResolved = true;
			readyElement = el;
		});
		
		expect(readyResolved).toBe(false);
		
		dot(document.body).when(condition, dot.div({ ref: ref } as any, "ready test"));
		(dot as any).flushSync();
		
		expect(readyResolved).toBe(false);
		
		condition.value = true;
		(dot as any).flushSync();
		
		// Wait for the promise to resolve
		await new Promise(resolve => setTimeout(resolve, 0));
		
		expect(readyResolved).toBe(true);
		expect(readyElement).toBeTruthy();
		expect((readyElement as any).innerHTML).toBe("ready test");
	});

	test("RefCollection basic usage.", () => {
		let refs = (dot as any).refCollection();
		let items = ["a", "b", "c"];
		
		dot(document.body).each(items, (item, i) => dot.div({ ref: refs.get(i) } as any, item));
		
		expect(refs.get(0).element.innerHTML).toBe("a");
		expect(refs.get(1).element.innerHTML).toBe("b");
		expect(refs.get(2).element.innerHTML).toBe("c");
		
		expect(Object.keys(refs.elements).length).toBe(3);
		expect(refs.elements[0].innerHTML).toBe("a");
	});

	test("RefCollection reactive updates.", () => {
		let refs = (dot as any).refCollection();
		let items = dot.state(["a", "b"]);
		
		dot(document.body).each(items, (item, i, k) => dot.div({ ref: refs.get(k) } as any, item));
		
		expect(Object.keys(refs.elements).length).toBe(2);
		
		items.value = ["a", "b", "c"];
		(dot as any).flushSync();
		
		expect(Object.keys(refs.elements).length).toBe(3);
		expect(refs.get(2).element.innerHTML).toBe("c");
		
		items.value = ["a"];
		(dot as any).flushSync();
		
		// Note: The collection might still have the refs, but their values should be null if unrendered
		expect(refs.get(1).value).toBeNull();
		expect(refs.get(2).value).toBeNull();
	});

	test("Function refs on elements.", () => {
		let capturedEl: HTMLElement | null = null;
		let callCount = 0;
		
		const refCallback = (el: HTMLElement | null) => {
			capturedEl = el;
			callCount++;
		};
		
		let condition = dot.state(true);
		dot(document.body).when(condition, dot.div({ ref: refCallback } as any, "callback test"));
		
		expect(callCount).toBe(1);
		expect(capturedEl).toBeTruthy();
		expect((capturedEl as any).innerHTML).toBe("callback test");
		
		condition.value = false;
		(dot as any).flushSync();
		
		expect(callCount).toBe(2);
		expect(capturedEl).toBeNull();
	});

	test("Function refs on components.", () => {
		class MyComponent implements IDotComponent {
			build() { return dot.div("comp"); }
		}
		
		let capturedComp: IDotComponent | null = null;
		let callCount = 0;
		
		const refCallback = (comp: IDotComponent | null) => {
			capturedComp = comp;
			callCount++;
		};
		
		let condition = dot.state(true);
		dot(document.body).when(condition, dot.mount(new MyComponent(), { ref: refCallback }));
		
		expect(callCount).toBe(1);
		expect(capturedComp).toBeInstanceOf(MyComponent);
		
		condition.value = false;
		(dot as any).flushSync();
		
		expect(callCount).toBe(2);
		expect(capturedComp).toBeNull();
	});
});
