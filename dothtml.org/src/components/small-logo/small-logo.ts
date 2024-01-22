import { dot } from "dothtml";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";
import styles from "./small-logo.css";

@dot.component
@dot.component.useStyles(styles)
class SmallLogo implements IComponent{
	build(...args: any[]): IDotGenericElement {
		return dot.div(
			dot.div(
				dot.span("DOT").id("dot")
				.span("html").id("html")
			).id("logo")
		).id("container");
	}

}

export default SmallLogo;