import { removeNodesBetween } from "../helpers";
import Reactive from "../reactive";
import { Vdom } from "./vdom";

export class HtmlVdom extends Vdom{

	beforeNode: Node;
	afterNode: Node;

	html: string|Reactive;
	observerId: number = 0;

	constructor(html: string|Reactive){
		super();
		this.html = html;
	}

	updateHtml(html){
		if(this.beforeNode){
			removeNodesBetween(this.beforeNode, this.afterNode);
			
			// Need to render everything to a temporary div them move everything to the target.
			let temp = this.beforeNode.ownerDocument.createElement("div");
			temp.innerHTML = html;

			while (temp.firstChild) {
				this.afterNode.parentElement.insertBefore(temp.firstChild, this.afterNode);
			}
		}
	}

	_render(target: HTMLElement) {
		let html = "";
		if(this.html instanceof Reactive){
			html = this.html.getValue();
			this.observerId = this.html.subscribeHtml(this);
		}
		else{
			html = this.html;
		}

		this.beforeNode = target.ownerDocument.createTextNode("");
		this.afterNode = target.ownerDocument.createTextNode("");
		target.appendChild(this.beforeNode);
		target.appendChild(this.afterNode);
		this.updateHtml(html ?? "");
	}

	_unrender() {
		if(this.beforeNode){
			let parent = this.beforeNode.parentElement;

			// TODO: once we set up bindings, need the ability to clear them.
			removeNodesBetween(this.beforeNode, this.afterNode);

			parent.removeChild(this.beforeNode);
			parent.removeChild(this.afterNode);
			this.beforeNode = null;
			this.afterNode = null;
		}

		if(this.observerId && this.html instanceof Reactive){
			this.html.detachBinding(this.observerId);
			this.observerId = 0;
		}
	}

	toString(){
		return this.html instanceof Reactive ? this.html.getValue() : this.html;
	}
}