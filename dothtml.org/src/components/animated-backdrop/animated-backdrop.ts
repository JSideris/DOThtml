import { dot } from "dothtml";
import { FrameworkItems, IComponent } from "dothtml-interfaces";
import styles from "./animated-backdrop.css";

const AnimatedBackdrop = dot.component(
	class implements IComponent{
		events?: string[];
		_?: FrameworkItems;
		build() {
			return dot.div();
		}
	}, 	
	[styles]
);

export default AnimatedBackdrop;