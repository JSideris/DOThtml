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
