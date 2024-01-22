import { dot } from "dothtml";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";
import styles from "./large-logo-part.css";

@dot.component
@dot.component.useStyles(styles)
class LargeLogoPart implements IComponent{
	events?: string[];
	_?: FrameworkItems;
	build(...args: any[]): IDotGenericElement {
		return dot.div(
			dot.div(
				dot.span("DOT").id("dot")
				.span("html").id("html")
			).id("logo")
			.div("Redefine web development.").id("tagline")
		).id("container");
	}

}

export default LargeLogoPart;