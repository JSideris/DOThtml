import { dot } from "dothtml";
import styles from "./get-dot.css";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";

@dot.component
@dot.component.useStyles(styles)
class GetDot implements IComponent{
	events?: string[];
	_?: FrameworkItems;
	build(): IDotGenericElement {
		return dot.div();
	}

}

export default GetDot;