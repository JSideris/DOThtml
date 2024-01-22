import { IComponent } from "dothtml-interfaces";
import Reactive from "../reactive";
import CollectionVdom from "./collection-vdom";
import { ConditionalVdom } from "./conditional-vdom";
import ElementVdom from "./element-vdom";
import { HtmlVdom } from "./html-vdom";
import { TextVdom } from "./text-vdom";
import { Vdom } from "./vdom";
import { AttributeValueType, ObservableCollection } from "./vdom-types";
import { ComponentVdom } from "./component-vdom";

type ParentVdom = ContainerVdom|ConditionalVdom|ElementVdom;

/**
 * This is the actual document builder.
 */
export class ContainerVdom extends Vdom{
	_children: Array<Vdom> = [];
	_parent: ParentVdom = null;

	constructor(){
		super();
	}

	_addChild(content: Vdom){
		this._children.push(content);
		if(this._parent && this._parent instanceof ElementVdom && this._parent.element) content._render(this._parent.element);
		return this;
	}

	_render(node: HTMLElement){	
		for(let c = 0; c < this._children.length; c++){
			this._children[c]._render(node);
		}
	}

	_unrender() {
		for(let c = 0; c < this._children.length; c++){
			this._children[c]._unrender();
		}
	}
	
	html(c: string|Reactive){
		let hn = new HtmlVdom(c);
		return this._addChild(hn);
	}

	text(c: string|Reactive){
		let tn = new TextVdom(c);
		return this._addChild(tn);
	}

	mount(c: IComponent){
		let cn = new ComponentVdom(c);
		return this._addChild(cn);
	}

	// // TODO: need to support immediate rendering.
	when(condition:Reactive|boolean, then: ContainerVdom|string|boolean|number){
		let condNode = new ConditionalVdom();
		let thenContainer: ContainerVdom;
		if(then instanceof ContainerVdom){
			thenContainer = then;
		}
		else{
			thenContainer = new ContainerVdom();
			let textVdom = new TextVdom(then);
			thenContainer._addChild(textVdom);
			then = thenContainer;
		}
		condNode.addCondition(condition, then);
		this._addChild(condNode);

		return this;
	}
	otherwiseWhen(condition:Reactive|boolean, then: ContainerVdom|string|boolean|number, seal = false){
		let condNode = this._children[this._children.length - 1];
		if(condNode instanceof ConditionalVdom){
			let thenContainer: ContainerVdom;
			if(then instanceof ContainerVdom){
				thenContainer = then;
			}
			else{
				thenContainer = new ContainerVdom();
				let textVdom = new TextVdom(then);
				thenContainer._addChild(textVdom);
				then = thenContainer;
			}
			condNode.addCondition(condition, then, seal);
			// if(this._isCore){
			// 	this._renderChildAndAppend(condNode);
			// }
		}
		else{
			throw new Error("Can't branch off of a non-conditional node.");
		}

		return this;
	}
	otherwise(then: ContainerVdom|string|boolean|number){ return this.otherwiseWhen(true, then, true) }

	each(collection: ObservableCollection, callback: ()=>Vdom){
		let collectionVdom = new CollectionVdom(collection, callback);
		this._addChild(collectionVdom);
		return this;
	}
}