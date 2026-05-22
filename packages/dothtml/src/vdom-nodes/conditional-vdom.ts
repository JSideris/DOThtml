import { removeNodesBetween } from "../helpers/tools";
import Binding from "../reactivity/binding";
import { ContainerVdom } from "./container-vdom";
import { Vdom } from "./vdom";
import { ConditionalNodeItem } from "./vdom-types";
import { IDotCore } from "dothtml-interfaces";

export class ConditionalVdom extends Vdom{

	private conditions: Array<ConditionalNodeItem> = []
	private sealed = false;
	private renderedIndex = -1;
	private currentUpdatePromise: Promise<void> | null = null;
	private nextIndex: number | null = null;

	constructor(dot: IDotCore){
		super(dot);
	}

	addCondition(condition:Binding|boolean, vNode: Vdom, seal = false){

		if(this.sealed){
			throw new Error("Cannot add additional conditions to a sealed block.");
		}
		this.sealed = seal;

		let C = {
			condition,
			vNode,
			startAnchor: null,
			endAnchor: null,
			observerId: 0
		};

		this.conditions.push(C);

		// If we're rendered
		if(this._isRendered){
			// This means it's rendered.

			this.renderClause(C, this.conditions[0].startAnchor.parentElement);

			// If we're rendered but none of the previous conditions were true.
			if(this.renderedIndex == -1){
				this.updateConditions();
			}
		}
	}

	private renderClause(C: ConditionalNodeItem, node: HTMLElement){
		// Add the anchors.
		if(C.startAnchor) throw new Error("Item is already rendered.");
		C.startAnchor = node.ownerDocument.createTextNode("");
		C.endAnchor = node.ownerDocument.createTextNode("");
		node.appendChild(C.startAnchor);
		node.appendChild(C.endAnchor);

		// Subscribe if necessary.
		if(C.condition instanceof Binding){
			C.observerId = C.condition._subscribe(this);
		}
	}

	_render(node: HTMLElement) {
		// this._node = targetDocument.createTextNode(this._textContent);
		// return this._node;
		this._isRendered = true;

		// First render all of the text nodes.

		// Need to readd all the conditions.
		for(let c = 0; c < this.conditions.length; c++){
			this.renderClause(this.conditions[c], node);
		}

		// Now render the first node with a positive conidion (if any)
		this.updateConditions();
	}

	removeCNode(C: ConditionalNodeItem){

		if(C.condition instanceof Binding){
			C.condition._unsubscribe(C.observerId);
			C.observerId = 0;
		}

		let start = C.startAnchor;
		let end = C.endAnchor;
		start.parentElement.removeChild(start);
		end.parentElement.removeChild(end);
		C.startAnchor = null;
		C.endAnchor = null;
		C.vNode._unrender();
	}

	_unrender() {
		if(!this._isRendered) return;
		this._isRendered = false;
		this.renderedIndex = -1;
		this.nextIndex = null;
		this.currentUpdatePromise = null;

		for(let i = 0; i < this.conditions.length; i++){
			let C = this.conditions[i]
			this.removeCNode(C);
		}
	}

	_getNodes(): Node[] {
		if(!this._isRendered) return [];
		let nodes = [];
		for(let i = 0; i < this.conditions.length; i++){
			let C = this.conditions[i];
			nodes.push(C.startAnchor);
			if(i == this.renderedIndex){
				nodes.push(...C.vNode._getNodes());
			}
			nodes.push(C.endAnchor);
		}
		return nodes;
	}

	_getLastChild(): Vdom | null {
		return this;
	}

	updateConditions(){

		let newIndex = -1;
		for(let c = 0; c < this.conditions.length; c++){
			let C = this.conditions[c];

			if(C.condition instanceof Binding ? C.condition._get() : C.condition){
				newIndex = c;
				break;
			}
		}

		if (this.currentUpdatePromise) {
			this.nextIndex = newIndex;
			return;
		}

		if(newIndex != this.renderedIndex){
			this.performUpdate(newIndex);
		}
	}

	private performUpdate(newIndex: number) {
		const oldIndex = this.renderedIndex;

		if(oldIndex != -1){
			const C = this.conditions[oldIndex];
			const result = C.vNode._unrenderAsync();
			if (result instanceof Promise) {
				this.currentUpdatePromise = result;
				result.then(() => {
					this.currentUpdatePromise = null;
					this.renderedIndex = -1; // Mark as nothing rendered during transition
					this.finishUpdate(newIndex);
				});
				return;
			}
		}

		this.renderedIndex = -1;
		this.finishUpdate(newIndex);
	}

	private finishUpdate(newIndex: number) {
		// Check if we were interrupted
		if (this.nextIndex !== null) {
			const next = this.nextIndex;
			this.nextIndex = null;
			if (next !== newIndex) {
				this.performUpdate(next);
				return;
			}
		}

		this.renderedIndex = newIndex;

		if(this.renderedIndex != -1){
			const C = this.conditions[this.renderedIndex];
			C.vNode._renderBefore(C.endAnchor);
		}

		// Check if we were interrupted during render
		if (this.nextIndex !== null) {
			const next = this.nextIndex;
			this.nextIndex = null;
			if (next !== this.renderedIndex) {
				this.performUpdate(next);
			}
		}
	}
}
