/**
 * This class represents a virtual dom tree.
 */

type PrimativeAttributeValueType = string|number|boolean;
type AttributeValueType = PrimativeAttributeValueType|(()=>AttributeValueType);

export default class VdomNode{
	tag: string;
	element: Element;
	attributes: Record<string, AttributeValueType> = {};
	children: Array<VdomNode> = [];

	constructor(tag: string){
		this.tag = tag;
	}

	addChild(node: VdomNode){
		this.children.push(node);
	}

	render(targetDocument = document){
		this.element = targetDocument.createElement(this.tag);
		for(let a in this.attributes){
			let A = this.attributes[a];
			if(typeof A === "string" || typeof A === "number"){
				this.element.setAttribute(a, `${A}`);
			}
			else if (typeof A === "boolean"){
				if(A){
					this.element.setAttribute(a, `${A}`);
				}
				else{
					this.element.removeAttribute(a);
				}
			}
			else{
				// It's a callback.
				// attachEvent((pendingCallTarget as Element), newName, call.params[0], call.arg3);
			}
		}
		return this.element;
	}
}
