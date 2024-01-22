import { dot } from "dothtml";
import styles from "./detailed-features.css";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";

@dot.component
@dot.component.useStyles(styles)
class DetailedFeatures implements IComponent{
	events?: string[];
	_?: FrameworkItems;
	build(): IDotGenericElement {
		return dot.div();
	}

}

export default DetailedFeatures;