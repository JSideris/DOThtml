import { dot } from "dothtml";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";
import styles from "./quick-start-part.css";

@dot.component
@dot.component.useStyles(styles)
class QuickStartPart implements IComponent{
	events?: string[];
	_?: FrameworkItems;
	build(...args: any[]): IDotGenericElement {
		return dot.div(
			dot
				.h3("Start Something New")
				.pre("npm i -g create-dothtml-app")
				.pre("npx create-dothtml-app MyApp")
				.pre("cd MyApp")
				.pre("npm start")
				.p("")
				.h3("Use DOThtml in an Existing Project")
				.pre("npm i dothtml")
		).id("content");
	}

}

export default QuickStartPart;