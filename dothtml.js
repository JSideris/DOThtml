function _DOT(document){
	this._document = document;
	this._if = null;
	this._pendingCalls = []; //Allows you to set parent attributes from children. Also allows for jquery helper calls.
	this._anonAttrFuncs = []; //Only to be used by top-level dot object.

	this.lastNode = document ? document.lastChild : null;
}

_DOT.prototype.version = "1.3.2";

_DOT.prototype._warnings = true;
_DOT.prototype.suppressWarnings = function(){
	this.__proto__._warnings = false;
};

_DOT.prototype._getNewDocument = function(){
	return document.createElement("DOTHTML-DOCUMENT");
};

_DOT.prototype._getAnInstance = function(){
	if(this._document || this._pendingCalls.length > 0) return this;
	else {
		var d = new _DOT(null);
		d._if = this._if;
		return d;
	};
};

_DOT.prototype._getLastChildOrNull = function(){
	if(this._document && this._document.lastChild) return this._document.lastChild;
	return null;
};

//I'm not sure if this is supported anymore.
_DOT.prototype.getLast = function(){
	return this._getLastChildOrNull();
}

_DOT.prototype.toString = function(){
	if(this._document) return this._document.innerHTML;
	else return "";
}

//before is passed in so that attributes or jquery wrappers can be associated with before's sibling, instead of inheritingParent, the default.
_DOT.prototype._evalContent = function(content, /*inheritingParent, before,*/ pendingCalls){
	if(typeof content === "string" || typeof content === "number" || typeof content === "boolean") { //Raw data
		var nDot = new _DOT(this._getNewDocument());
		nDot._document.innerHTML = content;
		return nDot._document.childNodes;
	}
	else if(Object.prototype.toString.call( content ) === '[object Array]') { //Array
		var nDot = new _DOT(this._getNewDocument());
		for(var i = 0; i < content.length; i++){
			nDot._appendOrCreateDocument(content[i]);
		}
		if(nDot._document) return nDot._document.childNodes;
	}
	else if(content && content.constructor && content.call && content.apply) //Function to evaluate
	{
		return this._evalContent(content(), /*inheritingParent, before,*/ pendingCalls);
	}
	else if(content && content instanceof _DOT) { //DOT
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

_DOT.prototype._appendOrCreateDocument = function(content, parentEl, beforeNode){
	//Note: the stuff with setting parentEl to beforeNode's parent is due to a very strange bug where this._document gets set to some phantom document when the wait function is used inside a div like so: DOT.div(DOT.wait(100, "hello!")); Try it. 
	parentEl = (beforeNode ? beforeNode.parentNode : null) || parentEl || this._document || this._getNewDocument();
	
	var nd = this._document === parentEl ? this : new _DOT(parentEl);
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
			if(call.type == "attr") pendingCallTarget.setAttribute(call.name, call.params[0]);
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

_DOT.prototype.el = function(tag, content){
	var ne = document.createElement(tag); 
	var nDoc = this._document || this._getNewDocument();
	nDoc.appendChild(ne);
	this._appendOrCreateDocument(content, ne);
	return this._document === nDoc ? this : new _DOT(nDoc);
};

_DOT.prototype.h = function(content){
	var hDoc = this._getNewDocument();
	var hDot = new _DOT(hDoc);
	//if(typeof content === "string" || typeof content === "number" || typeof content === "boolean") hDoc.innerHTML = content; //Raw data
	hDot._appendOrCreateDocument(content)
	
	var nDoc = this._document || this._getNewDocument();
	while(hDoc.childNodes.length > 0){
		nDoc.appendChild(hDoc.childNodes[0]);
	}
	return this._document === nDoc ? this : new _DOT(nDoc); 
};

_DOT.prototype.t = function(content){
	var textNode = document.createTextNode(content);
	var nDoc = this._document || this._getNewDocument();
	nDoc.appendChild(textNode);
	return new _DOT(nDoc);
};

_DOT.prototype.attr = function(attr, value){
	if(value && value.constructor && value.call && value.apply){
		dot._anonAttrFuncs.push(value);
		value = "dot._anonAttrFuncs[" + (dot._anonAttrFuncs.length - 1) + "](event);"
	}
	if(this._document) {
		var cn = this._document.childNodes;
		if(cn.length > 0 && cn[cn.length - 1].setAttribute) cn[cn.length - 1].setAttribute(attr, value || attr); //||attr is for self-explaining attributes
	}
	else{
		var pD = this._getAnInstance();
		//if(!pD._pendingCalls.length > 0) pD._pendingCalls = [];
		pD._pendingCalls.push({type: "attr", name: attr, params: [value]});
		return pD;
	}
	return this;
};

_DOT.prototype._appendSetElement = function(targetId, appendMode){
	if(!targetId) {if (this._warnings) console.warn("Can't render to " + targetId); return this;}
	var destination = document.getElementById(targetId);
	if(!destination) {if (this._warnings) console.warn("Element with ID: " + targetId + " not found."); return this;}
	if(this._document) {
		if(!appendMode) destination.innerHTML = "";
		while(this._document.childNodes.length > 0) destination.appendChild(this._document.childNodes[0]);
	}
	return this;
};

_DOT.prototype.appendToId = function(targetId){
	return this._appendSetElement(targetId, true);
};

_DOT.prototype.writeToId = function(targetId){
	return this._appendSetElement(targetId, false);
};

_DOT.prototype.iterate = function(iterations, callback, params){
	var target = this;
	var content = callback;
	var copycontent = null;
	if(content instanceof _DOT)	copycontent = content._document.cloneNode(true);
	
	for(var i = 0; i < iterations; i++){
		if(callback && callback.constructor && callback.call && callback.apply) content = callback(i, params);
		if(copycontent) content._document = copycontent.cloneNode(true);
		target = target._appendOrCreateDocument(content);
	}
	
	return target;
};

_DOT.prototype.each = function(array, callback){
	var target = this;
	for(var i = 0; i < array.length; i++){
		target = target._appendOrCreateDocument(callback(array[i]));
	}
	return target;
};

_DOT.prototype.if = function(condition, callback){
	if(condition) {
		this._if = true;
		return this._getAnInstance()._appendOrCreateDocument(callback);
	}
	else{
		this._if = false;
	}
	return this;
};

_DOT.prototype.elseif = function(condition, callback){
	if(!this._if){
		return this.if(condition, callback);
	}
	return this;
};

_DOT.prototype.else = function(callback){
	if(!this._if){
		this._if = null;
		return this._getAnInstance()._appendOrCreateDocument(callback);
	}
	return this;
};

_DOT.prototype.script = function(callback){
	//return this._appendOrCreateDocument(callback);
	callback();
	return this;
};

_DOT.prototype.wait = function(timeout, callback){
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

_DOT.prototype.empty = function(){
	if(this._document){
		while (this._document.firstChild) {
			this._document.removeChild(this._document.firstChild);
		}

	}
	return this;
}

/*_DOT.prototype.lastNode = function(){
	return this._document.lastChild;
}*/

_DOT.prototype.createWidget = function(name, callback){
	_DOT.prototype[name] = function(){
		var ret = callback.apply(DOT, arguments);
		//return this.h(callback.apply(DOT, arguments)); //Passes all tests, but we don't necissarilly want to force callback to be dot.
		if(ret instanceof _DOT) return this._appendOrCreateDocument(ret);
		else return ret;
	};
};

_DOT.prototype.createElement = function(tag){
	_DOT.prototype[tag] = _DOT.prototype[tag + "E"] = function(c){return this.el(tag, c);}
};

_DOT.prototype.createAttribute = function(attribute){
	_DOT.prototype[attribute] = _DOT.prototype[attribute + "A"] = function(value){return this.attr(attribute, value);}
};

_DOT.prototype.createJQueryWrapper = function(name){
	_DOT.prototype["$" + name] = function(){
		this.check$();
		var jo = jQuery(this._getLastChildOrNull()); // Get this first because a timeout tag is going to be added.
		
		var timeoutDot = null;
		var timeoutNode = null;
		
		//Replace function args with a custom wrapper.
		for(var i = 0; i < arguments.length; i++){
			var arg = arguments[i];
			if(arg instanceof _DOT){
				var dot = arg;
				arg = function(){return dot;}
			}
			if(arg && arg.constructor && arg.call && arg.apply){
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
			
			var pD = (retDOT._pendingCalls.length > 0 ? retDOT : new _DOT(retDOT._document));
			if(!pD._pendingCalls) pD._pendingCalls = [];
			pD._pendingCalls.push({type: "jQuery wrapper", name: name, params: arguments});
			return pD;
		}
	}
};

_DOT.prototype.createJQueryEventHandler = function(name){
	_DOT.prototype["$" + name] = function(handler){
		this.check$();
		if(this._document){
			var jo = jQuery(this._getLastChildOrNull());
			jo[name](handler);
			return this;
		}
		else{
			var pD = (this._pendingCalls.length > 0 ? this : new _DOT(this._document));
			if(!pD._pendingCalls) pD._pendingCalls = [];
			pD._pendingCalls.push({type: "jQuery event", name: name, params: arguments});
			return pD;
		}
	}
};

(function(){
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
		"onmousemove",
		"onmouseout",
		"onmouseover",
		"onmouseup",
		"onreset",
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
	
	for(var i = 0; i < allTags.length; i++) _DOT.prototype.createElement(allTags[i]);
	for(var i = 0; i < allAttributes.length; i++) _DOT.prototype.createAttribute(allAttributes[i]);
	for(var i = 0; i < allJQueryWrappers.length; i++) _DOT.prototype.createJQueryWrapper(allJQueryWrappers[i]);
	for(var i = 0; i < allJQueryEventHandlers.length; i++) _DOT.prototype.createJQueryEventHandler(allJQueryEventHandlers[i]);
}());

//Hyphenated Attributes.
_DOT.prototype["acceptcharset"] = _DOT.prototype["accept-charset"] = function(value){return this.attr("accept-charset", value);};

//SVG
_DOT.prototype.svg = function(){throw "SVG is not supported by this library. Keep an eye out for dotsvg.js in the future."};

//Data is a special attribute.
_DOT.prototype.data = function(suffix, value){
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

_DOT.prototype.cite = function(arg){
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
		
_DOT.prototype.form = function(arg){
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

_DOT.prototype.label = function(arg){
	if(arg && this._document && this._document.lastChild){
		var tagType = this._document.lastChild.tagName;
		if(tagType == "TRACK")
			return this.attr("label", arg);
	}
	return this.el("label", arg);
};

_DOT.prototype.span = function(arg){
	if(arg && this._document && this._document.lastChild){
		var tagType = this._document.lastChild.tagName;
		if(tagType == "COL" 
			|| tagType == "COLGROUP")
			return this.attr("span", arg);
	}
	return this.el("span", arg);
};

_DOT.prototype.summary = function(arg){
	if(arg && this._document && this._document.lastChild){
		var tagType = this._document.lastChild.tagName;
		if(tagType == "TABLE")
			return this.attr("summary", arg);
	}
	return this.el("summary", arg);
};

//Jquery wrappers

_DOT.prototype.check$ = function(){
	if(!jQuery) throw "Can't use jQuery wrappers without jQuery."
};

var dot;
var DOT = dot = function(targetSelector){ //DOT is kept for legacy reasons. dot is now prefered.
	var targets = targetSelector instanceof NodeList ? targetSelector : ( targetSelector instanceof Node ? [targetSelector] : document.querySelectorAll(targetSelector));
	var newDot = new _DOT();
	if(targets.length > 0){
		newDot._document = targets[0];
	}
	
	return newDot;
} 

//Fill in all the other fields.
dot.__proto__ = Object.create(_DOT.prototype);
dot._document = null;
dot._if = null;
dot._pendingCalls = [];
dot._anonAttrFuncs = [];