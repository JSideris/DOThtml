import { dot, IDotComponent } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import Signal from "../../src/reactivity/signal";

afterEach(() => { 
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("HMR Phase 3 State Preservation", () => {
	test("preserves internal Signal state", () => {
		const hmrId = "src/components/Stateful.ts:Stateful";

		class StatefulV1 implements IDotComponent {
			static __hmrId = hmrId;
			count = dot.state(0);
			build() {
				return dot.div("Count: ", this.count, " (V1)");
			}
		}

		class StatefulV2 implements IDotComponent {
			static __hmrId = hmrId;
			count = dot.state(0);
			build() {
				return dot.div("Count: ", this.count, " (V2)");
			}
		}

		// Mount V1
		const comp = new StatefulV1();
		(dot as any)(document.body).mount(comp);
		const el = document.body.querySelector("[cvdom]") as HTMLElement;
		expect(el.shadowRoot?.innerHTML).toContain("Count: 0 (V1)");

		// Update state
		comp.count.value = 42;
		(dot as any).flushSync();
		expect(el.shadowRoot?.innerHTML).toContain("Count: 42 (V1)");

		// Swap to V2
		(dot as any).hmr.swap(hmrId, StatefulV2);
		(dot as any).flushSync();

		// Should show V2 but with preserved state
		expect(el.shadowRoot?.innerHTML).toContain("Count: 42 (V2)");
	});

	test("preserves multiple signals and computed signals reflect changes", () => {
		const hmrId = "src/components/MultiState.ts:MultiState";

		class MultiStateV1 implements IDotComponent {
			static __hmrId = hmrId;
			firstName = (dot as any).state("John");
			lastName = (dot as any).state("Doe");
			fullName = (dot as any).computed(() => `${this.firstName.value} ${this.lastName.value}`);
			build() {
				return (dot as any).div(this.fullName, " (V1)");
			}
		}

		class MultiStateV2 implements IDotComponent {
			static __hmrId = hmrId;
			firstName = (dot as any).state("John");
			lastName = (dot as any).state("Doe");
			fullName = (dot as any).computed(() => `${this.lastName.value}, ${this.firstName.value}`);
			build() {
				return (dot as any).div(this.fullName, " (V2)");
			}
		}

		const comp = new MultiStateV1();
		(dot as any)(document.body).mount(comp);
		const el = document.body.querySelector("[cvdom]") as HTMLElement;
		expect(el.shadowRoot?.innerHTML).toContain("John Doe (V1)");

		comp.firstName.value = "Jane";
		(dot as any).flushSync();
		expect(el.shadowRoot?.innerHTML).toContain("Jane Doe (V1)");

		(dot as any).hmr.swap(hmrId, MultiStateV2);
		(dot as any).flushSync();

		// V2 has different computed logic: "Doe, Jane"
		expect(el.shadowRoot?.innerHTML).toContain("Doe, Jane (V2)");
	});

	test("preserves RefCollection state", () => {
		const hmrId = "src/components/RefCol.ts:RefCol";

		class RefColV1 implements IDotComponent {
			static __hmrId = hmrId;
			items = (dot as any).refCollection();
			build() {
				return (dot as any).div(
					(dot as any).div({ ref: this.items.get(1) } as any, "Item 1"),
					(dot as any).div({ ref: this.items.get(2) } as any, "Item 2")
				);
			}
		}

		class RefColV2 implements IDotComponent {
			static __hmrId = hmrId;
			items = (dot as any).refCollection();
			build() {
				return (dot as any).div(
					(dot as any).span({ ref: this.items.get(1) } as any, "Item 1 V2"),
					(dot as any).span({ ref: this.items.get(2) } as any, "Item 2 V2")
				);
			}
		}

		const comp = new RefColV1();
		(dot as any)(document.body).mount(comp);
		const el = document.body.querySelector("[cvdom]") as HTMLElement;
		
		const ref1 = comp.items.get(1).value;
		expect(ref1).not.toBeNull();
		expect((ref1 as HTMLElement).tagName).toBe("DIV");

		(dot as any).hmr.swap(hmrId, RefColV2);
		(dot as any).flushSync();

		const newComp = (el as any).component;
		const newRef1 = newComp.items.get(1).value;
		expect(newRef1).not.toBeNull();
		// After rebuild, it should be a SPAN
		expect((newRef1 as HTMLElement).tagName).toBe("SPAN");
	});

	test("calls lifecycle hooks and cleans up effects", () => {
		const hmrId = "src/components/LifecycleHooks.ts:LifecycleHooks";
		let unmountingCalled = 0;
		let mountedCalled = 0;
		let effectCleanupCalled = 0;

		class LifecycleV1 implements IDotComponent {
			static __hmrId = hmrId;
			build() {
				(dot as any).effect(() => {
					return () => effectCleanupCalled++;
				});
				return (dot as any).div("V1");
			}
			unmounting() { unmountingCalled++; }
			mounted() { mountedCalled++; }
		}

		class LifecycleV2 implements IDotComponent {
			static __hmrId = hmrId;
			build() { return (dot as any).div("V2"); }
			unmounting() { unmountingCalled++; }
			mounted() { mountedCalled++; }
		}

		(dot as any)(document.body).mount(new LifecycleV1());
		expect(mountedCalled).toBe(1);

		(dot as any).hmr.swap(hmrId, LifecycleV2);
		(dot as any).flushSync();
		
		expect(unmountingCalled).toBe(1); // From V1
		expect(effectCleanupCalled).toBe(1); // From V1 effect
		expect(mountedCalled).toBe(2); // From V2
	});
});
