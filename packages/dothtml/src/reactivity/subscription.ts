import { IBinding } from "dothtml-interfaces";
import VMetaNode from "../v-meta-nodes/v-meta-node";
import CollectionVdom from "../vdom-nodes/collection-vdom";
import { ConditionalVdom } from "../vdom-nodes/conditional-vdom";
import { HtmlVdom } from "../vdom-nodes/html-vdom";
import { TextVdom } from "../vdom-nodes/text-vdom";
import Binding from "./binding";
import ReactiveAttr from "./reactive-attr";
import { isVType } from "../helpers/tools";


/**
 * Bindings link a reactive to a vdom node or other item using a bound reactive.
 */
export default class Subscription{
	boundReactive: IBinding;
	item: any;
	active: boolean = true;
	isQueued: boolean = false;

	constructor(boundReactive: IBinding, item: any){
		this.boundReactive = boundReactive;
		this.item = item;
	}

	// TODO: would be more efficient to compute the _get first then pass it into this function.
	update(): any {
		if(!this.active) return;
		let value = this.boundReactive._get();

		if(this.item instanceof TextVdom || isVType(this.item, "text")){
			this.item.textNode.textContent = value as string ?? "";
		}
		else if(this.item._isReactiveVdom || isVType(this.item, "reactive")){
			this.item.update(value);
		}
		else if(this.item instanceof HtmlVdom || isVType(this.item, "html")){
			this.item.updateHtml(value);
		}
		else if(this.item instanceof ReactiveAttr){
			this.item.elementVdom.updateReactiveAttr(this.item.attribute, value as any);
		}
		else if(this.item instanceof VMetaNode || isVType(this.item, ["style-v-node", "attribute-v-node"])){
			this.item.update();
		}
		else if(this.item instanceof CollectionVdom || isVType(this.item, "collection")){
			// TODO: shouldn't I pass the value in here???
			return this.item.updateList();
		}
		else if(this.item instanceof ConditionalVdom || isVType(this.item, "conditional")){
			// TODO: shouldn't I pass the value in here???
			this.item.updateConditions();
		}
		else if(this.item instanceof Function){
			this.item(value);
		}
	}
}