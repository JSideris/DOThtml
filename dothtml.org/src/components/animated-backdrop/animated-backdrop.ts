import { dot } from "dothtml";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";
import styles from "./animated-backdrop.css";

@dot.component
@dot.component.useStyles(styles)
class AnimatedBackdrop implements IComponent{
	events?: string[];
	_?: FrameworkItems;
	build(): IDotGenericElement {
		return dot.div();
	}
}

export default AnimatedBackdrop;