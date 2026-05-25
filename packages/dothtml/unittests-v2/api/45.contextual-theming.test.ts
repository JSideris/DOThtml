import { dot, FrameworkItems, IDotComponent, IDotDocument } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => { 
	let styles = document.getElementsByTagName("style");

	for(let i = styles.length-1; i >= 0; i--){
		styles[i].parentElement?.removeChild(styles[i]);
	}

	(dot as any).globalStyles = [];

	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Contextual Theme Inheritance.", () => {
	test("Basic theme inheritance.", () => {
		class ChildComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			build(): IDotDocument {
				return dot.button({ class: "themed-button", id: "child-btn" }, "Child Button");
			}
		}

		class ParentComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			stylize() {
				// Provide a theme function
				return (s: any) => {
					s.class("themed-button", (b: any) => b.color("rgb(255, 0, 0)"));
				};
			}
			build(): IDotDocument {
				return dot.div(new ChildComp());
			}
		}

		dot(document.body).mount(new ParentComp());
		dot.flushSync();

		const parentEl = document.body.children[0];
		const childCompEl = parentEl.shadowRoot!.querySelector("child-comp") || parentEl.shadowRoot!.querySelector("[cvdom]"); // Depending on how it's rendered
		// Actually, let's just find the child component element.
		const childComp = parentEl.shadowRoot!.querySelector(new ChildComp().constructor["_dotHtmlComponent"].tagName);
		expect(childComp).not.toBeNull();
		const shadowRoot = childComp!.shadowRoot;
		expect(shadowRoot).not.toBeNull();

		const styleTag = shadowRoot!.querySelector("style");
		expect(styleTag).not.toBeNull();
		expect(styleTag!.innerHTML).toContain("color: rgb(255, 0, 0);");
	});

	test("Nested theme inheritance (nearest wins).", () => {
		class GrandchildComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			build(): IDotDocument {
				return dot.span({ class: "themed-text", id: "gc-text" }, "Grandchild Text");
			}
		}

		class ChildComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			stylize() {
				return (s: any) => {
					s.class("themed-text", (b: any) => b.color("rgb(0, 255, 0)"));
				};
			}
			build(): IDotDocument {
				return dot.div(new GrandchildComp());
			}
		}

		class ParentComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			stylize() {
				return (s: any) => {
					s.class("themed-text", (b: any) => b.color("rgb(255, 0, 0)"));
				};
			}
			build(): IDotDocument {
				return dot.div(new ChildComp());
			}
		}

		dot(document.body).mount(new ParentComp());
		dot.flushSync();

		const parentEl = document.body.children[0];
		const childComp = parentEl.shadowRoot!.querySelector(new ChildComp().constructor["_dotHtmlComponent"].tagName);
		const grandchildComp = childComp!.shadowRoot!.querySelector(new GrandchildComp().constructor["_dotHtmlComponent"].tagName);
		
		const shadowRoot = grandchildComp!.shadowRoot;
		expect(shadowRoot).not.toBeNull();

		const styleTag = shadowRoot!.querySelector("style");
		expect(styleTag!.innerHTML).toContain("color: rgb(0, 255, 0);"); // Child wins over Parent
		expect(styleTag!.innerHTML).not.toContain("color: rgb(255, 0, 0);");
	});

	test("Reactive theme updates.", () => {
		const themeColor = dot.state("rgb(255, 0, 0)");

		class ChildComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			build(): IDotDocument {
				return dot.div({ class: "themed-box", id: "child-box" });
			}
		}

		class ParentComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			stylize() {
				return (s: any) => {
					s.class("themed-box", (b: any) => b.backgroundColor(themeColor));
				};
			}
			build(): IDotDocument {
				return dot.div(new ChildComp());
			}
		}

		dot(document.body).mount(new ParentComp());
		dot.flushSync();

		const parentEl = document.body.children[0];
		const childComp = parentEl.shadowRoot!.querySelector(new ChildComp().constructor["_dotHtmlComponent"].tagName) as HTMLElement;
		
		const shadowRoot = childComp.shadowRoot!;
		const style = shadowRoot.querySelector("style")!;
		
		// Check if the variable is set on the host
		const varName = Array.from(childComp.style).find(name => name.startsWith("--dh-v"));
		expect(varName).toBeDefined();
		expect(childComp.style.getPropertyValue(varName!)).toBe("rgb(255, 0, 0)");

		// Update theme
		themeColor.value = "rgb(0, 0, 255)";
		dot.flushSync();

		expect(childComp.style.getPropertyValue(varName!)).toBe("rgb(0, 0, 255)");
	});

	test("Reactive theme function swap.", () => {
		const theme1 = (s: any) => s.class("themed-box", (b: any) => b.color("rgb(255, 0, 0)"));
		const theme2 = (s: any) => s.class("themed-box", (b: any) => b.color("rgb(0, 255, 0)"));
		const currentTheme = dot.state(theme1);

		class ChildComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			build(): IDotDocument {
				return dot.div({ class: "themed-box", id: "child-box" });
			}
		}

		class ParentComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			stylize() {
				return currentTheme;
			}
			build(): IDotDocument {
				return dot.div(new ChildComp());
			}
		}

		dot(document.body).mount(new ParentComp());
		dot.flushSync();

		const parentEl = document.body.children[0];
		const childComp = parentEl.shadowRoot!.querySelector(new ChildComp().constructor["_dotHtmlComponent"].tagName) as HTMLElement;
		
		let styleTag = childComp.shadowRoot!.querySelector("style")!;
		expect(styleTag.innerHTML).toContain("color: rgb(255, 0, 0);");

		// Swap theme function
		currentTheme.value = theme2;
		dot.flushSync();

		styleTag = childComp.shadowRoot!.querySelector("style")!;
		expect(styleTag.innerHTML).toContain("color: rgb(0, 255, 0);");
	});
});
