import { dot } from "dothtml";
import { FrameworkItems, IComponent } from "dothtml-interfaces";
import styles from "./nav-btn.css";

const NavBtn = dot.component<["text"], ["click"]>(
	class implements IComponent{

		// events?: string[] = ["click"];
		_?: FrameworkItems;
		build() {
			return dot.a(
				{ 
					id: "container", 
					onClick: ()=>this._.emit("click") 
				},
				this._.props.text
			);
		}

	},
	[styles]
);

export default NavBtn;