import { dot, FrameworkItems, IDotComponent, IDotDocument } from "../../src";
import StyleSheetBuilder from "../../src/v-style-nodes/style-sheet-builder";
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

describe("Media Queries", () => {

	test("StyleSheetBuilder.media() generates nested CSS string", () => {
		const builder = new StyleSheetBuilder();
		builder.class("navbar", n => n
			.display("flex")
			.heightPx(70)
		).media("screen and (max-width: 600px)", m => m
			.class("navbar", n => n
				.heightPx(50)
				.padding("0px 20px")
			)
			.class("nav-links", l => l
				.display("none")
			)
		);

		const expectedCss = `.navbar { display: flex; height: 70px; }
@media screen and (max-width: 600px) {
  .navbar { height: 50px; padding: 0px 20px; }
  .nav-links { display: none; }
}`;
		expect(builder.toString()).toBe(expectedCss);
	});

	test("Nested media queries (theoretical support)", () => {
		const builder = new StyleSheetBuilder();
		builder.media("screen", m1 => m1
			.media("(max-width: 600px)", m2 => m2
				.class("test", c => c.color("red"))
			)
		);

		const expectedCss = `@media screen {
  @media (max-width: 600px) {
    .test { color: red; }
  }
}`;
		expect(builder.toString()).toBe(expectedCss);
	});

	test("Component stylize with media queries", () => {
		class ResponsiveComp {
			_?: FrameworkItems;
			stylize(s: any) {
				return s.class("container", c => c
					.widthPx(1000)
				).media("screen and (max-width: 1000px)", m => m
					.class("container", c => c
						.widthP(100)
					)
				);
			}
			build() {
				return dot.div({ class: "container" });
			}
		}

		dot(document.body).mount(new ResponsiveComp() as any);
		dot.flushSync();

		const customEl = document.body.children[0];
		const shadowRoot = customEl.shadowRoot;
		expect(shadowRoot).not.toBeNull();

		let cssContent = "";
		if (shadowRoot!.adoptedStyleSheets && shadowRoot!.adoptedStyleSheets.length > 0) {
			// In JSDOM, adoptedStyleSheets might not be fully inspectable as strings easily,
			// but we can check the rules if needed. 
			// However, renderStylesheet fallback to <style> if not supported.
			cssContent = (shadowRoot!.adoptedStyleSheets[0] as any).cssRules?.[1]?.cssText || "";
		}
		
		if (!cssContent) {
			const styleTag = shadowRoot!.querySelector("style");
			cssContent = styleTag?.innerHTML || "";
		}

		expect(cssContent).toContain("@media screen and (max-width: 1000px)");
		expect(cssContent).toContain(".container");
		expect(cssContent).toContain("width: 100%");
	});
});
