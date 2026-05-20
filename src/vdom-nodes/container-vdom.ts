import { IDotComponent, IDotCore, IDotCss } from "dothtml-interfaces";
import Signal from "../reactivity/signal";
import CollectionVdom from "./collection-vdom";
import { ConditionalVdom } from "./conditional-vdom";
import ElementVdom from "./element-vdom";
import { HtmlVdom } from "./html-vdom";
import { TextVdom } from "./text-vdom";
import { ReactiveVdom } from "./reactive-vdom";
import { Vdom } from "./vdom";
import { AttributeValueType, ObservableCollection } from "./vdom-types";
import { ComponentVdom } from "./component-vdom";
import Binding from "../reactivity/binding";
import BaseVStyle from "../v-style-nodes/base-v-style";

type ParentVdom = ContainerVdom|ConditionalVdom|ElementVdom;

/**
 * This is the actual document builder.
 */
export class ContainerVdom extends Vdom{
	_children: Array<Vdom> = [];
	_parent: ParentVdom = null;

	constructor(dot: IDotCore){
		super(dot);
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

	_getLastChild(): Vdom | null {
		return this._children[this._children.length - 1] || null;
	}
}
