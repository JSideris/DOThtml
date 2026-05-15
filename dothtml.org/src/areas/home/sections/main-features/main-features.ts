import { dot } from "dothtml";
import styles from "./main-features.css?inline";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";

const MainFeatures = dot.component(
	class MainFeatures implements IDotComponent{
		_?: FrameworkItems;
		build() {
			return dot.div();
		}

	}, [styles]
);

export default MainFeatures;