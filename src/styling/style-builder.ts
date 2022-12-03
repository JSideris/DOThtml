"use strict";

import Util, { AnimationType } from "../util";
import {AllLengthUnits} from "./unit-function-tables";
import CssAngle from "./css-types.ts/css-angle";
import CssColor from "./css-types.ts/css-color";
import CssComplex from "./css-types.ts/css-complex";
import { CssDataTypeToken } from "./css-types.ts/css-data-type";
import CssLength from "./css-types.ts/css-length";
import CssNumber from "./css-types.ts/css-number";
import CssTransform from "./css-types.ts/css-transform";
import CssUnknown from "./css-types.ts/css-unknown";
import CssUrl from "./css-types.ts/css-url";
import IDotCss, { HideParams, LengthProp, NumericLength, ShowParams } from "./i-dotcss";

//Latest Update.
/*
* - Wrapped code in anonymous function.
* - Hid _Builder and _StyleProperty.
* - Increased compatibility with IE 8, 9, and 10.
* - Allowed 0-length animations.
* 5.1 
* - Typified style builder.
* - Fixed up transformations and redid transform builder.
* - Removed some old junk.
*/

const STATIC_SYLES_ATTR = "data-dot-static-styles";

// Rename this to DotcssHelpers.
// The name Dotcss2 comes from a time when this was a clone of dotcss with "private" members.
class Dotcss2{
	//Inverse of framerate in ms/frame.
	// Used for old browsers that don't support requestAnimationFrameframe.
	fxInterval = 1000/60;
	
	lastBuilder: _Builder = null;
	scopeStack: Array<HTMLElement> = [];

	globalStyleElement: HTMLStyleElement = null;

	animateFull(
		element: HTMLElement, 
		jsFriendlyProp: string, 
		propType: string, 
		startValue: any, 
		targetValue: any, 
		finalValue: any, 
		currentTime: number, 
		totalDuration: number, 
		animationStyle: AnimationType, 
		callback: Function, 
		lastValue?: any){
		if(lastValue && element.style[jsFriendlyProp] != lastValue) return; //Animation can be cancelled any time by setting the value directly.
	
		if(totalDuration - currentTime > 0){
			switch(propType){
				case "color":
					var r = Math.round(Util.numberStep(startValue.r, targetValue.r, currentTime, totalDuration, animationStyle));
					var g = Math.round(Util.numberStep(startValue.g, targetValue.g, currentTime, totalDuration, animationStyle ));
					var b = Math.round(Util.numberStep(startValue.b, targetValue.b, currentTime, totalDuration, animationStyle ));
					var a = dotcss.formatNumberValue(Util.numberStep(startValue.a, targetValue.a, currentTime, totalDuration, animationStyle )); //TODO: make sure this doesn't need to be rounded or something.
					dotcss(element)[jsFriendlyProp](r, g, b, a);
					break;
				case "length":
					dotcss(element)[jsFriendlyProp](dotcss.formatNumberValue(Util.numberStep(startValue.length, targetValue.length, currentTime, totalDuration, animationStyle), startValue.units) + startValue.units);
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
							newTransform += dotcss.formatNumberValue(Util.numberStep(actualV1, actualV2, currentTime, totalDuration, animationStyle), units) + units + ",";
						}
						newTransform = newTransform.substring(0, newTransform.length - 1);
						newTransform += ") ";
					}
					dotcss(element)[jsFriendlyProp](newTransform);
					break;
				default:
					switch(startValue.type){
						case "number":
							dotcss(element)[jsFriendlyProp](dotcss.formatNumberValue(Util.numberStep(startValue.value, targetValue.value, currentTime, totalDuration, animationStyle)));
							break;
						case "complex":
							var newVal = "";
							for(var i = 0; i < startValue.numbers.length; i++){
								newVal += startValue.parts[i];
								newVal += dotcss.formatNumberValue(Util.numberStep(startValue.numbers[i], targetValue.numbers[i], currentTime, totalDuration, animationStyle))
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
				var change = (now ? (window.performance.now() - now) : dotcss2.fxInterval);
				dotcss2.animateFull(element, jsFriendlyProp, propType, startValue, targetValue, finalValue, currentTime + change, totalDuration, animationStyle, callback, last);
			}
			if(window.requestAnimationFrame) {
				window.requestAnimationFrame(nextStep);
				//setTimeout(function(){if(!reachedAnimFrame) console.log("ERROR");}, 100);
			}
			else window.setTimeout(nextStep, dotcss2.fxInterval);
		}
		else{
			//TODO: verify that decimal values are properly handled here.
			dotcss(element)[jsFriendlyProp](finalValue);
			if(callback) callback();
		}
	}

	//Takes the property and generates all the dotcss and builder functions.
	extendDothtml(prop, jsFriendlyProp, type){
		//Create the new function by extending the builder.
		let _b = _Builder.prototype;
		_b[jsFriendlyProp] = function(){
			
			if(arguments.length == 0) return this;
			var args = [];
			for(var i = 0; i < arguments.length; i++) args.push(arguments[i]);

			// TODO: Why can't I just pass arguments directly into this function?
			// Try it.
			var value = dotcss2.convertStyleIntoDotCssObject(args, type).toString();
			
			
			var newCss = prop + ":" + value + ";";
			this.currentCss += newCss;
			// console.log(`SETTING ${jsFriendlyProp}:`, this.toString());
			// this.toString()

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
		dotcss2.addPropFunctionToDotCssObject(jsFriendlyProp);
		
		//Each unit of length will also have its own version of this function (assuming this is a length property).
		if(type == "length"){
			for(var u = 0; u < AllLengthUnits.length; u++){
				var uu = AllLengthUnits[u];
				(function(uu){
					_b[jsFriendlyProp + (uu.jsName || uu.unit)] = function(){
						for(var i = 0; i < arguments.length; i++) arguments[i] = arguments[i] + uu.unit.toLowerCase();
						return _b[jsFriendlyProp].apply(this, arguments);
					}
				})(uu);
				dotcss2.addPropFunctionToDotCssObject(jsFriendlyProp + (uu.jsName || uu.unit));
			}
		}
		
		//_b[jsFriendlyProp].__proto__ = Object.create(_StyleProperty.prototype);
		_b[jsFriendlyProp].type = type;
		_b[jsFriendlyProp].jsFriendlyProp = jsFriendlyProp;

		// This is weird. It looks like I was trying to implement some form of multilpe inheritance.
		// This should really be upgraded.
		for (var k in _StyleProperty.prototype) {
			if(_b[jsFriendlyProp][k] === undefined) _b[jsFriendlyProp][k] = _StyleProperty.prototype[k];
		}
	}

	//Returns a JSON object representation of value specific to the cssDataType passed in.
	convertStyleIntoDotCssObject(value, cssDataType: CssDataTypeToken){
		//if(!value) return null;
		if(!(value instanceof Array)) value = [value];
		if(cssDataType == "color") return new CssColor(value);
		else if (cssDataType == "url") return new CssUrl(value);
		else if (cssDataType == "length" && (!isNaN(value[0]) || (value[0].indexOf(" ") == -1 && value[0].replace(Util.floatRegex, "") != value[0]))) return new CssLength(value[0]);
		else if (cssDataType == "transformation") return (new CssTransform(value[0])).toString()
		else{
			if(value[0] === "" 
				|| (
					(isNaN(value[0]))
					&& ("" + value[0]).replace(Util.floatRegex, "") == value[0])
				) return new CssUnknown(value[0]); //No numbers.
			if(isNaN(value[0])) return new CssComplex(value[0]); //Numbers
			else return new CssNumber(value[0]); //Just a number.
		}
		
	};

	//Ensures that two complex values match.
	compareComplexDataTypes(value1, value2){
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
	addPropFunctionToDotCssObject(funcName){
		dotcss[funcName] = function(){
			var n = new _Builder();
			return n[funcName].apply(n, arguments);
		}
	};

	// Might remove this.
	// I think this doesn't work. Removing now. Not sure what it was supposed to do.
	// makeTransformFunction(fn){
	// 	dotcss[fn] = function(){
	// 		var n = new Transform();
	// 		return n[fn].apply(n, arguments);
	// 	};
	// }

	computedStyleOrActualStyle(element, property){
		return window.getComputedStyle(element)[property] || element.style[property];
	};

	modDeg(a){
		if(a < 0) a = 360 - ((-a) % 360);
		return a % 360;
	};
}
const dotcss2 = new Dotcss2();


const dotcss = function(query:Array<HTMLElement>|HTMLElement|Array<string>|string){
	//this.currentCss = "";
	var target = null;
	if(query){
		// console.log(query, "?");
		if( typeof query == "string" ) {
			// Creating a style tag. Might not be supported forever.
			if(query.length > 2 && query.indexOf("{}") == query.length - 2){
				// TODO: this needs further testing, particularly when mulitple sytles are set on the same page.
				// Be sure to set up some tests.
				query = query.substring(0, query.length - 2);

				if(!dotcss2.globalStyleElement){
					dotcss2.globalStyleElement = document.createElement("style");
					document.head.appendChild(dotcss2.globalStyleElement);
				}
				target = [dotcss2.globalStyleElement];
				target[0].innerHTML += query + "{}\r\n";
			}
			else {
				// This is overly complicated, but here is the spiel. 
				// If there's an element on the scopeStack, it should be used with the querySelectorAll.
				// BUT, querySelectorAll doesn't actually select the element it's currently on, which is a requirement for dothtml. 
				// To make matters worse, if we do querySelectorAll on the element's parents, we may accidentally select its siblings!!
				// To fix this, we get a list from querySelectorAll on the element, then push the element itself to that list 
				// iff it is in the list of elements queried from its parent. 
				// In addition to all of that, we don't want scoped styles to be applied to child components. 
				var s0 = dotcss2.scopeStack[0];
				// if(s0 instanceof Component){
				// 	s0 = s0.$el;
				// }
				// If we're doing scoped, and it's an element.
				if(s0 && s0.parentNode && s0.querySelectorAll){
					// console.log(s0);
					target = getScopedNodeList(query, s0);
				}
				else{
					target = document.querySelectorAll(query as string);
				}
				// target = referencePt.querySelectorAll(query);
			}
		}

		if((query instanceof NodeList) || (query instanceof Array)) target = query;
		if(query instanceof Node) target = [query]; //Doesn't need to be a NodeList. Just iterable.
	}
	dotcss2.lastBuilder = new _Builder(target);
	return dotcss2.lastBuilder;
} as unknown as IDotCss; // We do this because many of the dotcss methods are generated at runtime. Greatly reduces build size.


dotcss.version = "0.16.0";

function getScopedNodeList(query: String, s0: Element): Array<HTMLElement>{
	// Get all of the matching child elements of the component. This will not include s0 itself, but it does include nested components.
	// So we will need to manipulate this collection.
	// querySelectorAll returns a NodeList, which we need to convert into an Array.
	var target = Array.from(s0.querySelectorAll(query as any));
	// console.log(query, s0.className);

	// Exclude nested components.
	for(var t = 0; t < target.length; t++){
		var T = target[t];

		// Is it a nested component??
		if(T["__dothtml_component"]){
			// It's a component. Remove it, and all of it's descendants. 
			target.splice(t, 1);
			t--;
			
			var subTargets = T.querySelectorAll(query as any);
			for(var s = 0; s < subTargets.length; s++){
				let S = subTargets[s];
				target.splice(target.indexOf(S, t + 1), 1);
			}
		}
	}

	// Loop through all the sibling nodes until we find s0.
	var parentTargets = Array.from(s0.parentNode.querySelectorAll(query as any));

	var p = parentTargets.indexOf(s0);
	if(p != -1){
		target.unshift(parentTargets[p]);
	}
	
	return target;
}

/**
 * The dotcss builder gets extended with all of the css functions at runtime.
*/
export class _Builder{
	currentCss: string;
	targets: Array<HTMLElement>;
	constructor(targets?: Array<HTMLElement>){
		this.currentCss = "";
		this.targets = targets ?? null;
	}

	toString(){
		// console.log("CALLED TOSTRING!", this.currentCss);
		return this.currentCss;
	}

	// These methods are a bit strange to have here.
	// They should probably be a part of the dotcss core object or something.
	// Also, they're the only items that are explicitly part of the builder rather than generated.

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
	hide(style?: {
		duration
		hideStyle
		complete
	}){
		if(this.targets){
			var arg0: HideParams|number = arguments[0] || {};
			var arg0N = arg0 as number;
			var arg0O = arg0 as HideParams;
			var ops: HideParams = {};
			ops.duration = arg0O.duration || (isNaN(arg0N) ? 0 : arg0N) || 0;
			//ops.display = arg0.display || "none";
			//ops.opacity = arg0.opacity || null;
			//ops.width = arg0.width || null;
			//ops.height = arg0.height || null;
			ops.complete = arg0O.complete || (typeof arguments[1] == "function" ? arguments[1] : (typeof arguments[2] == "function" ? arguments[2] : function(){}));
			ops.hideStyle = arg0O.hideStyle || "normal";
			ops.animationStyle = arg0O.animationStyle || (typeof arguments[1] == "string" ? arguments[1] as any : "ease");
	
			if(ops.duration > 0){
				let doneCnt = 0;
				let m = 0;
				let q = this.targets.length;
				for(let i = 0; i < this.targets.length; i++){
					let w = this.targets[i].style.width as NumericLength;
					let h = this.targets[i].style.height as NumericLength;
					let oStr = this.targets[i].style.opacity;
					let o: number;
					if(!oStr || oStr === "") o = 1;
					else o = Number(oStr);
					let ov = this.targets[i].style.overflow;
					if(ops.hideStyle != "fade"){
						this.targets[i].style.overflow = "hidden";
						m += 2;
						(function(that, t, w: NumericLength, h: NumericLength, ov){
							dotcss(t).width.animate(0, ops.duration, ops.animationStyle, function(){
								dotcss(t).display("none").width(w).overflow(ov); //Restore original overflow value. Only needs to be done once.
								doneCnt++; if(doneCnt >= m * q) ops.complete(that);
							});
							dotcss(t).height.animate(0, ops.duration, ops.animationStyle, function(){
								dotcss(t).display("none").height(h);
								doneCnt++; if(doneCnt >= m * q) ops.complete(that);
							});
						})(this, this.targets[i], w, h, ov);	
					}
					if(ops.hideStyle != "shrink"){
						m++;
						(function(that, t, o){
							return dotcss(t).opacity.animate(0, ops.duration, ops.animationStyle, function(){
								dotcss(t).display("none").opacity(o);
								doneCnt++; if(doneCnt >= m * q) ops.complete(that);
							});
						})(this, this.targets[i], o);
					}
				}
			}
			else{
				dotcss(this.targets).display("none");
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
	show(style?: {
		duration
		showStyle
		complete
	}){
		if(this.targets){
			let arg0 = arguments[0] || {};
			let arg0N = arg0 as number;
			let arg0O = arg0 as ShowParams;
			let ops: ShowParams = {};
			ops.duration = arg0O.duration || (isNaN(arg0N) ? 0 : arg0N) || 0;
			ops.display = arg0O.display || "block";
			ops.opacity = arg0O.opacity;
			ops.width = arg0O.width || null;
			ops.height = arg0O.height || null;
			ops.complete = arg0O.complete || (typeof arguments[1] == "function" ? arguments[1] : (typeof arguments[2] == "function" ? arguments[2] : function(){}));
			ops.showStyle = arg0O.showStyle || "normal";
			ops.animationStyle = arg0O.animationStyle || (typeof arguments[1] == "string" ? arguments[1] as any : "ease");

			if(ops.duration > 0){
				let doneCnt = 0;
				let q = this.targets.length;
				let m = 0;
				for(let i = 0; i < this.targets.length; i++){
					let o = ops.opacity;
					if(ops.opacity === undefined){
						o = parseFloat(this.targets[i].style.opacity) || 1;
					}
					if(ops.showStyle != "fade"){
						m += 2;
						let w = ops.width || this.targets[i].style.width as NumericLength;
						let h = ops.height || this.targets[i].style.height as NumericLength;
						
						dotcss(this.targets[i]).width(0);
						dotcss(this.targets[i]).height(0);
						// console.log(doneCnt + " " + q*m);
						dotcss(this.targets[i]).width.animate(w, ops.duration, ops.animationStyle, function(){doneCnt++; if(doneCnt >= q * m) ops.complete();});
						dotcss(this.targets[i]).height.animate(h, ops.duration, ops.animationStyle, function(){doneCnt++; if(doneCnt >= q * m) ops.complete();});
					}

					//let o = this.target[i].style.opacity; //Guess I should fade to 1?
					dotcss(this.targets[i]).opacity(0);
					dotcss(this.targets[i]).display(ops.display);

					if(ops.showStyle != "grow"){
						m++;
						dotcss(this.targets[i]).opacity.animate(o, ops.duration, ops.animationStyle, function(){doneCnt++; if(doneCnt == q * m) ops.complete();});
					}
				}
			}
			else{
				return dotcss(this.targets).display(ops.display);
			}
		}
		return this;
	}

	fadeOut(duration, complete){
		return this.hide({
			duration: isNaN(duration) ? 400 : Number(duration), 
			hideStyle: "fade",
			complete: complete
		});
	};
	
	fadeIn(duration, complete){
		return this.show({
			duration: isNaN(duration) ? 400 : Number(duration), 
			showStyle: "fade",
			complete: complete
		});
	};
}

// This could be better handeld. Consider putting it inside the dotcss class.
dotcss.prototype.toString = _Builder.prototype.toString;

// Why do we need this?
class _StyleProperty{
	type: CssDataTypeToken;
	jsFriendlyProp: string;
	constructor(){
		this.type = null;
		this.jsFriendlyProp = null;

	}
	//toString override gets the value.
	toString(): string{
		if(dotcss2.lastBuilder.targets){
			// TODO: this doesn't make sense. Please figure it out.
			let ret = null;
			if(dotcss2.lastBuilder.targets.length > 1){
				ret = [];
				for(let i = 0; i < dotcss2.lastBuilder.targets.length; i++){
					ret.push(dotcss2.lastBuilder.targets[i].style[this.jsFriendlyProp]);
				}
			}
			else ret = dotcss2.lastBuilder.targets[0].style[this.jsFriendlyProp];
			return ret;
		}
		else return null;
	}
	
	//val is another special function that breaks the value into a special object.
	val(){
		if(dotcss2.lastBuilder.targets){
			let ret = null;
			// TODO: something wrong with this. Types don't check out.
			if(dotcss2.lastBuilder.targets.length > 1){
				ret = null;
				for(let i = 0; i < dotcss2.lastBuilder.targets.length; i++){
					if(dotcss2.lastBuilder.targets[0].style[this.jsFriendlyProp]){
						ret.push(dotcss2.convertStyleIntoDotCssObject(dotcss2.lastBuilder.targets[i].style[this.jsFriendlyProp], this.type));
					}
					else ret.push(null);
				}
			}
			else{
				if(dotcss2.lastBuilder.targets[0].style[this.jsFriendlyProp]){
					ret = dotcss2.convertStyleIntoDotCssObject(dotcss2.lastBuilder.targets[0].style[this.jsFriendlyProp], this.type)
				}
				else ret = null;
			}
			return ret;
		}
		else return null;
	}
	
	//Ability to animate just like jquery.
	//complete does not get called if the animation was cancelled.
	animate(value, duration, style, complete){
		duration = isNaN(duration) ? 400 : (duration || 0);
		if(dotcss2.lastBuilder && dotcss2.lastBuilder.targets){
			if(!complete && style && style.call && style.apply){ //Fix params.
				complete = style;
				style = undefined;
			}
			for(let i = 0; i < dotcss2.lastBuilder.targets.length; i++){
				let target = dotcss2.lastBuilder.targets[i];
				let oldValue = null;
				let newValue = null;
				let finalValue = null; //newValue might be in different units from the final value...
	
				//Get the old and new values.
				newValue = dotcss2.convertStyleIntoDotCssObject(value, this.type);
	
				//If it's a transformation, a little extra work is required.
				//Need to frame all the rotations properly, and combine both the new and the old transformations.
				if(this.type == "transformation"){
					//Special handling. We'd like to consider the transformation as a complex data type first, then if that's not possible, convert it into a matrix data type.
					//Reason being: linear transformations on matrices are inaccurate. Rotations end up scaling the target.
					//Don't want to get the computed value for transformations.
					oldValue = dotcss2.convertStyleIntoDotCssObject(target.style[this.jsFriendlyProp], this.type);
				}
				if(!oldValue){ //Standard. Happens when the type is not a transformation.
					oldValue = dotcss2.convertStyleIntoDotCssObject(dotcss2.computedStyleOrActualStyle(target, this.jsFriendlyProp), this.type);
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
							let currentLengthPx = dotcss.lengthToPx(oldValue.toString(), this.jsFriendlyProp as LengthProp, target);
							let newLengthPx = dotcss.lengthToPx(newValue.toString(), this.jsFriendlyProp as LengthProp, target);
							oldValue.length = currentLengthPx;
							oldValue.units = "px";
							newValue.length = newLengthPx;
							newValue.units = "px";
	
							//Won't need this anymore.
							//console.warn("Couldn't animate " + this.jsFriendlyProp + ". Inconsistent units.");
							//return dotcss2._lastBuilder;
						}
					}
				}
				else if(this.type == "color"){} //OK
				else if(this.type == "transformation"){
					//Couple things to do here.
					//1. The old and new values must contain the exact same transformation template.
					//2. Angles in the old transformation should be reframed so that they are close to the new angles (or should they)
	
					let startTransform = "";
					let desiredTransform = "";
					let oldIndex = oldValue.transformations.length - 1;
					let newIndex = newValue.transformations.length - 1;
					while(oldIndex >= 0 || newIndex >= 0){
						let transformToAdd = "";
						let oldTransformValues = null;
						let newTransformValues = null;
						if(oldIndex >= 0 && newIndex >= 0 && oldValue.transformations[oldIndex].transformation == newValue.transformations[newIndex].transformation){
							let currentOldT = oldValue.transformations[oldIndex];
							let currentNewT = newValue.transformations[newIndex];
							
							transformToAdd = currentOldT.transformation;
							oldTransformValues = currentOldT.args;
							newTransformValues = currentNewT.args;
	
							oldIndex--;
							newIndex--;
						}
						else if(oldIndex >= newIndex){
							let currentOldT = oldValue.transformations[oldIndex];
							transformToAdd = currentOldT.transformation;
							oldTransformValues = currentOldT.args;
							if(transformToAdd == "matrix"){
								newTransformValues = [1,0, 0,1, 0,0];
							}
							else if(transformToAdd == "matrix3d"){
								newTransformValues = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
							}
							else {
								let filler = (transformToAdd.indexOf("scale") == -1) ? 0 : 1;
								newTransformValues = [];
								for(let j = 0; j < oldTransformValues.length; j++) newTransformValues.push(!isNaN(oldTransformValues[j]) ? filler : (
									!isNaN(oldTransformValues[j].angle) ? new CssAngle(0) : (
										!isNaN(oldTransformValues[j].length) ? new CssLength(0) : (0)
									)));
							}
							oldIndex--;
						}
						else{
							let currentNewT = newValue.transformations[newIndex];
							transformToAdd = currentNewT.transformation;
							newTransformValues = currentNewT.args;
							if(transformToAdd == "matrix"){
								oldTransformValues = [1,0, 0,1, 0,0];
							}
							else if(transformToAdd == "matrix3d"){
								oldTransformValues = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
							}
							else {
								let filler = (transformToAdd.indexOf("scale") == -1) ? 0 : 1;
								oldTransformValues = [];
								for(let j = 0; j < newTransformValues.length; j++) oldTransformValues.push(!isNaN(newTransformValues[j]) ? filler : (
									!isNaN(newTransformValues[j].angle) ? new CssAngle(0) : (
										!isNaN(newTransformValues[j].length) ? new CssLength(0) : (0)
									)));
							}
							newIndex--;
						}
	
						startTransform = ") " + startTransform;
						desiredTransform = ") " + desiredTransform;
						//Handle special values here.
						if(transformToAdd.indexOf("rotate") != -1){
							let oldAngle = oldTransformValues[oldTransformValues.length - 1].angle;
							let newAngle = newTransformValues[newTransformValues.length - 1].angle;
							let sep = dotcss.angleSubtract(newAngle, oldAngle);
							oldTransformValues[oldTransformValues.length - 1].angle = newAngle - sep;
						}
						for(let j = oldTransformValues.length - 1; j >= 0; j--){
							startTransform = "," + oldTransformValues[i] + startTransform;
							desiredTransform = "," + newTransformValues[i] + desiredTransform;
						}
						startTransform = transformToAdd + "(" + startTransform.substring(1);
						desiredTransform = transformToAdd + "(" + desiredTransform.substring(1);
					}
					oldValue = dotcss2.convertStyleIntoDotCssObject(startTransform, "transformation");
					newValue = dotcss2.convertStyleIntoDotCssObject(desiredTransform, "transformation");
	
				}
				else if(oldValue.type == "number" && newValue.type == "number"){} //OK
				else if(oldValue.type == "complex" && newValue.type == "complex"){
					if(!dotcss2.compareComplexDataTypes(oldValue, newValue)){
						console.warn("Couldn't animate " + this.jsFriendlyProp + ". Value mismatch.");
						continue;
					}
				}
				else{
					console.warn("Couldn't animate " + this.jsFriendlyProp + ". Not a recognizable length, color, or number.");
					continue;
				}
				dotcss2.animateFull(target, this.jsFriendlyProp, oldValue.type || this.type, oldValue, newValue, finalValue, dotcss2.fxInterval, duration, style || "ease", complete);
			}
		}
		return dotcss2.lastBuilder;
	}
	
	//Have to add these back since we're going to replace the __proto__ of a function with this new prototype.
	apply = Function.apply;
	call = Function.call;
};

dotcss.formatNumberValue = function(value, unit){
	switch(unit){
		case "px": return Math.round(value);
		default: return Math.round(value * 100) / 100;
	}
};

const _allProps = {
	color: "color|background-Color|border-Bottom-Color|border-Color|border-Left-Color|border-Right-Color|border-Top-Color|text-Decoration-Color|outline-Color|column-Rule-Color",
	length: "background-Size|border-Bottom-Left-Radius|border-Bottom-Right-Radius|border-Bottom-Width|border-Image-Width|border-Left-Width|border-Radius|border-Right-Width|border-Top-Left-Radius|border-Top-Right-Radius|border-Top-Width|border-Width|bottom|height|left|margin|margin-Bottom|margin-Left|margin-Right|margin-Top|max-Height|max-Width|min-Height|min-Width|padding|padding-Bottom|padding-Left|padding-Right|padding-Top|right|top|width|line-Height|flex-Basis|font-Size",
	url: "background-Image|border-Image|list-Style-Image|content|image-Orientation",
	transformation: "transform",
	misc: "opacity|background|background-Attachment|background-Blend-Mode|background-Position|background-Repeat|background-Clip|background-Origin|border|border-Bottom|border-Bottom-Style|border-Image-Outset|border-Image-Repeat|border-Image-Slice|border-Image-Source|border-Left|border-Left-Style|border-Right|border-Right-Style|border-Style|border-Top|border-Top-Style|box-Decoration-Break|box-Shadow|clear|clip|display|float|overflow|box|overflow-X|overflow-Y|position|visibility|vertical-Align|z-Index|align-Content|align-Items|align-Self|flex|flex-Basis|flex-Direction|flex-Flow|flex-Grow|flex-Shrink|flex-Wrap|grid|grid-Area|grid-Auto-Columns|grid-auto-Rows|grid-Column|grid-Column-End|grid-Column-Gap|grid-Column-Start|grid-Gap|grid-Row|grid-Row-End|grid-Row-Gap|grid-Row-Start|grid-Template|grid-Template-Areas|grid-Template-Columns|grid-Template-Rows|justify-Content|order|hanging-Punctuation|hyphens|letter-Spacing|line-Break|overflow-Wrap|tab-Size|text-Align|text-Align-Last|text-Combine-Upright|text-Indent|text-Justify|text-Transform|white-Space|word-Break|word-Spacing|word-Wrap|text-Decoration|text-Decoration-Line|text-Decoration-Style|text-Shadow|text-Underline-Position|font|font-Family|font-Feature-Settings|font-Kerning|font-Language-Override|font-Size-Adjust|font-Stretch|font-Style|font-Synthesis|font-Variant|font-Variant-Alternates|font-Variant-Caps|font-Variant-East-Asian|font-Variant-Ligatures|font-Variant-Numeric|font-Variant-Position|font-Weight|direction|text-Orientation|text-Combine-Upright|unicode-Bidi|user-Select|writing-Mode|border-Collapse|border-Spacing|caption-Side|empty-Cells|table-Layout|counter-Increment|counter-Reset|list-Style|list-Style-Position|list-Style-Type|animation|animation-Delay|animation-Direction|animation-Duration|animation-Fill-Mode|animation-Iteration-Count|animation-Name|animation-Play-State|animation-Timing-Function|backface-Visibility|perspective2d|perspective-Origin|transform-Origin|transform-Style|transition|transition-Property|transition-Duration|transition-Timing-Function|transition-Delay|box-Sizing|cursor|ime-Mode|nav-Down|nav-Index|nav-Left|nav-Right|nav-Up|outline|outline-Offset|outline-Style|outline-Width|resize|text-Overflow|break-After|break-Before|break-Inside|column-Count|column-Fill|column-Gap|column-Rule|column-Rule-Style|column-Rule-Width|column-Span|column-Width|columns|widows|orphans|page-Break-After|page-Break-Before|page-Break-Inside|marks|quotes|filter|image-Rendering|image-Resolution|object-Fit|object-Position|mask|mask-Type|mark|mark-After|mark-Before|phonemes|rest|rest-After|rest-Before|voice-Balance|voice-Duration|voice-Pitch|voice-Pitch-Range|voice-Rate|voice-Stress|voice-Volume|marquee-Direction|marquee-Play-Count|marquee-Speed|marquee-Style|pointer-Events"
}

// const _allTransforms = [
// 	"matrix",
// 	"matrix3d",
// 	"translate",
// 	"translate3d",
// 	"translateX",
// 	"translateY",
// 	"translateZ",
// 	"scale",
// 	"scale3d",
// 	"scaleX",
// 	"scaleY",
// 	"scaleZ",
// 	"rotate",
// 	"rotate3d",
// 	"rotateX",
// 	"rotateY",
// 	"rotateZ",
// 	"skew",
// 	"skewX",
// 	"skewY",
// 	"perspective"
// ]

// TODO: this may have been intended to be private.

dotcss.matrixMultiply3D = function(A: Array<number>, B: Array<number>){
	if(A.length != 16 || B.length != 16) throw "3D matrices must be arrays of 16 length.";
	var ret = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	for(var y = 0; y < 4; y++)
		for(var x = 0; x < 4; x++)
			for(var i = 0; i < 4; i++)
				ret[y + x * 4] += Number(A[y + i * 4]) * Number(B[i + x * 4]);
	return ret;
};

//Public functions.

// TODO: this doesn't really belong in here. This is like a math lib.



// // TODO: I don't think these are really needed. The css types take care of these.

// dotcss.angleSubtract = function(a: number, b: number):number{
// 	if(a < 0) a = 360 - ((-a) % 360); else a = a % 360;
// 	if(b < 0) b = 360 - ((-b) % 360); else b = b % 360;
// 	var phi = Math.abs(b - a) % 360;
// 	var d = phi > 180 ? 360 - phi : phi;
// 	var sign = (a - b >= 0 && a - b <= 180) || (a - b <=-180 && a- b>= -360) ? 1 : -1;
// 	return d * sign;
// };

// //Special handler for building urls.
// dotcss.url = function(url: string): string{
// 	return `url('${url}')`;
// };

// //Special handler for building rgb colors.
// dotcss.rgb = function(r: number, g: number, b: number): string{
// 	return `rgb(${r},${g},${b})`;
// };

// //Special handler for building rgba colors.
// dotcss.rgba = function(r: number, g: number, b: number, a: number): string{
// 	return `rgba(${r},${g},${b},${a})`;
// };

// We don't do this anymore.
// dotcss.buildTransform = function(){
// 	return new dotcss2._Transform();
// };

dotcss["cacheScopedStaticStyles"] = function(el: HTMLElement){
	let elements = getScopedNodeList("*", el);
	for(let element of elements){
		if(element.hasAttribute("style")){
			element.setAttribute(STATIC_SYLES_ATTR, element.getAttribute("style"));
		}
	}
}

dotcss["clearDynamicStyles"] = function(el: HTMLElement){
	let elements = getScopedNodeList("*", el);
	for(let element of elements){
		element.removeAttribute("style");
		if(element.hasAttribute(STATIC_SYLES_ATTR)){
			element.setAttribute("style", element.getAttribute(STATIC_SYLES_ATTR));
		}
	}
}

dotcss.scopeToEl = function(el: HTMLElement){
	dotcss2.scopeStack.unshift(el);
	return this;
};
dotcss.unscope = function(){
	dotcss2.scopeStack.shift();
	return this;
};

//Build dotcss.
for(var k in _allProps) {
	let P = _allProps[k].split("|");
	for(var i in P){
		dotcss2.extendDothtml(P[i].toLowerCase(), P[i].replace(new RegExp("-", "g"), ""), k);
	}
}
// for(let i: number = 0; i < _allLengthUnits.length; i++) dotcss2.makeTransformFunction(_allLengthUnits[i]);

//dotcss = new dotcss();

// for (var k in _b) {
// 	if(_Builder[k] === undefined) dotcss[k] = _p[k];
// }

export default dotcss;







// Old stuff that might not be needed anymore?
// angleToDeg: function(a: number|string){
// 	if(!isNaN(a as number)) return Number(a); //If there are no units, assume deg.
// 	a = (a as string).trim();
// 	if(a.indexOf("deg") != -1) return dotcss.formatNumberValue(Number(a.split("deg")[0]));
// 	else if(a.indexOf("grad") != -1) return dotcss.formatNumberValue(Number(a.split("grad")[0]) * 0.9);
// 	else if(a.indexOf("rad") != -1) return dotcss.formatNumberValue(Number(a.split("rad")[0]) * 180 / Math.PI);
// 	else if(a.indexOf("turn") != -1) return dotcss.formatNumberValue(Number(a.split("turn")[0]) * 360);
// 	else throw a + " does not have valid units for an angle."
// },	lengthToPx: function(l: string|number, prop?: LengthProp, element?: Element){
// 	var R = Math.round;
// 	var N = Number;
// 	if(!isNaN(l as number)) return R(N(l)); //If there are no units, assume px.
// 	l = (l as string).trim();
// 	var S = l.split;
// 	//Absolute:
// 	if(l.indexOf("px") != -1) return R(N(l.split("px")[0]));
// 	else if(l.indexOf("in") != -1) return R(N(l.split("in")[0]) * 96);
// 	else if(l.indexOf("pt") != -1) return R(N(l.split("pt")[0]) * 96 / 72);
// 	else if(l.indexOf("pc") != -1) return R(N(l.split("pc")[0]) * 16);
// 	else if(l.indexOf("cm") != -1) return R(N(l.split("cm")[0]) * 96 / 2.54);
// 	else if(l.indexOf("mm") != -1) return R(N(l.split("mm")[0]) * 96 / 25.4);
// 	else if(l.indexOf("q") != -1) return R(N(l.split("q")[0]) * 96 / 101.6);
// 	//Technically relative:
// 	else if(l.indexOf("vw") != -1) return R(N(l.split("vw")[0]) * 0.01 * Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
// 	else if(l.indexOf("vh") != -1) return R(N(l.split("vh")[0]) * 0.01 * Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
// 	else if(l.indexOf("vmin") != -1) return Math.min(Util.lengthToPx(R(N(l.split("vmin")[0]+ "vw"))), R(N(l.split("vmin")[0]+ "vx"))); //I know this is slow, but it's compact, and it's not like this is a common unit.
// 	else if(l.indexOf("vmax") != -1) return Math.max(Util.lengthToPx(R(N(l.split("vmin")[0]+ "vw"))), R(N(l.split("vmin")[0]+ "vx")));
// 	else if(l.indexOf("rem") != -1) return R(N(l.split("rem")[0]) * Util.lengthToPx(dotcss2._computedStyleOrActualStyle(document.body, "fontSize"))); //Couldn't get a stack overflow if it's a computed value. Always in px.

// 	//Absolutely relative:
// 	else if (prop && element) {
// 		//If we're setting things relative to font sizes, that's easy.
// 		//Can't animate ex or ch. Sorry.
// 		if(l.indexOf("em") != -1) return R(N(l.split("em")[0]) * Util.lengthToPx(dotcss2._computedStyleOrActualStyle(element, "fontSize")));

// 		var ref = null;
// 		switch(prop){
// 			case "maxHeight":
// 			case "minHeight":
// 			case "top":
// 			case "bottom":
// 			case "height":
// 				if(!element.parentNode) throw "Cannot convert " + l + " " + prop + " to px for an element that has no parent."
// 				ref = Util.lengthToPx(dotcss2._computedStyleOrActualStyle(element.parentNode, "height"));
// 				break;
// 			case "maxHidth":
// 			case "minWidth":
// 			case "right":
// 			case "left":
// 			case "width":
// 			case "margin": //Yes, all padding and margins are relative to width.
// 			case "marginTop":
// 			case "marginBottom":
// 			case "marginLeft":
// 			case "marginRight":
// 			case "outlineOffset":
// 			case "padding":
// 			case "paddingTop":
// 			case "paddingBottom":
// 			case "paddingLeft":
// 			case "paddingRight":
// 				ref = Util.lengthToPx(dotcss2._computedStyleOrActualStyle(element.parentNode, "width"));
// 				if(!element.parentNode) throw "Cannot convert " + l + " " + prop + " to px for an element that has no parent."
// 				break;
// 			case "lineHeight": //Always relative to font. Would actually be nice to be able to set this relative to container though
// 				ref = Util.lengthToPx(dotcss2._computedStyleOrActualStyle(element, "fontSize"));
// 				break;
// 			case "fontSize": //Thought this is not strictly allowed in css, we'll assume it means relative to current element's height.
// 				ref = Util.lengthToPx(dotcss2._computedStyleOrActualStyle(element, "height"));
// 				break;
// 			default:
// 				throw "Unable to convert the value " + l + " to px for " + prop + ".";
// 		}

// 		if(isNaN(ref)) throw "Convert the value " + l + " to px for " + prop + " because the value it is relative to is not a number.";
		
// 		if(l.indexOf("%") != -1) return R(N(l.split("%")[0]) * 0.01 * ref);
// 		else throw "The units of " + l + " are not recognized by dotcss.";
// 	}
// 	else throw l + " does not have valid units for an absolute length.";
// },