import { dot } from "dothtml";
import styles from "./hero-section.css";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";
import LargeLogoPart from "./large-logo-part/large-logo-part";
import QuickStartPart from "./quick-start-part/quick-start-part";
import HeroFeaturesPart from "./hero-features-part/hero-features-part";

const HeroSection = dot.component(
	class implements IDotComponent{
		events?: string[];
		_?: FrameworkItems;
		build() {
			return dot.div(
				{ id: "content" },
				dot.div(
					{id: "logo-and-quickstart"}, 
					dot
						.div({id: "logo-pane"}, new LargeLogoPart())
						.div({id: "quickstart-pane"}, new QuickStartPart())
				)
				.div({id: "info-tags"}, new HeroFeaturesPart())
			);
		}
	}, 
	[styles]
)

export default HeroSection;