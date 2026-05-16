import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../components/MarkdownViewer/MarkdownViewer";

@dot.component
export default class Docs implements IDotComponent {
	static props = {
		routeParams: { type: Object, default: () => ({}) }
	};

	private docs = [
		{ id: "quick-start", label: "Quick Start" },
		{ id: "main-features", label: "Main Features" },
		{ id: "use-cases", label: "Use Cases" },
		{ id: "components", label: "Components" },
		{ id: "reactivity", label: "Reactivity" },
		{ id: "stores", label: "Stores" },
		{ id: "refs", label: "Refs" },
		{ id: "styling", label: "Styling" },
		{ id: "routing", label: "Routing" },
		{ id: "detailed-features", label: "Detailed Features" },
		{ id: "hero-features", label: "Hero Features" },
		{ id: "learn-more", label: "Learn More & Contribute" }
	];

	stylize(s: any) {
		return s.class("docs-container", c => c
			.display("flex")
			.minHeightPx(800)
			.paddingPx(100, 40, 40, 40)
			.maxWidthPx(1400)
			.marginPx(0, "auto")
			.gapPx(40)
			.position("relative")
			.zIndex(1)
		).class("sidebar", si => si
			.widthPx(280)
			.flexShrink(0)
			.position("sticky")
			.topPx(100)
			.height("fit-content")
			.paddingPx(20)
			.backgroundColor("rgba(255, 255, 255, 0.02)")
			.borderRadiusPx(12)
			.border("1px solid rgba(255, 255, 255, 0.05)")
		).class("sidebar h3", h => h
			.fontSizePx(18)
			.marginBottomPx(20)
			.color(s.v("primary"))
			.textTransform("uppercase")
			.letterSpacingPx(1)
		).class("sidebar ul", u => u
			.listStyle("none")
		).class("sidebar li", l => l
			.marginBottomPx(5)
		).class("sidebar a", a => a
			.display("block")
			.paddingPx(8, 12)
			.borderRadiusPx(6)
			.color(s.v("text-dim"))
			.transition("all 0.2s")
		).class("sidebar a:hover", a => a
			.color(s.v("text"))
			.backgroundColor("rgba(255, 255, 255, 0.05)")
		).class("sidebar a.active", a => a
			.color(s.v("primary"))
			.backgroundColor("rgba(255, 152, 0, 0.1)")
			.fontWeight(600)
		).class("docs-content", co => co
			.flex(1)
			.minWidth(0)
			.backgroundColor("rgba(255, 255, 255, 0.01)")
			.paddingPx(40)
			.borderRadiusPx(12)
			.border("1px solid rgba(255, 255, 255, 0.03)")
		).media("screen and (max-width: 800px)", m => m
			.class("docs-container", dc => dc
				.flexDirection("column")
				.paddingPx(60, 10, 10, 10)
			).class("sidebar", si => si
				.widthP(100)
				.position("static")
			)
		);
	}

	build() {
		const currentDoc = this.props.routeParams.doc || "quick-start";

		return dot.div({ class: "docs-container" },
			dot.aside({ class: "sidebar" },
				dot.h3("Documentation"),
				dot.ul(
					dot.each(this.docs, doc => 
						dot.li(
							dot.a({ 
								href: `#/docs/${doc.id}`,
								class: currentDoc === doc.id ? "active" : ""
							}, doc.label)
						)
					)
				)
			),
			dot.main({ class: "docs-content" },
				dot.mount(new MarkdownViewer({ src: `/docs/${currentDoc}.md` }))
			)
		);
	}
}
