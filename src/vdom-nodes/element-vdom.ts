import { IDotCore, IDotCss } from "dothtml-interfaces";
import { DOT_VDOM_PROP_NAME } from "../constants";
import Signal from "../reactivity/signal";
import AttributeVNode from "../v-meta-nodes/attribute-v-node";
import StyleVNode from "../v-meta-nodes/style-v-node";
import { ContainerVdom } from "./container-vdom";
import { Vdom } from "./vdom";
import { AttributeValueType } from "./vdom-types";
import Binding from "../reactivity/binding";
import ReactiveAttr from "../reactivity/reactive-attr";
import BaseVStyle from "../v-style-nodes/base-v-style";
import { IRef } from "dothtml-interfaces/src/bindings/i-ref";
import Ref from "../reactivity/ref";
import SyntheticEvent from "../events/synthetic-event";
import { EventManager } from "../events/event-manager";

export class AttributeItem{
	elementVDom: ElementVdom;
	attribute: string;
}

let manualInputAllowed = true;

export default class ElementVdom extends Vdom{

	children: ContainerVdom = null;
	element: HTMLElement;
	tag: string = null;
	private attributes: Record<string, AttributeValueType> = {};
	private events: Array<{name: string, callback: (e: any)=>void, modifiers: string[]}> = [];
	private attributeObserverIds: Array<{id: number, observable: Binding}> = [];
	private childBuilders: Array<{_render: (el: HTMLElement)=>void, _unrender: ()=>void}> = [];
	private attrVNodes: Array<AttributeVNode> = [];
	private styleVNodes: Array<StyleVNode> = [];
	private ref: Ref | ((el: HTMLElement | null) => void);
	inputListener: (e: any) => void;

	constructor(dot: IDotCore, tag: string){
		super();
		this.tag = tag;
		this.children = new ContainerVdom(dot);
		this.children._parent = this;
	}

	_render(node: HTMLElement){

		this.element = node.ownerDocument.createElement(this.tag);
		this.element[DOT_VDOM_PROP_NAME] = this;
		if(this.ref){
			if (typeof this.ref === "function") {
				this.ref(this.element);
			} else {
				this.ref.value = this.element;
			}
		}

		node.appendChild(this.element);

		if(this.children){
			this.children._render(this.element);
		}

		for(let a in this.attributes){
			this.renderAttr(a, this.attributes[a], this.element);
		}

		for(let i = 0; i < this.events.length; i++){
			let e = this.events[i];
			this.renderEvent(e.name, e.callback, e.modifiers);
		}
	}

	_unrender() {
		this.children._unrender();

		if(this.inputListener){
			this.element.removeEventListener("input", this.inputListener);
			this.inputListener = null;
		}

		const eventManager = EventManager.getForDocument(this.element.ownerDocument);
		for(let i = 0; i < this.events.length; i++){
			let e = this.events[i];
			eventManager.removeListener(this.element, e.name.toLowerCase(), e.callback);
		}

		this.element.parentNode?.removeChild(this.element);

		for(let i = 0; i < this.childBuilders.length; i++){
			this.childBuilders[i]._unrender();
		}
		this.childBuilders.length = 0;

		for(let i = 0; i < this.attrVNodes.length; i++){
			this.attrVNodes[i].unrender();
		}
		this.attrVNodes.length = 0;

		for(let i = 0; i < this.styleVNodes.length; i++){
			this.styleVNodes[i].unrender();
		}
		this.styleVNodes.length = 0;

		for(let i = 0; i < this.attributeObserverIds.length; i++){
			let item = this.attributeObserverIds[i];
			item.observable._unsubscribe(item.id);
		}
		this.attributeObserverIds.length = 0;

		if(this.ref){
			if (typeof this.ref === "function") {
				this.ref(null);
			} else {
				this.ref.value = null;
			}
		}
		this.element = null;
	}

	_getNodes(): Node[] {
		return this.element ? [this.element] : [];
	}

	toString(): string {
		if(this.element){
			return this.element.outerHTML;
		}
		else{
			return super.toString();
		}
	}

	setAttr(attr, value){

		attr = (attr ?? "").toLowerCase();

		const oldVal = this.attributes[attr];
		if (oldVal instanceof StyleVNode) {
			oldVal.unrender();
			const idx = this.styleVNodes.indexOf(oldVal);
			if (idx !== -1) this.styleVNodes.splice(idx, 1);
		}
		if (oldVal instanceof AttributeVNode) {
			oldVal.unrender();
			const idx = this.attrVNodes.indexOf(oldVal);
			if (idx !== -1) this.attrVNodes.splice(idx, 1);
		}

		if(value && typeof value === "object" && !(value instanceof Array || value instanceof Binding || value instanceof Signal || value instanceof BaseVStyle)){
			// Supports attributes that are space-separated, such as class and aria-*.
			// Also supports styles.
			switch(attr){
				case "style": {
					value = new StyleVNode(value as IDotCss);
					break;
				}
				case "ref": {
					// Just a ref nothing to do.
					break;
				}
				default: {
					// Other attributes.
					value = new AttributeVNode(attr, value);
					break;
				}
			}
		}

		if (typeof value === "function" && attr === "style") {
			const builder = new BaseVStyle();
			value(builder);
			value = new StyleVNode(builder);
		}

		if (value instanceof BaseVStyle && attr === "style") {
			value = new StyleVNode(value);
		}

		this.attributes[attr] = value;
		if(this.element){
			this.renderAttr(attr, value, this.element);
		}
	}

	private renderAttr(attr: string, value: AttributeValueType, node: HTMLElement){

		if(attr == "ref"){
			this.ref = value as any;
			if(this.element) {
				if (typeof this.ref === "function") {
					this.ref(this.element);
				} else {
					this.ref.value = this.element;
				}
			}
		}
		else if(typeof value === "string" || typeof value === "number"){
			if(attr == "value" && (this.tag.toLowerCase() == "input" || this.tag.toLowerCase() == "textarea" || this.tag.toLowerCase() == "select")){
				(node as any).value = value ?? "";
			}
			else{
				node.setAttribute(attr, `${value}`);
			}
		}
		else if (typeof value === "boolean" || value == null || value == undefined){
			if(attr == "checked" && this.tag.toLowerCase() == "input"){
				(node as HTMLInputElement).checked = !!value;
			}
			else if(attr == "selected" && this.tag.toLowerCase() == "option"){
				(node as HTMLOptionElement).selected = !!value;
			}
			
			if(value) node.setAttribute(attr, `${value}`);
			else node.removeAttribute(attr);
		}
		else if(value instanceof Array){
			// Like a space-separated class list.
			node.setAttribute(attr, value.join(" "));
		}
		else if (value instanceof Binding){
			this.renderAttr(attr, value._get(), node);
			let id = value._subscribe(new ReactiveAttr(this, attr));
			this.attributeObserverIds.push({id: id, observable: value});

			// If it's a value prop, update the observable on change.
			if((attr == "value" || attr == "checked") && value.isWritable){
				let timeout = null;
				if(!this.inputListener){
					this.inputListener = (e)=>{
						if(!manualInputAllowed)	return;
						if(timeout) clearTimeout(timeout);
						timeout = setTimeout(()=>{
							manualInputAllowed = false;
							value._set((this.element as HTMLInputElement)[attr]);
							manualInputAllowed = true;
							timeout = null;
						}, 200);
					}

					(this.element as HTMLInputElement).addEventListener("input", this.inputListener);
				}
			}

			// TODO: support reactives of arrays. There's already a test for this.
		}
		// else if (value instanceof BaseVStyle){
		// 	// Style building.
		// 	value._render(this.element);
		// 	this.childBuilders.push(value);
		// }
		else if(value instanceof AttributeVNode){
			value.render(node);
			this.attrVNodes.push(value);
		}
		else if(value instanceof StyleVNode){
			value.render(node);
			this.styleVNodes.push(value);
		}
		else{
			// TODO: 
			// attachEvent((pendingCallTarget as Element), newName, call.params[0], call.arg3);
		}
	}

	addEventListener(event: string, callback: (e: any)=>void, modifiers: string[] = []){
		this.events.push({name: event, callback: callback, modifiers: modifiers});
		if(this.element) this.renderEvent(event, callback, modifiers);
	}

	private renderEvent(e: string, callback: (e: any)=>void, modifiers: string[] = []){
		EventManager.getForDocument(this.element.ownerDocument).addListener(this.element, e.toLowerCase(), callback, modifiers);
	}
}