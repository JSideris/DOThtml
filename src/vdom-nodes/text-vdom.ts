import Reactive from "../reactive";
import { Vdom } from "./vdom";

// TODO: experiment with turning all text into an observable to see if it improves render performance.

export class TextVdom extends Vdom{

	text: string|boolean|number|Reactive;
	textNode: Node = null;
	observerId = 0;

	constructor(text: string|boolean|number|Reactive){
		super();
		this.text = text;
	}

	_render(node: HTMLElement) {
		if(this.text instanceof Reactive){
			this.textNode = node.ownerDocument.createTextNode(this.text.getValue() ?? "");
			this.observerId = this.text.subscribeText(this);
		}
		else{
			this.textNode = node.ownerDocument.createTextNode(`${this.text ?? ""}`);
		}
		
		node.appendChild(this.textNode);
	}

	_unrender() {
		if(this.textNode){

			this.textNode.parentElement.removeChild(this.textNode);
			this.textNode = null;
		}

		if(this.observerId && this.text instanceof Reactive){
			this.text.detachBinding(this.observerId);
			this.observerId = 0;
		}
	}

	toString(){
		let temp = document.createTextNode((this.text instanceof Reactive ? this.text.getValue() : this.text) ?? "");
		let div = document.createElement("div");
		div.appendChild(temp);
		return div.innerHTML;
	}
}