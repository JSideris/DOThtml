"use strict";

//Version 0.5.0 Beta.

//Latest Update.
//Added animations for transformations.
//Added animations for limited parameterized numeric "lists".

//TODO: there may be an issue with memory leakage during animations.
//TODO: shrink and grow are not working. 

//Inverse of framerate in ms/frame.
var _DOTCSS_FX_INTERVAL = 1000 / 60;

//Note to the open source community regarding the next variable:
//I don't particularly like having this as a public variable.
//But without it, there's no way to access the last target from inside the animate/tostring/val functions. 
//For instance, the syntax is dotcss(target).color.animate();
//The animate function needs to know the target element.
//dotcss(target) returns a _dotcssBuilder object with a target element assigned.
//color is a function inside the prototype of _dotcssBuilder,
//along with all the other css properties. Functions are objects,
//and this color object is assigned animate, toString, and val fields,
//each of which being a function. In these functions, the this keyword
//refers to the color function, not to the _dotcssBuilder where the target resides.
//Since color is in the prototype of _dotcssBuilder there isn't an easy way to
//access target from within the animate function.
//Maybe the open source community can find a better solution.
//Having this as a public variable directly and immediately hinders the scalability of this project.
var _dotcssLastBuilder = null;

//var _dotcssFloatRegex = "[\\-+]?([0-9]+\\.?[0-9]*|([0-9]*\\.?[0-9]+))(e\\-?[0-9]+)?";
var _dotcssFloatRegex = new RegExp("[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?", "g");

var _dotcssBuilder = function(target){
	this.currentCss = "";
	this.target = target;
}

var dotcss = function(query){
	//this.currentCss = "";

	var target = null;
	if(query){
		if(typeof query == "string" ) target = document.querySelectorAll(query);
		if((query instanceof NodeList) || (query instanceof Array)) target = query;
		if(query instanceof Node) target = [query]; //Doesn't need to be a NodeList. Just iterable.
	}
	_dotcssLastBuilder = new _dotcssBuilder(target);
	return _dotcssLastBuilder;
}

var _dotcssStyleProperty = function(){
	this.type = null;
	this.jsFriendlyProp = null;
}

//toString override gets the value.
_dotcssStyleProperty.prototype.toString = function(){
	if(_dotcssLastBuilder.target){
		var ret = null;
		if(_dotcssLastBuilder.target.length > 1){
			ret = [];
			for(var i = 0; i < _dotcssLastBuilder.target.length; i++){
				ret.push(_dotcssLastBuilder.target[i].style[this.jsFriendlyProp]);
			}
		}
		else ret = _dotcssLastBuilder.target[0].style[this.jsFriendlyProp];
		return ret;
	}
	else return null;
}

//val is another special function that breaks the value into a special object.
_dotcssStyleProperty.prototype.val = function(){
	if(_dotcssLastBuilder.target){
		var ret = null;
		if(_dotcssLastBuilder.target.length > 1){
			ret = null;
			for(var i = 0; i < _dotcssLastBuilder.target.length; i++){
				if(_dotcssLastBuilder.target[0].style[this.jsFriendlyProp]){
					ret.push(_convertStyleIntoDotCssObject(_dotcssLastBuilder.target[i].style[this.jsFriendlyProp], this.type));
				}
				else ret.push(null);
			}
		}
		else{
			if(_dotcssLastBuilder.target[0].style[this.jsFriendlyProp]){
				_convertStyleIntoDotCssObject(_dotcssLastBuilder.target[i].style[this.jsFriendlyProp], this.type)
			}
			else ret = null;
		}
		return ret;
	}
	else return null;
}

//Ability to animate just like jquery.
//complete does not get called if the animation was cancelled.
_dotcssStyleProperty.prototype.animate = function(value, duration, style, complete){
	if(_dotcssLastBuilder && _dotcssLastBuilder.target){
		if(!complete && style && style.call && style.apply){ //Fix params.
			complete = style;
			style = undefined;
		}
		for(var i = 0; i < _dotcssLastBuilder.target.length; i++){
			var target = _dotcssLastBuilder.target[i];
			var oldValue = _convertStyleIntoDotCssObject(window.getComputedStyle(target)[this.jsFriendlyProp], this.type);
			var newValue = _convertStyleIntoDotCssObject(_dotcssInputToCssValue((value instanceof Array) ? value : [value], this.type), this.type);
			/*switch(this.type){
				case "color":
			}*/

			//Do a little type/unit checking.
			
			if(this.type == "length"){
				if(oldValue.units != newValue.units){
					//Need to rectify this.
					if(oldValue.length == 0){
						oldValue.units = newValue.units;
						oldValue.value = oldValue.length + "" + oldValue.units;
					}
					else if(newValue.length == 0){
						newValue.units = newValue.units;
						newValue.value = oldValue.length + "" + oldValue.units;
					}
					else{
						//Turns out window.calculatewhatever always gets the calculated px value.
						//This also means we can do transitions without ever having to worry about units. Yay.
						//Just got to figure out how.
						console.warn("Couldn't animate " + jsFriendlyProp + ". Inconsistent units.");
						return _dotcssLastBuilder;
					}
				}
			}
			else if(this.type == "color"){} //OK
			else if(this.type == "transformation"){} //OK
			else if(oldValue.type == "number" && newValue.type == "number"){} //OK
			else if(oldValue.type == "complex" && newValue.type == "complex"){
				if(oldValue.numbers.length != newValue.numbers.length){ //TODO: doesn't compare parts.
					console.warn("Couldn't animate " + this.jsFriendlyProp + ". Value mismatch.");
					return _dotcssLastBuilder;	
				}
			}
			else{
				console.warn("Couldn't animate " + this.jsFriendlyProp + ". Not a recognizable length, color, or number.");
				return _dotcssLastBuilder;
			}

			_dotcssAnimate(target, this.jsFriendlyProp, this.type, oldValue, newValue, duration || 400, style || "linear", _DOTCSS_FX_INTERVAL, complete);
		}
	}
	return _dotcssLastBuilder;
}

//Have to add these back since we're going to replace the __proto__ of a function with this new prototype.
_dotcssStyleProperty.prototype.apply = Function.apply;
_dotcssStyleProperty.prototype.call = Function.call;

var _dotcssAnimate = function(element, jsFriendlyProp, propType, currentValue, targetValue, duration, animationStyle, progress, callback){
	//FIXME: the following line won't work. Need a way to cancel animations in progress. Or not.
	//if(window.getComputedStyle(element)[jsFriendlyProp] != currentValue.value) return; //Animation can be cancelled any time by setting the value directly.
	//Previously, this was set up so that animations would be cancelled if the style being animated was changed outside of this recursive function.
	//This approach had 2 problems: 1. Attempting to cancel the animation might fail if the new value happens to be the current step.
	//2. Apparently in some browsers (tested in chrome) the element doesn't re-render if the user is in another tab, meaning the computed css gets stale and cancels the animation. 
	if(duration > 0){
		switch(propType){
			case "color":
				var r = Math.round(_dotcssNumberStep(currentValue.r, targetValue.r, duration, progress, animationStyle));
				var g = Math.round(_dotcssNumberStep(currentValue.g, targetValue.g, duration, progress, animationStyle ));
				var b = Math.round(_dotcssNumberStep(currentValue.b, targetValue.b, duration, progress, animationStyle ));
				var a = dotcss.formatNumberValue(_dotcssNumberStep(currentValue.a, targetValue.a, duration, progress, animationStyle )); //TODO: make sure this doesn't need to be rounded or something.
				dotcss(element)[jsFriendlyProp](r, g, b, a);
				break;
			case "length":
				dotcss(element)[jsFriendlyProp](dotcss.formatNumberValue(_dotcssNumberStep(currentValue.length, targetValue.length, duration, progress, animationStyle), currentValue.units) + currentValue.units);
				break;
			case "transformation":
				for(var i = 0; i < currentValue.m.length; i++){
					currentValue.m[i] = dotcss.formatNumberValue(_dotcssNumberStep(currentValue.m[i], targetValue.m[i], duration, progress, animationStyle ));
				}
				dotcss(element)[jsFriendlyProp](currentValue.m);
				break;
			default:
				switch(currentValue.type){
					case "number":
						dotcss(element)[jsFriendlyProp](dotcss.formatNumberValue(_dotcssNumberStep(Number(currentValue.value), Number(targetValue.value), duration, progress, animationStyle)));
						break;
					case "complex":
						var newVal = "";
						for(var i = 0; i < currentValue.numbers.length; i++){
							newVal += currentValue.parts[i];
							newVal += dotcss.formatNumberValue(_dotcssNumberStep(Number(currentValue.numbers[i]), Number(targetValue.numbers[i]), duration, progress, animationStyle))
						}
						newVal += currentValue.parts[currentValue.parts.length - 1];
						
						dotcss(element)[jsFriendlyProp](newVal);
						break;
					default:
						console.warn("Unexpected data type for animation.");
				}
		}

		var now = (window.performance && window.performance.now) ? window.performance.now() : null;
		//var reachedAnimFrame = false;
		//TODO: there could be a memory leak here. Need to investigate.
		var nextStep = function(timestamp){
			var change = (now ? (window.performance.now() - now) : _DOTCSS_FX_INTERVAL);
			//var change = _DOTCSS_FX_INTERVAL;
			//reachedAnimFrame = true;
			//console.log(change);
			//TODO: could possibly save some processing power here by using teh new set values (from above) instead of re-calculating the computed css.
			_dotcssAnimate(element, jsFriendlyProp, propType, _convertStyleIntoDotCssObject(element.style[jsFriendlyProp], propType), targetValue, Math.max(0, duration - change), animationStyle, change, callback);
		}
		if(window.requestAnimationFrame) {
			window.requestAnimationFrame(nextStep);
			//setTimeout(function(){if(!reachedAnimFrame) console.log("ERROR");}, 100);
		}
		else window.setTimeout(nextStep, _DOTCSS_FX_INTERVAL);
	}
	else{
		dotcss(element)[jsFriendlyProp](targetValue.value);
		if(callback) callback();
	}
}

//Function that takes in a bunch of parameters and steps the start value toward the target based on timeRemaining and style.
//Returns the result.
var _dotcssNumberStep = function(start, target, timeRemaining, progress, style){
	switch(style){
		case "geometric":
		case "exponential":
			var m = Math.exp(-(progress || _DOTCSS_FX_INTERVAL) / timeRemaining);
			return  Number(target) + m * (start - target);
		case "linear":
		default:
			//console.logconsole.log(timeRemaining);
			return Number(start) + progress * (target - start) / timeRemaining;
	}
}

var _dotcssInputToCssValue = function(args, type){
	var value = args[0];
	switch(type){
		case "url":
			if(("" + value).trim().indexOf("url") != 0) 
				value = "url(" + value + ")";
			break;
		case "color":
			if(args.length == 3 && !isNaN(args[0]) && !isNaN(args[1]) && !isNaN(args[2]))
				value = "rgb(" 
					+ Math.min(255, Math.max(0, Math.round(args[0]))) + ", "
					+ Math.min(255, Math.max(0, Math.round(args[1]))) + ", " 
					+ Math.min(255, Math.max(0, Math.round(args[2]))) 
					+ ")";
			else if(args.length == 4 && !isNaN(args[0]) && !isNaN(args[1]) && !isNaN(args[2]) && !isNaN(args[3]))
				value = "rgba(" 
					+ Math.min(255, Math.max(0, Math.round(args[0]))) + ", "
					+ Math.min(255, Math.max(0, Math.round(args[1]))) + ", "
					+ Math.min(255, Math.max(0, Math.round(args[2]))) + ", "
					+ Math.min(1, Math.max(0, args[3]))
					+ ")";
			else if(("" + value)[0] == "#" || !isNaN(("" + value).substring(1, ("" + value).length))){
				if(("" + value)[0] == "#"){
					var tryHex = ("" + value).substring(1, ("" + value).length);
					if(tryHex.length == 3){
						var newTryHex = "";
						for(var i = 0; i < 3; i++){
							newTryHex = tryHex[i] + tryHex[i];
						}
						tryHex = newTryHex;
					}
					var tryHex = "0x" + tryHex;
					if(isNaN(tryHex)) break;
					value = Number(tryHex);
				}
				else{
					value = Math.round(Number("" + value));
				}
				var b = value & 0xFF;
				value >>= 8;
				var g = value & 0xFF;
				value >>= 8;
				var r = value & 0xFF;
				value = "rgb(" + r + "," + g + "," + b + ")";
			}
			break;
		case "length":
			value = "";
			for (var i = 0; i < args.length; i++){
				if(!isNaN(args[i]))
					value += args[i] + "px ";
				else
					value += args[i] + " ";
			}
			value = value.trim();
			break;
		case "transformation":
			if(Object.prototype.toString.call( value ) === '[object Array]'){
				if(value.length == 4) value = "matrix("+value.join(", ")+", 0, 0)";
				else if(value.length == 6) value = "matrix(" + value.join(", ") + ")";
				else if(value.length == 9){
					if(value[2]==0&&value[5]==0&&value[8]==1){
						value = "matrix("+value[0]+", "+value[1]+", "+value[3]+", "+value[4]+", "+value[6]+", "+value[7]+")";
					}
					else{
						value = "matrix3d("+value[0]+","+value[1]+","+value[2]+",0,"+value[3]+","+value[4]+","+value[5]+",0,0,0,1,0,"+value[6]+","+value[7]+","+value[8]+",1)"
					}
				}
				else if(value.length == 16){
					if(value[2]==0&&value[3]==0&&value[6]==0&&value[7]==0&&value[8]==0&&value[9]==0&&value[10]==1&&value[11]==0&&value[14]==0&&value[15]==1){
						value = "matrix("+value[0]+", "+value[1]+", "+value[4]+", "+value[5]+", "+value[12]+", "+value[13]+")";
					}
					else{
						value = "matrix3d(" + value.join(", ") + ")";
					}
				}
			}
			break;
		default:
			value = "";
			for (var i = 0; i < args.length; i++){
				value += args[i] + " ";
			}
			value = value.trim();
			break;
	}
	return value;
}

dotcss.formatNumberValue = function(value, unit){
	switch(unit){
		case "px": return Math.round(value);
		default: return Math.round(value * 100) / 100;
	}
}

var _allDotCssProperties = [
	{prop:"color", type:"color"},
	{prop:"opacity"},
	{prop:"background"},
	{prop:"background-Attachment"},
	{prop:"background-Blend-Mode"},
	{prop:"background-Color", type:"color"},
	{prop:"background-Image", type:"url"},
	{prop:"background-Position"},
	{prop:"background-Repeat"},
	{prop:"background-Clip"},
	{prop:"background-Origin"},
	{prop:"background-Size", type:"length"},
	{prop:"border"},
	{prop:"border-Bottom"},
	{prop:"border-Bottom-Color", type:"color"},
	{prop:"border-Bottom-Left-Radius", type:"length"},
	{prop:"border-Bottom-Right-Radius", type:"length"},
	{prop:"border-Bottom-Style"},
	{prop:"border-Bottom-Width", type:"length"},
	{prop:"border-Color", type:"color"},
	{prop:"border-Image", type:"url"},
	{prop:"border-Image-Outset"},
	{prop:"border-Image-Repeat"},
	{prop:"border-Image-Slice"},
	{prop:"border-Image-Source"},
	{prop:"border-Image-Width", type:"length"},
	{prop:"border-Left"},
	{prop:"border-Left-Color", type:"color"},
	{prop:"border-Left-Style"},
	{prop:"border-Left-Width", type:"length"},
	{prop:"border-Radius", type:"length"},
	{prop:"border-Right"},
	{prop:"border-Right-Color", type:"color"},
	{prop:"border-Right-Style"},
	{prop:"border-Right-Width", type:"length"},
	{prop:"border-Style"},
	{prop:"border-Top"},
	{prop:"border-Top-Color", type:"color"},
	{prop:"border-Top-Left-Radius", type:"length"},
	{prop:"border-Top-Right-Radius", type:"length"},
	{prop:"border-Top-Style"},
	{prop:"border-Top-Width", type:"length"},
	{prop:"border-Width", type:"length"},
	{prop:"box-Decoration-Break"},
	{prop:"box-Shadow"},
	{prop:"bottom", type:"length"},
	{prop:"clear"},
	{prop:"clip"},
	{prop:"display"},
	{prop:"float"},
	{prop:"height", type:"length"},
	{prop:"left", type:"length"},
	{prop:"margin", type:"length"},
	{prop:"margin-Bottom", type:"length"},
	{prop:"margin-Left", type:"length"},
	{prop:"margin-Right", type:"length"},
	{prop:"margin-Top", type:"length"},
	{prop:"max-Height", type:"length"},
	{prop:"max-Width", type:"length"},
	{prop:"min-Height", type:"length"},
	{prop:"min-Width", type:"length"},
	{prop:"overflow"},
	{prop:"box"},
	{prop:"overflow-X"},
	{prop:"overflow-Y"},
	{prop:"padding", type:"length"},
	{prop:"padding-Bottom", type:"length"},
	{prop:"padding-Left", type:"length"},
	{prop:"padding-Right", type:"length"},
	{prop:"padding-Top", type:"length"},
	{prop:"position"},
	{prop:"right", type:"length"},
	{prop:"top", type:"length"},
	{prop:"visibility"},
	{prop:"width", type:"length"},
	{prop:"vertical-Align"},
	{prop:"z-Index"},
	{prop:"align-Content"},
	{prop:"align-Items"},
	{prop:"align-Self"},
	{prop:"flex"},
	{prop:"flex-Basis"},
	{prop:"flex-Direction"},
	{prop:"flex-Flow"},
	{prop:"flex-Grow"},
	{prop:"flex-Shrink"},
	{prop:"flex-Wrap"},
	{prop:"justify-Content"},
	{prop:"order"},
	{prop:"hanging-Punctuation"},
	{prop:"hyphens"},
	{prop:"letter-Spacing"},
	{prop:"line-Break"},
	{prop:"line-Height", type:"length"},
	{prop:"overflow-Wrap"},
	{prop:"tab-Size"},
	{prop:"text-Align"},
	{prop:"text-Align-Last"},
	{prop:"text-Combine-Upright"},
	{prop:"text-Indent"},
	{prop:"text-Justify"},
	{prop:"text-Transform"},
	{prop:"white-Space"},
	{prop:"word-Break"},
	{prop:"word-Spacing"},
	{prop:"word-Wrap"},
	{prop:"text-Decoration"},
	{prop:"text-Decoration-Color", type:"color"},
	{prop:"text-Decoration-Line"},
	{prop:"text-Decoration-Style"},
	{prop:"text-Shadow"},
	{prop:"text-Underline-Position"},
	{prop:"font"},
	{prop:"font-Family"},
	{prop:"font-Feature-Settings"},
	{prop:"font-Kerning"},
	{prop:"font-Language-Override"},
	{prop:"font-Size", type:"length"},
	{prop:"font-Size-Adjust"},
	{prop:"font-Stretch"},
	{prop:"font-Style"},
	{prop:"font-Synthesis"},
	{prop:"font-Variant"},
	{prop:"font-Variant-Alternates"},
	{prop:"font-Variant-Caps"},
	{prop:"font-Variant-East-Asian"},
	{prop:"font-Variant-Ligatures"},
	{prop:"font-Variant-Numeric"},
	{prop:"font-Variant-Position"},
	{prop:"font-Weight"},
	{prop:"direction"},
	{prop:"text-Orientation"},
	{prop:"text-Combine-Upright"},
	{prop:"unicode-Bidi"},
	{prop:"user-Select"},
	{prop:"writing-Mode"},
	{prop:"border-Collapse"},
	{prop:"border-Spacing"},
	{prop:"caption-Side"},
	{prop:"empty-Cells"},
	{prop:"table-Layout"},
	{prop:"counter-Increment"},
	{prop:"counter-Reset"},
	{prop:"list-Style"},
	{prop:"list-Style-Image", type:"url"},
	{prop:"list-Style-Position"},
	{prop:"list-Style-Type"},
	{prop:"animation"},
	{prop:"animation-Delay"},
	{prop:"animation-Direction"},
	{prop:"animation-Duration"},
	{prop:"animation-Fill-Mode"},
	{prop:"animation-Iteration-Count"},
	{prop:"animation-Name"},
	{prop:"animation-Play-State"},
	{prop:"animation-Timing-Function"},
	{prop:"backface-Visibility"},
	{prop:"perspective"},
	{prop:"perspective-Origin"},
	{prop:"transform", type:"transformation"},
	{prop:"transform-Origin"},
	{prop:"transform-Style"},
	{prop:"transition"},
	{prop:"transition-Property"},
	{prop:"transition-Duration"},
	{prop:"transition-Timing-Function"},
	{prop:"transition-Delay"},
	{prop:"box-Sizing"},
	{prop:"content", type:"url"},
	{prop:"cursor"},
	{prop:"ime-Mode"},
	{prop:"nav-Down"},
	{prop:"nav-Index"},
	{prop:"nav-Left"},
	{prop:"nav-Right"},
	{prop:"nav-Up"},
	{prop:"outline"},
	{prop:"outline-Color", type:"color"},
	{prop:"outline-Offset"},
	{prop:"outline-Style"},
	{prop:"outline-Width"},
	{prop:"resize"},
	{prop:"text-Overflow"},
	{prop:"break-After"},
	{prop:"break-Before"},
	{prop:"break-Inside"},
	{prop:"column-Count"},
	{prop:"column-Fill"},
	{prop:"column-Gap"},
	{prop:"column-Rule"},
	{prop:"column-Rule-Color", type:"color"},
	{prop:"column-Rule-Style"},
	{prop:"column-Rule-Width"},
	{prop:"column-Span"},
	{prop:"column-Width"},
	{prop:"columns"},
	{prop:"widows"},
	{prop:"orphans"},
	{prop:"page-Break-After"},
	{prop:"page-Break-Before"},
	{prop:"page-Break-Inside"},
	{prop:"marks"},
	{prop:"quotes"},
	{prop:"filter"},
	{prop:"image-Orientation", type:"url"},
	{prop:"image-Rendering"},
	{prop:"image-Resolution"},
	{prop:"object-Fit"},
	{prop:"object-Position"},
	{prop:"mask"},
	{prop:"mask-Type"},
	{prop:"mark"},
	{prop:"mark-After"},
	{prop:"mark-Before"},
	{prop:"phonemes"},
	{prop:"rest"},
	{prop:"rest-After"},
	{prop:"rest-Before"},
	{prop:"voice-Balance"},
	{prop:"voice-Duration"},
	{prop:"voice-Pitch"},
	{prop:"voice-Pitch-Range"},
	{prop:"voice-Rate"},
	{prop:"voice-Stress"},
	{prop:"voice-Volume"},
	{prop:"marquee-Direction"},
	{prop:"marquee-Play-Count"},
	{prop:"marquee-Speed"},
	{prop:"marquee-Style"}
];

var _allDotCssLengthUnits = [
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

dotcss.matrixMultiply3D = function(A, B){
	if(A.length != 16 || B.length != 16) throw "3D matrices must be arrays of 16 length.";
	var ret = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	for(var y = 0; y < 4; y++)
		for(var x = 0; x < 4; x++)
			for(var i = 0; i < 4; i++)
				ret[y + x * 4] += Number(A[y + i * 4]) * Number(B[i + x * 4]);
	return ret;
}
dotcss.angleToRad = function(a){
	a = a.trim();
	if(a.indexOf("deg") != -1) return dotcss.formatNumberValue(Number(a.split("deg")[0]) * Math.PI / 180);
	else if(a.indexOf("grad") != -1) return dotcss.formatNumberValue(Number(a.split("grad")[0]) * 0.9);
	else if(a.indexOf("rad") != -1) return dotcss.formatNumberValue(Number(a.split("rad")[0]));
	else if(a.indexOf("turn") != -1) return dotcss.formatNumberValue(Number(a.split("turn")[0]) * 2 * Math.PI);
	else throw a + " does not have valid units for an angle."
}
dotcss.lengthToPx = function(l){
	l = l.trim();
	if(l.indexOf("px") != -1) return Math.round(Number(l.split("px")[0]));
	else if(l.indexOf("in") != -1) return Math.round(Number(l.split("in")[0]) * 96);
	else if(l.indexOf("pt") != -1) return Math.round(Number(l.split("pt")[0]) * 96 / 72);
	else if(l.indexOf("pc") != -1) return Math.round(Number(l.split("pc")[0]) * 16);
	else if(l.indexOf("cm") != -1) return Math.round(Number(l.split("cm")[0]) * 96 / 2.54);
	else if(l.indexOf("mm") != -1) return Math.round(Number(l.split("mm")[0]) * 96 / 25.4);
	else if(l.indexOf("q") != -1) return Math.round(Number(l.split("q")[0]) * 96 / 101.6);
	else throw l + " does not have valid units for an absolute length."
}

//Returns a JSON object representation of value specific to the cssDataType passed in.
function _convertStyleIntoDotCssObject(value, cssDataType){
	if(!value) return null;
	switch (cssDataType){
		case "color":
			var ret = {value: value, type: cssDataType};
			if(value[0] == "#"){
				var cH = value[0].split("#")[1];
				if(cH.length == 3){
					ret.r = Number("0x" + cH[0] + cH[0]);
					ret.g = Number("0x" + cH[1] + cH[1]);
					ret.b = Number("0x" + cH[2] + cH[2]);
					ret.a = 1;

				}
				else if(cH.length == 6){
					ret.r = Number("0x" + cH[0] + cH[1]);
					ret.g = Number("0x" + cH[2] + cH[3]);
					ret.b = Number("0x" + cH[4] + cH[5]);
					ret.a = 1;
				}
				else return null;
			}
			else if(value.toLowerCase().indexOf("rgb") === 0){
				//This also handles rgba.
				var cData = value.split("(")[1];
				cData = cData.split(")")[0];
				cData = cData.split(",");
				if(cData.length == 3 || cData.length == 4){
					ret.r = Number(cData[0]);
					ret.g = Number(cData[1]);
					ret.b = Number(cData[2]);
					ret.a = Number(cData[3] || 1);
				}
			}
			else{
				ret.a = 1;
				switch(value.toLowerCase()){
					case 'aliceblue':ret.r=0xF0;ret.g=0xF8;ret.r=0xFF;break;
					case 'antiquewhite':ret.r=0xFA;ret.g=0xEB;ret.r=0xD7;break;
					case 'aqua':ret.r=0x00;ret.g=0xFF;ret.r=0xFF;break;
					case 'aquamarine':ret.r=0x7F;ret.g=0xFF;ret.r=0xD4;break;
					case 'azure':ret.r=0xF0;ret.g=0xFF;ret.r=0xFF;break;
					case 'beige':ret.r=0xF5;ret.g=0xF5;ret.r=0xDC;break;
					case 'bisque':ret.r=0xFF;ret.g=0xE4;ret.r=0xC4;break;
					case 'black':ret.r=0x00;ret.g=0x00;ret.r=0x00;break;
					case 'blanchedalmond':ret.r=0xFF;ret.g=0xEB;ret.r=0xCD;break;
					case 'blue':ret.r=0x00;ret.g=0x00;ret.r=0xFF;break;
					case 'blueviolet':ret.r=0x8A;ret.g=0x2B;ret.r=0xE2;break;
					case 'brown':ret.r=0xA5;ret.g=0x2A;ret.r=0x2A;break;
					case 'burlywood':ret.r=0xDE;ret.g=0xB8;ret.r=0x87;break;
					case 'cadetblue':ret.r=0x5F;ret.g=0x9E;ret.r=0xA0;break;
					case 'chartreuse':ret.r=0x7F;ret.g=0xFF;ret.r=0x00;break;
					case 'chocolate':ret.r=0xD2;ret.g=0x69;ret.r=0x1E;break;
					case 'coral':ret.r=0xFF;ret.g=0x7F;ret.r=0x50;break;
					case 'cornflowerblue':ret.r=0x64;ret.g=0x95;ret.r=0xED;break;
					case 'cornsilk':ret.r=0xFF;ret.g=0xF8;ret.r=0xDC;break;
					case 'crimson':ret.r=0xDC;ret.g=0x14;ret.r=0x3C;break;
					case 'cyan':ret.r=0x00;ret.g=0xFF;ret.r=0xFF;break;
					case 'darkblue':ret.r=0x00;ret.g=0x00;ret.r=0x8B;break;
					case 'darkcyan':ret.r=0x00;ret.g=0x8B;ret.r=0x8B;break;
					case 'darkgoldenrod':ret.r=0xB8;ret.g=0x86;ret.r=0x0B;break;
					case 'darkgray':ret.r=0xA9;ret.g=0xA9;ret.r=0xA9;break;
					case 'darkgrey':ret.r=0xA9;ret.g=0xA9;ret.r=0xA9;break;
					case 'darkgreen':ret.r=0x00;ret.g=0x64;ret.r=0x00;break;
					case 'darkkhaki':ret.r=0xBD;ret.g=0xB7;ret.r=0x6B;break;
					case 'darkmagenta':ret.r=0x8B;ret.g=0x00;ret.r=0x8B;break;
					case 'darkolivegreen':ret.r=0x55;ret.g=0x6B;ret.r=0x2F;break;
					case 'darkorange':ret.r=0xFF;ret.g=0x8C;ret.r=0x00;break;
					case 'darkorchid':ret.r=0x99;ret.g=0x32;ret.r=0xCC;break;
					case 'darkred':ret.r=0x8B;ret.g=0x00;ret.r=0x00;break;
					case 'darksalmon':ret.r=0xE9;ret.g=0x96;ret.r=0x7A;break;
					case 'darkseagreen':ret.r=0x8F;ret.g=0xBC;ret.r=0x8F;break;
					case 'darkslateblue':ret.r=0x48;ret.g=0x3D;ret.r=0x8B;break;
					case 'darkslategray':ret.r=0x2F;ret.g=0x4F;ret.r=0x4F;break;
					case 'darkslategrey':ret.r=0x2F;ret.g=0x4F;ret.r=0x4F;break;
					case 'darkturquoise':ret.r=0x00;ret.g=0xCE;ret.r=0xD1;break;
					case 'darkviolet':ret.r=0x94;ret.g=0x00;ret.r=0xD3;break;
					case 'deeppink':ret.r=0xFF;ret.g=0x14;ret.r=0x93;break;
					case 'deepskyblue':ret.r=0x00;ret.g=0xBF;ret.r=0xFF;break;
					case 'dimgray':ret.r=0x69;ret.g=0x69;ret.r=0x69;break;
					case 'dimgrey':ret.r=0x69;ret.g=0x69;ret.r=0x69;break;
					case 'dodgerblue':ret.r=0x1E;ret.g=0x90;ret.r=0xFF;break;
					case 'firebrick':ret.r=0xB2;ret.g=0x22;ret.r=0x22;break;
					case 'floralwhite':ret.r=0xFF;ret.g=0xFA;ret.r=0xF0;break;
					case 'forestgreen':ret.r=0x22;ret.g=0x8B;ret.r=0x22;break;
					case 'fuchsia':ret.r=0xFF;ret.g=0x00;ret.r=0xFF;break;
					case 'gainsboro':ret.r=0xDC;ret.g=0xDC;ret.r=0xDC;break;
					case 'ghostwhite':ret.r=0xF8;ret.g=0xF8;ret.r=0xFF;break;
					case 'gold':ret.r=0xFF;ret.g=0xD7;ret.r=0x00;break;
					case 'goldenrod':ret.r=0xDA;ret.g=0xA5;ret.r=0x20;break;
					case 'gray':ret.r=0x80;ret.g=0x80;ret.r=0x80;break;
					case 'grey':ret.r=0x80;ret.g=0x80;ret.r=0x80;break;
					case 'green':ret.r=0x00;ret.g=0x80;ret.r=0x00;break;
					case 'greenyellow':ret.r=0xAD;ret.g=0xFF;ret.r=0x2F;break;
					case 'honeydew':ret.r=0xF0;ret.g=0xFF;ret.r=0xF0;break;
					case 'hotpink':ret.r=0xFF;ret.g=0x69;ret.r=0xB4;break;
					case 'indianred':ret.r=0xCD;ret.g=0x5C;ret.r=0x5C;break;
					case 'indigo':ret.r=0x4B;ret.g=0x00;ret.r=0x82;break;
					case 'ivory':ret.r=0xFF;ret.g=0xFF;ret.r=0xF0;break;
					case 'khaki':ret.r=0xF0;ret.g=0xE6;ret.r=0x8C;break;
					case 'lavender':ret.r=0xE6;ret.g=0xE6;ret.r=0xFA;break;
					case 'lavenderblush':ret.r=0xFF;ret.g=0xF0;ret.r=0xF5;break;
					case 'lawngreen':ret.r=0x7C;ret.g=0xFC;ret.r=0x00;break;
					case 'lemonchiffon':ret.r=0xFF;ret.g=0xFA;ret.r=0xCD;break;
					case 'lightblue':ret.r=0xAD;ret.g=0xD8;ret.r=0xE6;break;
					case 'lightcoral':ret.r=0xF0;ret.g=0x80;ret.r=0x80;break;
					case 'lightcyan':ret.r=0xE0;ret.g=0xFF;ret.r=0xFF;break;
					case 'lightgoldenrodyellow':ret.r=0xFA;ret.g=0xFA;ret.r=0xD2;break;
					case 'lightgray':ret.r=0xD3;ret.g=0xD3;ret.r=0xD3;break;
					case 'lightgrey':ret.r=0xD3;ret.g=0xD3;ret.r=0xD3;break;
					case 'lightgreen':ret.r=0x90;ret.g=0xEE;ret.r=0x90;break;
					case 'lightpink':ret.r=0xFF;ret.g=0xB6;ret.r=0xC1;break;
					case 'lightsalmon':ret.r=0xFF;ret.g=0xA0;ret.r=0x7A;break;
					case 'lightseagreen':ret.r=0x20;ret.g=0xB2;ret.r=0xAA;break;
					case 'lightskyblue':ret.r=0x87;ret.g=0xCE;ret.r=0xFA;break;
					case 'lightslategray':ret.r=0x77;ret.g=0x88;ret.r=0x99;break;
					case 'lightslategrey':ret.r=0x77;ret.g=0x88;ret.r=0x99;break;
					case 'lightsteelblue':ret.r=0xB0;ret.g=0xC4;ret.r=0xDE;break;
					case 'lightyellow':ret.r=0xFF;ret.g=0xFF;ret.r=0xE0;break;
					case 'lime':ret.r=0x00;ret.g=0xFF;ret.r=0x00;break;
					case 'limegreen':ret.r=0x32;ret.g=0xCD;ret.r=0x32;break;
					case 'linen':ret.r=0xFA;ret.g=0xF0;ret.r=0xE6;break;
					case 'magenta':ret.r=0xFF;ret.g=0x00;ret.r=0xFF;break;
					case 'maroon':ret.r=0x80;ret.g=0x00;ret.r=0x00;break;
					case 'mediumaquamarine':ret.r=0x66;ret.g=0xCD;ret.r=0xAA;break;
					case 'mediumblue':ret.r=0x00;ret.g=0x00;ret.r=0xCD;break;
					case 'mediumorchid':ret.r=0xBA;ret.g=0x55;ret.r=0xD3;break;
					case 'mediumpurple':ret.r=0x93;ret.g=0x70;ret.r=0xDB;break;
					case 'mediumseagreen':ret.r=0x3C;ret.g=0xB3;ret.r=0x71;break;
					case 'mediumslateblue':ret.r=0x7B;ret.g=0x68;ret.r=0xEE;break;
					case 'mediumspringgreen':ret.r=0x00;ret.g=0xFA;ret.r=0x9A;break;
					case 'mediumturquoise':ret.r=0x48;ret.g=0xD1;ret.r=0xCC;break;
					case 'mediumvioletred':ret.r=0xC7;ret.g=0x15;ret.r=0x85;break;
					case 'midnightblue':ret.r=0x19;ret.g=0x19;ret.r=0x70;break;
					case 'mintcream':ret.r=0xF5;ret.g=0xFF;ret.r=0xFA;break;
					case 'mistyrose':ret.r=0xFF;ret.g=0xE4;ret.r=0xE1;break;
					case 'moccasin':ret.r=0xFF;ret.g=0xE4;ret.r=0xB5;break;
					case 'navajowhite':ret.r=0xFF;ret.g=0xDE;ret.r=0xAD;break;
					case 'navy':ret.r=0x00;ret.g=0x00;ret.r=0x80;break;
					case 'oldlace':ret.r=0xFD;ret.g=0xF5;ret.r=0xE6;break;
					case 'olive':ret.r=0x80;ret.g=0x80;ret.r=0x00;break;
					case 'olivedrab':ret.r=0x6B;ret.g=0x8E;ret.r=0x23;break;
					case 'orange':ret.r=0xFF;ret.g=0xA5;ret.r=0x00;break;
					case 'orangered':ret.r=0xFF;ret.g=0x45;ret.r=0x00;break;
					case 'orchid':ret.r=0xDA;ret.g=0x70;ret.r=0xD6;break;
					case 'palegoldenrod':ret.r=0xEE;ret.g=0xE8;ret.r=0xAA;break;
					case 'palegreen':ret.r=0x98;ret.g=0xFB;ret.r=0x98;break;
					case 'paleturquoise':ret.r=0xAF;ret.g=0xEE;ret.r=0xEE;break;
					case 'palevioletred':ret.r=0xDB;ret.g=0x70;ret.r=0x93;break;
					case 'papayawhip':ret.r=0xFF;ret.g=0xEF;ret.r=0xD5;break;
					case 'peachpuff':ret.r=0xFF;ret.g=0xDA;ret.r=0xB9;break;
					case 'peru':ret.r=0xCD;ret.g=0x85;ret.r=0x3F;break;
					case 'pink':ret.r=0xFF;ret.g=0xC0;ret.r=0xCB;break;
					case 'plum':ret.r=0xDD;ret.g=0xA0;ret.r=0xDD;break;
					case 'powderblue':ret.r=0xB0;ret.g=0xE0;ret.r=0xE6;break;
					case 'purple':ret.r=0x80;ret.g=0x00;ret.r=0x80;break;
					case 'rebeccapurple':ret.r=0x66;ret.g=0x33;ret.r=0x99;break;
					case 'red':ret.r=0xFF;ret.g=0x00;ret.r=0x00;break;
					case 'rosybrown':ret.r=0xBC;ret.g=0x8F;ret.r=0x8F;break;
					case 'royalblue':ret.r=0x41;ret.g=0x69;ret.r=0xE1;break;
					case 'saddlebrown':ret.r=0x8B;ret.g=0x45;ret.r=0x13;break;
					case 'salmon':ret.r=0xFA;ret.g=0x80;ret.r=0x72;break;
					case 'sandybrown':ret.r=0xF4;ret.g=0xA4;ret.r=0x60;break;
					case 'seagreen':ret.r=0x2E;ret.g=0x8B;ret.r=0x57;break;
					case 'seashell':ret.r=0xFF;ret.g=0xF5;ret.r=0xEE;break;
					case 'sienna':ret.r=0xA0;ret.g=0x52;ret.r=0x2D;break;
					case 'silver':ret.r=0xC0;ret.g=0xC0;ret.r=0xC0;break;
					case 'skyblue':ret.r=0x87;ret.g=0xCE;ret.r=0xEB;break;
					case 'slateblue':ret.r=0x6A;ret.g=0x5A;ret.r=0xCD;break;
					case 'slategray':ret.r=0x70;ret.g=0x80;ret.r=0x90;break;
					case 'slategrey':ret.r=0x70;ret.g=0x80;ret.r=0x90;break;
					case 'snow':ret.r=0xFF;ret.g=0xFA;ret.r=0xFA;break;
					case 'springgreen':ret.r=0x00;ret.g=0xFF;ret.r=0x7F;break;
					case 'steelblue':ret.r=0x46;ret.g=0x82;ret.r=0xB4;break;
					case 'tan':ret.r=0xD2;ret.g=0xB4;ret.r=0x8C;break;
					case 'teal':ret.r=0x00;ret.g=0x80;ret.r=0x80;break;
					case 'thistle':ret.r=0xD8;ret.g=0xBF;ret.r=0xD8;break;
					case 'tomato':ret.r=0xFF;ret.g=0x63;ret.r=0x47;break;
					case 'turquoise':ret.r=0x40;ret.g=0xE0;ret.r=0xD0;break;
					case 'violet':ret.r=0xEE;ret.g=0x82;ret.r=0xEE;break;
					case 'wheat':ret.r=0xF5;ret.g=0xDE;ret.r=0xB3;break;
					case 'white':ret.r=0xFF;ret.g=0xFF;ret.r=0xFF;break;
					case 'whitesmoke':ret.r=0xF5;ret.g=0xF5;ret.r=0xF5;break;
					case 'yellow':ret.r=0xFF;ret.g=0xFF;ret.r=0x00;break;
					case 'yellowgreen':ret.r=0x9A;ret.g=0xCD;ret.r=0x32;break;
					default: return null;
				}
			}
			return ret;
		case "url":
			if(value.toLowerCase().indexOf("url") === 0){
				var ret = value.substring(indexOf("("), lastIndexOf(")")).trim();
				if((ret.indexOf("\"") && ret.lastIndexOf("\"") == ret.length - 1) || 
					(ret.indexOf("'") && ret.lastIndexOf("'") == ret.length - 1)){
					ret = ret.substring(1, ret.length - 1);
				}
				ret.value = value;
				ret.type = cssDataType;
				return ret;
			}
			else return value;
		case "length":
			return {value: value, type: cssDataType, length: Number(value.match(_dotcssFloatRegex)[0]), units: value.split(_dotcssFloatRegex)[1]};
		case "transformation":
			if(value.indexOf("(") == -1){
				value = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)"
			}
			var ret = {value: value, type: cssDataType};
			var m = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
			var transformations = value.split(/\)\s*/); transformations.pop(); for(var i = 0; i < transformations.length; i++) transformations[i] += ")";
			var cos = Math.cos; var sin = Math.sin; var tan = Math.tan;
			for(var t = transformations.length - 1; t >= 0; t--){
				var trans = transformations[t].trim();
				var parts = trans.split(/[\(\)]/);
				var func = parts[0]
				var p = parts[1].split(/\s*,\s*/)
				switch(func){
					case "matrix3d":
						if(transformations.length != 1) {console.warn("matrix3d is a stand-alone transformation."); continue}
						//Work is done.
						var mtch = trans.match(new RegExp("matrix3d\\(\\s*(.*?)\\s*\\)"))
						if(!mtch || mtch.length != 2) throw trans + " is not a valid transform";
						var s = mtch[1].split(",");
						if(s.length != 16) throw trans + " is not a valid transform";
						for(var i = 0; i < s.length; i++) m[i] = Number(s[i].trim());
						break;
					case "matrix":
						if(transformations.length != 1) {console.warn("matrix is a stand-alone transformation."); continue}
						//2D transform.
						var mtch = trans.match(new RegExp("matrix\\(\\s*(.*?)\\s*\\)"))
						if(!mtch || mtch.length != 2) throw trans + " is not a valid transform";
						var s = mtch[1].split(",");
						if(s.length != 6) throw trans + " is not a valid transform";;
						//i+(i>>1)*2+(i>>2)*4 maps the R2 coords to RP3.
						for(var i = 0; i < s.length; i++) m[i+(i>>1)*2+(i>>2)*4] = Number(s[i].trim());
						break;
						//No matrix - check for transformations.
					case "translate":
						if(p.length == 1) m = dotcss.matrixMultiply3D([1,0,0,0,0,1,0,0,0,0,1,0,dotcss.lengthToPx(p[0]),0,0,1], m);
						if(p.length == 2) m = dotcss.matrixMultiply3D([1,0,0,0,0,1,0,0,0,0,1,0,dotcss.lengthToPx(p[0]),dotcss.lengthToPx(p[1]),0,1], m);
						else throw func + " must have 1 or 2 params.";
						break;
					case "translate3d":
						if(p.length != 3) throw func + " must have 3 params.";
						m = dotcss.matrixMultiply3D([1,0,0,0,0,1,0,0,0,0,1,0,dotcss.lengthToPx(p[0]),dotcss.lengthToPx(p[1]),dotcss.lengthToPx(p[2]),1], m);
						break;
					case "translateX":
						if(p.length != 1) throw func + " must have 1 param.";
						m = dotcss.matrixMultiply3D([1,0,0,0,0,1,0,0,0,0,1,0,dotcss.lengthToPx(p[0]),0,0,1], m);
						break;
					case "translateY":
						if(p.length != 1) throw func + " must have 1 param.";
						m = dotcss.matrixMultiply3D([1,0,0,0,0,1,0,0,0,0,1,0,0,dotcss.lengthToPx(p[0]),0,1], m);
						break;
					case "translateZ":
						if(p.length != 1) throw func + " must have 1 param.";
						m = dotcss.matrixMultiply3D([1,0,0,0,0,1,0,0,0,0,1,0,0,0,dotcss.lengthToPx(p[0]),1], m);
						break;
					case "scale":
						if(p.length != 2) throw func + " must have 2 params.";
						m = dotcss.matrixMultiply3D([p[0],0,0,0,0,p[1],0,0,0,0,1,0,0,0,0,1], m);
						break;
					case "scale3d":
						if(p.length != 3) throw func + " must have 3 params.";
						m = dotcss.matrixMultiply3D([p[0],0,0,0,0,p[1],0,0,0,0,p[2],0,0,0,0,1], m);
						break;
					case "scaleX":
						if(p.length != 1) throw func + " must have 1 param.";
						m = dotcss.matrixMultiply3D([p[0],0,0,0,0,1,0,0,0,0,1,0,0,0,0,1], m);
						break;
					case "scaleY":
						if(p.length != 1) throw func + " must have 1 param.";
						m = dotcss.matrixMultiply3D([1,0,0,0,0,p[0],0,0,0,0,1,0,0,0,0,1], m);
						break;
					case "scaleZ":
						if(p.length != 1) throw func + " must have 1 param.";
						m = dotcss.matrixMultiply3D([1,0,0,0,0,1,0,0,0,0,p[0],0,0,0,0,1], m);
						break;
					case "rotate":
					case "rotateZ":
						if(p.length != 1) throw func + " must have 1 param.";
						var a = dotcss.angleToRad(p[0]);
						m = dotcss.matrixMultiply3D([cos(a),sin(a),0,0,-sin(a),cos(a),0,0,0,0,1,0,0,0,0,1], m);
						break;
					case "rotate3d":
						if(p.length != 4) throw func + " must have 4 params.";
						var x = p[0];
						var y = p[1];
						var z = p[2];
						var a = dotcss.angleToRad(p[3]);
						var cosA = cos(a);
						var sinA = sin(a);
						m = dotcss.matrixMultiply3D([1+(1-cosA)*(x*x-1),z*sinA+x*y*(1-cosA),-y*sinA+x*z*(1-cosA),0,
													-z*sinA+x*y*(1-cosA),1+(1-cosA)*(y*y-1),x*sinA+y*z*(1-cosA),0,
													y*sinA+x*z*(1-cosA),-x*sinA+y*z*(1-cosA),1+(1-cosA)*(z*z-1),0,
													0,					0,					0,					1], m);
						break;
					case "rotateX":
						if(p.length != 1) throw func + " must have 1 param.";
						var a = dotcss.angleToRad(p[0]);
						m = dotcss.matrixMultiply3D([1,0,0,0,0,cos(a),sin(a),0,0,-sin(a),cos(a),0,0,0,0,1], m);
						break;
					case "rotateY":
						if(p.length != 1) throw func + " must have 1 param.";
						var a = dotcss.angleToRad(p[0]);
						m = dotcss.matrixMultiply3D([cos(a),0,-sin(a),0,0,1,0,0,sin(a),0,cos(a),0,0,0,0,1], m);
						break;
					case "skew":
						if(p.length == 1) m = dotcss.matrixMultiply3D([1,0,0,0,tan(p[0]),1,0,0,0,0,1,0,0,0,0,1], m);
						if(p.length == 2) m = dotcss.matrixMultiply3D([1,tan(p[1]),0,0,tan(p[0]),1,0,0,0,0,1,0,0,0,0,1], m);
						else throw func + " must have 1 or 2 params.";
						break;
					case "skewX":
						if(p.length != 1) throw func + " must have 1 param.";
						m = dotcss.matrixMultiply3D([1,0,0,0,tan(p[0]),1,0,0,0,0,1,0,0,0,0,1], m);
						break;
					case "skewY":
						if(p.length != 1) throw func + " must have 1 param.";
						m = dotcss.matrixMultiply3D([1,tan(p[0]),0,0,0,1,0,0,0,0,1,0,0,0,0,1], m);
						break;
					case "perspective":
						//Interent documentation on this feature is a little patchy. Best refer to the spec.
						//https://www.w3.org/TR/css-transforms-1/#processing-of-perspective-transformed-boxes
						if(p.length != 1) throw func + " must have 1 param.";
						m = dotcss.matrixMultiply3D([1,0,0,0,0,1,0,0,0,0,1,dotcss.formatNumberValue(1 / dotcss.lengthToPx(p[0])),0,0,0,1], m);
						break;
					default: 
						throw func + " is not a translatable property.";
				}
			}
			ret.m = m;
			return ret;
		default: 
			if(value.replace(_dotcssFloatRegex, "") == value) return {value: value, type: undefined}; //No numbers.
			if(isNaN(value)) return {value: value, parts: (" " + value + " ").split(_dotcssFloatRegex), numbers: value.match(_dotcssFloatRegex), type: "complex"}; //Numbers
			else return {value: Number(value), type: "number"}; //Just a number.
			
			
	}
}

//Adds a builder function directly to the dotcss object so that dotcss doesn't 
//have to be used as a function when a target doesn't need to be specified.
function _addDotCssFunctionToDotCssObject(funcName){
	dotcss[funcName] = function(){
		var n = new _dotcssBuilder();
		return n[funcName].apply(n, arguments);
	}
}

//Takes the property and generates all the dotcss and builder functions.
function _makeDotCssFunction (prop, jsFriendlyProp, type){
	//Create the new function.
	_dotcssBuilder.prototype[jsFriendlyProp] = function(){
		if(arguments.length == 0) return this;
		var value = _dotcssInputToCssValue(arguments, type);
		
		var newCss = prop + ":" + value + ";";
		this.currentCss += newCss;
		
		if(this.target){
			for(var q = 0; q < this.target.length; q++){
				//this.target[q].style += newCss;
				this.target[q].style[jsFriendlyProp] = value;
			}
		}
		
		return this;
	}
	//Add the new function to the dotcss object so that it can be accessed without doing dotcss().
	_addDotCssFunctionToDotCssObject(jsFriendlyProp);
	
	//Each unit of length will also have its own version of this function (assuming this is a length property).
	if(type == "length"){
		for(var u = 0; u < _allDotCssLengthUnits.length; u++){
			var uu = _allDotCssLengthUnits[u];
			(function(uu){
				_dotcssBuilder.prototype[jsFriendlyProp + (uu.jsName || uu.unit)] = function(){
					for(var i = 0; i < arguments.length; i++) arguments[i] = arguments[i] + uu.unit.toLowerCase();
					return _dotcssBuilder.prototype[jsFriendlyProp].apply(this, arguments);
				}
			})(uu);
			_addDotCssFunctionToDotCssObject(jsFriendlyProp + (uu.jsName || uu.unit));
		}
	}
	
	_dotcssBuilder.prototype[jsFriendlyProp].__proto__ = Object.create(_dotcssStyleProperty.prototype);
	_dotcssBuilder.prototype[jsFriendlyProp].type = type;
	_dotcssBuilder.prototype[jsFriendlyProp].jsFriendlyProp = jsFriendlyProp;
}

//TODO: TEST THESE. PROBLEMS EXIST.

//Special handler for building urls.
dotcss.url = function(url){
	return "url('" + url + "')";
}

//Special handler for building rgb colors.
dotcss.rgb = function(r, g, b){
	return "rgb(" + r + ", " + g + ", " + b + ")";
}

//Special handler for building rgba colors.
dotcss.rgba = function(r, g, b, a){
	return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}

_dotcssBuilder.prototype.toString = dotcss.prototype.toString = function(){
	return this.currentCss;
}

//Usage:
//hide()
//show(duration, complete)
//show(options)
//Options
//	display: inline-block, block, etc.
//	duration: duration in ms.
//	complete: on-complete callback.
//	showStyle: fade, shrink, or normal
//	animationStyle: linear or exponential
_dotcssBuilder.prototype.hide = function(){
	if(this.target){
		var arg0 = arguments[0] || {};
		var ops = {};
		ops.duration = arg0.duration || (isNaN(arg0) ? 0 : arg0) || 0;
		//ops.display = arg0.display || "none";
		//ops.opacity = arg0.opacity || null;
		//ops.width = arg0.width || null;
		//ops.height = arg0.height || null;
		ops.complete = arg0.complete || (typeof arguments[1] == "function" ? arguments[1] : function(){});
		ops.hideStyle = arg0.hideStyle || "normal";
		ops.animationStyle = arg0.animationStyle || "exponential";

		if(ops.duration > 0){
			var doneCnt = 0;
			var m = 0;
			var q = this.target.length;
			for(var i = 0; i < this.target.length; i++){
				//style = window.getComputedStyle(target[i]);
				var w = this.target[i].style.width;
				var h = this.target[i].style.height;
				var o = this.target[i].style.opacity;
				if(ops.hideStyle != "fade"){
					m += 2;
					(function(that, t, w, h){
						dotcss(t).width.animate(0, ops.duration, ops.animationStyle, function(){
							dotcss(t).display("none").width(w);
							doneCnt++; if(doneCnt > m * q) ops.complete(that);
						});
						dotcss(t).height.animate(0, ops.duration, ops.animationStyle, function(){
							dotcss(t).display("none").height(h);
							doneCnt++; if(doneCnt > m * q) ops.complete(that);
						});
					})(this, this.target[i], w, h);	
				}
				if(ops.hideStyle != "shrink"){
					(function(that, t, o){
						return dotcss(t).opacity.animate(0, ops.duration, ops.animationStyle, function(){
							dotcss(t).display("none").opacity(o);
							doneCnt++; if(doneCnt > m * q) ops.complete(that);
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
}

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
_dotcssBuilder.prototype.show = function(){
	if(this.target){
		var arg0 = arguments[0] || {};
		var ops = {};
		ops.duration = arg0.duration || (isNaN(arg0) ? 0 : arg0) || 0;
		ops.display = arg0.display || "block";
		ops.opacity = arg0.opacity || 1;
		ops.width = arg0.width || null;
		ops.height = arg0.height || null;
		ops.complete = arg0.complete || (typeof arguments[1] == "function" ? arguments[1] : function(){});
		ops.showStyle = arg0.showStyle || "normal";
		ops.animationStyle = arg0.animationStyle || "exponential";

		if(ops.duration > 0){
			var doneCnt = 0;
			var q = this.target.length;
			var m = 0;
			for(var i = 0; i < this.target.length; i++){
				//style = window.getComputedStyle(target[i]);
				
				if(ops.showStyle != "fade"){
					m += 2
					var w = ops.width || this.target[i].style.width;
					var h = ops.height || this.target[i].style.height;
					
					dotcss(this.target[i]).width(0);
					dotcss(this.target[i]).height(0);
					// console.log(doneCnt + " " + q*m);
					dotcss(this.target[i]).width.animate(w, ops.duration, ops.animationStyle, function(){doneCnt++; if(doneCnt == q * m) ops.complete();});
					dotcss(this.target[i]).height.animate(h, ops.duration, ops.animationStyle, function(){doneCnt++; if(doneCnt == q * m) ops.complete();});
				}

				//var o = this.target[i].style.opacity; //Guess I should fade to 1?
				dotcss(this.target[i]).opacity(0);
				dotcss(this.target[i]).display(ops.display);

				if(ops.showStyle != "grow"){
					m++;
					dotcss(this.target[i]).opacity.animate(ops.opacity, ops.duration, ops.animationStyle, function(){doneCnt++; if(doneCnt == q * m) ops.complete();});
				}
			}
		}
		else{
			return dotcss(this.target).display(ops.display);
		}
	}
	return this;
}

_dotcssBuilder.prototype.fadeOut = function(duration, complete){
	return this.hide({
		duration: isNaN(duration) ? 400 : Number(duration), 
		hideStyle: "fade",
		complete: complete
	});
}

_dotcssBuilder.prototype.fadeIn = function(duration, complete){
	return this.show({
		duration: isNaN(duration) ? 400 : Number(duration), 
		showStyle: "fade",
		complete: complete
	});
}

//Build dotcss.
for(var i = 0; i < _allDotCssProperties.length; i++){
	var prop = _allDotCssProperties[i].prop.toLowerCase();
	var jsFriendlyProp = _allDotCssProperties[i].prop.replace(new RegExp("-", "g"), "");
	
	_makeDotCssFunction(prop, jsFriendlyProp, _allDotCssProperties[i].type);
}

//dotcss = new dotcss();