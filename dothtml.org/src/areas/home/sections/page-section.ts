import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import styles from "./page-section.css?inline";

@dot.component
export default class PageSection implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.div({ class: "page-section" });
	}
}
