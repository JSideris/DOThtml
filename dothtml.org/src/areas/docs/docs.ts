import { dot, DotComponent } from "dothtml";
import MarkdownViewer from "../../components/MarkdownViewer/MarkdownViewer";

interface DocsProps {
	routeParams: {
		doc?: string;
	};
}

@dot.component
export default class Docs extends DotComponent<DocsProps> {
	static props = {
		routeParams: { type: Object, default: () => ({}) }
	};

	private docs = [
		{ id: "quick-start", label: "Quick Start" },
		{ id: "cli", label: "Official CLI" },
		{ id: "rendering-basics", label: "Rendering Basics" },
		{ id: "main-features", label: "Main Features" },
		{ id: "components", label: "Components" },
		{ id: "reactivity", label: "Reactivity" },
		{ id: "use-cases", label: "Use Cases" },
		{ id: "stores", label: "Stores" },
		{ id: "refs", label: "Refs" },
		{ id: "scroll-and-visibility", label: "Scroll & Visibility" },
		{ id: "styling", label: "Stylize & Style" },
		{ id: "routing", label: "Routing" },
		{ id: "popups", label: "Popups" },
		{ id: "typescript", label: "TypeScript Reference" },
		{ id: "benchmarks", label: "Benchmarks" },
		{ id: "detailed-features", label: "Detailed Features" },
		{ id: "hero-features", label: "Hero Features" },
		{ id: "learn-more", label: "Learn More & Contribute" }
	];

	stylize(s: any) {
		return s.class("docs-container", c => c
			.display("flex")
			.minHeightPx(800)
			.paddingPx(100, 40, 40, 40)
			.maxWidthPx(1450)
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
		).class("docs-pagination", p => p
			.display("flex")
			.justifyContent("space-between")
			.marginTopPx(60)
			.paddingTopPx(40)
			.borderTop("1px solid rgba(255, 255, 255, 0.05)")
		).class("pagination-link", l => l
			.display("flex")
			.flexDirection("column")
			.textDecoration("none")
			.transition("all 0.2s")
		).class("pagination-link.next", l => l
			.alignItems("flex-end")
			.textAlign("right")
		).class("pagination-label", la => la
			.fontSizePx(14)
			.color(s.v("text-dim"))
			.marginBottomPx(5)
		).class("pagination-title", t => t
			.fontSizePx(18)
			.color(s.v("primary"))
			.fontWeight(600)
		).class("pagination-link:hover .pagination-title", t => t
			.color(s.v("text"))
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
		const currentIndex = this.docs.findIndex(d => d.id === currentDoc);
		const prevDoc = currentIndex > 0 ? this.docs[currentIndex - 1] : null;
		const nextDoc = currentIndex < this.docs.length - 1 ? this.docs[currentIndex + 1] : null;

		return dot.div({ class: "docs-container" },
			dot.aside({ class: "sidebar" },
				dot.h3("Documentation"),
				dot.ul(
					dot.each(this.docs, doc => 
						dot.li(
							dot.a({ 
								href: `/docs/${doc.id}`,
								class: currentDoc === doc.id ? "active" : "",
								onClick: (e: MouseEvent) => {
									e.preventDefault();
									(dot as any).navigate(`/docs/${doc.id}`);
								}
							}, doc.label)
						)
					)
				)
			),
			dot.main({ class: "docs-content" },
				dot.mount(new MarkdownViewer({ src: `/docs/${currentDoc}.md` })),
				dot.div({ class: "docs-pagination" },
					prevDoc ? dot.a({ 
						href: `/docs/${prevDoc.id}`, 
						class: "pagination-link prev",
						onClick: (e: MouseEvent) => {
							e.preventDefault();
							(dot as any).navigate(`/docs/${prevDoc.id}`);
						}
					},
						dot.span({ class: "pagination-label" }, "← Previous"),
						dot.span({ class: "pagination-title" }, prevDoc.label)
					) : dot.div(),
					nextDoc ? dot.a({ 
						href: `/docs/${nextDoc.id}`, 
						class: "pagination-link next",
						onClick: (e: MouseEvent) => {
							e.preventDefault();
							(dot as any).navigate(`/docs/${nextDoc.id}`);
						}
					},
						dot.span({ class: "pagination-label" }, "Next →"),
						dot.span({ class: "pagination-title" }, nextDoc.label)
					) : dot.div()
				)
			)
		);
	}
}
