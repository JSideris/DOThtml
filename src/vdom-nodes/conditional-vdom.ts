import { removeNodesBetween } from "../helpers";
import Reactive from "../reactive";
import { ContainerVdom } from "./container-vdom";
import { Vdom } from "./vdom";
import { ConditionalNodeItem } from "./vdom-types";

export class ConditionalVdom extends Vdom{

	private conditions: Array<ConditionalNodeItem> = []
	private sealed = false;
	private renderedIndex = -1;

	addCondition(condition:Reactive|boolean, vNode: ContainerVdom, seal = false){

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

		if(this.conditions[0].startAnchor){
			// This means it's rendered.

			this.addAnchor(C, this.conditions[0].startAnchor.parentElement);

			if(condition instanceof Reactive){
				C.observerId = condition.subscribeCond(this);
			}

			this.updateConditions();
		}
	}

	addAnchor(C: ConditionalNodeItem, node: HTMLElement){
		C.startAnchor = node.ownerDocument.createTextNode("");
		C.endAnchor = node.ownerDocument.createTextNode("");
		node.appendChild(C.startAnchor);
		node.appendChild(C.endAnchor);
	}

	_render(node: HTMLElement) {
		// this._node = targetDocument.createTextNode(this._textContent);
		// return this._node;

		// First render all of the text nodes.

		for(let c = 0; c < this.conditions.length; c++){
			let C = this.conditions[c];
			if(C.startAnchor){
				throw new Error("Item is already rendered.");
			}

			// C.textAnchor = targetDocument.createTextNode(`${c}`); // DEBUGGING
			this.addAnchor(C, node);

			if(C.condition instanceof Reactive){
				C.observerId = C.condition.subscribeCond(this);
			}
		}

		// Now render the first node with a positive conidion (if any)
		if(this.conditions.length)
		this.updateConditions();
	}

	_unrender() {
		if(this.conditions[0].startAnchor){
			for(let i = 0; i < this.conditions.length; i++){
				let C = this.conditions[i]
				let start = C.startAnchor;
				let end = C.endAnchor;

				C.vNode._unrender();
				start.parentElement.removeChild(start);
				end.parentElement.removeChild(end);
				C.startAnchor = null;
				C.endAnchor = null;

				if(C.condition instanceof Reactive){
					C.condition.detachBinding(C.observerId);
					C.observerId = 0;
				}
			}
			this.renderedIndex = -1;
		}
	}

	updateConditions(){
		let node = this.conditions[0].startAnchor.parentElement as HTMLElement;
		let newIndex = -1;
		for(let c = 0; c < this.conditions.length; c++){
			let C = this.conditions[c];

			if(C.condition instanceof Reactive ? C.condition.getValue() : C.condition){
				newIndex = c;
				break;
			}
		}

		if(newIndex != this.renderedIndex){
			{ // Remove old render.
				if(this.renderedIndex != -1){
					let C = this.conditions[this.renderedIndex];
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