import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import LargeLogoPart from "./large-logo-part/large-logo-part";
import QuickStartPart from "./quick-start-part/quick-start-part";
import HeroFeaturesPart from "./hero-features-part/hero-features-part";
import styles from "./hero-section.css?inline";

@dot.component
export default class HeroSection implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.div({ class: "hero-section" },
			dot.div({ class: "hero-main" },
				dot.div({ class: "logo-pane" }, dot.mount(new LargeLogoPart())),
				dot.div({ class: "quickstart-pane" }, dot.mount(new QuickStartPart()))
			),
			dot.div({ class: "features-pane" }, dot.mount(new HeroFeaturesPart()))
		);
	}
}
