import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../../../components/MarkdownViewer/MarkdownViewer";
import styles from "./use-cases.css?inline";

@dot.component
export default class UseCases implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.div({ class: "use-cases" },
			dot.mount(new MarkdownViewer({ src: "/docs/use-cases.md" }))
		);
	}
}
