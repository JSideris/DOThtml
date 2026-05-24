import Binding from "../reactivity/binding";
import Signal from "../reactivity/signal";
import VMetaNode from "./v-meta-node";
import { isVType } from "../helpers/tools";

/**
 * Attribute Virtual Nodes apply to a single attribute, such as class.
 */
export default class AttributeVNode extends VMetaNode{

	attr: string;
	value: Record<string, string|Binding>;
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
			for(let k in this.value){
				let v = (this.value as any)[k];

				if(v instanceof Signal || isVType(v, "signal")) v = (v as any).bind(); // TODO: this probably isn't the right place for this.

				if(v && (v instanceof Binding || isVType(v, "binding"))){
					let id = (v as any)._subscribe(this);
					this.observables[id] = v as any;
				}
			}
		}

		{ // Update.
			this.update();
		}
	}

	update(){
		if(!this.target) return;

		let tokens = [];
		for(let k in this.value){
			let v = (this.value as any)[k];
			if(v){
				if(v instanceof Signal || isVType(v, "signal")) v = (v as any).bind();
				if(!(v instanceof Binding || isVType(v, "binding")) || (v as any)._get()){	
					tokens.push(k);
				}
			}
		}
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