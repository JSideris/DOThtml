import { dot, navigate, currentHash } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

describe("Shadow DOM Scroll Navigation", () => {
	let scrollIntoViewMock: jest.Mock;

	beforeAll(() => {
		// Mock scrollTo which is not implemented in JSDOM
		window.scrollTo = jest.fn();
		scrollIntoViewMock = jest.fn();
		window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

		// Mock matchMedia
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation(query => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: jest.fn(), // Deprecated
				removeListener: jest.fn(), // Deprecated
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});
	});

	afterEach(() => {
		const root = document.body[DOT_VDOM_PROP_NAME];
		if (root && root.children) {
			root.children._unrender();
		}
		document.body.innerHTML = '';
		document.body[DOT_VDOM_PROP_NAME] = null;
		window.history.replaceState({}, "", "/");
		currentHash.value = "";
		scrollIntoViewMock.mockClear();
		(window.matchMedia as jest.Mock).mockClear();
	});

	test("Should scroll to an element inside a component's shadow DOM with smooth behavior", (done) => {
		class TargetComponent {
			build() {
				return dot.div({ id: "scroll-target" }, "Target Content");
			}
		}

		dot(document.body).mount(new TargetComponent() as any);
		(dot as any).flushSync();

		// Verify the element exists in shadow DOM
		const componentHost = document.body.children[0];
		const target = componentHost.shadowRoot?.getElementById("scroll-target");
		expect(target).toBeTruthy();

		// Trigger navigation to the hash
		navigate("#scroll-target");
		(dot as any).flushSync();

		// The scroll manager uses a setTimeout(..., 0)
		setTimeout(() => {
			try {
				expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });
				done();
			} catch (error) {
				done(error);
			}
		}, 50);
	});

	test("Should scroll to an element in a deeply nested component's shadow DOM with smooth behavior", (done) => {
		class InnerComponent {
			build() {
				return dot.div({ id: "deep-target" }, "Deep Content");
			}
		}

		class OuterComponent {
			build() {
				return dot.div(
					dot.h1("Outer"),
					dot.mount(new InnerComponent() as any)
				);
			}
		}

		dot(document.body).mount(new OuterComponent() as any);
		(dot as any).flushSync();

		navigate("#deep-target");
		(dot as any).flushSync();

		setTimeout(() => {
			try {
				expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });
				done();
			} catch (error) {
				done(error);
			}
		}, 50);
	});

	test("Should respect prefers-reduced-motion", (done) => {
		(window.matchMedia as jest.Mock).mockImplementation(query => ({
			matches: query === "(prefers-reduced-motion: reduce)",
			media: query,
		}));

		class TargetComponent {
			build() {
				return dot.div({ id: "motion-target" }, "Content");
			}
		}

		dot(document.body).mount(new TargetComponent() as any);
		(dot as any).flushSync();

		navigate("#motion-target");
		(dot as any).flushSync();

		setTimeout(() => {
			try {
				expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "auto" });
				done();
			} catch (error) {
				done(error);
			}
		}, 50);
	});

	test("Should scroll when hash changes on the same path", (done) => {
		class MultiTargetComponent {
			build() {
				return dot.div(
					dot.div({ id: "target-1", style: "height: 1000px" }, "Target 1"),
					dot.div({ id: "target-2", style: "height: 1000px" }, "Target 2")
				);
			}
		}

		dot(document.body).mount(new MultiTargetComponent() as any);
		(dot as any).flushSync();

		// 1. Navigate to target-1
		navigate("#target-1");
		(dot as any).flushSync();

		setTimeout(() => {
			try {
				expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
				
				// 2. Navigate to target-2 (same path, different hash)
				navigate("#target-2");
				(dot as any).flushSync();

				setTimeout(() => {
					try {
						expect(scrollIntoViewMock).toHaveBeenCalledTimes(2);
						done();
					} catch (error) {
						done(error);
					}
				}, 50);
			} catch (error) {
				done(error);
			}
		}, 50);
	});
});
