import Binding from "../reactivity/binding";
import Signal from "../reactivity/signal";
import { Vdom } from "./vdom";

// TODO: experiment with turning all text into an observable to see if it improves render performance.

export class TextVdom extends Vdom{

	_text: string|boolean|number|Binding;
	textNode: Node = null;
	observerId = 0;

	constructor(text: string|boolean|number|Binding){
		super();
		this._text = text;
	}

	_render(node: HTMLElement) {
		if(this._text instanceof Binding){
			this.textNode = node.ownerDocument.createTextNode(this._text._get() ?? "");
			this.observerId = this._text._subscribe(this);
		}
		else{
			this.textNode = node.ownerDocument.createTextNode(`${this._text ?? ""}`);
		}
		
		node.appendChild(this.textNode);
	}

	_unrender() {
		if(this.textNode){
			if (this.textNode.parentElement) {
				this.textNode.parentElement.removeChild(this.textNode);
			}
			this.textNode = null;
		}

		if(this.observerId && this._text instanceof Binding){
			this._text._unsubscribe(this.observerId);
			this.observerId = 0;
		}
	}

	_getNodes(): Node[] {
		return this.textNode ? [this.textNode] : [];
	}

	_getLastChild(): Vdom | null {
		return this;
	}

	toString(){
		let temp = document.createTextNode((this._text instanceof Binding ? this._text._get() : this._text) ?? "");
		let div = document.createElement("div");
		div.appendChild(temp);
		return div.innerHTML;
	}
}