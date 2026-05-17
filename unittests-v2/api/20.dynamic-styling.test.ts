import { dot, FrameworkItems, IDotComponent, IDotDocument } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => { 
	let styles = document.getElementsByTagName("style");

	for(let i = styles.length-1; i >= 0; i--){
		styles[i].parentElement?.removeChild(styles[i]);
	}

	(dot as any).globalStyles = [];
	(dot as any).setTheme(null);

	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Dynamic Styling Enhancements", () => {

	describe("Ghost Variable Injection", () => {
		test("Automatically injects CSS variables for reactive bindings in stylize", () => {
			const color = dot.state("rgb(255, 0, 0)");
			
			class GhostComp {
				_?: FrameworkItems;
				stylize(s: any): any {
					return s.class("test", c => c.color(color));
				}
				build(): any {
					return dot.div({ class: "test", id: "target" });
				}
			}

			dot(document.body).mount(new GhostComp() as any);
			dot.flushSync();

			const customEl = document.body.children[0] as HTMLElement;
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("rgb(255, 0, 0)");
			
			const target = customEl.shadowRoot!.getElementById("target")!;
			expect(target.className).toBe("test");

			// Check that the style rule exists in the shadow root
			const shadowRoot = customEl.shadowRoot!;
			let styleFound = false;
			if (shadowRoot.adoptedStyleSheets) {
				for (const sheet of shadowRoot.adoptedStyleSheets) {
					for (const rule of (sheet as any).cssRules) {
						if (rule.selectorText === ".test" && rule.style.color === "var(--dh-v1)") {
							styleFound = true;
						}
					}
				}
			}
			if (!styleFound) {
				const styleTags = shadowRoot.querySelectorAll("style");
				for (const tag of Array.from(styleTags)) {
					if (tag.textContent?.includes(".test") && tag.textContent?.includes("color: var(--dh-v1)")) {
						styleFound = true;
					}
				}
			}
			expect(styleFound).toBe(true);

			// Update the signal
			color.value = "rgb(0, 0, 255)";
			dot.flushSync();
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("rgb(0, 0, 255)");
		});

		test("Multiple instances have independent reactive styles", () => {
			const color1 = dot.state("rgb(255, 0, 0)");
			const color2 = dot.state("rgb(0, 255, 0)");
			
			class MultiGhostComp {
				_?: FrameworkItems;
				props: { color: any };
				stylize(s: any): any {
					return s.class("test", c => c.color(this.props.color));
				}
				build(): any {
					return dot.div({ class: "test" });
				}
			}

			const container = dot(document.body);
			(container as any).mount(new MultiGhostComp(), { color: color1 });
			(container as any).mount(new MultiGhostComp(), { color: color2 });
			dot.flushSync();

			const el1 = document.body.children[0] as HTMLElement;
			const el2 = document.body.children[1] as HTMLElement;
			
			expect(el1.style.getPropertyValue("--dh-v1")).toBe("rgb(255, 0, 0)");
			expect(el2.style.getPropertyValue("--dh-v1")).toBe("rgb(0, 255, 0)");

			color1.value = "rgb(0, 0, 255)";
			dot.flushSync();
			expect(el1.style.getPropertyValue("--dh-v1")).toBe("rgb(0, 0, 255)");
			expect(el2.style.getPropertyValue("--dh-v1")).toBe("rgb(0, 255, 0)");
		});
	});

	describe("Reactive Theme Context", () => {
		test("s.theme provides reactive access to global theme", () => {
			const theme = {
				primary: dot.state("rgb(255, 0, 0)"),
				spacing: dot.state(10)
			};
			(dot as any).setTheme(theme);

			class ThemeComp {
				_?: FrameworkItems;
				stylize(s: any): any {
					return s.class("test", c => c
						.color(s.theme.primary)
						.paddingPx(s.theme.spacing)
					);
				}
				build(): any {
					return dot.div({ class: "test", id: "target" });
				}
			}

			dot(document.body).mount(new ThemeComp() as any);
			dot.flushSync();

			const customEl = document.body.children[0] as HTMLElement;
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("rgb(255, 0, 0)");
			expect(customEl.style.getPropertyValue("--dh-v2")).toBe("10px");

			theme.primary.value = "rgb(0, 255, 0)";
			theme.spacing.value = 20;
			dot.flushSync();

			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("rgb(0, 255, 0)");
			expect(customEl.style.getPropertyValue("--dh-v2")).toBe("20px");
		});
	});

	describe("Signal Stylesheet Swapping", () => {
		test("stylize can return a Signal of styles", () => {
			const styleSignal = dot.state<any>(null);
			
			class SwapComp {
				_?: FrameworkItems;
				stylize(s: any): any {
					return styleSignal.bindAs(val => {
						if (val === "dark") {
							return s.class("test", c => c.color("rgb(255, 255, 255)").backgroundColor("rgb(0, 0, 0)"));
						}
						return s.class("test", c => c.color("rgb(0, 0, 0)").backgroundColor("rgb(255, 255, 255)"));
					});
				}
				build(): any {
					return dot.div({ class: "test", id: "target" });
				}
			}

			dot(document.body).mount(new SwapComp() as any);
			dot.flushSync();

			const customEl = document.body.children[0] as HTMLElement;
			const shadowRoot = customEl.shadowRoot!;

			// Check style tag content
			const styleTag = shadowRoot.getElementById("--dh-dynamic-style") as HTMLStyleElement;
			expect(styleTag.textContent).toContain("color: rgb(0, 0, 0)");
			
			// Swap to dark
			styleSignal.value = "dark";
			dot.flushSync();
			expect(styleTag.textContent).toContain("color: rgb(255, 255, 255)");
		});
	});

	describe("Fluent Template Literals", () => {
		test("s.template handles mixed static and dynamic content", () => {
			const opacity = dot.state(0.5);
			
			class TemplateComp {
				_?: FrameworkItems;
				stylize(s: any): any {
					return s.class("test", c => c
						.background(s.template`rgba(255, 0, 0, ${opacity})`)
					);
				}
				build(): any {
					return dot.div({ class: "test", id: "target" });
				}
			}

			dot(document.body).mount(new TemplateComp() as any);
			dot.flushSync();

			const customEl = document.body.children[0] as HTMLElement;
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("rgba(255, 0, 0, 0.5)");

			opacity.value = 1;
			dot.flushSync();
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("rgba(255, 0, 0, 1)");
		});
	});

	describe("Edge Cases and Cleanup", () => {
		test("Ghost variables are cleaned up on unmount", () => {
			const color = dot.state("rgb(255, 0, 0)");
			let subCount = (color as any).subscribers ? (color as any).subscribers.size : 0;
			
			class CleanupComp {
				_?: FrameworkItems;
				stylize(s: any): any {
					return s.class("test", c => c.color(color));
				}
				build(): any { return dot.div(); }
			}

			const container = dot(document.body);
			(container as any).mount(new CleanupComp() as any);
			dot.flushSync();

			const newSubCount = (color as any).subscribers.size;
			expect(newSubCount).toBeGreaterThan(subCount);

			(container as any)._unrender();
			dot.flushSync();

			const finalSubCount = (color as any).subscribers.size;
			expect(finalSubCount).toBe(subCount);
		});

		test("Ghost variables work with complex builders (transform)", () => {
			const x = dot.state(10);
			
			class TransformComp {
				_?: FrameworkItems;
				stylize(s: any): any {
					return s.class("test", c => c.transform({ translateX: x }));
				}
				build(): any { return dot.div({ class: "test", id: "target" }); }
			}

			dot(document.body).mount(new TransformComp() as any);
			dot.flushSync();

			const customEl = document.body.children[0] as HTMLElement;
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("translateX(10px)");

			x.value = 50;
			dot.flushSync();
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("translateX(50px)");
		});
	});
});
