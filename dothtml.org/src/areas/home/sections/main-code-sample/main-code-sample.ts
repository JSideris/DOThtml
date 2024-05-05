import { dot } from "dothtml";
import styles from "./main-code-sample.css";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";

const MainCodeSample = dot.component(
	class implements IDotComponent {
		_?: FrameworkItems;
		build() {
			return dot.div();
		}
	},
	[styles]
);

export default MainCodeSample;