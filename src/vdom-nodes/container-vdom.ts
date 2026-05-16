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
import BaseVStyle from "../v-style-nodes/base-v-style";

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

	_getNodes(): Node[] {
		let nodes = [];
		for(let i = 0; i < this._children.length; i++){
			nodes.push(...this._children[i]._getNodes());
		}
		return nodes;
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

	style(c: string | Watcher | Binding | IDotCss | ((s: BaseVStyle) => void)) {
		if (typeof c === "function") {
			const builder = new BaseVStyle();
			c(builder);
			this.attr("style", builder);
		} else {
			this.attr("style", c);
		}
		return this;
	}

	mount(c: IDotComponent, attrs?: Record<string, any>){
		let cn = new ComponentVdom(this._dot, c);
		if(attrs){
			for(let k in attrs){
				let val = attrs[k];
				if(k.startsWith("on") && typeof val === "function"){
					let eventName = k;
					let modifiers = [];
					if(k.includes(".")){
						const parts = k.split(".");
						eventName = parts[0];
						modifiers = parts.slice(1);
					}
					cn.addEventListener(eventName.substring(2).toLowerCase(), val, modifiers);
				}
				else{
					// For now, just set as a prop if we can. 
					// Components in DOThtml usually get their props via constructor, but we can support this too.
					if(!c["props"]) (c as any).props = {};
					(c as any).props[k] = val;
				}
			}
		}
		cn.init();
		let ret = this._addChild(cn);
		return ret;
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

	on(event: string, callback: (e: any)=>void){
		let C = this._children[this._children.length - 1];
		if(C && (C instanceof ElementVdom || C instanceof ComponentVdom)){
			C.addEventListener(event, callback);
		}
		else{
			throw new Error(`Invalid node to set ${event} listener.`);
		}
		return this;
	}

	each(collection: ObservableCollection, callback: ()=>Vdom){
		let collectionVdom = new CollectionVdom(reduceReactive(collection), callback);
		this._addChild(collectionVdom);
		return this;
	}
}