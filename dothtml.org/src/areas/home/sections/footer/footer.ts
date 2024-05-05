import { dot } from "dothtml";
import styles from "./footer.css";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";

const Footer = dot.component(
	class Footer implements IDotComponent{
		_?: FrameworkItems;
		build() {
			return dot.div();
		}
	}, [styles]
);

export default Footer;