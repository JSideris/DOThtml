import ElementVdom from "../vdom-nodes/element-vdom";

export default class ReactiveAttr{
	
	elementVdom: ElementVdom;
	attribute: string;

	constructor(elementVdom: ElementVdom, attribute: string){
		this.elementVdom = elementVdom;
		this.attribute = attribute;
	}
}