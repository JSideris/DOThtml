import { dot } from "dothtml";
import styles from "./contribute.css";
import { FrameworkItems, IComponent } from "dothtml-interfaces";

const Contribute = dot.component(
	class implements IComponent{
		_?: FrameworkItems;
		build() {
			return dot.div();
		}

	}, [styles]
);

export default Contribute;