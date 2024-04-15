

import { dot } from "dothtml";
import { IComponent } from "dothtml-interfaces";

const HelloWorld = dot.component(
	class implements IComponent{
		build() {
			return dot.div("Hello, World!")
		}
	}
);

dot(document.body).mount(new HelloWorld());