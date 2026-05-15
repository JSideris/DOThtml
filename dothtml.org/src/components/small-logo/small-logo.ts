import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import styles from "./small-logo.css?inline";

const SmallLogo = dot.component(
	class implements IDotComponent{
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