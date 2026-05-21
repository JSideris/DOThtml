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
		const el1 = document.body.querySelector("dothtml-10001") as HTMLElement;
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
		const el2 = document.body.querySelector("dothtml-10002") as HTMLElement;
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
});
