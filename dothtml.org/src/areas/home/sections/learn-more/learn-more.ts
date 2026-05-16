import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../../../components/MarkdownViewer/MarkdownViewer";
import styles from "./learn-more.css?inline";

@dot.component
export default class LearnMore implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.div({ class: "learn-more" },
			dot.mount(new MarkdownViewer({ src: "/docs/learn-more.md" }))
		);
	}
}
