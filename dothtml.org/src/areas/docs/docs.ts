import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../components/MarkdownViewer/MarkdownViewer";
import styles from "./docs.css?inline";

@dot.component
export default class Docs implements IDotComponent {
	static props = {
		routeParams: { type: Object, default: () => ({}) }
	};

	private docs = [
		{ id: "quick-start", label: "Quick Start" },
		{ id: "get-dot", label: "Installation" },
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
		{ id: "learn-more", label: "Learn More" },
		{ id: "contribute", label: "Contribute" }
	];

	stylize() {
		return styles;
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
