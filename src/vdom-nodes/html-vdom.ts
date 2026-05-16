import { removeNodesBetween } from "../helpers/tools";
import Binding from "../reactivity/binding";
import Watcher from "../reactivity/watcher";
import { Vdom } from "./vdom";

export class HtmlVdom extends Vdom{

	beforeNode: Node;
	afterNode: Node;

	html: string|Binding;
	observerId: number = 0;

	constructor(html: string|Binding){
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
		if(this.html instanceof Binding){
			html = this.html._get() ?? "";
			this.observerId = this.html._subscribe(this);
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

		if(this.observerId && this.html instanceof Binding){
			this.html._unsubscribe(this.observerId);
			this.observerId = 0;
		}
	}

	_getNodes(): Node[] {
		if(!this.beforeNode) return [];
		let nodes = [this.beforeNode];
		let curr = this.beforeNode.nextSibling;
		while(curr && curr !== this.afterNode){
			nodes.push(curr);
			curr = curr.nextSibling;
		}
		nodes.push(this.afterNode);
		return nodes;
	}

	toString(){
		return this.html instanceof Binding ? this.html._get() : this.html;
	}
}