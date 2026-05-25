import Binding from "../reactivity/binding";
import Signal from "../reactivity/signal";
import VMetaNode from "./v-meta-node";
import { isVType, flattenAttribute } from "../helpers/tools";

/**
 * Attribute Virtual Nodes apply to a single attribute, such as class.
 */
export default class AttributeVNode extends VMetaNode{

	attr: string;
	value: any;
	target: HTMLElement;
	_vtype = "attribute-v-node";

	observables: Record<number, Binding> = {};

	constructor(attrName, attrValue){
		super();
		this.attr = attrName;
		this.value = attrValue;
	}

	render(target: HTMLElement){
		this.target = target;

		{ // Register observables.
			this.registerObservables(this.value);
		}

		{ // Update.
			this.update();
		}
	}

	private registerObservables(val: any) {
		if (val instanceof Signal || isVType(val, "signal")) {
			let binding = (val as any).bind();
			let id = binding._subscribe(this);
			this.observables[id] = binding;
		}
		else if (val instanceof Binding || isVType(val, "binding") || (val as any)?._isBinding) {
			let id = (val as any)._subscribe(this);
			this.observables[id] = val as any;
		}
		else if (Array.isArray(val)) {
			for (let i = 0; i < val.length; i++) {
				this.registerObservables(val[i]);
			}
		}
		else if (typeof val === "object" && val !== null) {
			for (let k in val) {
				this.registerObservables(val[k]);
			}
		}
	}

	update(){
		if(!this.target) return;

		let tokens = flattenAttribute(this.value);
		
		if (tokens.length > 0) {
			this.target.setAttribute(this.attr, tokens.join(" "));
		} else {
			this.target.removeAttribute(this.attr);
		}
	}

	unrender(){
		this.target = null;

		for(let o in this.observables){
			let v = this.observables[o];
			(v as any)._unsubscribe(Number(o));
		}

		this.observables = {};
	}
}
