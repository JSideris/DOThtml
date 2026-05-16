import { IBinding } from "dothtml-interfaces";
import VMetaNode from "../v-meta-nodes/v-meta-node";
import CollectionVdom from "../vdom-nodes/collection-vdom";
import { ConditionalVdom } from "../vdom-nodes/conditional-vdom";
import { HtmlVdom } from "../vdom-nodes/html-vdom";
import { TextVdom } from "../vdom-nodes/text-vdom";
import Binding from "./binding";
import ReactiveAttr from "./reactive-attr";


/**
 * Bindings link a reactive to a vdom node or other item using a bound reactive.
 */
export default class Subscription{
	boundReactive: IBinding;
	item: any;
	active: boolean = true;

	constructor(boundReactive: IBinding, item: any){
		this.boundReactive = boundReactive;
		this.item = item;
	}

	// TODO: would be more efficient to compute the _get first then pass it into this function.
	update(): any {
		if(!this.active) return;
		let value = this.boundReactive._get();

		if(this.item instanceof TextVdom){
			this.item.textNode.textContent = value as string ?? "";
		}
		else if(this.item instanceof HtmlVdom){
			this.item.updateHtml(value);
		}
		else if(this.item instanceof ReactiveAttr){
			this.item.elementVdom.setAttr(this.item.attribute, this.boundReactive);
		}
		else if(this.item instanceof VMetaNode){
			this.item.update();
		}
		else if(this.item instanceof CollectionVdom){
			// TODO: shouldn't I pass the value in here???
			return this.item.updateList();
		}
		else if(this.item instanceof ConditionalVdom){
			// TODO: shouldn't I pass the value in here???
			this.item.updateConditions();
		}
		else if(this.item instanceof Function){
			this.item(value);
		}
	}
}