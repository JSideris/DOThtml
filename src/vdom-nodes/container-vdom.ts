import { IDotComponent, IDotCore, IDotCss } from "dothtml-interfaces";
import Watcher from "../reactivity/watcher";
import CollectionVdom from "./collection-vdom";
import { ConditionalVdom } from "./conditional-vdom";
import ElementVdom from "./element-vdom";
import { HtmlVdom } from "./html-vdom";
import { TextVdom } from "./text-vdom";
import { Vdom } from "./vdom";
import { AttributeValueType, ObservableCollection } from "./vdom-types";
import { ComponentVdom } from "./component-vdom";
import Binding from "../reactivity/binding";

type ParentVdom = ContainerVdom|ConditionalVdom|ElementVdom;

function reduceReactive(value: any){
	if(value instanceof Watcher) return value.bind();
	else return value;
}

/**
 * This is the actual document builder.
 */
export class ContainerVdom extends Vdom{
	_children: Array<Vdom> = [];
	_parent: ParentVdom = null;
	_dot: IDotCore;

	constructor(dot: IDotCore){
		super();
		this._dot = dot;
	}

	_addChild(content: Vdom){
		this._children.push(content);
		if(this._parent && this._parent instanceof ElementVdom && this._parent.element) content._render(this._parent.element);
		return this;
	}

	_render(node: HTMLElement){	
		this._isRendered = true;
		for(let c = 0; c < this._children.length; c++){
			this._children[c]._render(node);
		}
	}

	_unrender() {
		if(!this._isRendered) return;
		this._isRendered = false;
		for(let c = 0; c < this._children.length; c++){
			this._children[c]._unrender();
		}
	}

	// TODO: may need ot privatize this. This is no longer how attributes are set from outside of the framework.
	attr(A: string, c: any){
		let C = this._children[this._children.length - 1];
		if(C && C instanceof ElementVdom){
			C.setAttr(A, c);
		}
		else{
			throw new Error(`Invalid node to set ${A} attribute.`);
		}
	}
	
	html(c: string|Watcher|Binding){
		let hn = new HtmlVdom(reduceReactive(c));
		return this._addChild(hn);
	}

	text(c: string|Watcher|Binding){
		let tn = new TextVdom(reduceReactive(c));
		return this._addChild(tn);
	}

	md(c: string|Watcher){
		// TODO: for now, just render as text. 
		// We can add the md functionality later.
		return this.text(reduceReactive(c));
	}

	// style(c: string|Reactive|IDotCss){
	// 	if(c instanceof Reactive || typeof c == "string"){
	// 		this.attr("style", c);
	// 	}
	// 	else{
	// 		// It's a style builder.
	// 		if()
	// 	}
	// }

	mount(c: IDotComponent){
		let cn = new ComponentVdom(this._dot, c);
		return this._addChild(cn);
	}

	// // TODO: need to support immediate rendering.
	when(condition:Watcher|Binding|boolean, then: ContainerVdom|string|boolean|number){
		let condNode = new ConditionalVdom();
		let thenContainer: ContainerVdom;
		if(then instanceof ContainerVdom){
			thenContainer = then;
		}
		else{
			thenContainer = new ContainerVdom(this._dot);
			let textVdom = new TextVdom(reduceReactive(then));
			thenContainer._addChild(textVdom);
			then = thenContainer;
		}
		condNode.addCondition(reduceReactive(condition), reduceReactive(then));
		this._addChild(condNode);

		return this;
	}
	otherwiseWhen(condition:Watcher|Binding|boolean, then: ContainerVdom|string|boolean|number, seal = false){
		let condNode = this._children[this._children.length - 1];
		if(condNode instanceof ConditionalVdom){
			let thenContainer: ContainerVdom;
			if(then instanceof ContainerVdom){
				thenContainer = then;
			}
			else{
				thenContainer = new ContainerVdom(this._dot);
				let textVdom = new TextVdom(reduceReactive(then));
				thenContainer._addChild(textVdom);
				then = thenContainer;
			}
			condNode.addCondition(reduceReactive(condition), reduceReactive(then), seal);
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
		let collectionVdom = new CollectionVdom(reduceReactive(collection), callback);
		this._addChild(collectionVdom);
		return this;
	}
}