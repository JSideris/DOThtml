/**
 * Chagnes
 * - Aliases / shorter names for common/internal objects to reduce file size.
 * - Encapsulated _DOT (now _D) constructor.
 * - Removed DOT alias for dot.
 * - Renamed createWidget function to component.
 * - Added callbacks for after a component is created.
 * - Added an optional cunstructor to components.
 * - Added a setVal and getVal functions, similar to jQuery's val, only better.
 * - Added missing HTML tags.
 */
var dot = (function(){

	// DOT:
	function _D(document) {
		this._document = document;
		this._if = null;
		this._pendingCalls = []; //Allows you to set parent attributes from children. Also allows for jquery helper calls.
		this._anonAttrFuncs = []; //Only to be used by top-level dot object.

		this.lastNode = document ? document.lastChild : null;
	}

	var _p = _D.prototype;

	_p.version = "2.0.0";

	_p._warnings = true;
	_p.suppressWarnings = function(){
		this.__proto__._warnings = false;
	};

	_p._getNewDocument = function(){
		return document.createElement("DOTHTML-DOCUMENT");
	};

	_p._getAnInstance = function(){
		if(this._document || this._pendingCalls.length > 0) return this;
		else {
			var d = new _D(null);
			d._if = this._if;
			return d;
		};
	};

	_p._getLastChildOrNull = function(){
		if(this._document && this._document.lastChild) return this._document.lastChild;
		return null;
	};

	//I'm not sure if this is supported anymore.
	_p.getLast = function(){
		return this._getLastChildOrNull();
	}

	_p.toString = function(){
		if(this._document) return this._document.innerHTML;
		else return "";
	}

	//before is passed in so that attributes or jquery wrappers can be associated with before's sibling, instead of inheritingParent, the default.
	_p._evalContent = function(content, /*inheritingParent, before,*/ pendingCalls){
		if(typeof content === "string" || typeof content === "number" || typeof content === "boolean") { //Raw data
			var nDot = new _D(this._getNewDocument());
			nDot._document.innerHTML = content;
			return nDot._document.childNodes;
		}
		else if(Object.prototype.toString.call( content ) === '[object Array]') { //Array
			var nDot = new _D(this._getNewDocument());
			for(var i = 0; i < content.length; i++){
				nDot._appendOrCreateDocument(content[i]);
			}
			if(nDot._document) return nDot._document.childNodes;
		}
		else if(isF(content)) //Function to evaluate
		{
			return this._evalContent(content(), /*inheritingParent, before,*/ pendingCalls);
		}
		else if(content && content instanceof _D) { //DOT
			for(var i = 0; i < content._pendingCalls.length; i++){
				pendingCalls.push(content._pendingCalls[i]);
			}
			/*
			var inheritTarget = (before ? before.previousSibling : null) || inheritingParent || this._document.lastChild;
			if(inheritTarget && content._pendingCalls){ //Inherit jquery or attr actions from first child.
				for(var i = 0; i < content._pendingCalls.length; i++){
					var call = content._pendingCalls[i];
					if(call.type == "attr") inheritTarget.setAttribute(call.name, call.params[0]);
					else if(call.type == "jQuery wrapper"){
						var jo = jQuery(inheritTarget);
						jo[call.name].apply(jo, call.params);
					}
					else if(call.type == "jQuery event"){
						var jo = jQuery(inheritTarget);
						jo[call.name](handler);
					}
					else if(call.type == "wait"){
						call.callback();
					}
				}
			}
			*/
			if(content._document) return content._document.childNodes; //Return all the nodes in here.
		} 
		
		return null;
	};

	_p._appendOrCreateDocument = function(content, parentEl, beforeNode){
		//Note: the stuff with setting parentEl to beforeNode's parent is due to a very strange bug where this._document gets set to some phantom document when the wait function is used inside a div like so: DOT.div(DOT.wait(100, "hello!")); Try it. 
		parentEl = (beforeNode ? beforeNode.parentNode : null) || parentEl || this._document || this._getNewDocument();
		
		var nd = this._document === parentEl ? this : new _D(parentEl);
		nd._if = this._if;
		var pendingCalls = []; //This will populate with pending calls.
		var eContent = nd._evalContent(content, /*parentEl, beforeNode,*/ pendingCalls);
		for(var i = 0; i < pendingCalls.length; i++){
			var call = pendingCalls[i];
			//Three possibilities.
			//1. Use the pending call against the last sibling element, if one exists.
			//2. Otherwise, use it on the current parent, if it's ready.
			//3. Otherwise, save it as a pending call right here. // Don't think this ever happens.
			var pendingCallTarget = (beforeNode ? (beforeNode.previousSibling || parentEl /*Since lastChild will be a timeout*/) : null /*1*/) || parentEl.lastChild /*2*/ || parentEl; 
			if(pendingCallTarget && pendingCallTarget.tagName != "DOCUMENT"){
				if (call.type == "attr") {
					if (!isF(call.params[0])) {
						pendingCallTarget.setAttribute(call.name, call.params[0]);
					}
					else {
						if (pendingCallTarget.addEventListener) pendingCallTarget.addEventListener(call.name, call.params[0], call.arg3 || false);
						else pendingCallTarget.attachEvent("on" + call.name, call.params[0]); //compatibility with old browsers.
					}
				}
				else if(call.type == "jQuery wrapper"){
					var jo = jQuery(pendingCallTarget);
					jo[call.name].apply(jo, call.params);
				}
				else if(call.type == "jQuery event"){
					var jo = jQuery(pendingCallTarget);
					jo[call.name](handler);
				}
				else if(call.type == "wait"){
					call.callback();
				}
			}
			else{
				nd._pendingCalls.push(call); /*3*/
			}
		}
		if(eContent !== null){
			if( eContent instanceof NodeList ) {
				//for(var i = 0; i < eContent.length; i++){
				while(eContent.length > 0){
					if(beforeNode) parentEl.insertBefore(eContent[0], beforeNode);
					else parentEl.appendChild(eContent[0]);
				}
			}
			else{
				if(beforeNode) parentEl.insertBefore(eContent, beforeNode);
				else parentEl.appendChild(eContent);
			}
		}
		
		return nd;
		//return this;
	};

	_p.el = function(tag, content){
		var ne = document.createElement(tag); 
		var nDoc = this._document || this._getNewDocument();
		nDoc.appendChild(ne);
		this._appendOrCreateDocument(content, ne);
		return this._document === nDoc ? this : new _D(nDoc);
	};

	_p.h = function(content){
		var hDoc = this._getNewDocument();
		var hDot = new _D(hDoc);
		//if(typeof content === "string" || typeof content === "number" || typeof content === "boolean") hDoc.innerHTML = content; //Raw data
		hDot._appendOrCreateDocument(content)
		
		var nDoc = this._document || this._getNewDocument();
		while(hDoc.childNodes.length > 0){
			nDoc.appendChild(hDoc.childNodes[0]);
		}
		return this._document === nDoc ? this : new _D(nDoc); 
	};

	_p.t = function(content){
		var textNode = document.createTextNode(content);
		var nDoc = this._document || this._getNewDocument();
		nDoc.appendChild(textNode);
		return new _D(nDoc);
	};

	_p.attr = function(attr, value, arg3){
		if (isF(value)) {
			if (attr.indexOf("on") != 0) {//But only do this if it's an unrecognized event.
				dot._anonAttrFuncs.push(value);
				value = "dot._anonAttrFuncs[" + (dot._anonAttrFuncs.length - 1) + "](event);"
			}
			else {
				attr = attr.substring(2);
			}
		}
		if(this._document) {
			var cn = this._document.childNodes;
			var last = cn[cn.length - 1];
			if(last && last.setAttribute){
				if (!isF(value)) {
					var eValue = last.getAttribute(attr); //Appends the new value to any existing value.
					if (!eValue) eValue = ""; else eValue += " ";
					last.setAttribute(attr, eValue + (value === undefined ? attr : value)); //||attr is for self-explaining attributes
				}
				else {
					if (last.addEventListener) last.addEventListener(attr, value, arg3 || false);
					else last.attachEvent("on" + attr, value); //compatibility with old browsers.
				}
			}
		}
		else{
			var pD = this._getAnInstance();
			//if(!pD._pendingCalls.length > 0) pD._pendingCalls = [];
			pD._pendingCalls.push({ type: "attr", name: attr, params: [value], arg3: arg3 });
			return pD;
		}
		return this;
	};

	_p._appendSetElement = function(targetId, appendMode){
		if(!targetId) {if (this._warnings) console.warn("Can't render to " + targetId); return this;}
		var destination = document.getElementById(targetId);
		if(!destination) {if (this._warnings) console.warn("Element with ID: " + targetId + " not found."); return this;}
		if(this._document) {
			if(!appendMode) destination.innerHTML = "";
			while(this._document.childNodes.length > 0) destination.appendChild(this._document.childNodes[0]);
		}
		return this;
	};

	_p.appendToId = function(targetId){
		return this._appendSetElement(targetId, true);
	};

	_p.writeToId = function(targetId){
		return this._appendSetElement(targetId, false);
	};

	_p.iterate = function(iterations, callback, params){
		var target = this;
		var content = callback;
		var copycontent = null;
		if(content instanceof _D)	copycontent = content._document.cloneNode(true);
		
		for(var i = 0; i < iterations; i++){
			if(isF(callback)) content = callback(i, params);
			if(copycontent) content._document = copycontent.cloneNode(true);
			target = target._appendOrCreateDocument(content);
		}
		
		return target;
	};

	_p.each = function(array, callback){
		var target = this;
		for(var i = 0; i < array.length; i++){
			target = target._appendOrCreateDocument(callback(array[i]));
		}
		return target;
	};

	_p.if = function(condition, callback){
		if(condition) {
			this._if = true;
			return this._getAnInstance()._appendOrCreateDocument(callback);
		}
		else{
			this._if = false;
		}
		return this;
	};

	_p.elseif = function(condition, callback){
		if(!this._if){
			return this.if(condition, callback);
		}
		return this;
	};

	_p.else = function(callback){
		if(!this._if){
			this._if = null;
			return this._getAnInstance()._appendOrCreateDocument(callback);
		}
		return this;
	};

	_p.script = function(callback){
		//return this._appendOrCreateDocument(callback);
		callback();
		return this;
	};

	_p.wait = function(timeout, callback){
		var timeoutDot = this.el("dothtml-timeout");
		var timeoutNode = timeoutDot._document.lastChild;
		var startTimer = function(){
			setTimeout(function(){
				timeoutDot._appendOrCreateDocument(callback, null, timeoutNode);
				timeoutNode.parentElement.removeChild(timeoutNode);
				////timeoutNode.remove(); //Doesn't work in IE.
			}, timeout);
		}
		
		startTimer();
		return timeoutDot;
	};

	_p.empty = function(){
		if(this._document){
			while (this._document.firstChild) {
				this._document.removeChild(this._document.firstChild);
			}

		}
		return this;
	}

	_p.binding = function(val){
		return new _B(val);
	}

	/**
	 * Binds the value of an element to a data field.
	 * @param {_B} binding
	 */
	_p.bindTo = function(binding){
		var last = this.getLast();
		var noListener = true;
		var ret = this.setVal(binding.value);
		last.addEventListener("change", function(e){
			binding.value = this.getVal();
		});
		binding.subscribe(last);
		var noListener = false;
		return ret;
	}

	var components = {};

	/**
	 * @param {object} params - Params for the component builder.
	 * @param {string} params.name - Name of the component (required).
	 * @param {Function} params.builder - A function returning DOThtml (required).
	 * @param {Function} params.constructor - A function called before the element is created. Allows storing meta information about the element.
	 * @param {Function} params.ready - A function called after the element has been added. One parameter will be provided containing the added element.
	 */
	_p.component = function(params){
		var prms;
		if(arguments.length == 1) prms = params;
		else prms = {name: arguments[0], builder: arguments[1]}
		components[prms.name] = prms.constructor || function(){};
		_p[prms.name] = function(){
			var obj = new components[prms.name]();
			var ret = prms.builder.apply(obj, arguments);
			ret = this._appendOrCreateDocument(ret instanceof _D ? ret : dot.h(ret));
			obj.element = obj.element || ret.getLast();
			prms.ready && setTimeout(function(){prms.ready.apply(obj)}, 0);
			return ret;
		};

		_p[prms.name].prototype
	};

	_p.createElement = function(tag){
		_p[tag] = _p[tag + "E"] = function(c){return this.el(tag, c);}
	};

	_p.createAttribute = function(attribute){
		_p[attribute] = _p[attribute + "A"] = function(value){return this.attr(attribute, value);}
	};

	_p.createJQueryWrapper = function(name){
		_p["$" + name] = function(){
			this.check$();
			var jo = jQuery(this._getLastChildOrNull()); // Get this first because a timeout tag is going to be added.
			
			var timeoutDot = null;
			var timeoutNode = null;
			
			//Replace function args with a custom wrapper.
			for(var i = 0; i < arguments.length; i++){
				var arg = arguments[i];
				if(arg instanceof _D){
					var dot = arg;
					arg = function(){return dot;}
				}
				if(isF(arg)){
					timeoutDot = this.el("dothtml-timeout");
					timeoutNode = timeoutDot._document.lastChild;
					(function(arg, args, timeoutNode, timeoutDot){
						args[i] = function(){
							var ret = timeoutDot._appendOrCreateDocument(arg, null, timeoutNode);
							timeoutNode.parentElement.removeChild(timeoutNode);
							//timeoutNode.remove(); //Doesn't work in IE.
						};
					})(arg, arguments, timeoutNode, timeoutDot);
					break; //First function is assumed to be the callback.
				}
			}
			
			var retDOT = timeoutDot || this;
			if(this._document){
				
				jo[name].apply(jo, arguments);
				//var jqargs = arguments;
				//setTimeout(function(){jo[name].apply(jo, jqargs);}, 0);
				return retDOT;
			}
			else{
				
				var pD = (retDOT._pendingCalls.length > 0 ? retDOT : new _D(retDOT._document));
				if(!pD._pendingCalls) pD._pendingCalls = [];
				pD._pendingCalls.push({type: "jQuery wrapper", name: name, params: arguments});
				return pD;
			}
		}
	};

	_p.createJQueryEventHandler = function(name){
		_p["$" + name] = function(handler){
			this.check$();
			if(this._document){
				var jo = jQuery(this._getLastChildOrNull());
				jo[name](handler);
				return this;
			}
			else{
				var pD = (this._pendingCalls.length > 0 ? this : new _D(this._document));
				if(!pD._pendingCalls) pD._pendingCalls = [];
				pD._pendingCalls.push({type: "jQuery event", name: name, params: arguments});
				return pD;
			}
		}
	};


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
		"blockquote",
		"br",
		"button",
		"canvas",
		"caption",
		"cite", //*
		"code",
		"col",
		"colgroup",
		"content",
		"data", //*
		"datalist",
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
		"fieldset",
		"figcaption",
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
		"iframe",
		"img",
		"input",
		"ins",
		"kbd",
		"keygen",
		"label", //*
		"legend",
		"li",
		"main",
		"map",
		"mark",
		"menu",
		"menuitem",
		"meter",
		"nav",
		"noscript",
		"object",
		"ol",
		"optgroup",
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
		"sub",
		"summary", //*
		"sup",
		"table",
		"tbody",
		"td",
		"textarea",
		"tfoot",
		"th",
		"thead",
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
		"accesskey",
		"action",
		"align",
		"alink",
		"alt",
		"archive",
		"autocomplete",
		"autofocus",
		"autoplay",
		"autosave",
		"axis",
		"background",
		"bgcolor",
		"border",
		"buffered",
		"cellpadding",
		"cellspacing",
		"challenge",
		"char",
		"charoff",
		"checked",
		"cite", //*
		"class",
		"classid",
		"clear",
		"codebase",
		"codetype",
		"color",
		"cols",
		"colspan",
		"compact",
		"contenteditable",
		"contextmenu",
		"controls",
		"coords",
		"datetime",
		"declare",
		"default",
		"data", //*
		"dir",
		"dirname",
		"disabled",
		"download",
		"draggable",
		"dropzone",
		"enctype",
		"face",
		"font",
		"fontface",
		"fontfaceformat",
		"fontfacename",
		"fontfacesrc",
		"fontfaceuri",
		"fontspecification",
		"for",
		"foreignobject",
		"form", //*
		"formaction",
		"frame",
		"frameborder",
		"headers",
		"height",
		"hidden",
		"high",
		"href",
		"hreflang",
		"hspace",
		"icon",
		"id",
		"images",
		"ismap",
		"itemprop",
		"keytype",
		"kind",
		"label", //*
		"lang",
		"list",
		"longdesc",
		"loop",
		"low",
		"manifest",
		"marginheight",
		"marginwidth",
		"max",
		"maxlength",
		"media",
		"metadata",
		"method",
		"min",
		"missingglyph",
		"multiple",
		"muted",
		"name",
		"nohref",
		"noresize",
		"noshade",
		"novalidate",
		"nowrap",
		"onblur",
		"onchange",
		"onclick",
		"ondblclick",
		"onfocus",
		"onkeydown",
		"onkeypress",
		"onkeyup",
		"onload",
		"onmousedown",
		"onmouseenter",
		"onmousemove",
		"onmouseout",
		"onmouseover",
		"onmouseup",
		"onreset",
		"onscroll",
		"onselect",
		"onsubmit",
		"onunload",
		"open",
		"optimum",
		"pattern",
		"ping",
		"placeholder",
		"poster",
		"preload",
		"prompt",
		"radiogroup",
		"readonly",
		"rel",
		"required",
		"rev",
		"reversed",
		"rows",
		"rowspan",
		"rules",
		"sandbox",
		"scope",
		"scrolling",
		"seamless",
		"selected",
		"shape",
		"size",
		"sizes",
		"span", //*
		"spellcheck",
		"src",
		"srcdoc",
		"srclang",
		"srcset",
		"standby",
		"start",
		"step",
		"summary", //*
		"style",
		"tabindex",
		"target",
		"title",
		"type",
		"usemap",
		"valign",
		"value",
		"valuetype",
		"width",
		"wrap"
		//"dataA", //Special explicit 
		//"citeA",
		//"formA",
		//"labelA",
		//"spanA",
		//"summaryA"
	];
	
	var allJQueryWrappers = [
		"animate",
		"css",
		"empty",
		"fadeIn",
		"fadeOut",
		"fadeTo",
		"hide",
		"show"
	];
	
	var allJQueryEventHandlers = [
		"blur",
		"change",
		"click",
		"dblclick",
		"focus",
		"focusin",
		"focusout",
		"hover",
		"keydown",
		"keypress",
		"keyup",
		"mousedown",
		"mouseenter",
		"mouseleave",
		"mousemove",
		"mouseout",
		"mouseover",
		"mouseup",
		"one",
		"resize",
		"scroll",
		"select",
		"submit"
	];
	
	for(var i = 0; i < allTags.length; i++) _p.createElement(allTags[i]);
	for(var i = 0; i < allAttributes.length; i++) _p.createAttribute(allAttributes[i]);
	for(var i = 0; i < allJQueryWrappers.length; i++) _p.createJQueryWrapper(allJQueryWrappers[i]);
	for(var i = 0; i < allJQueryEventHandlers.length; i++) _p.createJQueryEventHandler(allJQueryEventHandlers[i]);

	//Hyphenated Attributes.
	_p["acceptcharset"] = _p["accept-charset"] = function(value){return this.attr("accept-charset", value);};

	//SVG
	_p.svg = function(){throw "SVG is not supported by this library. Keep an eye out for dotsvg.js in the future."};

	//Data is a special attribute.
	_p.data = function(suffix, value){
		if(arguments.length < 2){
			value = suffix;
			suffix = undefined;
			return this.attr("data", value);
		}
		else{
			return this.attr("data-" + suffix, value);
		}
	};

	//Special handling for names that exist as both elements and attributes.
	//summary, span, label, form, cite

	_p.cite = function(arg){
		if(arg && this._document && this._document.lastChild){
			var tagType = this._document.lastChild.tagName;
			if(tagType == "BLOCKQUOTE" 
				|| tagType == "DEL" 
				|| tagType == "INS" 
				|| tagType == "Q")
				return this.attr("cite", arg);
		}
		return this.el("cite", arg);
	};
			
	_p.form = function(arg){
		if(arg && this._document && this._document.lastChild){
			var tagType = this._document.lastChild.tagName;
			if(tagType == "BUTTON" 
				|| tagType == "FIELDSET" 
				|| tagType == "INPUT" 
				|| tagType == "KEYGEN"
				|| tagType == "LABEL"
				|| tagType == "METER"
				|| tagType == "OBJECT"
				|| tagType == "OUTPUT"
				|| tagType == "PROGRESS"
				|| tagType == "SELECT"
				|| tagType == "TEXTAREA")
				return this.attr("form", arg);
		}
		return this.el("form", arg);
	};

	_p.label = function(arg){
		if(arg && this._document && this._document.lastChild){
			var tagType = this._document.lastChild.tagName;
			if(tagType == "TRACK")
				return this.attr("label", arg);
		}
		return this.el("label", arg);
	};

	_p.span = function(arg){
		if(arg && this._document && this._document.lastChild){
			var tagType = this._document.lastChild.tagName;
			if(tagType == "COL" 
				|| tagType == "COLGROUP")
				return this.attr("span", arg);
		}
		return this.el("span", arg);
	};

	_p.summary = function(arg){
		if(arg && this._document && this._document.lastChild){
			var tagType = this._document.lastChild.tagName;
			if(tagType == "TABLE")
				return this.attr("summary", arg);
		}
		return this.el("summary", arg);
	};

	/**
	 * Sets the value of an input or texterea.
	 * @param {string} value - The value to be set.
	 */
	_p.setVal = function(value){
		var last = this.getLast() || this._document;
		if(!last) return this;
		if(last.parentNode && last.parentNode.tagName != "DOTHTML-DOCUMENT") last = last.parentNode;
		
		//if ( typeof value === "number" ) val += "";
		if ( Array.isArray( value ) ) {
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
			last.value = value;
		}

		return this;
	}

	_p.getVal = function(){
		var element = this.lastNode || this._document;
		if(!element || element.nodeType !== 1) return undefined;

		if ( element.type == "checkbox" ) {
			return element.checked ? true : false;
		}
		else if ( element.type == "radio" ) {
			return element.checked ? true : false;
		}
		else if ( element.tagName == "OPTION" ) {
			return element.selected ? true : false;
		}
		else {
			return element.value;
		}
	}

	//Jquery wrappers

	_p.check$ = function(){
		if(!jQuery) throw "Can't use jQuery wrappers without jQuery."
	};

	/** @type {_D} */
	var dot = dot = function(targetSelector){
		var targets = targetSelector instanceof NodeList ? targetSelector : ( targetSelector instanceof Node ? [targetSelector] : document.querySelectorAll(targetSelector));
		var newDot = new _D();
		if(targets.length > 0){
			newDot._document = targets[0];
		}
		
		return newDot;
	} 

	//Fill in all the other fields.
	dot.__proto__ = Object.create(_p);
	dot._document = null;
	dot._if = null;
	dot._pendingCalls = [];
	dot._anonAttrFuncs = [];

	// BINDINGS:
	function _B(value){
		this._value = value;
		this.subscribers = [];
		var self = this;
		this.property = Object.defineProperty(this, "value", { 
			//value: value,
			enumerable: true,
			//writable: true,
			get: function(){return self._value;},
			set: function(value){
				self._value = value; 
				self.updateSubscribers();
			}
		});
	}

	var _Bp = _B.prototype;

	_Bp.subscribe = function(element){
		this.subscribers.push(element);
	}

	_Bp.unsubscribe = function(element){
		for(var i = 0; i < S.length; i++){
			if(S[i] == element){
				S.splice(i, 1); 
				break;
			}
		}
	}

	_Bp.updateSubscribers = function(){
		var S = this.subscribers;
		for(var i = 0; i < S.length; i++){
			dot(S[i]).setVal(this._value);
		}
	}

	_Bp.setFrom = function(element){
		this.value = dot(element).getVal();
	}

	// TOOLS:

	function isF(value){
		return value && value.constructor && value.call && value.apply;
	}


	// Done - return the object.
	return dot;
}());