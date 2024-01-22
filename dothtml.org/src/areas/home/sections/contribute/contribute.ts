import { dot } from "dothtml";
import styles from "./contribute.css";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";

@dot.component
@dot.component.useStyles(styles)
class Contribute implements IComponent{
	events?: string[];
	_?: FrameworkItems;
	build(): IDotGenericElement {
		return dot.div();
	}

}

export default Contribute;