import { dot, IDotComponent, IDotDocument } from "../../src";
import { DOT_VDOM_PROP_NAME, IS_DEV } from "../../src/constants";
import { registerInstance, unregisterInstance, getInstances } from "../../src/hmr-registry";

afterEach(() => { 
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("HMR Phase 1 Infrastructure & Detection", () => {
	test("IS_DEV is true in test environment", () => {
		expect(IS_DEV).toBe(true);
	});

	test("HMR Registry register and unregister logic", () => {
		class DummyComponent implements IDotComponent {
			build() {
				return dot.div("dummy");
			}
		}

		const dummyInstance = { component: new DummyComponent() } as any;

		registerInstance("test-id", dummyInstance);
		let instances = getInstances("test-id");
		expect(instances.size).toBe(1);
		expect(instances.has(dummyInstance)).toBe(true);

		unregisterInstance("test-id", dummyInstance);
		instances = getInstances("test-id");
		expect(instances.size).toBe(0);
	});

	test("ComponentVdom automatically registers and unregisters instances when __hmrId is present", () => {
		class HmrComponent implements IDotComponent {
			static __hmrId = "src/components/HmrComponent.ts:HmrComponent";
			build() {
				return dot.div("HMR content");
			}
		}

		// Initially, the registry should have 0 instances for this ID
		expect(getInstances("src/components/HmrComponent.ts:HmrComponent").size).toBe(0);

		// Mount the component
		const instance = new HmrComponent();
		(dot(document.body) as any).mount(instance);

		// Now the registry should track it
		const trackedInstances = getInstances("src/components/HmrComponent.ts:HmrComponent");
		expect(trackedInstances.size).toBe(1);

		const trackedVdom = Array.from(trackedInstances)[0];
		expect(trackedVdom.component).toBe(instance);

		// Unmount the component to trigger unregister
		const root = document.body[DOT_VDOM_PROP_NAME];
		root.children._unrender();

		// The registry should now have 0 instances
		expect(getInstances("src/components/HmrComponent.ts:HmrComponent").size).toBe(0);
	});
});

describe("HMR Phase 2 Swap Logic", () => {
	test("dot.hmr.swap replaces component class and preserves props", () => {
		const hmrId = "src/components/TestComponent.ts:TestComponent";

		class TestComponentV1 implements IDotComponent {
			static __hmrId = hmrId;
			props: { name: string };
			build() {
				return dot.div(`Hello ${this.props.name} (V1)`);
			}
		}

		class TestComponentV2 implements IDotComponent {
			static __hmrId = hmrId;
			props: { name: string };
			build() {
				return dot.div(`Hello ${this.props.name} (V2)`);
			}
		}

		// Mount V1
		dot(document.body).mount(new TestComponentV1(), { name: "World" });
		const el1 = document.body.querySelector("[cvdom]") as HTMLElement;
		expect(el1.shadowRoot?.innerHTML).toContain("Hello World (V1)");

		// Perform HMR swap to V2
		(dot as any).hmr.swap(hmrId, TestComponentV2);

		// Output should be updated to V2, but props should be preserved
		expect(el1.shadowRoot?.innerHTML).toContain("Hello World (V2)");
		expect(el1.shadowRoot?.innerHTML).not.toContain("V1");
	});

	test("dot.hmr.swap preserves internal state if managed via props/signals", () => {
		const hmrId = "src/components/Counter.ts:Counter";

		class CounterV1 implements IDotComponent {
			static __hmrId = hmrId;
			props: { count: any };
			build() {
				return dot.div("Count: ", this.props.count, " (V1)");
			}
		}

		class CounterV2 implements IDotComponent {
			static __hmrId = hmrId;
			props: { count: any };
			build() {
				return dot.div("Count: ", this.props.count, " (V2)");
			}
		}

		const count = dot.state(0);
		dot(document.body).mount(new CounterV1(), { count });
		const el2 = document.body.querySelector("[cvdom]") as HTMLElement;
		expect(el2.shadowRoot?.innerHTML).toContain("Count: 0 (V1)");

		// Increment state
		count.value = 5;
		dot.flushSync();
		expect(el2.shadowRoot?.innerHTML).toContain("Count: 5 (V1)");

		// Swap to V2
		(dot as any).hmr.swap(hmrId, CounterV2);
		dot.flushSync();

		// Should show V2 with the same signal value
		expect(el2.shadowRoot?.innerHTML).toContain("Count: 5 (V2)");
		
		// Further updates should still work
		count.value = 10;
		dot.flushSync();
		expect(el2.shadowRoot?.innerHTML).toContain("Count: 10 (V2)");
	});

	test("dot.hmr.swap updates multiple instances", () => {
		const hmrId = "src/components/Multi.ts:Multi";

		class MultiV1 implements IDotComponent {
			static __hmrId = hmrId;
			build() { return dot.div("V1"); }
		}

		class MultiV2 implements IDotComponent {
			static __hmrId = hmrId;
			build() { return dot.div("V2"); }
		}

		dot(document.body).mount(new MultiV1());
		dot(document.body).mount(new MultiV1());

		const elements = document.body.querySelectorAll("[cvdom]");
		expect(elements.length).toBe(2);
		expect(elements[0].shadowRoot?.innerHTML).toContain("V1");
		expect(elements[1].shadowRoot?.innerHTML).toContain("V1");

		(dot as any).hmr.swap(hmrId, MultiV2);

		expect(elements[0].shadowRoot?.innerHTML).toContain("V2");
		expect(elements[1].shadowRoot?.innerHTML).toContain("V2");
	});

	test("dot.hmr.swap preserves event listeners", () => {
		const hmrId = "src/components/Events.ts:Events";
		let clickCount = 0;

		class EventsV1 implements IDotComponent {
			static __hmrId = hmrId;
			build() {
				return dot.button("Click Me").on("click", () => clickCount++);
			}
		}

		class EventsV2 implements IDotComponent {
			static __hmrId = hmrId;
			build() {
				// Version 2 has different text but should still handle clicks if we want it to
				return dot.button("Clicked Me").on("click", () => clickCount++);
			}
		}

		dot(document.body).mount(new EventsV1());
		const btn = document.body.querySelector("[cvdom]")?.shadowRoot?.querySelector("button") as HTMLButtonElement;
		
		btn.click();
		expect(clickCount).toBe(1);

		(dot as any).hmr.swap(hmrId, EventsV2);
		dot.flushSync();

		const btn2 = document.body.querySelector("[cvdom]")?.shadowRoot?.querySelector("button") as HTMLButtonElement;
		expect(btn2.innerHTML).toBe("Clicked Me");
		
		btn2.click();
		expect(clickCount).toBe(2);
	});

	test("dot.hmr.swap invalidates and updates styles", () => {
		const hmrId = "src/components/Styled.ts:Styled";

		class StyledV1 implements IDotComponent {
			static __hmrId = hmrId;
			stylize(css) {
				css.rule(".box", s => s.color("red"));
			}
			build() {
				return dot.div().attr("class", "box").text("Styled");
			}
		}

		class StyledV2 implements IDotComponent {
			static __hmrId = hmrId;
			stylize(css) {
				css.rule(".box", s => s.color("blue"));
			}
			build() {
				return dot.div().attr("class", "box").text("Styled");
			}
		}

		dot(document.body).mount(new StyledV1());
		const el = document.body.querySelector("[cvdom]") as HTMLElement;
		
		// We can't easily check computed styles in this test environment without a full browser,
		// but we can check if _cachedStyles was cleared and rebuilt.
		expect((StyledV1 as any)._cachedStyles).toBeDefined();

		(dot as any).hmr.swap(hmrId, StyledV2);
		
		expect((StyledV2 as any)._cachedStyles).toBeDefined();
		// The new styles should be applied to the shadow root.
		// In a real browser we'd check computed styles, but here we just check if it didn't crash.
	});

	test("dot.hmr.swap triggers built() lifecycle hook", () => {
		const hmrId = "src/components/Lifecycle.ts:Lifecycle";
		let builtCalled = 0;

		class LifecycleV1 implements IDotComponent {
			static __hmrId = hmrId;
			build() { return dot.div("V1"); }
			built() { builtCalled++; }
		}

		class LifecycleV2 implements IDotComponent {
			static __hmrId = hmrId;
			build() { return dot.div("V2"); }
			built() { builtCalled++; }
		}

		dot(document.body).mount(new LifecycleV1());
		expect(builtCalled).toBe(1);

		(dot as any).hmr.swap(hmrId, LifecycleV2);
		expect(builtCalled).toBe(2);
	});

	test("dot.hmr.swap handles nested component swapping", () => {
		const parentHmrId = "src/components/Parent.ts:Parent";
		const childHmrId = "src/components/Child.ts:Child";

		class ChildV1 implements IDotComponent {
			static __hmrId = childHmrId;
			build() { return dot.div("Child V1"); }
		}

		class ChildV2 implements IDotComponent {
			static __hmrId = childHmrId;
			build() { return dot.div("Child V2"); }
		}

		class Parent implements IDotComponent {
			static __hmrId = parentHmrId;
			build() {
				return dot.div(
					"Parent",
					new ChildV1()
				);
			}
		}

		dot(document.body).mount(new Parent());
		const el = document.body.querySelector("[cvdom]");
		const getChildContent = () => el?.shadowRoot?.querySelector("[cvdom]")?.shadowRoot?.innerHTML || "";
		
		expect(getChildContent()).toContain("Child V1");

		// Swap child
		(dot as any).hmr.swap(childHmrId, ChildV2);
		dot.flushSync();

		expect(getChildContent()).toContain("Child V2");
		expect(getChildContent()).not.toContain("Child V1");
	});

	test("dot.hmr.swap preserves internal state (signals not in props)", () => {
		const hmrId = "src/components/InternalState.ts:InternalState";

		class InternalStateV1 implements IDotComponent {
			static __hmrId = hmrId;
			count = dot.state(0);
			build() {
				return dot.div("Count: ", this.count, " (V1)");
			}
		}

		class InternalStateV2 implements IDotComponent {
			static __hmrId = hmrId;
			count = dot.state(0);
			build() {
				return dot.div("Count: ", this.count, " (V2)");
			}
		}

		const instance = new InternalStateV1();
		dot(document.body).mount(instance);
		const el = document.body.querySelector("[cvdom]") as HTMLElement;
		expect(el.shadowRoot?.innerHTML).toContain("Count: 0 (V1)");

		// Increment internal state
		instance.count.value = 7;
		dot.flushSync();
		expect(el.shadowRoot?.innerHTML).toContain("Count: 7 (V1)");

		// Swap to V2
		(dot as any).hmr.swap(hmrId, InternalStateV2);
		dot.flushSync();

		// This is expected to FAIL currently because count will be reset to 0
		expect(el.shadowRoot?.innerHTML).toContain("Count: 7 (V2)");
	});
});
