import { dot } from "dothtml";
import styles from "./hero-section.css";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";
import LargeLogoPart from "./large-logo-part/large-logo-part";
import QuickStartPart from "./quick-start-part/quick-start-part";
import HeroFeaturesPart from "./hero-features-part/hero-features-part";

@dot.component
@dot.component.useStyles(styles)
class HeroSection implements IComponent{
	events?: string[];
	_?: FrameworkItems;
	build(): IDotGenericElement {
		return dot.div(
			dot.div(
				dot
					.div(new LargeLogoPart()).id("logo-pane")
					.div(new QuickStartPart()).id("quickstart-pane")
			).id("logo-and-quickstart")
			.div(new HeroFeaturesPart()).id("info-tags")
		).id("content");
	}

}

export default HeroSection;