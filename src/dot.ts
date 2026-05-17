
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

const allTags = [
	"a",
	"aside",
	"abbr",
	"address",
	"area",
	"article",
	"audio",
	"b",
	"bdi",
	"bdo",
	"blockQuote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"cite",
	"code",
	"col",
	"colGroup",
	"content",
	"data",
	"dataList",
	"dd",
	"del",
	"details",
	"dfn",
	"dialog",
	"div",
	"dl",
	"dt",
	"em",
	"embed",
	"fieldSet",
	"figCaption",
	"figure",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"header",
	"hr",
	"i",
	"iFrame",
	"img",
	"input",
	"ins",
	"kbd",
	"keyGen",
	"label",
	"legend",
	"li",
	"main",
	"map",
	"mark",
	"menu",
	"menuItem",
	"meter",
	"nav",
	"object",
	"ol",
	"optGroup",
	"option",
	"output",
	"p",
	"param",
	"pre",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"section",
	"select",
	"small",
	"source",
	"span",
	"strong",
	"svg",
	"sub",
	"summary",
	"sup",
	"table",
	"tBody",
	"td",
	"textArea",
	"tFoot",
	"th",
	"tHead",
	"time",
	"tr",
	"track",
	"u",
	"ul",
	"var",
	"video",
	"wbr"
];

const allCoreWrappers = ["each", "html", "mount", "text", "md", "when", "on"];

const allEventAttr = {
	onAbort: 1,
	onBlur: 1,
	onChange: 1,
	onInput: 1,
	onCanPlay: 1,
	onCantPlayThrough: 1,
	onClick: 1,
	onCopy: 1,
	onContextMenu: 1,
	onCueChange: 1,
	onCut: 1,
	onDblClick: 1,
	onDrag: 1,
	onDragEnd: 1,
	onDragEnter: 1,
	onDragLeave: 1,
	onDragOver: 1,
	onDragStart: 1,
	onDrop: 1,
	onDurationChange: 1,
	onEmptied: 1,
	onEnded: 1,
	onError: 1,
	onFocus: 1,
	onHashChange: 1,
	onInvalid: 1,
	onKeyDown: 1,
	onKeyPress: 1,
	onKeyUp: 1,
	onLoad: 1,
	onLoadedData: 1,
	onLoadedMetadata: 1,
	onLoadStart: 1,
	onMouseDown: 1,
	onMouseEnter: 1,
	onMouseLeave: 1,
	onMouseMove: 1,
	onMouseOut: 1,
	onMouseOver: 1,
	onMouseUp: 1,
	onPointerCancel: 1,
	onPointerDown: 1,
	onPointerEnter: 1,
	onPointerLeave: 1,
	onPointerMove: 1,
	onPointerOut: 1,
	onPointerOver: 1,
	onPointerUp: 1,
	onTouchStart: 1,
	onTouchEnd: 1,
	onTouchCancel: 1,
	onTouchMove: 1,
	onMouseWheel: 1,
	onOffline: 1,
	onOnline: 1,
	onPageHide: 1,
	onPagePaste: 1,
	onPageShow: 1,
	onPause: 1,
	onPlay: 1,
	onPlaying: 1,
	onPopState: 1,
	onProgress: 1,
	onRateChange: 1,
	onReset: 1,
	onResize: 1,
	onScroll: 1,
	onSearch: 1,
	onSeeked: 1,
	onSeeking: 1,
	onSelect: 1,
	onStalled: 1,
	onStorage: 1,
	onSubmit: 1,
	onSuspend: 1,
	onTimeUpdate: 1,
	onToggle: 1,
	onUnload: 1,
	onVolumeChange: 1,
	onWaiting: 1,
	onWheel: 1,
};

const makeCoreWrapper = (d, fn)=>{
	d[fn] = function(){
		let n = new ContainerVdom(dot);
		n[fn](...arguments);
		return n;
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

	{ // Elements
		const isContent = (arg: any) => {
			return arg instanceof ContainerVdom || 
				arg instanceof Vdom || 
				(typeof arg == "object" && arg?.build) || 
				arg instanceof Signal || 
				arg instanceof Binding || 
				typeof arg === "string" || 
				typeof arg === "number" || 
				typeof arg === "boolean" || 
				Array.isArray(arg);
		};

		const applyContent = (n: ElementVdom, cont: any) => {
			if(Array.isArray(cont)){
				for(let i = 0; i < cont.length; i++) applyContent(n, cont[i]);
			}
			else if(cont instanceof ContainerVdom){
				for(let i = 0; i < cont._children.length; i++) n.children._addChild(cont._children[i]);
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

		const applyAttributes = (n: ElementVdom, attrs: any) => {
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

		for(let i = 0; i < allTags.length; i++){
			let E = allTags[i];
			ContainerVdom.prototype[E] = function(...args: any[]){
				let n = new ElementVdom(dot, E);

				for(let j = 0; j < args.length; j++){
					let arg = args[j];
					if(isContent(arg)){
						applyContent(n, arg);
					}
					else if(arg && typeof arg === "object"){
						applyAttributes(n, arg);
					}
				}

				return this._addChild(n);
			};
			makeCoreWrapper(_dot, E);
		}
	}

	{ // Special core functions.
		for(let i = 0; i < allCoreWrappers.length; i++){
			let W = allCoreWrappers[i];
			makeCoreWrapper(_dot, W);
		}
	}

	return _dot as unknown as IDotCore;
}

const dot = makeDot();

export default dot;
