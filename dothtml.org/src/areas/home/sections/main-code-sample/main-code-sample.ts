import { dot } from "dothtml";
import styles from "./main-code-sample.css";
import { FrameworkItems, IComponent } from "dothtml-interfaces";

const MainCodeSample = dot.component(
	class implements IComponent {
		_?: FrameworkItems;
		build() {
			return dot.div();
		}
	},
	[styles]
);

export default MainCodeSample;