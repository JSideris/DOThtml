
// This one will be abstract!

import { dot } from "dothtml";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";
import styles from "./page-section.css";

@dot.component
@dot.component.useStyles(styles)
class PageSection implements IComponent{
	events?: string[];
	_?: FrameworkItems;
	build(...args: any[]): IDotGenericElement {
		return dot.div();
	}

}

export default PageSection;