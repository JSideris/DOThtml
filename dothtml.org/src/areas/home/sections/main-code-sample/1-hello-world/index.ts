

import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";

const HelloWorld = dot.component(
	class implements IDotComponent{
		build() {
			return dot.div("Hello, World!")
		}
	}
);

dot(document.body).mount(new HelloWorld());