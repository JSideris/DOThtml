import { dot, DotComponent } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => { 
	const body: any = document.body;
	const root = body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	body[DOT_VDOM_PROP_NAME] = null;
	(dot as any).onError = null;
});

describe("Error Boundaries", () => {
	test("Component error boundary catches render error.", () => {
		let errorCaught = null;

		class ErrorProneComponent extends DotComponent {
			build() {
				throw new Error("Render failed");
				return dot.div();
			}
		}

		class BoundaryComponent extends DotComponent {
			errorCaught(err: any) {
				errorCaught = err;
				return dot.div("Fallback UI");
			}

			build() {
				return dot.div(
					dot.mount(new ErrorProneComponent())
				);
			}
		}

		dot(document.body).mount(new BoundaryComponent());
		
		expect(errorCaught).toBeInstanceOf(Error);
		expect(errorCaught.message).toBe("Render failed");
		
		const boundaryEl = document.body.querySelector('[cvdom]') as HTMLElement;
		expect(boundaryEl).not.toBeNull();
		const shadowRoot = boundaryEl.shadowRoot;
		expect(shadowRoot.innerHTML).toContain("Fallback UI");
	});

	test("Component error boundary catches error in mounted hook.", () => {
		let errorCaught = null;

		class ErrorProneComponent extends DotComponent {
			mounted() {
				throw new Error("Mount failed");
			}
			build() {
				return dot.div("Child Content");
			}
		}

		class BoundaryComponent extends DotComponent {
			errorCaught(err: any) {
				errorCaught = err;
				return dot.div("Fallback UI");
			}

			build() {
				return dot.div(
					dot.mount(new ErrorProneComponent())
				);
			}
		}

		dot(document.body).mount(new BoundaryComponent());
		
		expect(errorCaught).toBeInstanceOf(Error);
		expect(errorCaught.message).toBe("Mount failed");

		const boundaryEl = document.body.querySelector('[cvdom]') as HTMLElement;
		const shadowRoot = boundaryEl.shadowRoot;
		expect(shadowRoot.innerHTML).toContain("Fallback UI");
	});

	test("Global error handler catches error when no boundary is present.", () => {
		let globalError = null;
		(dot as any).onError = (err: any) => {
			globalError = err;
		};

		class ErrorProneComponent extends DotComponent {
			build() {
				throw new Error("Global failure");
				return dot.div();
			}
		}

		// We expect this to throw if not caught, but we want to see if onError is called.
		try {
			dot(document.body).mount(new ErrorProneComponent());
		} catch (e) {
			// Expected to propagate if not caught by boundary
		}
		
		expect(globalError).toBeInstanceOf(Error);
		expect(globalError.message).toBe("Global failure");
	});

	test("Scheduler continues working after a component error.", () => {
		const count = dot.state(0);
		let normalComponentEvaluations = 0;

		class ErrorProneComponent extends DotComponent {
			build() {
				// Use a computed to ensure we are enqueued on count change
				return dot.div(dot.computed(() => {
					if (count.value === 1) {
						throw new Error("Update failed");
					}
					return "Error Prone";
				}));
			}
		}

		class NormalComponent extends DotComponent {
			build() {
				normalComponentEvaluations++;
				return dot.div("Normal: ", count);
			}
		}

		dot(document.body).mount(new ErrorProneComponent());
		dot(document.body).mount(new NormalComponent());

		expect(normalComponentEvaluations).toBe(1);

		// Trigger update
		count.value = 1;
		
		// This should not throw and crash the whole app
		dot.flushSync();

		expect(normalComponentEvaluations).toBe(1); // build only called once
		
		const normalEl = document.body.lastChild as HTMLElement;
		expect(normalEl.shadowRoot.innerHTML).toContain("Normal: 1");
	});
});
