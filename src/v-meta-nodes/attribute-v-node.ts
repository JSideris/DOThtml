import BoundReactive from "../reactivity/bound-reactive";
import Reactive from "../reactivity/reactive";
import VMetaNode from "./v-meta-node";

/**
 * Attribute Virtual Nodes apply to a single attribute, such as class.
 * They're designed to allow users to set classes (and other attributes) using JSON objects.
 */
export default class AttributeVNode extends VMetaNode{

	attr: string;
	value: Record<string, string|BoundReactive>;
	target: HTMLElement;

	observables: Record<number, BoundReactive> = {};

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

				if(v instanceof Reactive) v = v.bind(); // TODO: this probably isn't the right place for this.

				if(v && v instanceof BoundReactive){
					let id = v._subscribe(this);
					this.observables[id] = v;
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
				if(v instanceof Reactive) v = v.bind();
				if(!(v instanceof BoundReactive) || v._get()){	
					tokens.push(k);
				}
			}
		}
		this.target.setAttribute(this.attr, tokens.join(" "));
	}

	unrender(){
		this.target = null;

		for(let o in this.observables){
			let v = this.observables[o];
			v._unsubscribe(Number(o));
		}

		this.observables = {};
	}
}