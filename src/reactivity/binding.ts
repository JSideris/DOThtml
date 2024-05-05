import { IBoundReactive } from "dothtml-interfaces";
import VMetaNode from "../v-meta-nodes/v-meta-node";
import CollectionVdom from "../vdom-nodes/collection-vdom";
import { ConditionalVdom } from "../vdom-nodes/conditional-vdom";
import { HtmlVdom } from "../vdom-nodes/html-vdom";
import { TextVdom } from "../vdom-nodes/text-vdom";
import BoundReactive from "./bound-reactive";
import ReactiveAttr from "./reactive-attr";
import ReactiveStyle from "./reactive-style";


/**
 * Bindings link a reactive to a vdom node or other item using a bound reactive.
 */
export default class Binding{
	boundReactive: IBoundReactive;
	item: any;

	constructor(boundReactive: IBoundReactive, item: any){
		this.boundReactive = boundReactive;
		this.item = item;
	}

	// TODO: would be more efficient to compute the _get first then pass it into this function.
	update(){
		let value = this.boundReactive._get();

		if(this.item instanceof TextVdom){
			this.item.textNode.textContent = value as string ?? "";
		}
		else if(this.item instanceof HtmlVdom){
			this.item.updateHtml(value);
		}
		else if(this.item instanceof ReactiveAttr){
			console.log("UPDATING REACTIVE ATTR", this.item.attribute, value);
			this.item.elementVdom.setAttr(this.item.attribute, this.boundReactive);
		}
		else if(this.item instanceof VMetaNode){
			this.item.update();
		}
		else if(this.item instanceof ReactiveStyle){
			this.item.vStyle.updateProp(this.item.prop, value);
		}
		else if(this.item instanceof CollectionVdom){
			// TODO: shouldn't I pass the value in here???
			this.item.updateList();
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