import { dot } from "dothtml";
import styles from "./main-code-sample.css";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";

@dot.component
@dot.component.useStyles(styles)
class MainCodeSample implements IComponent{
	events?: string[];
	_?: FrameworkItems;
	build(): IDotGenericElement {
		return dot.div();
	}

}

export default MainCodeSample;