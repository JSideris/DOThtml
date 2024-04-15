import { dot } from "dothtml";
import { IComponent } from "dothtml-interfaces";
import styles from "./small-logo.css";

const SmallLogo = dot.component(
	class implements IComponent{
		build() {
			return dot.div(
				{id: "container"},
				dot.div(
					{id: "logo"},
					dot.span({id: "dot"}, "DOT")
					.span({id: "html"}, "html")
				)
			);
		}
	},

	[styles]
);

export default SmallLogo;