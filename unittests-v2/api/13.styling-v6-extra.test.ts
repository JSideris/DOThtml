import { dot } from "../../src";
import StyleVNode from "../../src/v-meta-nodes/style-v-node";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => { 
	let styles = document.getElementsByTagName("style");

	for(let i = styles.length-1; i >= 0; i--){
		styles[i].parentElement?.removeChild(styles[i]);
	}

	(dot as any).globalStyles = [];
	(dot.css as any).props = [];

	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
	document.documentElement.removeAttribute("style");
});

describe("Styling v6 Extra Coverage", () => {

	describe("StyleVNode.toString() (SSR Support)", () => {
		test("toString() for element styles", () => {
			const styleNode = new StyleVNode((dot.css as any).color("red").paddingPx(10));
			expect(styleNode.toString()).toBe("color: red; padding: 10px; ");
		});

		test("toString() for selector targets", () => {
			const styleNode = new StyleVNode((dot.css as any).color("blue"));
			styleNode.target = ".my-class";
			expect(styleNode.toString()).toBe(".my-class { color: blue;  }");
		});

		test("toString() with reactive values", () => {
			const color = dot.watch("green");
			const styleNode = new StyleVNode((dot.css as any).color(color));
			expect(styleNode.toString()).toBe("color: green; ");
			color.value = "yellow";
			expect(styleNode.toString()).toBe("color: yellow; ");
		});
	});

	describe("Reactive Global Selectors", () => {
		test("StyleVNode.render(selector) creates and updates style tag", () => {
			const color = dot.watch("rgb(255, 0, 0)");
			const styleNode = new StyleVNode((dot.css as any).color(color));
			styleNode.render(".dynamic-global");

			const styleTag = document.head.querySelector("style");
			expect(styleTag).not.toBeNull();
			expect(styleTag?.textContent).toBe(".dynamic-global { color: rgb(255, 0, 0);  }");

			color.value = "rgb(0, 255, 0)";
			dot.flushSync();
			expect(styleTag?.textContent).toBe(".dynamic-global { color: rgb(0, 255, 0);  }");
			
			styleNode.unrender();
			expect(document.head.querySelector("style")).toBeNull();
		});
	});

	describe("CSS Variable Helpers Exhaustive", () => {
		test("s.variable() with numeric watcher", () => {
			const size = dot.watch(10);
			dot(document.body).div({ id: "var-test" }).style(s => s.variable("my-size", size.bindAs(v => `${v}px`)));
			dot.flushSync();

			const el = document.getElementById("var-test");
			expect(el?.style.getPropertyValue("--my-size")).toBe("10px");

			size.value = 20;
			dot.flushSync();
			expect(el?.style.getPropertyValue("--my-size")).toBe("20px");
		});

		test("s.v() with various inputs", () => {
			expect(dot.css.v("test")).toBe("var(--test)");
			expect(dot.css.v("--test")).toBe("var(--test)");
		});
	});
});
