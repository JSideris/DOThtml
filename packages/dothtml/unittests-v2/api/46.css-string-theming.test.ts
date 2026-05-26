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

describe("CSS String Theme Inheritance.", () => {
	test("Basic CSS string inheritance.", () => {
		class ChildComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			build(): IDotDocument {
				return dot.button({ class: "themed-button", id: "child-btn" }, "Child Button");
			}
		}

		class ParentComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			stylize() {
				// Provide a theme as a raw CSS string
				return ".themed-button { color: rgb(255, 0, 0); }";
			}
			build(): IDotDocument {
				return dot.div(new ChildComp());
			}
		}

		dot(document.body).mount(new ParentComp());
		dot.flushSync();

		const parentEl = document.body.children[0];
		const childComp = parentEl.shadowRoot!.querySelector(new ChildComp().constructor["_dotHtmlComponent"].tagName);
		expect(childComp).not.toBeNull();
		const shadowRoot = childComp!.shadowRoot;
		expect(shadowRoot).not.toBeNull();

		const styleTag = shadowRoot!.querySelector("style");
		expect(styleTag).not.toBeNull();
		// This should fail initially because strings aren't inherited as themes yet
		expect(styleTag!.innerHTML).toContain("color: rgb(255, 0, 0);");
	});

	test("CSS string inheritance with selector transformation.", () => {
		class ChildComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			build(): IDotDocument {
				return dot.div({ class: "content" }, "Content");
			}
		}

		class ParentComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			stylize() {
				// html/body should be transformed to :host in children
				return "html { background-color: rgb(0, 0, 0); } body { color: rgb(255, 255, 255); }";
			}
			build(): IDotDocument {
				return dot.div(new ChildComp());
			}
		}

		dot(document.body).mount(new ParentComp());
		dot.flushSync();

		const parentEl = document.body.children[0];
		const childComp = parentEl.shadowRoot!.querySelector(new ChildComp().constructor["_dotHtmlComponent"].tagName);
		const shadowRoot = childComp!.shadowRoot;

		const styleTag = shadowRoot!.querySelector("style");
		expect(styleTag).not.toBeNull();
		// html/body should become :host
		expect(styleTag!.innerHTML).toContain(":host { background-color: rgb(0, 0, 0); }");
		expect(styleTag!.innerHTML).toContain(":host { color: rgb(255, 255, 255); }");
	});

	test("Reactive CSS string inheritance.", () => {
		const currentTheme = dot.state(".themed-box { color: rgb(255, 0, 0); }");

		class ChildComp implements IDotComponent {
			_?: FrameworkItems | undefined;
			build(): IDotDocument {
				return dot.div({ class: "themed-box" });
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

		// Update theme string
		currentTheme.value = ".themed-box { color: rgb(0, 255, 0); }";
		dot.flushSync();

		styleTag = childComp.shadowRoot!.querySelector("style")!;
		expect(styleTag.innerHTML).toContain("color: rgb(0, 255, 0);");
	});
});
