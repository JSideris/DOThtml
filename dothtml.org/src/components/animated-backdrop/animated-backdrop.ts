import { dot } from "dothtml";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";
import styles from "./animated-backdrop.css";

const AnimatedBackdrop = dot.component(
	class implements IDotComponent{
		events?: string[];
		_?: FrameworkItems;
		build() {
			return dot.div();
		}
	}, 	
	[styles]
);

export default AnimatedBackdrop;