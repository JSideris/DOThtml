import { dot } from "dothtml";
import styles from "./detailed-features.css";
import { FrameworkItems, IComponent } from "dothtml-interfaces";

const DetailedFeatures = dot.component(
	class DetailedFeatures implements IComponent{
		_?: FrameworkItems;
		build() {
			return dot.div();
		}
	}
);

export default DetailedFeatures;