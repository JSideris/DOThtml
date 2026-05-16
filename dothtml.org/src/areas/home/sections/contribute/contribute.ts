import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../../../components/MarkdownViewer/MarkdownViewer";
import styles from "./contribute.css?inline";

@dot.component
export default class Contribute implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.div({ class: "contribute" },
			dot.mount(new MarkdownViewer({ src: "/docs/contribute.md" }))
		);
	}
}
