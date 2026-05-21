import { dot, DotComponent, IDotComponent } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	const body: any = document.body;
	const root = body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	body[DOT_VDOM_PROP_NAME] = null;
});

describe("Effect primitive.", () => {
	test("Basic effect reactivity.", () => {
		const count = dot.state(0);
		let evaluations = 0;
		let lastValue = -1;

		dot.effect(() => {
			evaluations++;
			lastValue = count.value;
		});

		expect(evaluations).toBe(1);
		expect(lastValue).toBe(0);

		count.value = 1;
		dot.flushSync();
		expect(evaluations).toBe(2);
		expect(lastValue).toBe(1);

		count.value = 2;
		dot.flushSync();
		expect(evaluations).toBe(3);
		expect(lastValue).toBe(2);
	});

	test("Effect cleanup logic.", () => {
		const count = dot.state(0);
		let cleanupCalled = 0;
		let evaluations = 0;

		const stop = dot.effect(() => {
			evaluations++;
			const val = count.value;
			return () => {
				cleanupCalled++;
			};
		});

		expect(evaluations).toBe(1);
		expect(cleanupCalled).toBe(0);

		count.value = 1;
		dot.flushSync();
		expect(evaluations).toBe(2);
		expect(cleanupCalled).toBe(1);

		stop();
		expect(cleanupCalled).toBe(2);
		
		count.value = 2;
		dot.flushSync();
		expect(evaluations).toBe(2); // Should not run again
		expect(cleanupCalled).toBe(2);
	});

	test("Effect batching.", () => {
		const a = dot.state(0);
		const b = dot.state(0);
		let evaluations = 0;

		dot.effect(() => {
			evaluations++;
			const val = a.value + b.value;
		});

		expect(evaluations).toBe(1);

		a.value = 1;
		b.value = 1;
		dot.flushSync();
		
		expect(evaluations).toBe(2); // Should only run once for both updates
	});

	test("Conditional dependencies in effect.", () => {
		const useA = dot.state(true);
		const a = dot.state("A");
		const b = dot.state("B");
		let evaluations = 0;
		let lastValue = "";

		dot.effect(() => {
			evaluations++;
			lastValue = useA.value ? a.value : b.value;
		});

		expect(evaluations).toBe(1);
		expect(lastValue).toBe("A");

		// Update B - should not trigger evaluation
		b.value = "B2";
		dot.flushSync();
		expect(evaluations).toBe(1);

		// Switch to B
		useA.value = false;
		dot.flushSync();
		expect(evaluations).toBe(2);
		expect(lastValue).toBe("B2");

		// Update A - should no longer trigger evaluation
		a.value = "A2";
		dot.flushSync();
		expect(evaluations).toBe(2);

		// Update B - should trigger evaluation
		b.value = "B3";
		dot.flushSync();
		expect(evaluations).toBe(3);
		expect(lastValue).toBe("B3");
	});

	test("Component auto-cleanup for effects.", () => {
		const source = dot.state(1);
		let effectEvaluations = 0;

		class MyComponent extends DotComponent {
			mounted() {
				const self: any = this;
				self.effect(() => {
					effectEvaluations++;
					const val = source.value;
				});
			}
			build() {
				return dot.div("Effect Component");
			}
		}

		dot(document.body).mount(new MyComponent());
		
		expect(effectEvaluations).toBe(1);
		expect((source as any).subscribers.size).toBe(1);
		
		const body: any = document.body;
		const root = body[DOT_VDOM_PROP_NAME];
		root.children._unrender();
		
		expect((source as any).subscribers.size).toBe(0);
		
		source.value = 2;
		dot.flushSync();
		expect(effectEvaluations).toBe(1); // Should not have run again
	});

	test("Memory leak: verify cleanup of subscriptions.", () => {
		const source = dot.state(1);
		const stop = dot.effect(() => {
			const val = source.value;
		});
		
		expect((source as any).subscribers.size).toBe(1);
		
		stop();
		expect((source as any).subscribers.size).toBe(0);
	});

	test("Store auto-cleanup for effects.", () => {
		const source = dot.state(1);
		let effectEvaluations = 0;

		const useStore = dot.store({
			state: () => ({}),
			actions: {
				init() {
					dot.effect(() => {
						effectEvaluations++;
						const val = source.value;
					});
				}
			}
		});

		const store = useStore();
		store.init();

		expect(effectEvaluations).toBe(1);
		expect((source as any).subscribers.size).toBe(1);

		store.$dispose();
		expect((source as any).subscribers.size).toBe(0);

		source.value = 2;
		dot.flushSync();
		expect(effectEvaluations).toBe(1); // Should not have run again
	});
});
