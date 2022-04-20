
import eventBus from "./event-bus";
import {IDotCore, IDotGenericElement} from "./i-dot";
import dotcss from "./style-builder";
import ERR from "./err";
import { DotContent, IDotElementDocument, IDotDocument } from "./i-dot";
import { ClassPrefix, eachK, GlobalComponentStack, isF, sT, str } from "./dot-util";
import Component from "./component";
import { ArrayArgCallback, AttrArgCallback, ConditionalArgCallback, ContentArgCallback } from "./arg-callback-obj";
import ObservableArray from "./observable-array";





const dot: IDotCore = (function(targetSelector: string|Element|Node|NodeList|Array<Node|Element>)
{
	//console.log(targetSelector);
	var targets = targetSelector ? (
		typeof targetSelector == "string" ? document.querySelectorAll(targetSelector) 
		: (targetSelector instanceof Element || targetSelector instanceof Node ? [targetSelector] 
			: ((targetSelector instanceof NodeList || (targetSelector instanceof Array)  && targetSelector[0] && (targetSelector[0] instanceof Element || targetSelector[0] instanceof Node)) ? targetSelector 
				: []
	)))
	: [];
	//console.log(targets);
	var newDot = new DotDocument();
	if(targets.length > 0){
		newDot.__document = targets[0];
	}

	dot["__selectionMode"] = SELECTOR_MODE;
	
	return newDot;
}) as IDotCore;





const DOCEL = "DOTHTML-DOCUMENT";
const DEFEL = "DOTHTML-DEFER";
var _anonFuncCounter = 0;

function ext(name: string, method: Function){
	_p[name] = dot[name] = method;
}

// Deletes one element (and not its children). 
// Used by _p.empty and _p.remove.
function deleteElement(element: Element){
	var deleted = null;
	var dc: Component = element["__dothtml_component"];
	if(dc){
		// var d = dc.deleting;
		dc.deleting && dc.deleting();
		dc["__$el"] = null;
		deleted = dc.deleted;
	}
	if(element.parentNode) element.parentNode.removeChild(element);
	deleted && deleted.apply(dc);
}

function _conditionalBlock(T, totalCondition, allConditions, contentCallback){
	var startTextNode = document.createTextNode("");
	var endTextNode = document.createTextNode("");
	//var cb = {f:contentCallback,startNode:startTextNode, endNode:endTextNode,condition:totalCondition};
	var cb = new ConditionalArgCallback(startTextNode, endTextNode, contentCallback, totalCondition);
	dot["__currentArgCallback"].push(cb);
	
	var renderContent = totalCondition();

	T = T._appendOrCreateDocument(startTextNode);
	
	for(var i = 0; i < allConditions.length; i++) allConditions[i]();
	cb.lastValue = renderContent;
	if(renderContent) T = T._appendOrCreateDocument(contentCallback);
	
	T = T._appendOrCreateDocument(endTextNode);
	dot["__currentArgCallback"].pop();
	return T;
}

function attachEvent(el: Element, ev: string, val: Function, a3?: boolean){
	if (el.addEventListener) el.addEventListener(ev, val as any, a3 || false);
	else (el as any).attachEvent("on" + ev, val); //compatibility with old browsers.
}

function createElement(tag){
	ext(tag, function(c){return this.el(tag, c);});
};

function createAttribute(attribute: string, alias?: string){
	_p[alias || attribute] = function(value){return this.attr(attribute, value);}
};

// Selection Mode enum.
export const SELECTOR_MODE = 1;
export const ATTRIBUTE_MODE = 2;

// TODO: this might need to go in just the right place.
// dotReady(dot, _p, _D);
// Dot document object.
// Formerly _D
var DotDocument: IDotDocument = (function(document?: Element, classPrefix?: number) {
	// Private vars.

	this.__document = document;
	this.__lastNode = document ? document.lastChild : null;
	this.__if = null;
	this.__pendingCalls = []; //Allows you to set parent attributes from children.
	this.__anonAttrFuncs = {}; //Only to be used by top-level dot object.
	this.__classPrefix = classPrefix || 0;
	this.__classedElements = [];
	this.__selectionMode = SELECTOR_MODE;
	
}) as IDotDocument;
// Prototype for the dot document object.

var _p = (DotDocument as unknown as Function).prototype;

var allTags = [
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

var allAttributes = [
	"accept",
	"accessKey",
	"action",
	"align",
	"aLink",
	"alt",
	"archive",
	"autoComplete",
	"autoFocus",
	"autoPlay",
	"autoSave",
	"axis",
	"background",
	"bgColor",
	"border",
	"buffered",
	"cellPadding",
	"cellSpacing",
	"challenge",
	"char",
	"charOff",
	"checked",
	// "cite", //*
	//"class",
	"classId",
	"clear",
	"codeBase",
	"codeType",
	"color",
	"cols",
	"colSpan",
	"compact",
	"contentEditable",
	"contextMenu",
	"controls",
	"coords",
	"dateTime",
	"declare",
	"default",
	//"data", //*
	"dir",
	"dirName",
	"disabled",
	"download",
	"draggable",
	"dropZone",
	"encType",
	"face",
	"font",
	"fontFace",
	"fontFaceFormat",
	"fontFaceName",
	"fontFaceSrc",
	"fontFaceUri",
	"fontSpecification",
	"for",
	"foreignObject",
	// "form", //*
	"formAction",
	"frame",
	"frameBorder",
	"headers",
	"height",
	"hidden",
	"high",
	"hRef",
	"hRefLang",
	"hSpace",
	"icon",
	"id",
	"images",
	"isMap",
	"itemProp",
	"keyType",
	"kind",
	// "label", //*
	"lang",
	"list",
	"longDesc",
	"loop",
	"low",
	"manifest",
	"marginHeight",
	"marginWidth",
	"max",
	"maxLength",
	"media",
	"metadata",
	"method",
	"min",
	"missingGlyph",
	"multiple",
	"muted",
	"name",
	"noHRef",
	"noResize",
	"noShade",
	"noValidate",
	"nowrap",
	"open",
	"optimum",
	"pattern",
	"ping",
	"placeholder",
	"poster",
	"preload",
	"prompt",
	"radioGroup",
	"readOnly",
	"rel",
	"required",
	"rev",
	"reversed",
	"rows",
	"rowSpan",
	"rules",
	"sandbox",
	"scope",
	"scrolling",
	"seamless",
	"selected",
	"shape",
	"size",
	"sizes",
	// "span", //*
	"spellCheck",
	"src",
	"srcDoc",
	"srcLang",
	"srcSet",
	"standby",
	"start",
	"step",
	// "summary", //*
	"style",
	"tabIndex",
	"target",
	"title",
	"type",
	"useMap",
	"vAlign",
	"value",
	"valueType",
	"width",
	"wrap"
	//"dataA", //Special explicit 
	//"citeA",
	//"formA",
	//"labelA",
	//"spanA",
	//"summaryA"
];

var specialAttributes = [
	["quoteCite","cite"],
	["objectData","data"],
	["whichForm","form"],
	["trackLabel","label"],
	["colSpan","span"],
	["tableSummary","summary"],
	["optionLabel","label"],
	["acceptCharset","accept-charset"],
]

var allEventAttr = [
	"onAbort",
	"onBlur",
	"onChange",
	"onInput",
	"onCanPlay",
	"onCantPlayThrough",
	"onClick",
	"onCopy",
	"onContextMenu",
	"onCueChange",
	"onCut",
	"onDblClick",
	"onDrag",
	"onDragEnd",
	"onDragEnter",
	"onDragLeave",
	"onDragOver",
	"onDragStart",
	"onDrop",
	"onDurationChange",
	"onEmptied",
	"onEnded",
	"onError",
	"onFocus",
	"onHashChange",
	"onInvalid",
	"onKeyDown",
	"onKeyPress",
	"onKeyUp",
	"onLoad",
	"onLoadedData",
	"onLoadedMetadata",
	"onLoadStart",
	"onMouseDown",
	"onMouseEnter",
	"onMouseMove",
	"onMouseOut",
	"onMouseOver",
	"onMouseUp",
	"onMouseWheel",
	"onOffline",
	"onOnline",
	"onPageHide",
	"onPagePaste",
	"onPageShow",
	"onPause",
	"onPlay",
	"onPlaying",
	"onPopState",
	"onProgress",
	"onRateChange",
	"onReset",
	"onResize",
	"onScroll",
	"onSearch",
	"onSeeked",
	"onSeeking",
	"onSelect",
	"onStalled",
	"onStorage",
	"onSubmit",
	"onSuspend",
	"onTimeUpdate",
	"onToggle",
	"onUnload",
	"onVolumeChange",
	"onWaiting",
	"onWheel",
]

var i;
for(i in allTags) createElement(allTags[i]);
for(i in allAttributes) createAttribute(allAttributes[i]);
for(i in specialAttributes) {
	createAttribute(specialAttributes[i][1],specialAttributes[i][0]);
}
for(i in allEventAttr) createAttribute(allEventAttr[i]);

ext("as", function<T extends IDotDocument>(dotElement: (...props: any[])=>T): T{
	return this;
});

ext("_getNewDocument", function(){
	return document.createElement(DOCEL);
});

ext("_getAnInstance", function(): IDotDocument{
	if(this.__document || this.__pendingCalls.length > 0) return this;
	else {
		var d = new DotDocument(null, this.__classPrefix);
		d.__if = this.__if;
		return d;
	};
});

ext("_getLastChildOrNull", function(): ChildNode{
	if(this.__document && this.__document.lastChild) return this.__document.lastChild;
	return null;
});

//I'm not sure if this is supported anymore.
ext("getLast", function(): Node{
	return this._getLastChildOrNull();
});
ext("getCurrent", function(): Node{
	let last;
	switch(dot["__selectionMode"]){
		case SELECTOR_MODE:{
			last = this.__document;
			break;
		}
		case ATTRIBUTE_MODE:{
			last = this.getLast() || this.__document;
			break;
		}
	}
	return last;
});

_p.toString = function(){
	if(this.__document) return this.__document.innerHTML;
	else return "";
};

_p.ref = function(name){
	let l = this.getLast();
	let gl = GlobalComponentStack.length;
	if(l && gl > 0){
		let c = GlobalComponentStack[gl - 1];
		c.$refs[name] = l;
	}
	return this;
}

//before is passed in so that attributes can be associated with before's sibling, instead of inheritingParent, the default.
ext("_evalContent", function(content: DotContent, pendingCalls?: Array<unknown>){
	if(content == null || content == undefined) return null;
	if(typeof content === "string" || typeof content === "number" || typeof content === "boolean") { //Raw data
		let nDot = new DotDocument(this._getNewDocument(), this.__classPrefix);
		nDot.__document.innerHTML = content;
		return nDot.__document.childNodes;
	}
	else if(content instanceof Node) return content;
	else if(Object.prototype.toString.call( content ) === '[object Array]') { //Array
		let nDot = new DotDocument(this._getNewDocument(), this.__classPrefix);
		for(let i = 0; i < (content as Array<unknown>).length; i++){
			nDot._appendOrCreateDocument((content as DotContent)[i]);
		}
		if(nDot.__document) return nDot.__document.childNodes;
	}
	else if(isF(content)) //Function to evaluate
	{
		return this._evalContent((content as (()=>DotContent))(), pendingCalls);
	}
	else if(content instanceof Component){
		return this._evalContent(Component.build(content));
	}
	else if(content instanceof DotDocument) { //DOT
		for(let i = 0; i < content["__pendingCalls"].length; i++){
			pendingCalls.push(content["__pendingCalls"][i]);
		}
		
		let cp = this.__classPrefix;
		for(let i in content["__classedElements"]){
			let el = content["__classedElements"][i];
			if(!cp){
				this["__classedElements"].push(el);
			}
			else{
				el.className = "dot-" + str(cp,16) + "-" + el.className;
			}
		}
		if(content["__document"]) return content["__document"].childNodes; //Return all the nodes in here.
	}
	
	return null;
});

ext("_appendOrCreateDocument", function(content: DotContent, parentEl?: Element, beforeNode?: Node|number){
	var T = this;
	// Validation
;;;	if(parentEl && beforeNode && isNaN(beforeNode as any) && (beforeNode as Node).parentNode != parentEl) throw "beforeNode is not in parentEl.";

	// Find the parent, or create one.
	//Note: the stuff with setting parentEl to beforeNode's parent is due to a very strange bug where this.__document gets set to some phantom document when the wait function is used inside a div like so: DOT.div(DOT.wait(100, "hello!")); Try it. )
	parentEl = parentEl || (beforeNode && isNaN(beforeNode as any) ? (beforeNode as Node).parentNode : null) || T.__document || T._getNewDocument();
	
	if(!isNaN(beforeNode as any)){
		beforeNode = parentEl.childNodes[beforeNode as number];
//;;;		if(!beforeNode) throw "beforeNode not found."; // TODO: reenable this and investigate why it breaks.
	}

	// nd is a dot wrapper for parentEl (allows us to do dot ops on it).
	var nd = T.__document === parentEl ? T : new DotDocument(parentEl, T.__classPrefix);
	nd.__if = T.__if;
	var pendingCalls = []; //This will populate with pending calls.
	
	// Evaluate the content. This does not add it to the DOM pet.
	var eContent;
	var cf = isF(content);
	// If it's a function, we need to consider 
	//if(cf) dot.__currentArgCallback.push({f:content,e:parentEl})
	if(cf) dot["__currentArgCallback"].push(new ContentArgCallback(parentEl, content as ()=>string));
	try{
		eContent = nd._evalContent(content, /*parentEl, beforeNode,*/ pendingCalls);
	}
	finally{
		if(cf) dot["__currentArgCallback"].pop();
	}


	// Pending calls are calls included in the dot element which didn't get consumed and must be propagated up.
	// This usually includes attributes and waits.
	for(var i = 0; i < pendingCalls.length; i++){
		var call = pendingCalls[i];
		//Three possibilities.
		//1. Use the pending call against the last sibling element, if one exists.
		//2. Otherwise, use it on the current parent, if it's ready.
		//3. Otherwise, save it as a pending call right here. // Don't think this ever happens.
		var pendingCallTarget = (beforeNode ? ((beforeNode as Node).previousSibling || parentEl /*Since lastChild will be a timeout*/) : null /*1*/) || parentEl.lastChild /*2*/ || parentEl; 
		if(pendingCallTarget && (pendingCallTarget as Element).tagName != "DOCUMENT"){
			if (call.type == "attr") {
				if (!isF(call.params[0])) {
					(pendingCallTarget as Element).setAttribute(call.name, call.params[0]);
				}
				else {
					// TODO: how do we know it's a valid event?
					let newName:string = call.name;
					attachEvent((pendingCallTarget as Element), newName, call.params[0], call.arg3);
				}
			}
			else if(call.type == "wait"){
				call.callback();
			}
		}
		else{
			nd.__pendingCalls.push(call); /*3*/
		}
	}

	// Append content to the current document.
	if(eContent !== null && eContent !== undefined){
		if( eContent instanceof NodeList ) {
			//for(var i = 0; i < eContent.length; i++){
			while(eContent.length > 0){
				if(beforeNode) parentEl.insertBefore(eContent[0], beforeNode as Node);
				else parentEl.appendChild(eContent[0]);
			}
		}
		else{
			if(beforeNode) parentEl.insertBefore(eContent, beforeNode as Node);
			else parentEl.appendChild(eContent);
		}
	}
	
	return nd;
	//return this;
});

ext("el", function(tag: string, content?: DotContent): IDotElementDocument<IDotGenericElement>{
	var T = this;
	var ne = document.createElement(tag); 
	var nDoc = T.__document || T._getNewDocument();
	nDoc.appendChild(ne);
	if(content) T._appendOrCreateDocument(content, ne);
	var ret = T.__document === nDoc ? T : new DotDocument(nDoc, T.__classPrefix);
	if(content && content instanceof DotDocument) for(var i in content["__classedElements"]) ret.__classedElements.push(content["__classedElements"][i]);

	dot["__selectionMode"] = ATTRIBUTE_MODE;

	return ret;
});

ext("h", function(content): IDotDocument{
	var T = this;
	var hDoc = T._getNewDocument();
	var hDot = new DotDocument(hDoc, T.__classPrefix);
	//if(typeof content === "string" || typeof content === "number" || typeof content === "boolean") hDoc.innerHTML = content; //Raw data
	hDot._appendOrCreateDocument(content)
	
	var nDoc = T.__document || T._getNewDocument();
	while(hDoc.childNodes.length > 0){
		nDoc.appendChild(hDoc.childNodes[0]);
	}
	return T.__document === nDoc ? T : new DotDocument(nDoc, T.__classPrefix); 
});

ext("t", function(content): IDotDocument{
	var textNode = document.createTextNode(content);
	var nDoc = this.__document || this._getNewDocument();
	nDoc.appendChild(textNode);
	return new DotDocument(nDoc, this.__classPrefix);
});

ext("attr", function(attr, value, arg3?){
	var T = this;
	if (isF(value)) { // events.
		if (attr.indexOf("on") == 0 && allEventAttr.indexOf(attr) != -1) {
			attr = attr.substring(2).toLowerCase();
		}
		else {
			// Unrecognized event.
			dot["__anonAttrFuncs"][_anonFuncCounter] = (value);
			value = "dot.__anonAttrFuncs[" + (_anonFuncCounter++) + "](arguments[0]);"
			// attr = attr.substring(2);
		}
	}

	if(T.__document) {
		var cn = T.__document.childNodes;
		var last = cn[cn.length - 1];
		if(last && last.setAttribute){
			if (!isF(value)) {

				// Objects (except for the css builder :/)
				if(typeof value == "object" && !(value instanceof dot.css["_Builder"])){
					var originalValue = value;
					var valueSetter = function(){
						var str = "";
						eachK(originalValue, function(k,v){
							v = isF(v) ? v() : v;
							if(!v) return;
							str += " " + k
						});
						return str.substring(1);
					}

					//dot.__currentArgCallback.push({f:valueSetter,e:parentEl,a:attr})
					dot["__currentArgCallback"].push(new AttrArgCallback(last, attr, valueSetter));
					value = valueSetter();
					dot["__currentArgCallback"].pop();
				}

				var eValue = last.getAttribute(attr); //Appends the new value to any existing value.
				if (!eValue) eValue = ""; else eValue += " ";
				last.setAttribute(attr, eValue + (value === undefined ? attr : value)); //||attr is for self-explaining attributes
			}
			else {
				attachEvent(last, attr, value, arg3);
			}
		}
	}
	else{
		// TODO: should probably remove pending calls. This has turned out to be an anti-pattern.
		var pD = T._getAnInstance();
		//if(!pD.__pendingCalls.length > 0) pD.__pendingCalls = [];
		pD.__pendingCalls.push({ type: "attr", name: attr, params: [value], arg3: arg3 });
		return pD;
	}
	return T;
});

ext("_appendSetElement", function(targetId: string, appendMode){
	var T = this;
	if(!targetId) {ERR("A", targetId); return T;}
	var destination = document.getElementById(targetId);
	if(!destination) {ERR("F", targetId); return T;}
	if(T.__document) {
		if(!appendMode) destination.innerHTML = "";
		while(T.__document.childNodes.length > 0) destination.appendChild(T.__document.childNodes[0]);
	}
	return T;
});

ext("iterate", function(iterations: number, callback: (i: number)=>DotContent){
	var target = this;
	// var copycontent = null;

	// Not sure what this was used for before the TS port.
	// var content = callback;
	// if(content instanceof DotDocument) {
	// 	copycontent = content.__document.cloneNode(true);
	// }
	
	for(var i = 0; i < iterations; i++){
		let content: DotContent = null;
		if(isF(callback)) content = callback(i);
		// if(copycontent) content.__document = copycontent.cloneNode(true);
		target = target._appendOrCreateDocument(content);
	}
	
	return target;
});

ext("each", function(array, callback, forceNoDeferred){
	var target = this;

	if(isF(array)){
		if(!forceNoDeferred){
			return target.defer(function(v){
				v.each(array, callback, true);
			});
		}
		// console.log(this.__document);
		var func = array;
		//target = target._appendOrCreateDocument();
		// dot.__currentArgCallback.push({f:callback,d:target}); 
		dot["__currentArgCallback"].push(new ArrayArgCallback(target, callback));
		try{
			array = func();
		}
		finally{
			dot["__currentArgCallback"].pop();
		}
	}

	if(array instanceof Array || array instanceof ObservableArray){
		for(var i = 0; i < (array as Array<any>).length; i++){
			target = target._appendOrCreateDocument(callback(array[i], i));
		}
	}
	else{
		var keys = Object.keys(array);
		for(var i = 0; i < keys.length; i++){
			var k = keys[i];
			target = target._appendOrCreateDocument(callback(array[k], k));
		}
	}
	return target;
});


//SVG
//_p.svg = function(){ERR("S")};

//Data is a special attribute.
_p.customData = function(suffix, value){
	return this.attr("data-" + suffix, value);
};

_p.class = function(value){
	var cp = this.__classPrefix;
	// This handles legitimate class prefixes. If we are dealing with a compted class list, each class list name is prefixed.
	if(cp){
		var prefix = "dot-" + str(cp, 16) + "-";
		if(typeof value == "string") value = prefix + value;
		else if(typeof value == "object"){
			var v2 = {};
			eachK(value, function(k,v){
				v2[prefix + k] = v;
			});
			value = v2;
		}
	}
	else
	{
		var el = this.getLast();
		el && this.__classedElements.push(el);
	}
	return this.attr("class", value);
}

_p.play = function(){
	let last: HTMLVideoElement|HTMLAudioElement = this.getCurrent();
	last.play && last.play();
	return this;
}
_p.pause = function(resetTime){
	let last: HTMLVideoElement|HTMLAudioElement = this.getCurrent();
	last.pause && last.pause();
	if(resetTime) last.currentTime = 0;
	return this;
}
_p.stop = function(){
	return this.pause(true);
}

/**
 * Sets the value of an input or texterea.
 * @param {string} value - The value to be set.
 */
_p.setVal = function(value): IDotElementDocument<IDotGenericElement>{
	let last = this.getCurrent();
	
	if(!last) return this;
	
	// console.log("CHECKVALUE", value);
	//if ( typeof value === "number" ) val += "";
	if ( Array.isArray && Array.isArray( value ) || !Array.isArray && value.join ) {
		value = value.join("");
	}
	else if(value == null){
		value = "";
	}

	if ( last.type == "checkbox" ) {
		last.checked = value ? true : false;
	}
	else if ( last.type == "radio" ) {
		last.checked = value ? true : false;
	}
	else if ( last.tagName == "OPTION" ) {
		last.selected = value ? true : false;
	}
	else {
		// console.log("UPDATING VALUE!!", value, last, last.value);
		last.value = value;
		// console.log("UPDATED!!", value, last, last.value);
	}

	return this;
};

_p.getVal = function(){
	var element: Element = this.__lastNode || this.__document;
	if(!element || element.nodeType !== 1) return undefined;

	if ( element["type"] == "checkbox" ) {
		return element["checked"] ? true : false;
	}
	else if ( element["type"] == "radio" ) {
		return element["checked"] ? true : false;
	}
	else if ( element.tagName == "OPTION" ) {
		return element["selected"] ? true : false;
	}
	else {
		return element["value"];
	}
};

ext("when", function(condition, contentCallback, ar){
	var T = this._getAnInstance();
	if(isF(condition)){
		if(!ar) ar = T.__conditionalArray = [condition];
		var l = ar.length - 1;
		var totalCondition = function(){
			for(var i = 0; i < l; i++){
				if(!!ar[i]()) {
					return false;
				}
			}
			return !!condition();
		}
		T = _conditionalBlock(T, totalCondition, ar, contentCallback);
		// ar.push(condition);
	}
	else{
		// Old:
		if(!!condition) {
			T = T._appendOrCreateDocument(isF(contentCallback) ? contentCallback() : contentCallback);
			T.__if = true;
		}
		else{
			T.__if = false;
		}
	}
	return T;
});

ext("otherwiseWhen", function(condition, callback): IDotDocument{
	if(isF(condition)){
		var ar = this.__conditionalArray;
		if(!ar) ERR("MC");
		//var l = ar.length - 1;
		// var newCondition = function(){
		// 	for(var i = 0; i <= l; i++){
		// 		if(ar[i]()) return false;
		// 	}
		// 	return !!condition();
		// }
		ar.push(condition);
		return this.when(condition, callback, ar);
	}
	else{
		if(!this.__if){
			return this.when(condition, callback);
		}
	}
	return this;
});

ext("otherwise", function(callback): IDotDocument{
	var ar = this.__conditionalArray;
	if(ar){
		//var l = ar.length - 1;
		var newCondition = function(){
			return true;
		}
		ar.push(newCondition);
		return this.when(newCondition, callback, ar);
	}
	else if(!this.__if){
		this.__if = null;
		return this._getAnInstance()._appendOrCreateDocument(callback);
	}
	return this;
});

ext("script", function(callback): IDotDocument{
	var last = this.getLast();
	sT(function(){callback(last);}, 0);
	return this;
});

ext("wait", function(timeout, callback): IDotDocument{
	var timeoutDot = this.el(DEFEL);
	var timeoutNode = timeoutDot.__document.lastChild;

	sT(()=>{
		timeoutDot._appendOrCreateDocument(callback, null, timeoutNode);
		timeoutNode.parentElement.removeChild(timeoutNode);
	}, timeout);
	
	return timeoutDot;
	// Ideally something like this:
	//return this.defer(function(d){d.h(callback)}, timeout);
});

ext("defer", function(callback){
	if(!isF(callback)) ERR("XF", "defer");
	var deferDot = this.el(DEFEL);
	var deferNode = deferDot.__document.lastChild;

	sT(()=>{
		callback(dot(deferNode.parentElement));
		deferNode.parentElement.removeChild(deferNode);
	}, 0);
	
	return deferDot;
});


ext("empty", function(){
	if(this.__document){
		// Build a queue of items to remove.
		var queue = [this.__document];
		var firstQ = true;
		var stack = [];
		while(queue.length > 0)
		{
			var current = queue.shift();
			if(current.childNodes.length > 0){
				for(var i = 0; i < current.childNodes.length; i++){
					queue.push(current.childNodes[i]);
				}
			}
			!firstQ && stack.push(current);
			firstQ = false;

		}
		while(stack.length > 0){
			deleteElement(stack.pop());
		}
	}
	// Drop all the other nodes (like text)
	// Text seems to get deleted even without this code :).
	//while (this.__document.firstChild) {
	//	this.__document.removeChild(this.__document.firstChild);
	//}

	return this;
});

ext("remove", function(){
	this.empty();
	deleteElement(this.__document);
});

ext("scopeClass", function(prefix: number|string|null, content: DotContent){
	if(prefix == null){
		prefix = ClassPrefix.next;
	}
	var T = this;

	//T.__classPrefix = prefix || classPrefix.next;
	//doc.__oldClassPrefix.push(prefix);
	T.__classPrefix = prefix;
	var ret = T.h(content);
	T.__classPrefix = 0;
	//doc.__oldClassPrefix.pop();
	//T.__classPrefix = oldCp;
	return ret;
});

_p.bindTo = function(prop: any){
	let lastProp: string = dot["__lastProp"];
	let lastIndex: number = dot["__lastIndex"];
	let lastComponent: Component = dot["__lastComponent"];

	let last = this.getLast();
	//var noListener = true;
	let _value = lastComponent.props[lastProp];
	if(lastIndex != null && lastIndex != undefined) _value = _value[lastIndex];

	let ret = this.setVal(_value);

	// Binding from the input to the prop.
	attachEvent(last, "change", function(e){lastComponent.props[lastProp] = dot(last).as(dot.input).getVal();})

	lastComponent["__propContainer"].bindings[lastProp].push({
		element: last
	});

	//var noListener = false;
	return ret;
};

// ext("resetScopeClass", function(){
// 	ClassPrefix.reset();
// });

dot.resetScopeClass = function(){
	ClassPrefix.reset();
	return this;
}

// _p.bindTo = function(binding){
// 	var last = this.getLast();
// 	//var noListener = true;
// 	var ret = this.setVal(binding.value);
// 	attachEvent(last, "change", function(e){binding.value = this.getVal();})
// 	binding.subscribe(last);
// 	//var noListener = false;
// 	return ret;
// }

// export DotDocument;













dot.css = dotcss;
dot.bus = eventBus;

// dot.component = addComponent;
// TODO: might remove this in v4+
// dot.removeComponent = removeComponent;

//Fill in all the other fields.
//if(Object.create) dot.prototype = Object.create(_p);
// dot.prototype.constructor = dot;
dot["__currentArgCallback"] = [];
dot["__document"] = null;
dot["__if"] = null;
dot["__pendingCalls"] = [];
dot["__anonAttrFuncs"] = {};

// TODO: these may already exist?
//dot.data = DotDocument.prototype.data;
//dot.dataA = DotDocument.prototype.dataA;
//dot.cite = DotDocument.prototype.cite;
//dot.form = DotDocument.prototype.form;

export default dot;