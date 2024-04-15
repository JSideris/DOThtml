import { dot } from "dothtml";
import { FrameworkItems, IComponent } from "dothtml-interfaces";

const Router = dot.component(
	class implements IComponent{
		events?: string[];
		_?: FrameworkItems;
		build() {
			return dot.div();
		}
	}
)