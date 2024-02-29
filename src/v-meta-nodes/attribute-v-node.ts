import Reactive from "../reactive";

export default class AttributeVNode{

	attr: string;
	value: any;
	target: HTMLElement;

	observables: Record<number, Reactive> = {};

	constructor(attrName, attrValue){
		this.attr = attrName;
		this.value = attrValue;
	}

	render(target: HTMLElement){
		this.target = target;

		{ // Register observables.
			for(let k in this.value){
				let v = (this.value as any)[k];
				if(v && v instanceof Reactive){
					let id = v.subscribeAttrCollection(this);
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
				if(!(v instanceof Reactive) || v.getValue()){	
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
			v.detachBinding(Number(o));
		}

		this.observables = {};
	}
}