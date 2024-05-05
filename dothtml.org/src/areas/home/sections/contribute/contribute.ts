import { dot } from "dothtml";
import styles from "./contribute.css";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";

const Contribute = dot.component(
	class implements IDotComponent{
		_?: FrameworkItems;
		build() {
			return dot.div();
		}

	}, [styles]
);

export default Contribute;