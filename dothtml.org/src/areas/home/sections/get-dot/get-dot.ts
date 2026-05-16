import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../../../components/MarkdownViewer/MarkdownViewer";
import styles from "./get-dot.css?inline";

@dot.component
export default class GetDot implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.div({ class: "get-dot-section" },
			dot.mount(new MarkdownViewer({ src: "/docs/get-dot.md" }))
		);
	}
}
