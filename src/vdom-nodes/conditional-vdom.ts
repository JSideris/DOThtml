import { removeNodesBetween } from "../helpers/tools";
import Binding from "../reactivity/binding";
import { ContainerVdom } from "./container-vdom";
import { Vdom } from "./vdom";
import { ConditionalNodeItem } from "./vdom-types";

export class ConditionalVdom extends Vdom{

	private conditions: Array<ConditionalNodeItem> = []
	private sealed = false;
	private renderedIndex = -1;

	addCondition(condition:Binding|boolean, vNode: ContainerVdom, seal = false){

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

		for(let i = 0; i < this.conditions.length; i++){
			let C = this.conditions[i]
			this.removeCNode(C);
		}
	}

	updateConditions(){

		let node = this.conditions[0].startAnchor.parentElement as HTMLElement;
		let newIndex = -1;
		for(let c = 0; c < this.conditions.length; c++){
			let C = this.conditions[c];

			if(C.condition instanceof Binding ? C.condition._get() : C.condition){
				newIndex = c;
				break;
			}
		}

		if(newIndex != this.renderedIndex){
			{ // Remove old render.
				if(this.renderedIndex != -1){
					let C = this.conditions[this.renderedIndex];
					// We don't want to remove the anchors here, just the content between them.
					// So we call the unrender method on the vNode.
					C.vNode._unrender();
				}
			}

			{ // Do the new render.
				this.renderedIndex = newIndex;
				if(newIndex != -1){
					let C = this.conditions[newIndex];
					C.vNode._renderBefore(C.endAnchor);
				}
			}
		}
	}
}