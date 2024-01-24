import { IDotDocument, IReactive } from "dothtml-interfaces";
import { DOT_VDOM_PROP_NAME } from "./constants";
import ElementVdom from "./vdom-nodes/element-vdom";
import { TextVdom } from "./vdom-nodes/text-vdom";
import { HtmlVdom } from "./vdom-nodes/html-vdom";
import { ConditionalVdom } from "./vdom-nodes/conditional-vdom";
import CollectionVdom from "./vdom-nodes/collection-vdom";
import BaseVStyle from "./v-style-nodes/base-v-style";

const TEXT_OFFSET = 0;
const HTML_OFFSET = 1;
const ATTR_OFFSET = 2;
const STYLE_OFFSET = 3;
const COND_OFFSET = 4;
const ARRAY_OFFSET = 5;
const CB_OFFSET = 6; // Always last. User callbacks happen after the DOM is updated.

const CATEGORIES = CB_OFFSET + 1;

export default class Reactive<Ti = any, To = Ti> implements IReactive<Ti, To>{
	_value: Ti;
	private _cachedLastValue: To;
	key: string;

	observingTextNodes: Record<number, TextVdom> = {};
	observingHtmlNodes: Record<number, HtmlVdom> = {};
	observingAttributes: Record<number, {element: ElementVdom, attribute: string}> = {};
	observingCollections: Record<number, {collection: CollectionVdom, key?: string}> = {};
	observingConditionals: Record<number, ConditionalVdom> = {};
	observingStyles: Record<number, {prop: string, vStyle: BaseVStyle}> = {};
	observingCallbacks: Record<number, (value: To)=>void> = {};

	constructor() {
	}

	getValue(): To {
		return this.transformer ? this.transformer(this._value) : this._value as unknown as To;
	}

	setValue(v: Ti) {
		this._value = v;
		let newValue = this.getValue();
		if(this._cachedLastValue != newValue){
			this._cachedLastValue = newValue;
			this.updater(newValue);
		}
	}

	private updater(value: To){
		for(let o in this.observingTextNodes){
			let n = this.observingTextNodes[o];
			n.textNode.textContent = value as string ?? "";
		}

		for(let o in this.observingHtmlNodes){
			let n = this.observingHtmlNodes[o];
			n.updateHtml(value as string);
		}

		for(let o in this.observingAttributes){
			let a = this.observingAttributes[o];
			a.element.setAttr(a.attribute, this);
		}

		for(let o in this.observingStyles){
			let s = this.observingStyles[o];
			s.vStyle.updateProp(s.prop, value as string);
		}

		for(let o in this.observingCollections){
			let c = this.observingCollections[o];
			c.collection.updateList();
		}

		for(let o in this.observingConditionals){
			let a = this.observingConditionals[o];
			a.updateConditions();
		}

		// Last.
		for(let o in this.observingCallbacks){
			let cb = this.observingCallbacks[o];
			cb(value);
		}
	}

	transformer?: (input: Ti) => To;

	nextId = 1;

	subscribeText(node: TextVdom): number {
		let id = TEXT_OFFSET + CATEGORIES * this.nextId++;
		this.observingTextNodes[id] = node;
		return id;
	}
	subscribeHtml(node: HtmlVdom): number {
		let id = HTML_OFFSET + CATEGORIES * this.nextId++;
		this.observingHtmlNodes[id] = node;
		return id;
	}
	subscribeAttr(node: ElementVdom, attributeName: string): number {
		let id = ATTR_OFFSET + CATEGORIES * this.nextId++;
		this.observingAttributes[id] = {element: node, attribute: attributeName};
		return id;
	}
	// Might change this up to support more advanced builder options.
	subscribeStyle(vStyle: BaseVStyle, propName: string): number {
		let id = STYLE_OFFSET + CATEGORIES * this.nextId++;
		this.observingStyles[id] = {prop: propName, vStyle: vStyle};
		return id;
	}
	subscribeCollection(node: CollectionVdom): number {
		let id = ARRAY_OFFSET + CATEGORIES * this.nextId++;
		this.observingCollections[id] = {collection: node, key: null};
		return id;
	}
	subscribeCond(node: ConditionalVdom): number {
		let id = COND_OFFSET + CATEGORIES * this.nextId++;
		this.observingConditionals[id] = node;
		return id;
	}
	subscribeCallback(callback: (value: To)=>void): number {
		let id = CB_OFFSET + CATEGORIES * this.nextId++;
		this.observingCallbacks[id] = callback;
		return id;
	}

	detachBinding(id: number) {
		let category = id % CATEGORIES;
		switch(category){
			case TEXT_OFFSET: {
				delete this.observingTextNodes[id];
				break;
			}
			case ATTR_OFFSET: {
				delete this.observingAttributes[id];
				break;
			}
			case STYLE_OFFSET: {
				delete this.observingStyles[id];
				break;
			}
			case HTML_OFFSET: {
				delete this.observingHtmlNodes[id];
				break;
			}
			case ARRAY_OFFSET: {
				delete this.observingCollections[id];
				break;
			}
			case COND_OFFSET: {
				delete this.observingConditionals[id];
				break;
			}
			case CB_OFFSET: {
				delete this.observingCallbacks[id];
				break;
			}
		}
	}

	updateObservers(): void {
		let updatedValue = this.getValue();
		this._cachedLastValue = updatedValue;
		this.updater(updatedValue);
	}
	
}