import { dot } from "../../src";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";
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

describe("Bug Reproductions", () => {

	describe("Issue 1: style attribute function support", () => {
		test("style attribute accepts a function", () => {
			(dot(document.body) as any).div({
				id: "test-el",
				style: (s: any) => s.color("red").fontSize(20)
			});
			dot.flushSync();

			const el = document.getElementById("test-el");
			expect(el?.style.color).toBe("red");
			expect(el?.style.fontSize).toBe("20px");
		});
	});

	describe("Issue 2: Transform/Filter Suffix Support (_N)", () => {
		test("transform supports suffixes like rotateX_2", () => {
			(dot(document.body) as any).div({
				id: "test-el",
				style: (s: any) => s.transform({
					rotateX: "10deg",
					rotateX_2: "20deg"
				})
			});
			dot.flushSync();

			const el = document.getElementById("test-el");
			// The expected transform string should contain both rotations.
			// Order might depend on implementation, but typically it's the order of keys.
			expect(el?.style.transform).toContain("rotateX(10deg)");
			expect(el?.style.transform).toContain("rotateX(20deg)");
		});
	});

	describe("Issue 3: Reactive Binding Propagation in Nested Builders", () => {
		test("transform updates when binding changes", () => {
			const rotation = dot.state(10);
			(dot(document.body) as any).div({
				id: "test-el",
				style: (s: any) => s.transform({
					rotateY: rotation.bindAs(r => `${r}deg`)
				})
			});
			dot.flushSync();

			const el = document.getElementById("test-el");
			expect(el?.style.transform).toBe("rotateY(10deg)");

			rotation.value = 20;
			dot.flushSync();
			expect(el?.style.transform).toBe("rotateY(20deg)");
		});
	});

	describe("Issue 4: Global Style Transformation for Shadow DOM", () => {
		test("html and body selectors are transformed to :host in shadow root", () => {
			(dot as any).useGlobalStyles("html { color: red; } body { background: blue; }");

			@dot.component
			class TestComp implements IDotComponent {
				_?: FrameworkItems;
				build(dot: any) {
					return dot.div({ id: "inner" }, "Hello");
				}
			}

			dot(document.body).mount(new TestComp() as any);
			dot.flushSync();

			const customEl = document.body.children[0];
			const shadowRoot = customEl.shadowRoot;
			const styleTags = shadowRoot?.querySelectorAll("style");
			
			let foundHostRed = false;
			let foundHostBlue = false;

			styleTags?.forEach(tag => {
				if (tag.textContent?.includes(":host { color: red; }")) foundHostRed = true;
				if (tag.textContent?.includes(":host { background: blue; }")) foundHostBlue = true;
			});

			expect(foundHostRed).toBe(true);
			expect(foundHostBlue).toBe(true);
		});
	});
});
