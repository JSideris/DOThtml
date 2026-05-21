import { dot, IDotComponent, IDotDocument } from "../../src";
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

describe("Computed state.", () => {
	test("Basic computed reactivity.", () => {
		const first = dot.state("John");
		const last = dot.state("Doe");
		const full = dot.computed(() => `${first.value} ${last.value}`);

		dot(document.body).div(full);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<div>John Doe</div>"));

		first.value = "Jane";
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<div>Jane Doe</div>"));

		last.value = "Smith";
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<div>Jane Smith</div>"));
	});

	test("Diamond problem (single update).", () => {
		const count = dot.state(0);
		let evaluations = 0;
		const a = dot.computed(() => {
			evaluations++;
			return count.value + 1;
		});
		const b = dot.computed(() => count.value + 2);
		const combined = dot.computed(() => a.value + b.value);

		dot(document.body).div(combined);
		expect(evaluations).toBe(1);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<div>3</div>"));

		count.value = 1;
		dot.flushSync();
		// combined should only trigger one update of the DOM.
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<div>5</div>"));
		expect(evaluations).toBe(2);
	});

	test("Circular dependency detection.", () => {
		const a = dot.state(0);
		const b = dot.state(0);
		
		let compA: any;
		let compB: any;

		compA = dot.computed(() => {
			if (a.value > 0) return compB.value + 1;
			return 1;
		});
		compB = dot.computed(() => {
			if (b.value > 0) return compA.value + 1;
			return 1;
		});

		// Trigger the cycle
		a.value = 1;
		b.value = 1;

		dot.flushSync();

		expect(() => {
			let x = compA.value;
		}).toThrow("Circular dependency detected");
	});

	test("Dynamic dependency tracking.", () => {
		const useA = dot.state(true);
		const a = dot.state("A");
		const b = dot.state("B");
		let evaluations = 0;
		const combined = dot.computed(() => {
			evaluations++;
			return useA.value ? a.value : b.value;
		});

		dot(document.body).div(combined);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<div>A</div>"));
		expect(evaluations).toBe(1);

		// Update B - should not trigger evaluation
		b.value = "B2";
		dot.flushSync();
		expect(evaluations).toBe(1);

		// Update A - should trigger evaluation
		a.value = "A2";
		dot.flushSync();
		expect(evaluations).toBe(2);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<div>A2</div>"));

		// Switch to B
		useA.value = false;
		dot.flushSync();
		expect(evaluations).toBe(3);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<div>B2</div>"));

		// Update A - should no longer trigger evaluation
		a.value = "A3";
		dot.flushSync();
		expect(evaluations).toBe(3);

		// Update B - should trigger evaluation
		b.value = "B3";
		dot.flushSync();
		expect(evaluations).toBe(4);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<div>B3</div>"));
	});

	test("Memory leak / Disposal.", () => {
		const source = dot.state(1);
		const comp = dot.computed(() => source.value * 2);
		
		expect((source as any).subscribers.size).toBe(1);
		
		(comp as any).dispose();
		expect((source as any).subscribers.size).toBe(0);
	});

	test("Component auto-cleanup.", () => {
		const source = dot.state(1);
		let compRef: any;

		class MyComponent implements IDotComponent {
			_?: any;
			build() {
				compRef = dot.computed(() => source.value * 2);
				return dot.div(compRef);
			}
		}

		const c = new MyComponent();
		dot(document.body).mount(c);
		
		// 1 for the computed signal
		expect((source as any).subscribers.size).toBe(1);
		// 1 for the text binding inside the component's shadow DOM
		expect((compRef as any).subscribers.size).toBe(1);
		
		const root = document.body[DOT_VDOM_PROP_NAME];
		root.children._unrender();
		
		expect((source as any).subscribers.size).toBe(0);
		expect((compRef as any).subscribers.size).toBe(0);
	});
});
