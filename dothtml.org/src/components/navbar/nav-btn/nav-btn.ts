import { dot } from "dothtml";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";
import styles from "./nav-btn.css";

@dot.component
@dot.component.useStyles(styles)
class NavBtn implements IComponent{

	constructor(text: string){}

	events?: string[] = ["click"];
	_?: FrameworkItems;
	build(text: string): IDotGenericElement {
		return dot.a(
			text
		).id("container").onClick(()=>this._.emit("click"));
	}

}

export default NavBtn;