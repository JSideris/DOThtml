import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../../../components/MarkdownViewer/MarkdownViewer";
import styles from "./detailed-features.css?inline";

@dot.component
export default class DetailedFeatures implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.div({ class: "detailed-features" },
			dot.mount(new MarkdownViewer({ src: "/docs/detailed-features.md" }))
		);
	}
}
