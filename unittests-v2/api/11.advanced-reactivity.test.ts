import { dot, IDotComponent, IDotCore } from "../../src";
import formatHTML from "./formatHTML";
import Signal from "../../src/reactivity/signal";

describe("Advanced Reactivity and Edge Cases", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
	});

	test("Constructor Cleanup: computeds in class properties are disposed", () => {
		const source = dot.state(1);

		@(dot.component as any)
		class MyComponent implements IDotComponent {
			// This computed is created during instantiation (constructor)
			double = dot.computed(() => {
				const val = source.value * 2;
				return val;
			});
			
			build(dot: IDotCore) {
				return dot.div(this.double);
			}
		}

		const comp = new MyComponent();
		const vdom = (dot(document.body) as any).mount(comp);
		dot.flushSync();

		const shadowRoot = document.body.children[0].shadowRoot;
		expect(formatHTML(shadowRoot?.innerHTML || "")).toContain("2");
		
		const initialBindings = (source as any).subscribers.size;
		expect(initialBindings).toBeGreaterThan(0);

		(vdom as any)._unrender();
		dot.flushSync();

		// After unmount, the computed should be disposed, so it should detach from source.
		expect((source as any).subscribers.size).toBe(0);
	});

	test("Reactive Validation: type: String accepts Signal<string>", () => {
		@(dot.component as any)
		class Child implements IDotComponent {
			static props = {
				name: { type: String, required: true }
			};
			props: { name: Signal<string> | string };
			build(dot: IDotCore) {
				return dot.div(this.props.name);
			}
		}

		const nameSignal = dot.state("John");
		
		// Should NOT throw
		(dot(document.body) as any).mount(new Child(), { name: nameSignal });
		dot.flushSync();

		const shadowRoot = document.body.children[0].shadowRoot;
		expect(formatHTML(shadowRoot?.innerHTML || "")).toContain("john");

		// Should throw for wrong type even if reactive
		const ageSignal = dot.state(25);
		expect(() => {
			(dot(document.body) as any).mount(new Child(), { name: ageSignal });
		}).toThrow(/expected string, but got number/);
	});

	test("Error Recovery: computed recovers after temporary failure", () => {
		const source = dot.state(1);
		const computed = dot.computed(() => {
			if (source.value < 0) {
				throw new Error("Negative value not allowed");
			}
			return source.value * 2;
		});

		expect(computed.value).toBe(2);

		source.value = -1;
		dot.flushSync();

		expect(() => computed.value).toThrow("Negative value not allowed");

		source.value = 5;
		dot.flushSync();

		expect(computed.value).toBe(10);
	});

	test("Deep Propagation: A -> B -> C -> DOM chain efficiency", () => {
		const a = dot.state(1);
		const b = dot.computed(() => a.value + 1);
		const c = dot.computed(() => b.value + 1);
		
		let renderCount = 0;
		@(dot.component as any)
		class Comp implements IDotComponent {
			static props = { val: { type: Number } };
			props: { val: Signal<number> };
			build(dot: IDotCore) {
				renderCount++;
				return dot.div(this.props.val);
			}
		}

		(dot(document.body) as any).mount(new Comp(), { val: c });
		dot.flushSync();

		const shadowRoot = document.body.children[0].shadowRoot;
		expect(renderCount).toBe(1);
		expect(formatHTML(shadowRoot?.innerHTML || "")).toContain("3");

		a.value = 10;
		dot.flushSync();

		expect(renderCount).toBe(2); // Should only re-render once
		expect(formatHTML(shadowRoot?.innerHTML || "")).toContain("12");
	});

	test("Array Mutation: computed reacts to refresh", () => {
		const list = dot.state([1, 2, 3]);
		const sum = dot.computed(() => list.value.reduce((a, b) => a + b, 0));

		expect(sum.value).toBe(6);

		list.value.push(4);
		list.refresh();
		dot.flushSync();

		expect(sum.value).toBe(10);
	});
});
