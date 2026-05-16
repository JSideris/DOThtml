import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../../../../components/MarkdownViewer/MarkdownViewer";
import styles from "./quick-start-part.css?inline";

@dot.component
export default class QuickStartPart implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.div({ class: "terminal-container" },
			dot.div({ class: "terminal-header" },
				dot.div({ class: "dot dot-red" }),
				dot.div({ class: "dot dot-yellow" }),
				dot.div({ class: "dot dot-green" })
			),
			dot.mount(new MarkdownViewer({ src: "/docs/quick-start.md" }))
		);
	}
}
