
// This one will be abstract!

import { dot } from "dothtml";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";
import styles from "./page-section.css";

// AFTER
const PageSection = dot.component(
	class implements IDotComponent{
		events?: string[];
		_?: FrameworkItems;
		build(...args: any[]) {
			return dot.div();
		}
	}, [styles]
);

export default PageSection;