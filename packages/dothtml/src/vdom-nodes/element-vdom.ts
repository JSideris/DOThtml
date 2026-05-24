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

export default class ElementVdom extends Vdom{

	private _children: ContainerVdom = null;
	_vtype = "element";
	get children(): ContainerVdom {
		if(!this._children){
			this._children = new ContainerVdom(this._dot);
			this._children._parent = this;
		}
		return this._children;
	}
	set children(value: ContainerVdom) {
		this._children = value;
	}
	element: HTMLElement;
	tag: string = null;
	private attributes: Record<string, AttributeValueType> = {};
	private events: Array<{name: string, callback: (e: any)=>void, modifiers: string[]}> = [];
	private attributeObserverIds: Array<{id: number, observable: Binding, attr: string}> = [];
	private childBuilders: Array<{_render: (el: HTMLElement)=>void, _unrender: ()=>void}> = [];
	private attrVNodes: Array<AttributeVNode> = [];
	private styleVNodes: Array<StyleVNode> = [];
	private ref: Ref | ((el: HTMLElement | null) => void);
	inputListener: (e: any) => void;
	compositionStartListener: () => void;
	compositionEndListener: (e: any) => void;
	private manualInputAllowed: boolean = true;
	private isComposing: boolean = false;
	private activeBindings: Record<string, Binding> = {};
	private lastSyncedValues: Record<string, any> = {};

	constructor(dot: IDotCore, tag: string){
		super(dot);
		this.tag = tag;
	}

	_render(node: HTMLElement){
		this._isRendered = true;

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

		if(this._children){
			this._children._render(this.element);
		}

		// Render events first so they are available for attribute checks.
		for(let i = 0; i < this.events.length; i++){
			let e = this.events[i];
			this.renderEvent(e.name, e.callback, e.modifiers);
		}

		// Render 'type' first if it exists, as it affects how 'bind', 'value', and 'checked' are handled.
		if (this.attributes["type"] !== undefined) {
			this.renderAttr("type", this.attributes["type"], this.element);
		}

		for(let a in this.attributes){
			if (a === "type") continue;
			this.renderAttr(a, this.attributes[a], this.element);
		}

		if (this._onEnterHook) {
			this._onEnterHook(this.element);
		}
	}

	_unrender() {
		if(!this._isRendered) return;
		this._isRendered = false;
		if(this._children) this._children._unrender();

		if(!this.element) return;

		const eventManager = EventManager.getForDocument(this.element.ownerDocument);
		if(this.inputListener){
			eventManager.removeListener(this.element, "input", this.inputListener);
			this.inputListener = null;
		}

		if(this.compositionStartListener){
			eventManager.removeListener(this.element, "compositionstart", this.compositionStartListener);
			this.compositionStartListener = null;
		}

		if(this.compositionEndListener){
			eventManager.removeListener(this.element, "compositionend", this.compositionEndListener);
			this.compositionEndListener = null;
		}

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

	_getLastChild(): Vdom | null {
		return this;
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
		let targetAttr = attr;
		if(attr == "bind"){
			let typeAttr = this.attributes["type"];
			if (typeAttr instanceof Binding) typeAttr = typeAttr._get();
			else if (typeAttr instanceof Signal) typeAttr = typeAttr.value;

			const type = (typeof typeAttr === "string") ? typeAttr.toLowerCase() : null;
			targetAttr = (this.tag.toLowerCase() == "input" && (type == "checkbox" || type == "radio")) ? "checked" : "value";
		}

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

		// Clean up old binding if it exists.
		for (let i = 0; i < this.attributeObserverIds.length; i++) {
			let item = this.attributeObserverIds[i];
			if (item.attr === attr || item.attr === targetAttr) {
				item.observable._unsubscribe(item.id);
				this.attributeObserverIds.splice(i, 1);
				break;
			}
		}

		if(value && typeof value === "object" && !(value instanceof Array || value instanceof Binding || (value as any)?._isBinding || value instanceof Signal || (value as any)?._isSignal || value instanceof BaseVStyle)){
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

	updateReactiveAttr(attr: string, value: AttributeValueType){
		if(!this.element) return;
		this.renderAttr((attr ?? "").toLowerCase(), value, this.element);
	}

	private renderAttr(attr: string, value: AttributeValueType, node: HTMLElement, isExplicitBind: boolean = false){

		if(attr == "bind"){
			let typeAttr = this.attributes["type"];
			if (typeAttr instanceof Binding) typeAttr = typeAttr._get();
			else if (typeAttr instanceof Signal) typeAttr = typeAttr.value;

			const type = (typeof typeAttr === "string") ? typeAttr.toLowerCase() : null;
			attr = (this.tag.toLowerCase() == "input" && (type == "checkbox" || type == "radio")) ? "checked" : "value";
			isExplicitBind = true;
		}

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
				this.lastSyncedValues[attr] = value ?? "";
			}
			else{
				node.setAttribute(attr, `${value}`);
			}
		}
		else if (typeof value === "boolean" || value == null || value == undefined){
			if(attr == "checked" && this.tag.toLowerCase() == "input"){
				(node as HTMLInputElement).checked = !!value;
				this.lastSyncedValues[attr] = !!value;
			}
			else if(attr == "selected" && this.tag.toLowerCase() == "option"){
				(node as HTMLOptionElement).selected = !!value;
			}
			else if(attr == "value" && (this.tag.toLowerCase() == "input" || this.tag.toLowerCase() == "textarea" || this.tag.toLowerCase() == "select")){
				(node as any).value = value ?? "";
				this.lastSyncedValues[attr] = value ?? "";
			}
			
			if(value) node.setAttribute(attr, `${value}`);
			else node.removeAttribute(attr);
		}
		else if(value instanceof Array){
			// Like a space-separated class list.
			node.setAttribute(attr, value.join(" "));
		}
		else if (value instanceof Binding || (value as any)?._isBinding){
			this.renderAttr(attr, (value as any)._get(), node, isExplicitBind);
			
			// Only subscribe if we haven't already for this attribute.
			if (!this.attributeObserverIds.some(item => item.attr === attr && item.observable === value)) {
				let id = (value as any)._subscribe(new ReactiveAttr(this, attr));
				this.attributeObserverIds.push({id: id, observable: value as any, attr: attr});
			}

			// If it's a value prop, update the observable on change.
			if((attr == "value" || attr == "checked") && (value as any).isWritable && isExplicitBind){
				this.activeBindings[attr] = value as any;
				if(!this.inputListener){
					this.inputListener = (e)=>{
						if (this.isComposing) return;
						try {
							const targetAttr = ((e.target as any).type === "checkbox" || (e.target as any).type === "radio") ? "checked" : "value";
							const binding = this.activeBindings[targetAttr];
							if(!binding) return;

							const val = (this.element as HTMLInputElement)[targetAttr];
							const currentSigVal = binding._get();
							const lastVal = this.lastSyncedValues[targetAttr];

							// Only update the signal if the DOM changed AND the signal hasn't already been updated to this value.
							// We use loose equality here to handle null/undefined/empty string transitions gracefully.
							if (currentSigVal == lastVal && val != lastVal) {
								binding._set(val);
							}
							
							// Always update the last synced value to match the current state.
							this.lastSyncedValues[targetAttr] = binding._get();
						} catch (e) {
							console.error("CAUGHT ERROR: " + e.message);
						}
					}

					this.compositionStartListener = () => {
						this.isComposing = true;
					};

					this.compositionEndListener = (e) => {
						this.isComposing = false;
						// Manually trigger an update after composition ends.
						this.inputListener(e);
					};

					const eventManager = EventManager.getForDocument(this.element.ownerDocument);
					eventManager.addListener(this.element, "input", this.inputListener);
					eventManager.addListener(this.element, "compositionstart", this.compositionStartListener);
					eventManager.addListener(this.element, "compositionend", this.compositionEndListener);
				}
			}
		}
		else if(value instanceof AttributeVNode){
			value.render(node);
			this.attrVNodes.push(value);
		}
		else if(value instanceof StyleVNode){
			value.render(node);
			this.styleVNodes.push(value);
		}
	}

	addEventListener(event: string, callback: (e: any)=>void, modifiers: string[] = []){
		// Check if listener already exists to avoid duplicates.
		if (this.events.some(e => e.name === event && e.callback === callback)) return;
		
		this.events.push({name: event, callback: callback, modifiers: modifiers});
		if(this.element) this.renderEvent(event, callback, modifiers);
	}

	private renderEvent(e: string, callback: (e: any)=>void, modifiers: string[] = []){
		EventManager.getForDocument(this.element.ownerDocument).addListener(this.element, e.toLowerCase(), callback, modifiers);
	}
}
