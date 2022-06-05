import Component from "../component";
import dot from "../dot";
import { DotContent } from "../i-dot";

// TODO: make text and links mutable by making them properties.
export class NavLink extends Component{
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