import { dot } from "dothtml";
import styles from "./footer.css";
import { FrameworkItems, IComponent } from "dothtml-interfaces";

const Footer = dot.component(
	class Footer implements IComponent{
		_?: FrameworkItems;
		build() {
			return dot.div();
		}
	}, [styles]
);

export default Footer;