import ComponentWrapper from "../component-factory";
import dot from "../dot";
import { DotContent } from "../i-dot";

// TODO: make text and links mutable by making them properties.
export class NavLink extends ComponentWrapper{
	content: DotContent;
	hRef: string;
	constructor(content: DotContent, href: string){
		super();
		this.content = content;
		this.hRef = href;
	}

	builder() {
		return dot.a(this.content).hRef(this.hRef).onClick(e => {
			e.preventDefault();
			dot.navigate(this.hRef);
		});
	}
}