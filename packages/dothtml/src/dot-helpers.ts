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
import { isVType } from "./helpers/tools";
import { HtmlVdom } from "./vdom-nodes/html-vdom";

export const trySmartAdopt = (dot: IDotCore, n: ElementVdom, tag: string, content: any): boolean => {
	if (tag !== "svg" && tag !== "math") return false;
	
	let rawStr: string = "";
	if (typeof content === "string") {
		rawStr = content;
	} else if (content instanceof HtmlVdom || isVType(content, "html")) {
		rawStr = (content as any)._content;
		if (typeof rawStr !== "string") return false;
	} else {
		return false;
	}

	const trimmed = rawStr.trim();
	if (!trimmed.toLowerCase().startsWith("<" + tag)) return false;

	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(trimmed, tag === "svg" ? "image/svg+xml" : "application/xml");
		const root = doc.documentElement;

		if (root.tagName.toLowerCase() === tag) {
			// Adopt Attributes
			for (let i = 0; i < root.attributes.length; i++) {
				const attr = root.attributes[i];
				if (!n.hasAttr(attr.name)) {
					n.setAttr(attr.name, attr.value);
				}
			}
			// Adopt Children
			n.children.mount(new HtmlVdom(root.innerHTML, dot));
			return true;
		}
	} catch (e) {
		// Fallback to normal rendering if parsing fails
	}

	return false;
};

export const isContent = (arg: any) => {
	return arg instanceof ContainerVdom || 
		isVType(arg, "container") ||
		arg instanceof Vdom || 
		isVType(arg, ["vdom", "container", "element", "fragment", "component", "html", "text", "reactive", "conditional", "collection", "slot"]) ||
		arg?._root || // DotChain
		isVType(arg, "dotchain") ||
		arg?._children || // FragmentVdom or ContainerVdom
		(typeof arg == "object" && arg?.build) || 
		arg instanceof Signal || 
		isVType(arg, "signal") ||
		arg?._isSignal ||
		arg instanceof Binding || 
		isVType(arg, "binding") ||
		arg?._isBinding ||
		typeof arg === "string" || 
		typeof arg === "number" || 
		typeof arg === "boolean" || 
		Array.isArray(arg);
};

export const applyContent = (dot: IDotCore, n: ElementVdom | ContainerVdom, cont: any) => {
	const target = (n instanceof ElementVdom || isVType(n, "element")) ? (n as any).children : n;
	if(Array.isArray(cont)){
		for(let i = 0; i < cont.length; i++) applyContent(dot, n, cont[i]);
	}
	else if(cont?._root || isVType(cont, "dotchain")){
		applyContent(dot, n, cont._root);
	}
	else if(Array.isArray(cont?._children)){
		const children = cont._children;
		if (children && children.length > 0) {
			for(let i = 0; i < children.length; i++) target._addChild(children[i]);
		}
	}
	else if(cont instanceof Vdom || isVType(cont, ["vdom", "container", "element", "fragment", "component", "html", "text", "reactive", "conditional", "collection", "slot"])){
		target._addChild(cont);
	}
	else if(typeof cont == "object" && cont?.build){
		target.mount(cont);
	}
	else{
		if(cont !== null && cont !== undefined){
			let val = cont;
			if(val instanceof Signal || isVType(val, "signal") || val?._isSignal){
				val = (val as any).bind();
			}
			if(val instanceof Binding || isVType(val, "binding") || val?._isBinding){
				target._addChild(new ReactiveVdom(dot, val as any));
			}
			else{
				target._addChild(new TextVdom(val));
			}
		}
	}
};

export const applyAttributes = (n: ElementVdom, attrs: any) => {
	for(let k in attrs) {
		let attr = attrs[k];
		if((attr instanceof Signal || isVType(attr, "signal") || attr?._isSignal) && !attr?._isRef) attr = (attr as any).bind();
		
		if (k === "html" || k === "innerHtml") {
			n.children.mount(attr);
			continue;
		}

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
			if ((tag === "svg" || tag === "math") && trySmartAdopt(dot, n, tag, arg)) {
				continue;
			}
			applyContent(dot, n, arg);
		}
		else if (typeof arg === "function" && (tag === "svg" || tag === "math")) {
			arg(n.children);
		}
		else if(arg && typeof arg === "object"){
			applyAttributes(n, arg);
		}
	}

	return n;
}
