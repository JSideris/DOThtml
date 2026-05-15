import { dot } from "dothtml";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";
import styles from "./hero-features-part.css?inline";
import MarkdownViewer from "../../../components/MarkdownViewer/MarkdownViewer";

@dot.component
@dot.component.useStyles(styles)
class HeroFeaturesPart implements IDotComponent{
	events?: string[];
	_?: FrameworkItems;
	build() {
		return dot.div(
			{ id: "content" },
			new MarkdownViewer("/docs/hero-features.md")
		);
	}

}

export default HeroFeaturesPart;
