import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import styles from "./nav-btn.css?inline";

@dot.component
export default class NavBtn implements IDotComponent {
	static props = {
		text: { type: String, required: true },
		active: { type: Boolean, default: false }
	};

	stylize() {
		return styles;
	}

	build() {
		return dot.a({ 
			class: ["nav-btn", { active: this.props.active }] 
		}, this.props.text);
	}
}
