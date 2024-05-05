import { dot } from "dothtml";
import styles from "./learn-more.css";
import { FrameworkItems, IDotComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";

@dot.component
@dot.component.useStyles(styles)
class LearnMore implements IDotComponent{
	events?: string[];
	_?: FrameworkItems;
	build(): IDotGenericElement {
		return dot.div();
	}

}

export default LearnMore;