
import { ContainerVdom } from "./vdom-nodes/container-vdom";
import { TextVdom } from "./vdom-nodes/text-vdom";
import { ReactiveVdom } from "./vdom-nodes/reactive-vdom";
import ElementVdom from "./vdom-nodes/element-vdom";
import { Vdom } from "./vdom-nodes/vdom";
import { DOT_VDOM_PROP_NAME } from "./constants";
import Signal from "./reactivity/signal";
import Computed from "./reactivity/computed";
import { component } from "./decoration/component";
import { ComponentVdom } from "./vdom-nodes/component-vdom";
import renderStylesheet from "./helpers/render-stylesheet";
import BaseVStyle from "./v-style-nodes/base-v-style";
import StyleVNode from "./v-meta-nodes/style-v-node";
import { IDotCore, IDotCss, IDotComponent } from "dothtml-interfaces";
import WindowWrapper from "./window-wrapper";
import Binding from "./reactivity/binding";
import Ref from "./reactivity/ref";
import RefCollection from "./reactivity/ref-collection";
import { scheduler } from "./reactivity/scheduler";
import { createStore, getStore, clearStores, getStores } from "./reactivity/store";
import { getCurrentComponent, pushComponent, popComponent } from "./vdom-nodes/component-context";
import { createElement } from "./dot-helpers";
import { allTags, allCoreWrappers, allTagsSet } from "./tags";
import { DotChain } from "./dot-chain";
import { HtmlVdom } from "./vdom-nodes/html-vdom";
import { ConditionalVdom } from "./vdom-nodes/conditional-vdom";
import CollectionVdom from "./vdom-nodes/collection-vdom";
import { FragmentVdom } from "./vdom-nodes/fragment-vdom";

function reduceReactive(value: any){
	if(value instanceof Signal) return value.bind();
	else return value;
}

function promote(vdom: Vdom): DotChain {
	if (vdom instanceof DotChain) return vdom;
	return new DotChain(vdom._dot, vdom);
}

(Vdom.prototype as any)._addChild = function(node: Vdom) {
	return promote(this)._addChild(node);
};

(Vdom.prototype as any).text = function(c: any) {
	let val = reduceReactive(c);
	if(val instanceof Binding){
		return this._addChild(new ReactiveVdom(this._dot, val));
	}
	return this._addChild(new TextVdom(val));
};

(Vdom.prototype as any).html = function(c: any) {
	return this._addChild(new HtmlVdom(reduceReactive(c)));
};

(Vdom.prototype as any).md = function(c: any) {
	return this.text(c);
};

(Vdom.prototype as any).mount = function(c: any, attrs?: any) {
	let cn = new ComponentVdom(this._dot, c);
	if(attrs){
		for(let k in attrs){
			let val = attrs[k];
			if(k === "ref"){
				cn.setRef(val);
			}
			else if(k.startsWith("on") && typeof val === "function"){
				let eventName = k;
				let modifiers = [];
				if(k.includes(".")){
					const parts = k.split(".");
					eventName = parts[0];
					modifiers = parts.slice(1);
				}
				cn.addEventListener(eventName.substring(2).toLowerCase(), val, modifiers);
			}
			else{
				if(!c["props"]) (c as any).props = {};
				(c as any).props[k] = val;
			}
		}
	}
	cn.init();
	return this._addChild(cn);
};

(Vdom.prototype as any).when = function(condition: any, then: any) {
	let condNode = new ConditionalVdom(this._dot);
	let thenContainer: Vdom;
	if (then instanceof Vdom) {
		thenContainer = then;
	} else if (typeof then === "object" && then?.build) {
		thenContainer = new FragmentVdom(this._dot);
		(thenContainer as FragmentVdom).mount(then);
	} else {
		thenContainer = new FragmentVdom(this._dot);
		(thenContainer as FragmentVdom)._children.push(new TextVdom(reduceReactive(then)));
	}
	condNode.addCondition(reduceReactive(condition), thenContainer as any);
	return this._addChild(condNode);
};

(Vdom.prototype as any).each = function(collection: any, callback: any) {
	let collectionVdom = new CollectionVdom(this._dot, reduceReactive(collection), callback);
	return this._addChild(collectionVdom);
};

(Vdom.prototype as any).otherwiseWhen = function(condition: any, then: any, seal = false) {
	let lastChild = this._getLastChild();

	if (lastChild instanceof ConditionalVdom) {
		let thenNode: Vdom;
		if (then instanceof Vdom) {
			thenNode = then;
		} else if (typeof then === "object" && then?.build) {
			thenNode = new FragmentVdom(this._dot);
			(thenNode as FragmentVdom).mount(then);
		} else {
			thenNode = new TextVdom(reduceReactive(then));
		}
		lastChild.addCondition(reduceReactive(condition), thenNode, seal);
	} else {
		throw new Error("Can't branch off of a non-conditional node.");
	}
	return this;
};

(Vdom.prototype as any).otherwise = function(then: any) {
	return this.otherwiseWhen(true, then, true);
};

(Vdom.prototype as any).attr = function(A: string, c: any) {
	let lastChild = this._getLastChild();

	if (lastChild instanceof ElementVdom) {
		lastChild.setAttr(A, c);
	} else {
		throw new Error(`Invalid node to set ${A} attribute.`);
	}
	return this;
};

(Vdom.prototype as any).style = function(c: string | Signal | Binding | IDotCss | ((s: BaseVStyle) => void)) {
	if (typeof c === "function") {
		const builder = new BaseVStyle();
		c(builder);
		this.attr("style", builder);
	} else {
		this.attr("style", c);
	}
	return this;
};

(Vdom.prototype as any).on = function(event: string, callback: (e: any)=>void) {
	let lastChild = this._getLastChild();

	if(lastChild && (lastChild instanceof ElementVdom || lastChild instanceof ComponentVdom)){
		lastChild.addEventListener(event, callback);
	}
	else{
		throw new Error(`Invalid node to set ${event} listener.`);
	}
	return this;
};

for (let i = 0; i < allTags.length; i++) {
	const tag = allTags[i];
	(Vdom.prototype as any)[tag] = function(...args: any[]) {
		return this._addChild(createElement(this._dot, tag, args));
	};
}

const makeCoreWrapper = (d, fn)=>{
	d[fn] = function(){
		if (allTagsSet.has(fn)) {
			return createElement(dot, fn, arguments);
		} else {
			let n = new ContainerVdom(dot);
			n[fn](...arguments);
			return n;
		}
	}
}

const makeDot = ()=>{
	const _dot = function(targetSelector, targetWindow: Window = window){

		if(targetSelector?.ownerDocument?.defaultView){
			let el = (targetSelector as HTMLElement);
			let node = el[DOT_VDOM_PROP_NAME] as ElementVdom;
			if(node){
				return node.children;
			}
			else{
				node = new ElementVdom(dot, el.tagName.toLocaleLowerCase());
				node.element = el;
				node.children._parent = node;
				node.children._isRendered = true;
				el[DOT_VDOM_PROP_NAME] = node;
				return node.children;
			}
		}
		else if(typeof targetSelector == "string"){
			return _dot(targetWindow.document.querySelectorAll(targetSelector)[0]);
		}
		else{
			throw new Error("Invalid render target.");
		}
	}

	_dot.state = function<T extends Signal|Array<any>|{[key: string|number]: any}|string|number|boolean = any>(value: T, key?: string): Signal<T>{
		let o = new Signal();
		o.key = key;
		o.value = (value);
		return o;
	}

	_dot.computed = function<T>(getter: () => T): Signal<T>{
		const c = new Computed(getter);
		const currentComponent = getCurrentComponent();
		if (currentComponent) {
			currentComponent.registerComputed(c);
		}
		return c;
	}

	_dot.component = component;
	_dot.getCurrentComponent = getCurrentComponent;

	_dot.store = createStore;
	_dot.getStore = getStore;
	_dot.clearStores = clearStores;
	Object.defineProperty(_dot, "stores", { get: () => getStores() });

	_dot.create = function<T extends IDotComponent>(Ctor: { new(...args: any[]): T }, ...args: any[]): T {
		const tracker = {
			computedSignals: [],
			disposables: [],
			registerComputed(w: any) { this.computedSignals.push(w); },
			registerDisposable(d: any) { this.disposables.push(d); }
		};
		pushComponent(tracker as any);
		let instance: T;
		try {
			instance = new Ctor(...args);
		} finally {
			popComponent();
		}

		if ((instance as any)._trackedComputeds) {
			(instance as any)._trackedComputeds.push(...tracker.computedSignals);
		} else {
			(instance as any)._trackedComputeds = tracker.computedSignals;
		}

		if ((instance as any)._trackedDisposables) {
			(instance as any)._trackedDisposables.push(...tracker.disposables);
		} else {
			(instance as any)._trackedDisposables = tracker.disposables;
		}

		return instance;
	}

	_dot.ref = function<T extends HTMLElement | IDotComponent = HTMLElement>(){
		return new Ref<T>();
	}

	_dot.refCollection = function<T extends HTMLElement | IDotComponent = HTMLElement>(){
		return new RefCollection<T>();
	}

	_dot.alpha = function(color: string | Signal<string> | Binding<string>, opacity: number | Signal<number> | Binding<number>) {
		return new Computed(() => {
			const c = color instanceof Binding ? color._get() : (color instanceof Signal ? color.value : color);
			const o = opacity instanceof Binding ? opacity._get() : (opacity instanceof Signal ? opacity.value : opacity);
			
			const percentage = Math.round(Math.max(0, Math.min(100, (1 - o) * 100)) * 100) / 100;
			return `color-mix(in srgb, ${c}, transparent ${percentage}%)`;
		});
	};

	_dot.globalStyles = [];
	_dot.useGlobalStyles = (styles: string | CSSStyleSheet | Array<string | CSSStyleSheet>) => {
		const stylesArray = Array.isArray(styles) ? styles : [styles];
		for (const s of stylesArray) {
			_dot.globalStyles.push(s);
			if (typeof document !== "undefined") {
				_dot.useStyles(document, s);
			}
		}
	};

	_dot.css = new BaseVStyle();

	_dot._theme = null;
	_dot.setTheme = (theme: any) => {
		_dot._theme = theme;
	};

	_dot.useStyles = (applyToDocument: Document, styles: string | CSSStyleSheet | ((css: any) => string | IDotCss)) => {
		if (applyToDocument && !styles) {
			if (typeof applyToDocument == "string" || (applyToDocument["call"] && applyToDocument["apply"])) {
				styles = applyToDocument as any;
				applyToDocument = document;
			}
		}

		const styleItem = renderStylesheet(styles as any, applyToDocument);
		if (styleItem instanceof (applyToDocument.defaultView as any)?.CSSStyleSheet) {
			applyToDocument.adoptedStyleSheets = [...applyToDocument.adoptedStyleSheets, styleItem as CSSStyleSheet];
		} else if (styleItem instanceof HTMLElement) {
			applyToDocument.head.appendChild(styleItem);
		}
	};

	if (typeof document !== "undefined") {
		const globalStyleVNode = new StyleVNode(_dot.css);
		globalStyleVNode.render(document.documentElement);
	}

	_dot.window = (options) => {
		return new WindowWrapper(options);
	}

	_dot.flushSync = () => {
		scheduler.flushSync();
	}

	_dot.setSync = (sync: boolean) => {
		scheduler.setSync(sync);
	}

	for(let i = 0; i < allTags.length; i++){
		let E = allTags[i];
		makeCoreWrapper(_dot, E);
	}

	for(let i = 0; i < allCoreWrappers.length; i++){
		let W = allCoreWrappers[i];
		makeCoreWrapper(_dot, W);
	}

	return _dot as unknown as IDotCore;
}

const dot = makeDot();

export default dot;
