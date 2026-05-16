import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../../../components/MarkdownViewer/MarkdownViewer";
import styles from "./main-features.css?inline";

@dot.component
export default class MainFeatures implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.div({ class: "main-features" },
			dot.mount(new MarkdownViewer({ src: "/docs/main-features.md" }))
		);
	}
}
