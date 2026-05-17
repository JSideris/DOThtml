import { dot } from "../../src";
import StyleSheetBuilder from "../../src/v-style-nodes/style-sheet-builder";
import KeyframesBuilder from "../../src/v-style-nodes/keyframes-builder";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => {
	const styles = document.getElementsByTagName("style");
	for (let i = styles.length - 1; i >= 0; i--) {
		styles[i].parentElement?.removeChild(styles[i]);
	}
	(dot as any).globalStyles = [];
	document.body.innerHTML = "";
	document.body[DOT_VDOM_PROP_NAME] = null;
});

function getComponentStylesheetCss(): string {
	const customEl = document.body.children[0];
	const shadowRoot = customEl?.shadowRoot;
	if (!shadowRoot) return "";

	if (shadowRoot.adoptedStyleSheets?.length) {
		const sheet = shadowRoot.adoptedStyleSheets[0] as any;
		if (sheet.cssRules?.length) {
			return Array.from(sheet.cssRules).map((r: any) => r.cssText).join("\n");
		}
	}

	const styleTag = shadowRoot.querySelector("style");
	return styleTag?.innerHTML || "";
}

describe("Advanced CSS At-Rules", () => {

	describe("@keyframes", () => {

		test("KeyframesBuilder.from() and .to() generate keyframe steps", () => {
			const kf = new KeyframesBuilder(new StyleSheetBuilder());
			kf.from(f => f.opacity(0).transform({ translateY: 10 }))
				.to(t => t.opacity(1).transform({ translateY: 0 }));

			const expected = `from { opacity: 0; transform: translateY(10px); }
to { opacity: 1; transform: translateY(0px); }`;
			expect(kf.toString()).toBe(expected);
		});

		test("KeyframesBuilder.at() supports percentage steps", () => {
			const kf = new KeyframesBuilder(new StyleSheetBuilder());
			kf.at(0, s => s.opacity(0))
				.at(50, s => s.opacity(0.5))
				.at("100%", s => s.opacity(1));

			const expected = `0% { opacity: 0; }
50% { opacity: 0.5; }
100% { opacity: 1; }`;
			expect(kf.toString()).toBe(expected);
		});

		test("StyleSheetBuilder.keyframes() emits @keyframes block", () => {
			const builder = new StyleSheetBuilder();
			builder.class("box", b => b.animationName("fade-in").animationDurationS(1))
				.keyframes("fade-in", k => k
					.from(f => f.opacity(0))
					.to(t => t.opacity(1))
				);

			const expected = `.box { animation-name: fade-in; animation-duration: 1s; }
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}`;
			expect(builder.toString()).toBe(expected);
		});

		test("Component stylize with keyframes applies animation in shadow DOM", () => {
			class AnimatedComp {
				stylize(s: any) {
					return s.class("pulse", p => p
						.animationName("pulse")
						.animationDurationS(2)
						.animationIterationCount("infinite")
					).keyframes("pulse", k => k
						.from(f => f.opacity(0.4))
						.to(t => t.opacity(1))
					);
				}
				build() {
					return dot.div({ class: "pulse" }, "...");
				}
			}

			dot(document.body).mount(new AnimatedComp() as any);
			dot.flushSync();

			const css = getComponentStylesheetCss();
			expect(css).toContain("@keyframes pulse");
			expect(css).toContain("animation-name: pulse");
			expect(css).toContain("from");
			expect(css).toContain("opacity: 0.4");
		});
	});

	describe("@container", () => {

		test("StyleSheetBuilder.container() generates nested CSS", () => {
			const builder = new StyleSheetBuilder();
			builder.class("card-host", h => h.containerType("inline-size"))
				.container("(min-width: 400px)", c => c
					.class("card", card => card.flexDirection("row"))
				);

			const expected = `.card-host { container-type: inline-size; }
@container (min-width: 400px) {
  .card { flex-direction: row; }
}`;
			expect(builder.toString()).toBe(expected);
		});

		test("Named container query", () => {
			const builder = new StyleSheetBuilder();
			builder.class("sidebar", s => s.containerName("sidebar").containerType("inline-size"))
				.container("sidebar (min-width: 300px)", c => c
					.class("nav", n => n.display("flex"))
				);

			const expected = `.sidebar { container-name: sidebar; container-type: inline-size; }
@container sidebar (min-width: 300px) {
  .nav { display: flex; }
}`;
			expect(builder.toString()).toBe(expected);
		});

		test("Nested container inside media", () => {
			const builder = new StyleSheetBuilder();
			builder.media("screen", m => m
				.container("(max-width: 600px)", c => c
					.class("panel", p => p.display("block"))
				)
			);

			const expected = `@media screen {
  @container (max-width: 600px) {
    .panel { display: block; }
  }
}`;
			expect(builder.toString()).toBe(expected);
		});

		test("Component stylize with container queries", () => {
			class ContainerComp {
				stylize(s: any) {
					return s.class("host", h => h.containerType("inline-size").widthP(100))
						.class("content", c => c.display("block"))
						.container("(min-width: 500px)", q => q
							.class("content", c => c.display("flex"))
						);
				}
				build() {
					return dot.div({ class: "host" }, dot.div({ class: "content" }));
				}
			}

			dot(document.body).mount(new ContainerComp() as any);
			dot.flushSync();

			const css = getComponentStylesheetCss();
			expect(css).toContain("@container (min-width: 500px)");
			expect(css).toContain("container-type: inline-size");
		});
	});

	describe("@supports", () => {

		test("StyleSheetBuilder.supports() generates feature query block", () => {
			const builder = new StyleSheetBuilder();
			builder.supports("(display: grid)", s => s
				.class("layout", l => l.display("grid"))
			).class("layout", l => l.display("flex"));

			const expected = `@supports (display: grid) {
  .layout { display: grid; }
}
.layout { display: flex; }`;
			expect(builder.toString()).toBe(expected);
		});

		test("Supports with selector-like condition", () => {
			const builder = new StyleSheetBuilder();
			builder.supports("selector(:has(*))", s => s
				.class("has-child", h => h.border("1px solid red"))
			);

			const expected = `@supports selector(:has(*)) {
  .has-child { border: 1px solid red; }
}`;
			expect(builder.toString()).toBe(expected);
		});

		test("Component stylize with supports", () => {
			class SupportsComp {
				stylize(s: any) {
					return s.supports("(backdrop-filter: blur(1px))", sup => sup
						.class("glass", g => g.backdropFilter("blur(12px)"))
					).class("glass", g => g.backgroundColor("rgba(0,0,0,0.5)"));
				}
				build() {
					return dot.div({ class: "glass" });
				}
			}

			dot(document.body).mount(new SupportsComp() as any);
			dot.flushSync();

			const css = getComponentStylesheetCss();
			expect(css).toContain("@supports (backdrop-filter: blur(1px))");
			expect(css).toContain("backdrop-filter: blur(12px)");
		});
	});

	describe("Combined at-rules", () => {

		test("keyframes, container, supports, and media in one stylesheet", () => {
			const builder = new StyleSheetBuilder();
			builder.class("widget", w => w.containerType("inline-size"))
				.keyframes("spin", k => k
					.from(f => f.transform({ rotate: 0 }))
					.to(t => t.transform({ rotate: 360 }))
				)
				.media("screen", m => m
					.container("(min-width: 300px)", c => c
						.class("widget", w => w.animationName("spin"))
					)
				)
				.supports("(animation-timeline: scroll())", s => s
					.class("widget", w => w.animationTimeline("scroll()"))
				);

			const css = builder.toString();
			expect(css).toContain("@keyframes spin");
			expect(css).toContain("@media screen");
			expect(css).toContain("@container (min-width: 300px)");
			expect(css).toContain("@supports (animation-timeline: scroll())");
			expect(css).toContain("container-type: inline-size");
		});
	});
});
