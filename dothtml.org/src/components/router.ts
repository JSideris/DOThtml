import { dot } from "dothtml";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";

const Router = dot.component(
	class implements IDotComponent{
		events?: string[];
		_?: FrameworkItems;
		build() {
			return dot.div();
		}
	}
)