import { FrameworkItems, IDotComponent, IDotDocument } from "dothtml-interfaces";
import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => { 
	let styles = document.getElementsByTagName("style");

	for(let i = styles.length-1; i >= 0; i--){
		styles[i].parentElement?.removeChild(styles[i]);
	}

	(dot as any).globalStyles = [];
	// Clear global dot.css variables
	(dot.css as any).props = [];

	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
	document.documentElement.removeAttribute("style");
});

describe("Styling v6 Phase 3", () => {

	describe("Global Reactive Styles", () => {
		test("dot.css variable binding to document root", () => {
			const themeColor = dot.watch("rgb(255, 0, 0)");
			dot.css.variable("global-accent", themeColor);
			dot.flushSync();
			
			// dot.css is bound to document.documentElement in dot.ts
			expect(document.documentElement.style.getPropertyValue("--global-accent")).toBe("rgb(255, 0, 0)");

			themeColor.value = "rgb(0, 255, 0)";
			dot.flushSync();
			expect(document.documentElement.style.getPropertyValue("--global-accent")).toBe("rgb(0, 255, 0)");
		});
	});

	describe("CSS Variable Helper (s.v())", () => {
		test("s.v() formatting", () => {
			expect(dot.css.v("my-var")).toBe("var(--my-var)");
			expect(dot.css.v("--already-has-prefix")).toBe("var(--already-has-prefix)");
		});

		test("s.v() usage in builder", () => {
			dot(document.body).div({
				id: "test-el"
			}).style(s => s.variable("local-accent", "red").setProp("--applied-val", s.v("local-accent")));
			dot.flushSync();

			const el = document.getElementById("test-el");
			expect(el?.style.getPropertyValue("--applied-val")).toBe("var(--local-accent)");
		});
	});

	describe("Static Style Safety", () => {
		test("stylize throws on reactive values", () => {
			const color = dot.watch("red");
			
			class FaultyComp {
				_?: FrameworkItems;
				stylize(s: any) {
					return s.class("test", c => c.color(color));
				}
				build() { return dot.div(); }
			}

			expect(() => {
				dot(document.body).mount(new FaultyComp() as any);
				dot.flushSync();
			}).toThrow(/Reactive values \(Watchers\/Bindings\) cannot be used directly in stylize\(\)/);
		});

		test("stylize does not throw on s.v()", () => {
			class SafeComp {
				_?: FrameworkItems;
				stylize(s: any) {
					return s.class("test", c => c.color(s.v("accent")));
				}
				build() { return dot.div({ class: "test" }); }
			}

			expect(() => {
				dot(document.body).mount(new SafeComp() as any);
				dot.flushSync();
			}).not.toThrow();
		});
	});

	describe("Host Style Unrendering", () => {
		test("hostStyle cleanup on unmount", () => {
			const color = dot.watch("rgb(255, 0, 0)");
			let mountCount = 0;

			class HostComp {
				_?: FrameworkItems;
				hostStyle(s: any) { s.variable("host-var", color); }
				build() { mountCount++; return dot.div(); }
			}

			const container = dot(document.body);
			const comp = new HostComp();
			container.mount(comp as any);
			dot.flushSync();

			const customEl = document.body.children[0] as HTMLElement;
			expect(customEl.style.getPropertyValue("--host-var")).toBe("rgb(255, 0, 0)");

			// Unmount
			(container as any)._unrender();
			dot.flushSync();

			expect(document.body.children.length).toBe(0);
			// The subscriptions should be cleared. We can check by updating the watcher
			// and seeing if anything crashes or if we can track subscription count if we had access.
			// But primarily, the element is gone.
			
			color.value = "rgb(0, 0, 255)";
			expect(() => dot.flushSync()).not.toThrow();
		});
	});

	describe("Global Styles Adoption", () => {
		test("components adopt global styles", () => {
			const globalCss = ".global-reactive { color: var(--global-val); }";
			(dot as any).useGlobalStyles(globalCss);

			class ChildComp {
				_?: FrameworkItems;
				build() { return dot.div({ class: "global-reactive" }); }
			}

			dot(document.body).mount(new ChildComp() as any);
			dot.flushSync();

			const customEl = document.body.children[0];
			const shadowRoot = customEl.shadowRoot;
			
			let hasGlobalStyle = false;
			if (shadowRoot?.adoptedStyleSheets) {
				for (const sheet of shadowRoot.adoptedStyleSheets) {
					// This is a bit hard to check directly without looking at rules
					// but we can check if there are any sheets.
					if (sheet.cssRules.length > 0) hasGlobalStyle = true;
				}
			}
			
			if (!hasGlobalStyle && shadowRoot) {
				const styleTags = shadowRoot.querySelectorAll("style");
				for (const tag of Array.from(styleTags)) {
					if (tag.textContent?.includes(".global-reactive")) hasGlobalStyle = true;
				}
			}

			expect(hasGlobalStyle).toBe(true);
		});
	});
});
