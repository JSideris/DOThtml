import { dot } from "dothtml";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";
import styles from "./quick-start-part.css?inline";

const QuickStartPart = dot.component(
	class implements IDotComponent{
		events?: string[];
		_?: FrameworkItems;
		build() {
			return dot.div(
				{id: "content"},
				dot
					.h3("Start Something New in TypeScript")
					.pre({class: "cmd"}, "npm i -g create-dothtml-app")
					.pre({class: "cmd"}, "npx create-dothtml-app MyApp")
					.pre({class: "cmd"}, "cd MyApp")
					.pre({class: "cmd"}, "npm start")
					.p("")
					.h3("Add DOThtml to an existing Node.js Project")
					.pre({class: "cmd"}, "npm i dothtml")
					// .h3("DOThtml as a UMD Library")
					// .pre(`<script src="***********************************************************************************"></script>`).class("html")
					// .h3("Learn about Quick Start Configs")
					// .a("blah blah blah").hRef("")
			)
		}
	}, [styles]
);

export default QuickStartPart;