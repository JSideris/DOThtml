import { IDotCore } from "dothtml-interfaces";
import { ContainerVdom } from "./vdom-nodes/container-vdom";
import { Vdom } from "./vdom-nodes/vdom";
import Signal from "./reactivity/signal";
import Binding from "./reactivity/binding";
import ElementVdom from "./vdom-nodes/element-vdom";
import { ReactiveVdom } from "./vdom-nodes/reactive-vdom";
import { TextVdom } from "./vdom-nodes/text-vdom";
import Ref from "./reactivity/ref";
import { allEventAttr } from "./dot-event-attrs";

export const isContent = (arg: any) => {
	return arg instanceof ContainerVdom || 
		arg instanceof Vdom || 
		arg?._root || // DotChain
		arg?._children || // FragmentVdom or ContainerVdom
		(typeof arg == "object" && arg?.build) || 
		arg instanceof Signal || 
		arg instanceof Binding || 
		typeof arg === "string" || 
		typeof arg === "number" || 
		typeof arg === "boolean" || 
		Array.isArray(arg);
};

export const applyContent = (dot: IDotCore, n: ElementVdom, cont: any) => {
	if(Array.isArray(cont)){
		for(let i = 0; i < cont.length; i++) applyContent(dot, n, cont[i]);
	}
	else if(Array.isArray(cont?._children)){
		const children = cont._children;
		if (children && children.length > 0) {
			const target = n.children;
			for(let i = 0; i < children.length; i++) target._addChild(children[i]);
		}
	}
	else if(cont?._root){
		applyContent(dot, n, cont._root);
	}
	else if(cont instanceof Vdom){
		n.children._addChild(cont);
	}
	else if(typeof cont == "object" && cont?.build){
		n.children.mount(cont);
	}
	else{
		if(cont !== null && cont !== undefined){
			let val = cont;
			if(val instanceof Signal){
				val = val.bind();
			}
			if(val instanceof Binding){
				n.children._addChild(new ReactiveVdom(dot, val));
			}
			else{
				n.children._addChild(new TextVdom(val));
			}
		}
	}
};

export const applyAttributes = (n: ElementVdom, attrs: any) => {
	for(let k in attrs) {
		let attr = attrs[k];
		if(attr instanceof Signal && !(attr instanceof Ref)) attr = attr.bind();
		let eventName = k;
		let modifiers = [];
		if(k.includes(".")){
			const parts = k.split(".");
			eventName = parts[0];
			modifiers = parts.slice(1);
		}

		const isEvent = allEventAttr[eventName] || (eventName.startsWith("on") && eventName[2] && eventName[2] === eventName[2].toUpperCase());

		if(isEvent) {
			if(typeof attrs[k] !== "function") {
				throw new Error(`Value of event attribute ${k} must be a function.`);
			}

			(n as any).addEventListener(eventName.substring(2).toLowerCase(), attr, modifiers);
		} else {
			n.setAttr(k, attr);
		}
	}
};

export const createElement = (dot: IDotCore, tag: string, args: any[] | IArguments): ElementVdom => {
	let n = new ElementVdom(dot, tag);

	for(let j = 0; j < args.length; j++){
		let arg = args[j];
		if(isContent(arg)){
			applyContent(dot, n, arg);
		}
		else if(arg && typeof arg === "object"){
			applyAttributes(n, arg);
		}
	}

	return n;
}
