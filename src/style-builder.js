"use strict";

//Latest Update.
/*
* - Wrapped code in anonymous function.
* - Hid _Builder and _StyleProperty.
* - Increased compatibility with IE 8, 9, and 10.
* - Allowed 0-length animations.
*/


var dotcss = function(query){
	//this.currentCss = "";
	var target = null;
	if(query){
		// console.log(query, "?");
		if(typeof query == "string" ) {
			if(query.length > 2 && query.indexOf("{}") == query.length - 2){
				query = query.substring(0, query.length - 2);
				target = [document.createElement("style")];
				document.head.appendChild(target[0]);
				target[0].innerHTML = query + "{}";
			}
			else {
				// This is overly complicated, but here is the spiel. 
				// If there's an element on the scopeStack, it should be used with the querySelectorAll.
				// BUT, querySelectorAll doesn't actually select the element it's currently on, which is a requirement for dothtml. 
				// To make matters worse, if we do querySelectorAll on the element's parents, we may accidentally select its siblings!!
				// To fix this, we get a list from querySelectorAll on the element, then push the element itself to that list 
				// iff it is in the list of elements queried from its parent. 
				// In addition to all of that, we don't want scoped styles to be applied to child components. 
				var s0 = scopeStack[0];

				// If we're doing scoped, and it's an element.
				if(s0 && s0.parentNode && s0.querySelectorAll){

					target = getScopedNodeList(query, s0);
				}
				else{
					target = document.querySelectorAll(query);
				}
				// target = referencePt.querySelectorAll(query);
			}
		}
		if((query instanceof NodeList) || (query instanceof Array)) target = query;
		if(query instanceof Node) target = [query]; //Doesn't need to be a NodeList. Just iterable.
	}
	dotcss._lastBuilder = new _Builder(target);
	return dotcss._lastBuilder;
};

dotcss.version = "0.14.0";

//Inverse of framerate in ms/frame.
dotcss._fxInterval = 1000 / 60;

dotcss._lastBuilder = null;

dotcss._floatRegex = new RegExp("[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?", "g");

var scopeStack = [];

function getScopedNodeList(query, s0){
	// Get all of the matching child elements of the component. This will not include s0 itself, but it does include nested components.
	// So we will need to manipulate this collection.
	// querySelectorAll returns a NodeList, which we need to convert into an Array.
	var target = Array.from(s0.querySelectorAll(query));

	// Exclude nested components.
	for(var t = 0; t < target.length; t++){
		var T = target[t];

		// Is it a nested component??
		if(T.__dothtml_component){
			// It's a component. Remove it, and all of it's descendants. 
			target.splice(t, 1);
			t--;
			
			var subTargets = T.querySelectorAll(query);
			for(var s = 0; s < subTargets.length; s++){
				let S = subTargets[s];
				target.splice(target.indexOf(S, t + 1), 1);
			}
		}
	}

	// Loop through all the sibling nodes until we find s0.
	var parentTargets = Array.from(s0.parentNode.querySelectorAll(query));

	var p = parentTargets.indexOf(s0);
	if(p != -1){
		target.unshift(parentTargets[p]);
	}
	
	return target;
}

function _Builder(target){
	this.currentCss = "";
	this.target = target;
}

dotcss._Builder = _Builder;

var _b = _Builder.prototype;

_b.toString = dotcss.prototype.toString = function(){
	// console.log("CALLED TOSTRING!");
	return this.currentCss;
};

//Usage:
//hide()
//hide(duration, complete)
//hide(options)
//Options
//	display: inline-block, block, etc.
//	duration: duration in ms.
//	complete: on-complete callback.
//	hideStyle: fade, shrink, or normal
//	animationStyle: linear or exponential
_b.hide = function(){
	if(this.target){
		var arg0 = arguments[0] || {};
		var ops = {};
		ops.duration = arg0.duration || (isNaN(arg0) ? 0 : arg0) || 0;
		//ops.display = arg0.display || "none";
		//ops.opacity = arg0.opacity || null;
		//ops.width = arg0.width || null;
		//ops.height = arg0.height || null;
		ops.complete = arg0.complete || (typeof arguments[1] == "function" ? arguments[1] : (typeof arguments[2] == "function" ? arguments[2] : function(){}));
		ops.hideStyle = arg0.hideStyle || "normal";
		ops.animationStyle = arg0.animationStyle || (typeof arguments[1] == "string" ? arguments[1] : "ease");

		if(ops.duration > 0){
			var doneCnt = 0;
			var m = 0;
			var q = this.target.length;
			for(var i = 0; i < this.target.length; i++){
				var w = this.target[i].style.width;
				var h = this.target[i].style.height;
				var o = this.target[i].style.opacity;
				if(o === "") o = 1;
				var ov = this.target[i].style.overflow;
				if(ops.hideStyle != "fade"){
					this.target[i].style.overflow = "hidden";
					m += 2;
					(function(that, t, w, h, ov){
						dotcss(t).width.animate(0, ops.duration, ops.animationStyle, function(){
							dotcss(t).display("none").width(w).overflow(ov); //Restore original overflow value. Only needs to be done once.
							doneCnt++; if(doneCnt >= m * q) ops.complete(that);
						});
						dotcss(t).height.animate(0, ops.duration, ops.animationStyle, function(){
							dotcss(t).display("none").height(h);
							doneCnt++; if(doneCnt >= m * q) ops.complete(that);
						});
					})(this, this.target[i], w, h, ov);	
				}
				if(ops.hideStyle != "shrink"){
					m++;
					(function(that, t, o){
						return dotcss(t).opacity.animate(0, ops.duration, ops.animationStyle, function(){
							dotcss(t).display("none").opacity(o);
							doneCnt++; if(doneCnt >= m * q) ops.complete(that);
						});
					})(this, this.target[i], o);
				}
			}
		}
		else{
			dotcss(this.target).display("none");
			ops.complete(this); //This sets the display to none.
		}
	}
	return this;
};

//Usage:
//show()
//show(duration, complete)
//show(options)
//Options
//	display: inline-block, block, etc.
//	opacity: final opacity.
//	width: final width.
//	height: final height.
//	duration: duration in ms.
//	complete: on-complete callback.
//	showStyle: fade, grow, or normal
//	animationStyle: linear or exponential
_b.show = function(){
	if(this.target){
		var arg0 = arguments[0] || {};
		var ops = {};
		ops.duration = arg0.duration || (isNaN(arg0) ? 0 : arg0) || 0;
		ops.display = arg0.display || "block";
		ops.opacity = arg0.opacity;
		ops.width = arg0.width || null;
		ops.height = arg0.height || null;
		ops.complete = arg0.complete || (typeof arguments[1] == "function" ? arguments[1] : (typeof arguments[2] == "function" ? arguments[2] : function(){}));
		ops.showStyle = arg0.showStyle || "normal";
		ops.animationStyle = arg0.animationStyle || (typeof arguments[1] == "string" ? arguments[1] : "ease");

		if(ops.duration > 0){
			var doneCnt = 0;
			var q = this.target.length;
			var m = 0;
			for(var i = 0; i < this.target.length; i++){
				var o = ops.opacity;
				if(ops.opacity === undefined){
					o = parseFloat(this.target[i].style.opacity) || 1;
				}
				if(ops.showStyle != "fade"){
					m += 2;
					var w = ops.width || this.target[i].style.width;
					var h = ops.height || this.target[i].style.height;
					
					dotcss(this.target[i]).width(0);
					dotcss(this.target[i]).height(0);
					// console.log(doneCnt + " " + q*m);
					dotcss(this.target[i]).width.animate(w, ops.duration, ops.animationStyle, function(){doneCnt++; if(doneCnt >= q * m) ops.complete();});
					dotcss(this.target[i]).height.animate(h, ops.duration, ops.animationStyle, function(){doneCnt++; if(doneCnt >= q * m) ops.complete();});
				}

				//var o = this.target[i].style.opacity; //Guess I should fade to 1?
				dotcss(this.target[i]).opacity(0);
				dotcss(this.target[i]).display(ops.display);

				if(ops.showStyle != "grow"){
					m++;
					dotcss(this.target[i]).opacity.animate(o, ops.duration, ops.animationStyle, function(){doneCnt++; if(doneCnt == q * m) ops.complete();});
				}
			}
		}
		else{
			return dotcss(this.target).display(ops.display);
		}
	}
	return this;
};

_b.fadeOut = function(duration, complete){
	return this.hide({
		duration: isNaN(duration) ? 400 : Number(duration), 
		hideStyle: "fade",
		complete: complete
	});
};

_b.fadeIn = function(duration, complete){
	return this.show({
		duration: isNaN(duration) ? 400 : Number(duration), 
		showStyle: "fade",
		complete: complete
	});
};

//TYPES:
dotcss._Url = function(value){
	this.type = "url";
	this.url = null;
	if(!value || value.length == 0 || (value.length == 1 && value[0] == "" || value[0] == "none" || value[0] == "initial" || value[0] == "inherit")){
		this.url = null;
	}
	else{
		this.url = [];
		for(var i = 0; i < value.length; i++){
			var currentURL = "";
			if(value[i].toLowerCase().indexOf("url") === 0){
				var url = value[i].substring(indexOf("("), lastIndexOf(")")).trim();
				if((url.indexOf("\"") && url.lastIndexOf("\"") == url.length - 1) || 
					(url.indexOf("'") && url.lastIndexOf("'") == url.length - 1)){
					url = url.substring(1, ret.length - 1);
				}
				this.url.push(url);
			}
			else{
				this.url.push(value[i]);
			}
		}
	}
}

dotcss._Url.prototype.toString = function(){
	if(!this.url) return "none";
	else 
	{
		var ret = [];
		for(var i = 0; i < this.url.length; i++){
			ret.push("url(\"" + this.url[i] + "\")");
		}
		return ret.join(", ");
	}
}

dotcss._Color = function(value){
	this.type = "color";
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 1;
	if(value.length == 1) {
		value = value[0];
		if(value == "" || value == "none" || value == "initial" || value == "inherit"){} //Nothing more needs to be done.
		else if(!isNaN(value)){
			this.b = value & 0xFF;
			value >>= 8;
			this.g = value & 0xFF;
			value >>= 8;
			this.r = value & 0xFF;
		}
		else if(value[0] == "#"){
			var cH = value.split("#")[1];
			if(cH.length == 3){
				this.r = Number("0x" + cH[0] + "" + cH[0]);
				this.g = Number("0x" + cH[1] + "" + cH[1]);
				this.b = Number("0x" + cH[2] + "" + cH[2]);

			}
			else if(cH.length == 6){
				this.r = Number("0x" + cH[0] + "" + cH[1]);
				this.g = Number("0x" + cH[2] + "" + cH[3]);
				this.b = Number("0x" + cH[4] + "" + cH[5]);
			}
			//else throw value + " is not a valid color"; //or just stick with black.
		}
		else if(value.toLowerCase().indexOf("rgb") === 0){
			//This also handles rgba.
			var cData = value.split("(")[1];
			cData = cData.split(")")[0];
			cData = cData.split(",");
			if(cData.length == 3 || cData.length == 4){
				this.r = Number(cData[0]);
				this.g = Number(cData[1]);
				this.b = Number(cData[2]);
				this.a = Number(cData[3] || 1);
			}
		}
		else{
			var r = 0;
			var g = 0;
			var b = 0;
			switch(value.toLowerCase()){
				case 'aliceblue':r=0xF0;g=0xF8;b=0xFF;break;
				case 'antiquewhite':r=0xFA;g=0xEB;b=0xD7;break;
				case 'aqua':r=0x00;g=0xFF;b=0xFF;break;
				case 'aquamarine':r=0x7F;g=0xFF;b=0xD4;break;
				case 'azure':r=0xF0;g=0xFF;b=0xFF;break;
				case 'beige':r=0xF5;g=0xF5;b=0xDC;break;
				case 'bisque':r=0xFF;g=0xE4;b=0xC4;break;
				case 'black':r=0x00;g=0x00;b=0x00;break;
				case 'blanchedalmond':r=0xFF;g=0xEB;b=0xCD;break;
				case 'blue':r=0x00;g=0x00;b=0xFF;break;
				case 'blueviolet':r=0x8A;g=0x2B;b=0xE2;break;
				case 'brown':r=0xA5;g=0x2A;b=0x2A;break;
				case 'burlywood':r=0xDE;g=0xB8;b=0x87;break;
				case 'cadetblue':r=0x5F;g=0x9E;b=0xA0;break;
				case 'chartreuse':r=0x7F;g=0xFF;b=0x00;break;
				case 'chocolate':r=0xD2;g=0x69;b=0x1E;break;
				case 'coral':r=0xFF;g=0x7F;b=0x50;break;
				case 'cornflowerblue':r=0x64;g=0x95;b=0xED;break;
				case 'cornsilk':r=0xFF;g=0xF8;b=0xDC;break;
				case 'crimson':r=0xDC;g=0x14;b=0x3C;break;
				case 'cyan':r=0x00;g=0xFF;b=0xFF;break;
				case 'darkblue':r=0x00;g=0x00;b=0x8B;break;
				case 'darkcyan':r=0x00;g=0x8B;b=0x8B;break;
				case 'darkgoldenrod':r=0xB8;g=0x86;b=0x0B;break;
				case 'darkgray':r=0xA9;g=0xA9;b=0xA9;break;
				case 'darkgrey':r=0xA9;g=0xA9;b=0xA9;break;
				case 'darkgreen':r=0x00;g=0x64;b=0x00;break;
				case 'darkkhaki':r=0xBD;g=0xB7;b=0x6B;break;
				case 'darkmagenta':r=0x8B;g=0x00;b=0x8B;break;
				case 'darkolivegreen':r=0x55;g=0x6B;b=0x2F;break;
				case 'darkorange':r=0xFF;g=0x8C;b=0x00;break;
				case 'darkorchid':r=0x99;g=0x32;b=0xCC;break;
				case 'darkred':r=0x8B;g=0x00;b=0x00;break;
				case 'darksalmon':r=0xE9;g=0x96;b=0x7A;break;
				case 'darkseagreen':r=0x8F;g=0xBC;b=0x8F;break;
				case 'darkslateblue':r=0x48;g=0x3D;b=0x8B;break;
				case 'darkslategray':r=0x2F;g=0x4F;b=0x4F;break;
				case 'darkslategrey':r=0x2F;g=0x4F;b=0x4F;break;
				case 'darkturquoise':r=0x00;g=0xCE;b=0xD1;break;
				case 'darkviolet':r=0x94;g=0x00;b=0xD3;break;
				case 'deeppink':r=0xFF;g=0x14;b=0x93;break;
				case 'deepskyblue':r=0x00;g=0xBF;b=0xFF;break;
				case 'dimgray':r=0x69;g=0x69;b=0x69;break;
				case 'dimgrey':r=0x69;g=0x69;b=0x69;break;
				case 'dodgerblue':r=0x1E;g=0x90;b=0xFF;break;
				case 'firebrick':r=0xB2;g=0x22;b=0x22;break;
				case 'floralwhite':r=0xFF;g=0xFA;b=0xF0;break;
				case 'forestgreen':r=0x22;g=0x8B;b=0x22;break;
				case 'fuchsia':r=0xFF;g=0x00;b=0xFF;break;
				case 'gainsboro':r=0xDC;g=0xDC;b=0xDC;break;
				case 'ghostwhite':r=0xF8;g=0xF8;b=0xFF;break;
				case 'gold':r=0xFF;g=0xD7;b=0x00;break;
				case 'goldenrod':r=0xDA;g=0xA5;b=0x20;break;
				case 'gray':r=0x80;g=0x80;b=0x80;break;
				case 'grey':r=0x80;g=0x80;b=0x80;break;
				case 'green':r=0x00;g=0x80;b=0x00;break;
				case 'greenyellow':r=0xAD;g=0xFF;b=0x2F;break;
				case 'honeydew':r=0xF0;g=0xFF;b=0xF0;break;
				case 'hotpink':r=0xFF;g=0x69;b=0xB4;break;
				case 'indianred':r=0xCD;g=0x5C;b=0x5C;break;
				case 'indigo':r=0x4B;g=0x00;b=0x82;break;
				case 'ivory':r=0xFF;g=0xFF;b=0xF0;break;
				case 'khaki':r=0xF0;g=0xE6;b=0x8C;break;
				case 'lavender':r=0xE6;g=0xE6;b=0xFA;break;
				case 'lavenderblush':r=0xFF;g=0xF0;b=0xF5;break;
				case 'lawngreen':r=0x7C;g=0xFC;b=0x00;break;
				case 'lemonchiffon':r=0xFF;g=0xFA;b=0xCD;break;
				case 'lightblue':r=0xAD;g=0xD8;b=0xE6;break;
				case 'lightcoral':r=0xF0;g=0x80;b=0x80;break;
				case 'lightcyan':r=0xE0;g=0xFF;b=0xFF;break;
				case 'lightgoldenrodyellow':r=0xFA;g=0xFA;b=0xD2;break;
				case 'lightgray':r=0xD3;g=0xD3;b=0xD3;break;
				case 'lightgrey':r=0xD3;g=0xD3;b=0xD3;break;
				case 'lightgreen':r=0x90;g=0xEE;b=0x90;break;
				case 'lightpink':r=0xFF;g=0xB6;b=0xC1;break;
				case 'lightsalmon':r=0xFF;g=0xA0;b=0x7A;break;
				case 'lightseagreen':r=0x20;g=0xB2;b=0xAA;break;
				case 'lightskyblue':r=0x87;g=0xCE;b=0xFA;break;
				case 'lightslategray':r=0x77;g=0x88;b=0x99;break;
				case 'lightslategrey':r=0x77;g=0x88;b=0x99;break;
				case 'lightsteelblue':r=0xB0;g=0xC4;b=0xDE;break;
				case 'lightyellow':r=0xFF;g=0xFF;b=0xE0;break;
				case 'lime':r=0x00;g=0xFF;b=0x00;break;
				case 'limegreen':r=0x32;g=0xCD;b=0x32;break;
				case 'linen':r=0xFA;g=0xF0;b=0xE6;break;
				case 'magenta':r=0xFF;g=0x00;b=0xFF;break;
				case 'maroon':r=0x80;g=0x00;b=0x00;break;
				case 'mediumaquamarine':r=0x66;g=0xCD;b=0xAA;break;
				case 'mediumblue':r=0x00;g=0x00;b=0xCD;break;
				case 'mediumorchid':r=0xBA;g=0x55;b=0xD3;break;
				case 'mediumpurple':r=0x93;g=0x70;b=0xDB;break;
				case 'mediumseagreen':r=0x3C;g=0xB3;b=0x71;break;
				case 'mediumslateblue':r=0x7B;g=0x68;b=0xEE;break;
				case 'mediumspringgreen':r=0x00;g=0xFA;b=0x9A;break;
				case 'mediumturquoise':r=0x48;g=0xD1;b=0xCC;break;
				case 'mediumvioletred':r=0xC7;g=0x15;b=0x85;break;
				case 'midnightblue':r=0x19;g=0x19;b=0x70;break;
				case 'mintcream':r=0xF5;g=0xFF;b=0xFA;break;
				case 'mistyrose':r=0xFF;g=0xE4;b=0xE1;break;
				case 'moccasin':r=0xFF;g=0xE4;b=0xB5;break;
				case 'navajowhite':r=0xFF;g=0xDE;b=0xAD;break;
				case 'navy':r=0x00;g=0x00;b=0x80;break;
				case 'oldlace':r=0xFD;g=0xF5;b=0xE6;break;
				case 'olive':r=0x80;g=0x80;b=0x00;break;
				case 'olivedrab':r=0x6B;g=0x8E;b=0x23;break;
				case 'orange':r=0xFF;g=0xA5;b=0x00;break;
				case 'orangered':r=0xFF;g=0x45;b=0x00;break;
				case 'orchid':r=0xDA;g=0x70;b=0xD6;break;
				case 'palegoldenrod':r=0xEE;g=0xE8;b=0xAA;break;
				case 'palegreen':r=0x98;g=0xFB;b=0x98;break;
				case 'paleturquoise':r=0xAF;g=0xEE;b=0xEE;break;
				case 'palevioletred':r=0xDB;g=0x70;b=0x93;break;
				case 'papayawhip':r=0xFF;g=0xEF;b=0xD5;break;
				case 'peachpuff':r=0xFF;g=0xDA;b=0xB9;break;
				case 'peru':r=0xCD;g=0x85;b=0x3F;break;
				case 'pink':r=0xFF;g=0xC0;b=0xCB;break;
				case 'plum':r=0xDD;g=0xA0;b=0xDD;break;
				case 'powderblue':r=0xB0;g=0xE0;b=0xE6;break;
				case 'purple':r=0x80;g=0x00;b=0x80;break;
				case 'rebeccapurple':r=0x66;g=0x33;b=0x99;break;
				case 'red':r=0xFF;g=0x00;b=0x00;break;
				case 'rosybrown':r=0xBC;g=0x8F;b=0x8F;break;
				case 'royalblue':r=0x41;g=0x69;b=0xE1;break;
				case 'saddlebrown':r=0x8B;g=0x45;b=0x13;break;
				case 'salmon':r=0xFA;g=0x80;b=0x72;break;
				case 'sandybrown':r=0xF4;g=0xA4;b=0x60;break;
				case 'seagreen':r=0x2E;g=0x8B;b=0x57;break;
				case 'seashell':r=0xFF;g=0xF5;b=0xEE;break;
				case 'sienna':r=0xA0;g=0x52;b=0x2D;break;
				case 'silver':r=0xC0;g=0xC0;b=0xC0;break;
				case 'skyblue':r=0x87;g=0xCE;b=0xEB;break;
				case 'slateblue':r=0x6A;g=0x5A;b=0xCD;break;
				case 'slategray':r=0x70;g=0x80;b=0x90;break;
				case 'slategrey':r=0x70;g=0x80;b=0x90;break;
				case 'snow':r=0xFF;g=0xFA;b=0xFA;break;
				case 'springgreen':r=0x00;g=0xFF;b=0x7F;break;
				case 'steelblue':r=0x46;g=0x82;b=0xB4;break;
				case 'tan':r=0xD2;g=0xB4;b=0x8C;break;
				case 'teal':r=0x00;g=0x80;b=0x80;break;
				case 'thistle':r=0xD8;g=0xBF;b=0xD8;break;
				case 'tomato':r=0xFF;g=0x63;b=0x47;break;
				case 'turquoise':r=0x40;g=0xE0;b=0xD0;break;
				case 'violet':r=0xEE;g=0x82;b=0xEE;break;
				case 'wheat':r=0xF5;g=0xDE;b=0xB3;break;
				case 'white':r=0xFF;g=0xFF;b=0xFF;break;
				case 'whitesmoke':r=0xF5;g=0xF5;b=0xF5;break;
				case 'yellow':r=0xFF;g=0xFF;b=0x00;break;
				case 'yellowgreen':r=0x9A;g=0xCD;b=0x32;break;
			}
			this.r = r;
			this.g = g;
			this.b = b;
		}
	}
	else if(value.length == 3 || value.length == 4){
		this.r = value[0];
		this.g = value[1];
		this.b = value[2];
		if(value.length == 4){
			this.a = value[3];
		}
	}
	
}

dotcss._Color.prototype.toString = function(){
	var R = Math.round;
	var X = Math.max;
	var N = Math.min;
	if(this.a == 1)
		return "rgb(" + N(255, X(0, R(this.r))) + ", " + N(255, X(0, R(this.g))) + ", " + N(255, X(0, R(this.b))) + ")";
	else
		return "rgba(" + N(255, X(0, R(this.r))) + ", " + N(255, X(0, R(this.g))) + ", " + N(255, X(0, R(this.b))) + ", " + N(1, X(0, this.a)) + ")";
}

//TODO: this should support multiple lengths.
dotcss._Length = function(value){
	value = value || "0px";
	if(!isNaN(value)) value = Math.round(value) + "px";
	this.type = "length";
	this.length = Number(value.match(dotcss._floatRegex)[0]);
	this.units = value.split(dotcss._floatRegex)[1] || "px";
}

dotcss._Length.prototype.toString = function(){
	return this.length + this.units;
}

dotcss._Angle = function(value){
	value = value || "0deg";
	if(!isNaN(value)) value = Math.round(value) + "px";
	this.type = "angle";
	this.angle = Number(value.match(dotcss._floatRegex)[0]);
	this.units = value.split(dotcss._floatRegex)[1] || "deg";
}

dotcss._Angle.prototype.toString = function(){
	return this.angle + this.units;
}

dotcss._Transform = function(value){
	this.type = "transformation";
	this.transformations = [];
	//this.finalMatrix = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
	if(value == "" || value == "none" || value == "initial" || value == "inherit" || ("" + value).indexOf("(") == -1){
		//this.value = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
		return;
	}
	//var ret = {value: value, type: cssDataType};
	var transformations = value.split(/\)\s*/); transformations.pop(); for(var i = 0; i < transformations.length; i++) transformations[i] += ")";
	var cos = Math.cos; var sin = Math.sin; var tan = Math.tan;
	for(var t = 0; t < transformations.length; t++){
		var trans = transformations[t].trim();
		var parts = trans.split(/[\(\)]/);
		var func = parts[0]
		var p = parts[1].split(/\s*,\s*/)
	
		if(this[func]){
			this[func].apply(this, p);
		}
	}
}

dotcss._Transform.prototype.toString = function(){
	var ret = "";
	for(var i = 0; i < this.transformations.length; i++){
		var t = this.transformations[i];
		ret += t.transformation + "(";
		for(var k = 0; k < t.args.length; k++){
			ret += t.args[k] + ",";
		}
		ret = ret.substring(0, ret.length - 1);
		ret += ") ";
	}
	return ret.trim();
}

dotcss._Transform.prototype._updateValue = function(transformation, args){
	//this.finalMatrix = dotcss.matrixMultiply3D(m, this.finalMatrix);
	this.transformations.push({transformation: transformation, args: args});
	/*if(this.value.length > 0) this.value += " ";
	this.value += transformation + "(";
	for(var i = 0; i < args.length; i++){
		this.value += args[i] + (i == args.length -1 ? "" : ",")
	}*/
}

dotcss._Transform.prototype.matrix3d = function(){
	var p = arguments;
	if(p.length == 16){
		this.finalMatrix = dotcss.matrixMultiply3D(p, this.finalMatrix);
		this._updateValue("matrix3d", args);
	}
	else throw "matrix3d requires 16 parameters.";
	return this;
}

dotcss._Transform.prototype.matrix = function(){
	var p = arguments;
	if(p.length == 6){
		this._updateValue("matrix", p/*, [p[0], p[1], 0, 0, p[2], p[3], 0, 0, 0, 0, 1, 0, p[4], p[5], 0, 1]*/);
	}
	else if(p.length == 16){
		this.matrix3d.apply(this, p);
	}
	else throw "matrix requires 6 parameters.";
	return this;
}

dotcss._Transform.prototype.translate = function(){
	var p = arguments;
	if(p.length == 1){
		var x = dotcss.lengthToPx(p[0]);
		this._updateValue("translate", [new dotcss._Length(x + "px")]/*, [1,0,0,0,0,1,0,0,0,0,1,0,x,0,0,1]*/);
	}
	else if(p.length == 2){
		var x = dotcss.lengthToPx(p[0]);
		var y = dotcss.lengthToPx(p[1]);
		this._updateValue("translate", [new dotcss._Length(x + "px"), new dotcss._Length(y + "px")]/*, [1,0,0,0,0,1,0,0,0,0,1,0,x,y,0,1]*/);
	}
	else if(p.length == 3) this.translate3d.apply(this, p);
	else throw "translate requires 1 or 2 parameters.";
	return this;
}

dotcss._Transform.prototype.translate3d = function(){
	var p = arguments;
	if(p.length == 3){
		var x = dotcss.lengthToPx(p[0]);
		var y = dotcss.lengthToPx(p[1]);
		var z = dotcss.lengthToPx(p[2]);
		this._updateValue("translate3d", [new dotcss._Length(x + "px"), new dotcss._Length(y + "px"), new dotcss._Length(z + "px")]/*, [1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]*/);
	}
	else throw "translate3d requires 3 parameters.";
	return this;
}

dotcss._Transform.prototype.translateX = function(){
	var p = arguments;
	if(p.length == 1){
		//var x = dotcss.lengthToPx(p[0]);
		//this._updateValue("translateX", [new dotcss._Length(x + "px")]/*, [1,0,0,0,0,1,0,0,0,0,1,0,x,0,0,1]*/);
		this.translate(p[0], 0);
	}
	else throw "translateX requires 1 parameter.";
	return this;
}

dotcss._Transform.prototype.translateY = function(){
	var p = arguments;
	if(p.length == 1){
		//var y = dotcss.lengthToPx(p[0]);
		//this._updateValue("translateY", [new dotcss._Length(y + "px")]/*, [1,0,0,0,0,1,0,0,0,0,1,0,0,y,0,1]*/);
		this.translate(0, p[0]);
	}
	else throw "translateY requires 1 parameter.";
	return this;
}

dotcss._Transform.prototype.translateZ = function(){
	var p = arguments;
	if(p.length == 1){
		//var z = dotcss.lengthToPx(p[0]);
		//this._updateValue("translateZ", [new dotcss._Length(z + "px")]/*, [1,0,0,0,0,1,0,0,0,0,1,0,0,0,z,1]*/);
		this.translate3d(0, 0, p[0]);
	}
	else throw "translateZ requires 1 parameter.";
	return this;
}

dotcss._Transform.prototype.scale = function(){
	var p = arguments;
	if(p.length == 2){
		this._updateValue("scale", p/*, [p[0],0,0,0,0,p[1],0,0,0,0,1,0,0,0,0,1]*/);
	}
	else if(p.length == 3) this.scale3d.apply(this, p)
	else throw "scale requires 2 parameters.";
	return this;
}

dotcss._Transform.prototype.scale3d = function(){
	var p = arguments;
	if(p.length == 3){
		this._updateValue("scale3d", p/*, [p[0],0,0,0,0,p[1],0,0,0,0,p[2],0,0,0,0,1]*/);
	}
	else throw "scale3d requires 3 parameters.";
	return this;
}

dotcss._Transform.prototype.scaleX = function(){
	var p = arguments;
	if(p.length == 1){
		//this._updateValue("scaleX", p/*, [p[0],0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]*/);
		this.scale(p[0],1);
	}
	else throw "scaleX requires 1 parameter.";
	return this;
}

dotcss._Transform.prototype.scaleY = function(){
	var p = arguments;
	if(p.length == 1){
		//this._updateValue("scaleY", p/*, [1,0,0,0,0,p[0],0,0,0,0,1,0,0,0,0,1]*/);
		this.scale(1,p[0]);
	}
	else throw "scaleY requires 1 parameter.";
	return this;
}

dotcss._Transform.prototype.scaleZ = function(){
	var p = arguments;
	if(p.length == 1){
		//this._updateValue("scaleZ", p/*, [1,0,0,0,0,1,0,0,0,0,p[0],0,0,0,0,1]*/);
		this.scale3d(1,1,p[0]);
	}
	else throw "scaleZ requires 1 parameter.";
	return this;
}

dotcss._Transform.prototype.rotate = function(){
	var p = arguments;
	if(p.length == 1){
		var a = dotcss.angleToDeg(p[0]);
		this._updateValue("rotate", [new dotcss._Angle(a + "deg")]/*, [Math.cos(a),Math.sin(a),0,0,-Math.sin(axxx),Math.cos(axxx),0,0,0,0,1,0,0,0,0,1]*/);
	}
	else throw "scaleZ requires 1 parameter.";
	return this;
}

dotcss._Transform.prototype.rotate3d = function(){
	var p = arguments;
	if(p.length == 4){
		var x = p[0];
		var y = p[1];
		var z = p[2];
		var a = dotcss.angleToDeg(p[3]);
		/*var C = 1 - cos(axx);
		var S = sin(axx);*/
		this._updateValue("rotate3d", [x, y, z, new dotcss._Angle(a + "deg")]/*, 
			[1+C*(x*x-1),	z*S+x*y*C,		-y*S+x*z*C,		0,
			-z*S+x*y*C,		1+C*(y*y-1),	x*S+y*z*C,		0,
			y*S+x*z*C,		-x*S+y*z*C,		1+C*(z*z-1),	0,
			0,				0,				0,				1]*/
		);
	}
	else throw "rotate3d requires 4 parameters.";
	return this;
}

dotcss._Transform.prototype.rotateX = function(){
	var p = arguments;
	if(p.length == 1){
		var a = dotcss.angleToDeg(p[0]);
		this._updateValue("rotateX", [new dotcss._Angle(a + "deg")]/*, [1,0,0,0,0,Math.cos(axx),Math.sin(axx),0,0,-Math.sin(axx),Math.cos(axx),0,0,0,0,1]*/);
		//this.rotate3d(1, 0, 0, p[0]);
	}
	else throw "rotateX requires 1 parameter.";
	return this;
}

dotcss._Transform.prototype.rotateY = function(){
	var p = arguments;
	if(p.length == 1){
		//this might be faster:
		var a = dotcss.angleToDeg(p[0]);
		this._updateValue("rotateY", [new dotcss._Angle(a + "deg")]/*, [Math.cos(xxa),0,-Math.sin(axxx),0,0,1,0,0,Math.sin(xxx),0,Math.cos(xxx),0,0,0,0,1]*/);
		//this.rotate3d(0, 1, 0, p[0]);
	}
	else throw "rotateY requires 1 parameter.";
	return this;
}

dotcss._Transform.prototype.rotateZ = function(){
	this.rotate.apply(this, arguments);
	return this;
}

dotcss._Transform.prototype.skew = function(){
	var p = arguments;
	if(p.length == 1){
		var ax = dotcss.angleToDeg(p[0]);
		this._updateValue("skew", [new dotcss._Angle(ax + "deg")]/*, [1,0,0,0,Math.tan(axxxxx),1,0,0,0,0,1,0,0,0,0,1]*/);
	}
	else if(p.length == 2){
		var ax = dotcss.angleToDeg(p[0]);
		var ay = dotcss.angleToDeg(p[1]);
		this._updateValue("skew", [new dotcss._Angle(ax + "deg"), new dotcss._Angle(ay + "deg")]/*, [1,Math.tan(axxxy),0,0,Math.tan(axxxx),1,0,0,0,0,1,0,0,0,0,1]*/);
	}
	else throw "skew requires 1 or 2 parameters.";
	return this;
}

dotcss._Transform.prototype.skewX = function(){
	var p = arguments;
	if(p.length == 1) this.skew.apply(this, p) //Makes things easier.
	else throw "skewX requires 1 parameter.";
	return this;
}

dotcss._Transform.prototype.skewY = function(){
	var p = arguments;
	if(p.length == 1) this.skew.apply(this, [0, p[0]]) //Makes things easier.
	else throw "skewY requires 1 parameter.";
	return this;
}

dotcss._Transform.prototype.perspective = function(){
	var p = arguments;
	if(p.length == 1){
		var d =  dotcss.lengthToPx(p[0]);
		this._updateValue("perspective", [new dotcss._Length(d + "px")]/*, [1,0,0,0,0,1,0,0,0,0,1,0,0,0,dotcss.formatNumberValue(-1 / d),1]*/);
	}
	else throw "perspective requires 1 parameter.";
	return this;
}

dotcss._Complex = function(value){
	this.type = "complex";
	this.parts = (" " + value + " ").split(dotcss._floatRegex);
	this.numbers = value.match(dotcss._floatRegex);
}

dotcss._Complex.prototype.toString = function(){
	var ret = this.parts[0];
	for(var i = 0; i < this.numbers.length; i++){
		ret += this.numbers[i] + this.parts[i+1];
	}
	return ret;
}

dotcss._Number = function(value){
	this.type = "number";
	this.value = Number(value);
}

dotcss._Number.prototype.toString = function(){
	return this.value;
}

dotcss._Unknown = function(value){
	this.type = "unknown";
	this.value = value;
}

dotcss._Unknown.prototype.toString = function(){
	return this.value;
}

function _StyleProperty(){
	this.type = null;
	this.jsFriendlyProp = null;
};

//toString override gets the value.
_StyleProperty.prototype.toString = function(){
	if(dotcss._lastBuilder.target){
		var ret = null;
		if(dotcss._lastBuilder.target.length > 1){
			ret = [];
			for(var i = 0; i < dotcss._lastBuilder.target.length; i++){
				ret.push(dotcss._lastBuilder.target[i].style[this.jsFriendlyProp]);
			}
		}
		else ret = dotcss._lastBuilder.target[0].style[this.jsFriendlyProp];
		return ret;
	}
	else return null;
};

//val is another special function that breaks the value into a special object.
_StyleProperty.prototype.val = function(){
	if(dotcss._lastBuilder.target){
		var ret = null;
		if(dotcss._lastBuilder.target.length > 1){
			ret = null;
			for(var i = 0; i < dotcss._lastBuilder.target.length; i++){
				if(dotcss._lastBuilder.target[0].style[this.jsFriendlyProp]){
					ret.push(dotcss._convertStyleIntoDotCssObject(dotcss._lastBuilder.target[i].style[this.jsFriendlyProp], this.type));
				}
				else ret.push(null);
			}
		}
		else{
			if(dotcss._lastBuilder.target[0].style[this.jsFriendlyProp]){
				ret = dotcss._convertStyleIntoDotCssObject(dotcss._lastBuilder.target[0].style[this.jsFriendlyProp], this.type)
			}
			else ret = null;
		}
		return ret;
	}
	else return null;
};

//Ability to animate just like jquery.
//complete does not get called if the animation was cancelled.
_StyleProperty.prototype.animate = function(value, duration, style, complete){
	duration = isNaN(duration) ? 400 : (duration || 0);
	if(dotcss._lastBuilder && dotcss._lastBuilder.target){
		if(!complete && style && style.call && style.apply){ //Fix params.
			complete = style;
			style = undefined;
		}
		for(var i = 0; i < dotcss._lastBuilder.target.length; i++){
			var target = dotcss._lastBuilder.target[i];
			var oldValue = null;
			var newValue = null;
			var finalValue = null; //newValue might be in different units from the final value...

			//Get the old and new values.
			newValue = dotcss._convertStyleIntoDotCssObject(value, this.type);

			//If it's a transformation, a little extra work is required.
			//Need to frame all the rotations properly, and combine both the new and the old transformations.
			if(this.type == "transformation"){
				//Special handling. We'd like to consider the transformation as a complex data type first, then if that's not possible, convert it into a matrix data type.
				//Reason being: linear transformations on matrices are inaccurate. Rotations end up scaling the target.
				//Don't want to get the computed value for transformations.
				oldValue = dotcss._convertStyleIntoDotCssObject(target.style[this.jsFriendlyProp], this.type);
			}
			if(!oldValue){ //Standard. Happens when the type is not a transformation.
				oldValue = dotcss._convertStyleIntoDotCssObject(dotcss._computedStyleOrActualStyle(target, this.jsFriendlyProp), this.type);
			}

			finalValue = newValue.toString();

			//Do a little type/unit checking.
			
			if(this.type == "length"){
				if(oldValue.units != newValue.units){
					//Need to rectify this.
					//This can get messy. If one of the lengths is zero, it would minimize the likelihood of an error.
					if(oldValue.length == 0){
						oldValue.units = newValue.units;
						oldValue.length = 0;
					}
					else if(newValue.length == 0){
						newValue.units = oldValue.units;
						newValue.length = 0;
					}
					else{
						//Things are messy. Try to mitigate. Convert the old value into the new units, as best we can.
						var currentLengthPx = dotcss.lengthToPx(oldValue.toString(), this.jsFriendlyProp, target);
						var newLengthPx = dotcss.lengthToPx(newValue.toString(), this.jsFriendlyProp, target);
						oldValue.length = currentLengthPx;
						oldValue.units = "px";
						newValue.length = newLengthPx;
						newValue.units = "px";

						//Won't need this anymore.
						//console.warn("Couldn't animate " + this.jsFriendlyProp + ". Inconsistent units.");
						//return dotcss._lastBuilder;
					}
				}
			}
			else if(this.type == "color"){} //OK
			else if(this.type == "transformation"){
				//Couple things to do here.
				//1. The old and new values must contain the exact same transformation template.
				//2. Angles in the old transformation should be reframed so that they are close to the new angles (or should they)

				var startTransform = "";
				var desiredTransform = "";
				var oldIndex = oldValue.transformations.length - 1;
				var newIndex = newValue.transformations.length - 1;
				while(oldIndex >= 0 || newIndex >= 0){
					var transformToAdd = "";
					var oldTransformValues = null;
					var newTransformValues = null;
					if(oldIndex >= 0 && newIndex >= 0 && oldValue.transformations[oldIndex].transformation == newValue.transformations[newIndex].transformation){
						var currentOldT = oldValue.transformations[oldIndex];
						var currentNewT = newValue.transformations[newIndex];
						
						transformToAdd = currentOldT.transformation;
						oldTransformValues = currentOldT.args;
						newTransformValues = currentNewT.args;

						oldIndex--;
						newIndex--;
					}
					else if(oldIndex >= newIndex){
						var currentOldT = oldValue.transformations[oldIndex];
						transformToAdd = currentOldT.transformation;
						oldTransformValues = currentOldT.args;
						if(transformToAdd == "matrix"){
							newTransformValues = [1,0, 0,1, 0,0];
						}
						else if(transformToAdd == "matrix3d"){
							newTransformValues = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
						}
						else {
							var filler = (transformToAdd.indexOf("scale") == -1) ? 0 : 1;
							newTransformValues = [];
							for(var j = 0; j < oldTransformValues.length; j++) newTransformValues.push(!isNaN(oldTransformValues[j]) ? filler : (
								!isNaN(oldTransformValues[j].angle) ? new dotcss._Angle(0) : (
									!isNaN(oldTransformValues[j].length) ? new dotcss._Length(0) : (0)
								)));
						}
						oldIndex--;
					}
					else{
						var currentNewT = newValue.transformations[newIndex];
						transformToAdd = currentNewT.transformation;
						newTransformValues = currentNewT.args;
						if(transformToAdd == "matrix"){
							oldTransformValues = [1,0, 0,1, 0,0];
						}
						else if(transformToAdd == "matrix3d"){
							oldTransformValues = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
						}
						else {
							var filler = (transformToAdd.indexOf("scale") == -1) ? 0 : 1;
							oldTransformValues = [];
							for(var j = 0; j < newTransformValues.length; j++) oldTransformValues.push(!isNaN(newTransformValues[j]) ? filler : (
								!isNaN(newTransformValues[j].angle) ? new dotcss._Angle(0) : (
									!isNaN(newTransformValues[j].length) ? new dotcss._Length(0) : (0)
								)));
						}
						newIndex--;
					}

					startTransform = ") " + startTransform;
					desiredTransform = ") " + desiredTransform;
					//Handle special values here.
					if(transformToAdd.indexOf("rotate") != -1){
						var oldAngle = oldTransformValues[oldTransformValues.length - 1].angle;
						var newAngle = newTransformValues[newTransformValues.length - 1].angle;
						var sep = dotcss.angleSubtract(newAngle, oldAngle);
						oldTransformValues[oldTransformValues.length - 1].angle = newAngle - sep;
					}
					for(var j = oldTransformValues.length - 1; j >= 0; j--){
						startTransform = "," + oldTransformValues[i] + startTransform;
						desiredTransform = "," + newTransformValues[i] + desiredTransform;
					}
					startTransform = transformToAdd + "(" + startTransform.substring(1);
					desiredTransform = transformToAdd + "(" + desiredTransform.substring(1);
				}
				oldValue = dotcss._convertStyleIntoDotCssObject(startTransform, "transformation");
				newValue = dotcss._convertStyleIntoDotCssObject(desiredTransform, "transformation");

			}
			else if(oldValue.type == "number" && newValue.type == "number"){} //OK
			else if(oldValue.type == "complex" && newValue.type == "complex"){
				if(!dotcss._compareComplexDataTypes(oldValue, newValue)){
					console.warn("Couldn't animate " + this.jsFriendlyProp + ". Value mismatch.");
					continue;
				}
			}
			else{
				console.warn("Couldn't animate " + this.jsFriendlyProp + ". Not a recognizable length, color, or number.");
				continue;
			}
			dotcss._animate(target, this.jsFriendlyProp, oldValue.type || this.type, oldValue, newValue, finalValue, dotcss._fxInterval, duration, style || "ease", complete);
		}
	}
	return dotcss._lastBuilder;
};

//Have to add these back since we're going to replace the __proto__ of a function with this new prototype.
_StyleProperty.prototype.apply = Function.apply;
_StyleProperty.prototype.call = Function.call;

dotcss._animate = function(element, jsFriendlyProp, propType, startValue, targetValue, finalValue, currentTime, totalDuration, animationStyle, callback, lastValue){
	if(lastValue && element.style[jsFriendlyProp] != lastValue) return; //Animation can be cancelled any time by setting the value directly.

	if(totalDuration - currentTime > 0){
		switch(propType){
			case "color":
				var r = Math.round(dotcss._numberStep(startValue.r, targetValue.r, currentTime, totalDuration, animationStyle));
				var g = Math.round(dotcss._numberStep(startValue.g, targetValue.g, currentTime, totalDuration, animationStyle ));
				var b = Math.round(dotcss._numberStep(startValue.b, targetValue.b, currentTime, totalDuration, animationStyle ));
				var a = dotcss.formatNumberValue(dotcss._numberStep(startValue.a, targetValue.a, currentTime, totalDuration, animationStyle )); //TODO: make sure this doesn't need to be rounded or something.
				dotcss(element)[jsFriendlyProp](r, g, b, a);
				break;
			case "length":
				dotcss(element)[jsFriendlyProp](dotcss.formatNumberValue(dotcss._numberStep(startValue.length, targetValue.length, currentTime, totalDuration, animationStyle), startValue.units) + startValue.units);
				break;
			case "transformation":
				var newTransform = "";
				//startValue and targetValue are guaranteed to have the same template.
				for(var i = 0; i < startValue.transformations.length; i++){
					var t1 = startValue.transformations[i];
					var t2 = targetValue.transformations[i];
					newTransform += t1.transformation + "(";
					for(var k = 0; k < t1.args.length; k++){
						var v1 = t1.args[k];
						var v2 = t2.args[k];
						var actualV1 = isNaN(v1) ? v1.length || v1.angle || v1.value || 0 : v1;
						var actualV2 = isNaN(v2) ? v2.length || v2.angle || v2.value || 0 : v2;
						var units = isNaN(v1) ? v1.units : "";
						newTransform += dotcss.formatNumberValue(dotcss._numberStep(actualV1, actualV2, currentTime, totalDuration, animationStyle), units) + units + ",";
					}
					newTransform = newTransform.substring(0, newTransform.length - 1);
					newTransform += ") ";
				}
				dotcss(element)[jsFriendlyProp](newTransform);
				break;
			default:
				switch(startValue.type){
					case "number":
						dotcss(element)[jsFriendlyProp](dotcss.formatNumberValue(dotcss._numberStep(startValue.value, targetValue.value, currentTime, totalDuration, animationStyle)));
						break;
					case "complex":
						var newVal = "";
						for(var i = 0; i < startValue.numbers.length; i++){
							newVal += startValue.parts[i];
							newVal += dotcss.formatNumberValue(dotcss._numberStep(startValue.numbers[i], targetValue.numbers[i], currentTime, totalDuration, animationStyle))
						}
						newVal += startValue.parts[startValue.parts.length - 1];
						
						dotcss(element)[jsFriendlyProp](newVal);
						break;
					default:
						console.warn("Unexpected data type for animation.");
				}
		}

		var now = (window.performance && window.performance.now) ? window.performance.now() : null;
		//var reachedAnimFrame = false;
		//TODO: there could be a memory leak here. Need to investigate.
		//Because we're creating a lot of new functions. Are they being released?
		var last = element.style[jsFriendlyProp];
		var nextStep = function(timestamp){
			var change = (now ? (window.performance.now() - now) : dotcss._fxInterval);
			dotcss._animate(element, jsFriendlyProp, propType, startValue, targetValue, finalValue, currentTime + change, totalDuration, animationStyle, callback, last);
		}
		if(window.requestAnimationFrame) {
			window.requestAnimationFrame(nextStep);
			//setTimeout(function(){if(!reachedAnimFrame) console.log("ERROR");}, 100);
		}
		else window.setTimeout(nextStep, dotcss._fxInterval);
	}
	else{
		//TODO: verify that decimal values are properly handled here.
		dotcss(element)[jsFriendlyProp](finalValue);
		if(callback) callback();
	}
};

//Function that takes in a bunch of parameters and steps the start value toward the target based on timeRemaining and style.
//currentValue is the current value.
//targetValue is the target valaue.
//timeRemaining is the time remaining in ms.
//stepProgress is the size of this step.
//totalDuration is the duration of the entire animation from start to finish (not just this step).
//style is the type of transition (geometric=exponential, ease, linear).
//Returns the result.
dotcss._numberStep = function(startValue, targetValue, currentTime, totalDuration, style){
	
	startValue = Number(startValue);
	targetValue = Number(targetValue);

	var timeRemaining  = totalDuration - currentTime;

	switch(style){
		case "geometric":
		case "exponential"://This is kind of stupid now that we have ease. I might come back and add it in the future. For now assume ease.
		//	var m = Math.exp(-1 / timeRemaining);
		//	return  targetValue + m * (startValue - targetValue);
		case "ease":
			var m = (-Math.cos(Math.PI * (currentTime / totalDuration)) + 1) * 0.5;
			return  startValue + m * (targetValue - startValue);
		case "linear":
		default:
			return startValue + (targetValue - startValue) * (currentTime / totalDuration);
	}
};

dotcss.formatNumberValue = function(value, unit){
	switch(unit){
		case "px": return Math.round(value);
		default: return Math.round(value * 100) / 100;
	}
};

var _allProps = {
	color: "color|background-Color|border-Bottom-Color|border-Color|border-Left-Color|border-Right-Color|border-Top-Color|text-Decoration-Color|outline-Color|column-Rule-Color",
	length: "background-Size|border-Bottom-Left-Radius|border-Bottom-Right-Radius|border-Bottom-Width|border-Image-Width|border-Left-Width|border-Radius|border-Right-Width|border-Top-Left-Radius|border-Top-Right-Radius|border-Top-Width|border-Width|bottom|height|left|margin|margin-Bottom|margin-Left|margin-Right|margin-Top|max-Height|max-Width|min-Height|min-Width|padding|padding-Bottom|padding-Left|padding-Right|padding-Top|right|top|width|line-Height|font-Size",
	url: "background-Image|border-Image|list-Style-Image|content|image-Orientation",
	transformation: "transformation",
	misc: "opacity|background|background-Attachment|background-Blend-Mode|background-Position|background-Repeat|background-Clip|background-Origin|border|border-Bottom|border-Bottom-Style|border-Image-Outset|border-Image-Repeat|border-Image-Slice|border-Image-Source|border-Left|border-Left-Style|border-Right|border-Right-Style|border-Style|border-Top|border-Top-Style|box-Decoration-Break|box-Shadow|clear|clip|display|float|overflow|box|overflow-X|overflow-Y|position|visibility|vertical-Align|z-Index|align-Content|align-Items|align-Self|flex|flex-Basis|flex-Direction|flex-Flow|flex-Grow|flex-Shrink|flex-Wrap|grid|grid-Area|grid-Auto-Columns|grid-auto-Rows|grid-Column|grid-Column-End|grid-Column-Gap|grid-Column-Start|grid-Gap|grid-Row|grid-Row-End|grid-Row-Gap|grid-Row-Start|grid-Template|grid-Template-Areas|grid-Template-Columns|grid-Template-Rows|justify-Content|order|hanging-Punctuation|hyphens|letter-Spacing|line-Break|overflow-Wrap|tab-Size|text-Align|text-Align-Last|text-Combine-Upright|text-Indent|text-Justify|text-Transform|white-Space|word-Break|word-Spacing|word-Wrap|text-Decoration|text-Decoration-Line|text-Decoration-Style|text-Shadow|text-Underline-Position|font|font-Family|font-Feature-Settings|font-Kerning|font-Language-Override|font-Size-Adjust|font-Stretch|font-Style|font-Synthesis|font-Variant|font-Variant-Alternates|font-Variant-Caps|font-Variant-East-Asian|font-Variant-Ligatures|font-Variant-Numeric|font-Variant-Position|font-Weight|direction|text-Orientation|text-Combine-Upright|unicode-Bidi|user-Select|writing-Mode|border-Collapse|border-Spacing|caption-Side|empty-Cells|table-Layout|counter-Increment|counter-Reset|list-Style|list-Style-Position|list-Style-Type|animation|animation-Delay|animation-Direction|animation-Duration|animation-Fill-Mode|animation-Iteration-Count|animation-Name|animation-Play-State|animation-Timing-Function|backface-Visibility|perspective2d|perspective-Origin|transform-Origin|transform-Style|transition|transition-Property|transition-Duration|transition-Timing-Function|transition-Delay|box-Sizing|cursor|ime-Mode|nav-Down|nav-Index|nav-Left|nav-Right|nav-Up|outline|outline-Offset|outline-Style|outline-Width|resize|text-Overflow|break-After|break-Before|break-Inside|column-Count|column-Fill|column-Gap|column-Rule|column-Rule-Style|column-Rule-Width|column-Span|column-Width|columns|widows|orphans|page-Break-After|page-Break-Before|page-Break-Inside|marks|quotes|filter|image-Rendering|image-Resolution|object-Fit|object-Position|mask|mask-Type|mark|mark-After|mark-Before|phonemes|rest|rest-After|rest-Before|voice-Balance|voice-Duration|voice-Pitch|voice-Pitch-Range|voice-Rate|voice-Stress|voice-Volume|marquee-Direction|marquee-Play-Count|marquee-Speed|marquee-Style"
}

var _allLengthUnits = [
	{unit:"Em"},
	{unit:"Ex"},
	{unit:"Ch"},
	{unit:"Rem"},
	{unit:"Vw"},
	{unit:"Vh"},
	{unit:"Vmin"},
	{unit:"Vmax"},
	{unit:"%", jsName:"P"},
	{unit:"Cm"},
	{unit:"Mm"},
	{unit:"In"},
	{unit:"Px"},
	{unit:"Pt"},
	{unit:"Pc"}
];

var _allTransforms = [
	"matrix",
	"matrix3d",
	"translate",
	"translate3d",
	"translateX",
	"translateY",
	"translateZ",
	"scale",
	"scale3d",
	"scaleX",
	"scaleY",
	"scaleZ",
	"rotate",
	"rotate3d",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skew",
	"skewX",
	"skewY",
	"perspective"
]

dotcss.matrixMultiply3D = function(A, B){
	if(A.length != 16 || B.length != 16) throw "3D matrices must be arrays of 16 length.";
	var ret = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	for(var y = 0; y < 4; y++)
		for(var x = 0; x < 4; x++)
			for(var i = 0; i < 4; i++)
				ret[y + x * 4] += Number(A[y + i * 4]) * Number(B[i + x * 4]);
	return ret;
};
dotcss.angleToDeg = function(a){
	if(!isNaN(a)) return Number(a); //If there are no units, assume deg.
	a = a.trim();
	if(a.indexOf("deg") != -1) return dotcss.formatNumberValue(Number(a.split("deg")[0]));
	else if(a.indexOf("grad") != -1) return dotcss.formatNumberValue(Number(a.split("grad")[0]) * 0.9);
	else if(a.indexOf("rad") != -1) return dotcss.formatNumberValue(Number(a.split("rad")[0]) * 180 / Math.PI);
	else if(a.indexOf("turn") != -1) return dotcss.formatNumberValue(Number(a.split("turn")[0]) * 360);
	else throw a + " does not have valid units for an angle."
};
dotcss.lengthToPx = function(l, prop, element){
	var R = Math.round;
	var N = Number;
	if(!isNaN(l)) return R(N(l)); //If there are no units, assume px.
	l = l.trim();
	var S = l.split;
	//Absolute:
	if(l.indexOf("px") != -1) return R(N(l.split("px")[0]));
	else if(l.indexOf("in") != -1) return R(N(l.split("in")[0]) * 96);
	else if(l.indexOf("pt") != -1) return R(N(l.split("pt")[0]) * 96 / 72);
	else if(l.indexOf("pc") != -1) return R(N(l.split("pc")[0]) * 16);
	else if(l.indexOf("cm") != -1) return R(N(l.split("cm")[0]) * 96 / 2.54);
	else if(l.indexOf("mm") != -1) return R(N(l.split("mm")[0]) * 96 / 25.4);
	else if(l.indexOf("q") != -1) return R(N(l.split("q")[0]) * 96 / 101.6);
	//Technically relative:
	else if(l.indexOf("vw") != -1) return R(N(l.split("vw")[0]) * 0.01 * Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
	else if(l.indexOf("vh") != -1) return R(N(l.split("vh")[0]) * 0.01 * Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
	else if(l.indexOf("vmin") != -1) return Math.min(dotcss.lengthToPx(R(N(l.split("vmin")[0]))) + "vw", R(N(l.split("vmin")[0])) + "vx"); //I know this is slow, but it's compact, and it's not like this is a common unit.
	else if(l.indexOf("vmax") != -1) return Math.max(dotcss.lengthToPx(R(N(l.split("vmin")[0]))) + "vw", R(N(l.split("vmin")[0])) + "vx");
	else if(l.indexOf("rem") != -1) return R(N(l.split("rem")[0]) * dotcss.lengthToPx(dotcss._computedStyleOrActualStyle(document.body, "fontSize"))); //Couldn't get a stack overflow if it's a computed value. Always in px.

	//Absolutely relative:
	else if (prop && element) {
		//If we're setting things relative to font sizes, that's easy.
		//Can't animate ex or ch. Sorry.
		if(l.indexOf("em") != -1) return R(N(l.split("em")[0]) * dotcss.lengthToPx(dotcss._computedStyleOrActualStyle(element, "fontSize")));

		var ref = null;
		switch(prop){
			case "maxHeight":
			case "minHeight":
			case "top":
			case "bottom":
			case "height":
				if(!element.parentNode) throw "Cannot convert " + l + " " + prop + " to px for an element that has no parent."
				ref = dotcss.lengthToPx(dotcss._computedStyleOrActualStyle(element.parentNode, "height"));
				break;
			case "maxHidth":
			case "minWidth":
			case "right":
			case "left":
			case "width":
			case "margin": //Yes, all padding and margins are relative to width.
			case "marginTop":
			case "marginBottom":
			case "marginLeft":
			case "marginRight":
			case "padding":
			case "paddingTop":
			case "paddingBottom":
			case "paddingLeft":
			case "paddingRight":
				ref = dotcss.lengthToPx(dotcss._computedStyleOrActualStyle(element.parentNode, "width"));
				if(!element.parentNode) throw "Cannot convert " + l + " " + prop + " to px for an element that has no parent."
				break;
			case "lineHeight": //Always relative to font. Would actually be nice to be able to set this relative to container though
				ref = dotcss.lengthToPx(dotcss._computedStyleOrActualStyle(element, "fontSize"));
				break;
			case "fontSize": //Thought this is not strictly allowed in css, we'll assume it means relative to current element's height.
				ref = dotcss.lengthToPx(dotcss._computedStyleOrActualStyle(element, "height"));
				break;
			default:
				throw "Unable to convert the value " + l + " to px for " + prop + ".";
		}

		if(isNaN(ref)) throw "Convert the value " + l + " to px for " + prop + " because the value it is relative to is not a number.";
		
		if(l.indexOf("%") != -1) return R(N(l.split("%")[0]) * 0.01 * ref);
		else throw "The units of " + l + " are not recognized by dotcss.";
	}
	else throw l + " does not have valid units for an absolute length.";
};

//Returns a JSON object representation of value specific to the cssDataType passed in.
dotcss._convertStyleIntoDotCssObject = function(value, cssDataType){
	//if(!value) return null;
	if(!(value instanceof Array)) value = [value];
	if(cssDataType == "color") return new dotcss._Color(value);
	else if (cssDataType == "url") return new dotcss._Url(value);
	else if (cssDataType == "length" && (!isNaN(value[0]) || (value[0].indexOf(" ") == -1 && value[0].replace(dotcss._floatRegex, "") != value[0]))) return new dotcss._Length(value[0]);
	else if (cssDataType == "transformation") return new dotcss._Transform(value[0].toString())
	else{
		if(value[0] === "" 
			|| (
				(isNaN(value[0]))
				&& ("" + value[0]).replace(dotcss._floatRegex, "") == value[0])
			) return new dotcss._Unknown(value[0]); //No numbers.
		if(isNaN(value[0])) return new dotcss._Complex(value[0]); //Numbers
		else return new dotcss._Number(value[0]); //Just a number.
	}
	
};

//Ensures that two complex values match.
dotcss._compareComplexDataTypes = function(value1, value2){
	if(value1.type != "complex" || value2.type != "complex") return false;
	if(value1.numbers.length != value2.numbers.length) return false;
	if(value1.parts.length != value2.parts.length) return false;
	for(var i = 0; i < value1.parts.length; i++){
		if(value1.parts[i] != value2.parts[i]) return false;
	}
	return true;
};

//Adds a builder function directly to the dotcss object so that dotcss doesn't 
//have to be used as a function when a target doesn't need to be specified.
dotcss._addPropFunctionToDotCssObject = function(funcName){
	dotcss[funcName] = function(){
		var n = new _Builder();
		return n[funcName].apply(n, arguments);
	}
};

//Takes the property and generates all the dotcss and builder functions.
dotcss._makeFunction = function(prop, jsFriendlyProp, type){
	//Create the new function.
	_b[jsFriendlyProp] = function(){

		
		if(arguments.length == 0) return this;
		var args = [];
		for(var i = 0; i < arguments.length; i++) args.push(arguments[i]);
		var value = dotcss._convertStyleIntoDotCssObject(args, type).toString();
		
		var newCss = prop + ":" + value + ";";
		this.currentCss += newCss;
		
		if(this.target){
			for(var q = 0; q < this.target.length; q++){
				//this.target[q].style += newCss;
				var t = this.target[q];
				if(t.tagName == "STYLE") t.innerHTML = t.innerHTML.substring(0, t.innerHTML.length - 1) + prop + ":" + value + ";}";
				else t.style[jsFriendlyProp] = value;
			}
		}
		
		return this;
	}
	//Add the new function to the dotcss object so that it can be accessed without doing dotcss().
	dotcss._addPropFunctionToDotCssObject(jsFriendlyProp);
	
	//Each unit of length will also have its own version of this function (assuming this is a length property).
	if(type == "length"){
		for(var u = 0; u < _allLengthUnits.length; u++){
			var uu = _allLengthUnits[u];
			(function(uu){
				_b[jsFriendlyProp + (uu.jsName || uu.unit)] = function(){
					for(var i = 0; i < arguments.length; i++) arguments[i] = arguments[i] + uu.unit.toLowerCase();
					return _b[jsFriendlyProp].apply(this, arguments);
				}
			})(uu);
			dotcss._addPropFunctionToDotCssObject(jsFriendlyProp + (uu.jsName || uu.unit));
		}
	}
	
	//_b[jsFriendlyProp].__proto__ = Object.create(_StyleProperty.prototype);
	_b[jsFriendlyProp].type = type;
	_b[jsFriendlyProp].jsFriendlyProp = jsFriendlyProp;

	for (var k in _StyleProperty.prototype) {
		if(_b[jsFriendlyProp][k] === undefined) _b[jsFriendlyProp][k] = _StyleProperty.prototype[k];
	}
};

dotcss._makeTransformFunction = function(fn){
	dotcss[fn] = function(){
		var n = new dotcss._Transform();
		return n[fn].apply(n, arguments);
	};
}

dotcss._computedStyleOrActualStyle = function(element, property){
	return window.getComputedStyle(element)[property] || element.style[property];
};

dotcss._modDeg = function(a){
	if(a < 0) a = 360 - ((-a) % 360);
	return a % 360;
};

//Public functions.

dotcss.angleSubtract = function(a, b){
	if(a < 0) a = 360 - ((-a) % 360); else a = a % 360;
	if(b < 0) b = 360 - ((-b) % 360); else b = b % 360;
	var phi = Math.abs(b - a) % 360;
	var d = phi > 180 ? 360 - phi : phi;
	var sign = (a - b >= 0 && a - b <= 180) || (a - b <=-180 && a- b>= -360) ? 1 : -1;
	return d * sign;
};

//Special handler for building urls.
dotcss.url = function(url){
	return "url('" + url + "')";
};

//Special handler for building rgb colors.
dotcss.rgb = function(r, g, b){
	return "rgb(" + r + ", " + g + ", " + b + ")";
};

//Special handler for building rgba colors.
dotcss.rgba = function(r, g, b, a){
	return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
};

dotcss.buildTransform = function(){
	return new dotcss._Transform();
};

dotcss.scopeToEl = function(el){
	scopeStack.unshift(el);
	return this;
};
dotcss.unscope = function(){
	scopeStack.shift();
	return this;
};

//Build dotcss.
for(var k in _allProps) {
	let P = _allProps[k].split("|");
	for(var i in P){
		dotcss._makeFunction(P[i].toLowerCase(), P[i].replace(new RegExp("-", "g"), ""), k);
	}
}
for(var i = 0; i < _allLengthUnits.length; i++) dotcss._makeTransformFunction(_allLengthUnits[i]);
//dotcss = new dotcss();

// for (var k in _b) {
// 	if(_Builder[k] === undefined) dotcss[k] = _p[k];
// }

export default dotcss;