import { dot, IDotComponent } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => { 
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("dot.create bug fix verification", () => {
	test("dot.create should not overwrite signals from @dot.component", () => {
		const source = dot.state(1);
		let constructorComputed: any;

		@dot.component
		class DecoratedComponent implements IDotComponent {
			constructor() {
				constructorComputed = dot.computed(() => source.value * 2);
			}
			build() {
				return dot.div(constructorComputed);
			}
		}

		// Use dot.create on a decorated component
		const instance = dot.create(DecoratedComponent);

		// The fix: instance._trackedComputeds should contain constructorComputed.
		expect((instance as any)._trackedComputeds).toContain(constructorComputed);

		dot(document.body).mount(instance);
		// 1 for the computed, 1 for the div binding
		expect((source as any).subscribers.size).toBe(1);

		// Unmount
		const root = document.body[DOT_VDOM_PROP_NAME];
		root.children._unrender();

		// constructorComputed should be disposed.
		expect((source as any).subscribers.size).toBe(0);
	});

	test("dot.create should support disposables", () => {
		let disposed = false;

		class UndecoratedComponent implements IDotComponent {
			constructor() {
				const currentComponent = (dot as any).getCurrentComponent();
				if (currentComponent && currentComponent.registerDisposable) {
					currentComponent.registerDisposable(() => {
						disposed = true;
					});
				}
			}
			build() {
				return dot.div("test");
			}
		}

		const instance = dot.create(UndecoratedComponent);
		dot(document.body).mount(instance);

		const root = document.body[DOT_VDOM_PROP_NAME];
		root.children._unrender();

		expect(disposed).toBe(true);
	});
});
