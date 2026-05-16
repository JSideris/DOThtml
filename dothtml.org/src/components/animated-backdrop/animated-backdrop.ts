import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import styles from "./animated-backdrop.css?inline";

@dot.component
export default class AnimatedBackdrop implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.div({ class: "backdrop" },
			dot.div({ class: "grid" }),
			dot.div({ class: "glow" })
		);
	}
}

