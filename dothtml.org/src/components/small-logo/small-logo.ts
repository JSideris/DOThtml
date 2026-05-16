import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import styles from "./small-logo.css?inline";

@dot.component
export default class SmallLogo implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.div({ class: "logo-container" },
			dot.div({ class: "logo-text" },
				dot.span({ class: "dot" }, "DOT")
				.span({ class: "html" }, "html")
			)
		);
	}
}
