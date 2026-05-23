import { removeNodesBetween } from "../helpers/tools";
import Binding from "../reactivity/binding";
import { Vdom } from "./vdom";
import { IDotCore } from "dothtml-interfaces";

export class HtmlVdom extends Vdom{

	beforeNode: Node;
	afterNode: Node;

	_content: any;
	private currentVdom: Vdom | null = null;
	observerId: number = 0;

	constructor(content: any, dot?: IDotCore){
		super(dot);
		this._content = content;
	}

	private _toVdom(value: any): Vdom | null {
		if (value === null || value === undefined) {
			return null;
		}
		if (value instanceof Vdom || value?._root) {
			return value?._root || value;
		}
		
		if (this._dot) {
			if ((typeof value === "object" && value.build) || Array.isArray(value)) {
				// Use the dot factory to create a container and mount the content.
				// This avoids circular dependencies on ComponentVdom/ContainerVdom.
				return (this._dot as any).mount(value)._root;
			}
		}
		
		return null;
	}

	updateHtml(content: any){
		if(this.beforeNode){
			if (this.currentVdom) {
				this.currentVdom._unrender();
				this.currentVdom = null;
			}
			removeNodesBetween(this.beforeNode, this.afterNode);
			
			const vdom = this._toVdom(content);
			if (vdom) {
				this.currentVdom = vdom;
				this.currentVdom._renderBefore(this.afterNode);
			} else if (content !== null && content !== undefined) {
				// Need to render everything to a temporary div them move everything to the target.
				let temp = this.beforeNode.ownerDocument.createElement("div");
				temp.innerHTML = content;

				while (temp.firstChild) {
					this.afterNode.parentElement.insertBefore(temp.firstChild, this.afterNode);
				}
			}
		}
	}

	_render(target: HTMLElement) {
		let val = "";
		if(this._content instanceof Binding){
			val = this._content._get();
			this.observerId = this._content._subscribe(this);
		}
		else{
			val = this._content;
		}

		this.beforeNode = target.ownerDocument.createTextNode("");
		this.afterNode = target.ownerDocument.createTextNode("");
		target.appendChild(this.beforeNode);
		target.appendChild(this.afterNode);
		this.updateHtml(val);
	}

	_unrender() {
		if(this.beforeNode){
			if (this.currentVdom) {
				this.currentVdom._unrender();
				this.currentVdom = null;
			}

			let parent = this.beforeNode.parentElement;

			removeNodesBetween(this.beforeNode, this.afterNode);

			parent.removeChild(this.beforeNode);
			parent.removeChild(this.afterNode);
			this.beforeNode = null;
			this.afterNode = null;
		}

		if(this.observerId && this._content instanceof Binding){
			this._content._unsubscribe(this.observerId);
			this.observerId = 0;
		}
	}

	update(value: any) {
		this.updateHtml(value);
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

	_getLastChild(): Vdom | null {
		return this;
	}

	toString(){
		if (this.currentVdom) return this.currentVdom.toString();
		return this._content instanceof Binding ? this._content._get() : this._content;
	}
}
