import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../../../../components/MarkdownViewer/MarkdownViewer";
import styles from "./hero-features-part.css?inline";

@dot.component
export default class HeroFeaturesPart implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.div({ class: "features-container" },
			dot.mount(new MarkdownViewer({ src: "/docs/hero-features.md" }))
		);
	}
}
