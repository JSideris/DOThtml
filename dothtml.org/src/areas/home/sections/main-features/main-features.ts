import { dot } from "dothtml";
import styles from "./main-features.css";
import { FrameworkItems, IComponent } from "dothtml-interfaces";

const MainFeatures = dot.component(
	class MainFeatures implements IComponent{
		_?: FrameworkItems;
		build() {
			return dot.div();
		}

	}, [styles]
);

export default MainFeatures;