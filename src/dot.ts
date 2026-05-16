
import { ContainerVdom } from "./vdom-nodes/container-vdom";
import { TextVdom } from "./vdom-nodes/text-vdom";
import ElementVdom from "./vdom-nodes/element-vdom";
import { Vdom } from "./vdom-nodes/vdom";
import { DOT_VDOM_PROP_NAME } from "./constants";
import Watcher from "./reactivity/watcher";
import Computed from "./reactivity/computed";
import { component } from "./decoration/component";
import { ComponentVdom } from "./vdom-nodes/component-vdom";
// import { useStyles } from "./decoration/use-styles";
import BaseVStyle from "./v-style-nodes/base-v-style";
import { IDotCore, IDotCss, IDotComponent } from "dothtml-interfaces";
import WindowWrapper from "./window-wrapper";
import Binding from "./reactivity/binding";
import Ref from "./reactivity/ref";
import { scheduler } from "./reactivity/scheduler";
import { getCurrentComponent, pushComponent, popComponent } from "./vdom-nodes/component-context";

// TODO: these stay in memory. I believe I could refactor this so that the memory gets cleaned up.
// Look into it.
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
	"cite", //*
	"code",
	"col",
	"colGroup",
	"content",
	"data", //*
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
	"form", //*
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
	"label", //*
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
	"span", //*
	"strong",
	"svg",
	"sub",
	"summary", //*
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

// Keeping this around for reference. Might need it at same point.
// Don't delete. It took a decent amount of effort to put this together.
// const allAttributes = [
// 	"accept",
// 	"accessKey",
// 	"action",
// 	"align",
// 	"allow",
// 	"allowFullScreen",
// 	"aLink",
// 	"alt",
// 	"archive",
// 	"autoCapitalize",
// 	"autoComplete",
// 	"autoFocus",
// 	"autoPlay",
// 	"autoSave",
// 	"axis",
// 	"background",
// 	"bgColor",
// 	"border",
// 	"buffered",
// 	"cellPadding",
// 	"cellSpacing",
// 	"challenge",
// 	"char",
// 	"charset",
// 	"charOff",
// 	"checked",
// 	// "cite", //*
// 	"class",
// 	"classId",
// 	"clear",
// 	"codeBase",
// 	"codeType",
// 	"color",
// 	"cols",
// 	"colSpan",
// 	"compact",
// 	"contentEditable",
// 	"contextMenu",
// 	"controls",
// 	"coords",
// 	"crossOrigin",
// 	"dateTime",
// 	"declare",
// 	"decoding",
// 	"default",
// 	//"data", //*
// 	"dir",
// 	"dirName",
// 	"disabled",
// 	"download",
// 	"draggable",
// 	"dropZone",
// 	"encType",
// 	"enterKeyHint",
// 	"exportParts",
// 	"face",
// 	"font",
// 	"fontFace",
// 	"fontFaceFormat",
// 	"fontFaceName",
// 	"fontFaceSrc",
// 	"fontFaceUri",
// 	"fontSpecification",
// 	"for",
// 	"foreignObject",
// 	// "form", //*
// 	"formAction",
// 	"frame",
// 	"frameBorder",
// 	"headers",
// 	"height",
// 	"hidden",
// 	"high",
// 	"hRef",
// 	"hRefLang",
// 	"hSpace",
// 	"icon",
// 	"id",
// 	"inert",
// 	"inputMode",
// 	"images",
// 	"is",
// 	"isMap",
// 	"itemId",
// 	"itemProp",
// 	"itemRef",
// 	"itemScope",
// 	"itemType",
// 	"keyType",
// 	"kind",
// 	// "label", //*
// 	"lang",
// 	"list",
// 	"loading",
// 	"longDesc",
// 	"loop",
// 	"low",
// 	"manifest",
// 	"marginHeight",
// 	"marginWidth",
// 	"max",
// 	"maxLength",
// 	"media",
// 	"metadata",
// 	"method",
// 	"min",
// 	"missingGlyph",
// 	"multiple",
// 	"muted",
// 	"name",
// 	"noHRef",
// 	"nOnce",
// 	"noResize",
// 	"noShade",
// 	"noValidate",
// 	"noWrap",
// 	"open",
// 	"optimum",
// 	"part",
// 	"pattern",
// 	"ping",
// 	"placeholder",
// 	"playsInline",
// 	"poster",
// 	"preload",
// 	"prompt",
// 	"radioGroup",
// 	"readOnly",
// 	"referrerPolicy",
// 	"rel",
// 	"required",
// 	"rev",
// 	"reversed",
// 	"role",
// 	"rows",
// 	"rowSpan",
// 	"rules",
// 	"sandbox",
// 	"scope",
// 	"scrolling",
// 	"seamless",
// 	"selected",
// 	"shape",
// 	"size",
// 	"sizes",
// 	// "span", //*
// 	"spellCheck",
// 	"src",
// 	"srcDoc",
// 	"srcLang",
// 	"srcSet",
// 	"standby",
// 	"start",
// 	"step",
// 	// "summary", //*
// 	"style", // Special
// 	"tabIndex",
// 	"target",
// 	"title",
// 	"translate",
// 	"type",
// 	"useMap",
// 	"vAlign",
// 	// "value", // Special behavior.
// 	"valueType",
// 	"virtualKeyboardPolicy",
// 	"width",
// 	"wrap"
// 	//"dataA", //Special explicit 
// 	//"citeA",
// 	//"formA",
// 	//"labelA",
// 	//"spanA",
// 	//"summaryA"
// ];

// const specialAttributes = [
// 	["quoteCite","cite"],
// 	["objectData","data"],
// 	["whichForm","form"],
// 	["trackLabel","label"],
// 	["colSpan","span"],
// 	["tableSummary","summary"],
// 	["optionLabel","label"],
// 	["acceptCharset","accept-charset"],
// 	["areaHidden", "area-hidden"],
// 	["areaLabel", "area-label"],
// 	["areaDescribedBy", "area-describedby"],
// 	["areaControls", "area-controls"],
// 	["areaExpanded", "area-expanded"],
// 	["areaChecked", "area-checked"],
// 	["areaSelected", "area-selected"],
// ];

// TODO: don't forget to add md.
// To find the definitions of these, check container-vdom.ts
const allCoreWrappers = ["each", "html", "mount", "text", "md", "when", "on"];

// This could easily be modified so that it adds some rudimentary element checking.
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

// dot(document.body).div(dot.p("123").id("my-p")).id("my-div");

/**
 * 1. Main VDomNode is built.
 * 2. A new vdom node is built, and `p()` is called in it, creating a new vdom node.
 */

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
			// It's an element.
			// Try to get the node out of it.
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

	// _dot.watch = function<Ti extends Reactive|Array<any>|{[key: string|number]: any}|string|number|boolean = any, To = Ti>(props: {value: Ti, key?: string, transform?: (value: Ti)=>To}): Reactive<Ti, To>{
	_dot.watch = function<T extends Watcher|Array<any>|{[key: string|number]: any}|string|number|boolean = any>(value: T, key?: string): Watcher<T>{
		let o = new Watcher();
		o.key = key;
		// o._value = props?.value;
		o.value = (value);
		return o;
	}

	_dot.computed = function<T>(getter: () => T): Watcher<T>{
		const c = new Computed(getter);
		const currentComponent = getCurrentComponent();
		if (currentComponent) {
			currentComponent.registerComputed(c);
		}
		return c;
	}

	_dot.component = component;

	_dot.create = function<T extends IDotComponent>(Ctor: { new(...args: any[]): T }, ...args: any[]): T {
		const tracker = {
			computedWatchers: [],
			registerComputed(w: any) { this.computedWatchers.push(w); }
		};
		pushComponent(tracker as any);
		let instance: T;
		try {
			instance = new Ctor(...args);
		} finally {
			popComponent();
		}
		(instance as any)._trackedComputeds = tracker.computedWatchers;
		return instance;
	}

	_dot.ref = function(){
		return new Ref();
	}

	_dot.css = new BaseVStyle();
	((_dot.css as any)._isBase as boolean) = true;

	// _dot.component = component;
	// _dot.component["useStyles"] = useStyles;

	_dot.useStyles = (applyToDocument: Document, styles: string|((css)=>string|IDotCss))=>{

		if(applyToDocument && !styles){
			if(typeof applyToDocument == "string" || (applyToDocument["call"] && applyToDocument["apply"])){
				styles = applyToDocument as any;
				applyToDocument = document;
			}
		}

		let cssStringContent = "";
		if(typeof styles == "string"){
			cssStringContent = styles;
		}
		else{
			let content = styles(dot.css);
			if(typeof content == "string"){
				cssStringContent = content;
			}
			else{
				// TODO: need a way to get the string from the framework. Still a WIP.
			}
		}
		const styleSheet = applyToDocument.createElement("style");
		styleSheet.type = "text/css";
		styleSheet.textContent = cssStringContent;
		applyToDocument.head.appendChild(styleSheet);
	};

	_dot.window = (options) => {
		return new WindowWrapper(options);
	}

	_dot.flushSync = () => {
		scheduler.flushSync();
	}

	{ // Elements
		for(let i = 0; i < allTags.length; i++){
			let E = allTags[i];
			ContainerVdom.prototype[E] = function(a, b){
				let n = new ElementVdom(dot, E);

				let cont;
				let attrs;
				{ // Find out which arg is the content and which is the attributes.
					if(a instanceof ContainerVdom || a instanceof Vdom || (typeof a == "object" && a?.build) || a instanceof Watcher || a instanceof Binding || typeof a === "string" || typeof a === "number" || typeof a === "boolean" || Array.isArray(a)){
						cont = a;
						attrs = b;
					}
					if(b instanceof ContainerVdom || b instanceof Vdom || (typeof b == "object" && b?.build) || b instanceof Watcher || b instanceof Binding || typeof b === "string" || typeof b === "number" || typeof b === "boolean" || Array.isArray(b)){
						if(cont) throw new Error("Both element arguments can't be content.");
						cont = b;
						attrs = a;
					}

					if(!cont && (a || b)){
						attrs = (a || b);
					}

					// If we didn't find a content, there could have been an invalid value passed in.
					// The logic to determine if a content was found is a little tricky because we allow null and undefined.
					// It's actually wrong right now. Not a high priority though.
					// if(cont === undefined && ((a && b) || ((a || b) && !attr))){
					// 	throw new Error("Unknown value type.");
					// }
				}

				{ // Apply attributes to element.
					if(attrs){
						for(let k in attrs) {
							let attr = attrs[k];
							if(attr instanceof Watcher) attr = attr.bind();
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
					}
				}
				
				{ // Add children to new element.
					if(cont instanceof ContainerVdom){
						// Note that this creates a redundant new ContainerVdom in the ElementVdom that gets overwritten.
						// Perhaps there's a way to eliminate this inefficiency.
						n.children = cont;
					}
					else if(cont instanceof Vdom){
						n.children._addChild(cont);
					}
					else if(typeof cont == "object" && cont?.build){
						// n.children._addChild(new ComponentVdom(dot, cont));
						n.children.mount(cont);
						
					}
					else{
						// Text or reactives.
						if(cont !== null && cont !== undefined){
							if(cont instanceof Watcher){
								cont = cont.bind();
							}
							n.children._addChild(new TextVdom(cont));
						}
					}
				}

				return this._addChild(n);

				// if(c instanceof ContainerVDomNode){
				// 	n = c;
				// }
				// else{
				// 	n = new ContainerVDomNode();
				// 	if(c instanceof HtmlVDomNode || c instanceof TextVDomNode){
				// 		n._addChild(c);
				// 	}
				// 	else{
				// 		// It's content (assume text). Later we'll add support for other types.
				// 		if(c){
				// 			let inner = new TextVDomNode(c);
				// 			n._addChild(inner);
				// 		}
				// 	}
				// }
				// return this._addChild(n);
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
