import { dot } from "dothtml";
import styles from "./get-dot.css";
import { FrameworkItems, IDotComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";

@dot.component
@dot.component.useStyles(styles)
class GetDot implements IDotComponent{
	events?: string[];
	_?: FrameworkItems;
	build(): IDotGenericElement {
		return dot.div();
	}

}

export default GetDot;