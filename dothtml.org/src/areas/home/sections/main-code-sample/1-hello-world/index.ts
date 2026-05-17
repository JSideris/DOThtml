

import { dot, IDotComponent } from "dothtml";

const HelloWorld = dot.component(
	class implements IDotComponent{
		build() {
			return dot.div("Hello, World!")
		}
	}
);

dot(document.body).mount(new HelloWorld());