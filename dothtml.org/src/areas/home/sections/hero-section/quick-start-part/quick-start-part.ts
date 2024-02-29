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
				.h3("Start Something New in TypeScript")
				.pre("npm i -g create-dothtml-app").class("cmd")
				.pre("npx create-dothtml-app MyApp").class("cmd")
				.pre("cd MyApp").class("cmd")
				.pre("npm start").class("cmd")
				.p("")
				.h3("Add DOThtml to an existing Node.js Project")
				.pre("npm i dothtml").class("cmd")
				// .h3("DOThtml as a UMD Library")
				// .pre(`<script src="***********************************************************************************"></script>`).class("html")
				// .h3("Learn about Quick Start Configs")
				// .a("blah blah blah").hRef("")
		).id("content");
	}

}

export default QuickStartPart;