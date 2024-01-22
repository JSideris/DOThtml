import { DOT_VDOM_PROP_NAME } from "../constants";
import Reactive from "../reactive";
import { ContainerVdom } from "./container-vdom";
import { Vdom } from "./vdom";
import { AttributeValueType } from "./vdom-types";

export default class ElementVdom extends Vdom{

	children: ContainerVdom = null;
	element: HTMLElement;
	tag: string = null;
	private attributes: Record<string, AttributeValueType> = {};
	private events: Array<{name: string, callback: (e: Event)=>void}> = [];
	private attributeObserverIds: Array<{id: number, observable: Reactive}> = [];

	constructor(tag: string){
		super();
		this.tag = tag;
		this.children = new ContainerVdom();
		this.children._parent = this;
	}

	_render(node: HTMLElement){

		this.element = node.ownerDocument.createElement(this.tag);
		this.element[DOT_VDOM_PROP_NAME] = this;

		for(let a in this.attributes){
			this.renderAttr(a, this.attributes[a], this.element);
		}

		node.appendChild(this.element);

		for(let i = 0; i < this.events.length; i++){
			let e = this.events[i];
			this.renderEvent(e.name, e.callback);
		}
	
		if(this.children){
			this.children._render(this.element);
		}
	}

	_unrender() {
		this.children._unrender();
		this.element.parentNode?.removeChild(this.element);
		this.element = null;

		for(let i = 0; i < this.attributeObserverIds.length; i++){
			let item = this.attributeObserverIds[i];
			item.observable.detachBinding(item.id);
		}
		this.attributeObserverIds.length = 0;
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
		this.attributes[attr] = value;
		if(this.element){
			this.renderAttr(attr, value, this.element);
		}
	}

	private renderAttr(attr: string, value: AttributeValueType, node: HTMLElement){
		if(typeof value === "string" || typeof value === "number"){
			node.setAttribute(attr, `${value}`);
		}
		else if (typeof value === "boolean" || value == null || value == undefined){
			if(value) node.setAttribute(attr, `${value}`);
			else node.removeAttribute(attr);
		}
		else if (value instanceof Reactive){
			this.renderAttr(attr, value.getValue(), node);
			let id = value.subscribeAttr(this, attr);
			this.attributeObserverIds.push({id: id, observable: value});

			// If it's a value prop, update the observable on change.
			if(attr == "value" || attr == "checked"){
				this.element.addEventListener("input", (e)=>{
					value.setValue((this.element as HTMLInputElement)[attr]);
				});
			}
		}
		else{
			// TODO: 
			// attachEvent((pendingCallTarget as Element), newName, call.params[0], call.arg3);
		}
	}

	addEventListener(event: string, callback: (e: Event)=>void){
		this.events.push({name: event, callback: callback});
		if(this.element) this.renderEvent(event, callback);
	}

	private renderEvent(e: string, callback: (e: Event)=>void){
		this.element.addEventListener(e.toLowerCase(), callback);
	}
}