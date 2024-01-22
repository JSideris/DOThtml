import { dot } from "dothtml";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";

@dot.component
class Router implements IComponent{
	events?: string[];
	_?: FrameworkItems;
	build(): IDotGenericElement {
		return dot.div();
	}
}