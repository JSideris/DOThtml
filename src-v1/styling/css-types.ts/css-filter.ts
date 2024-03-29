import { isF } from "../../dot-util";
import CssDataType from "./css-data-type";
import CssLength from "./css-length";
import CssPercentage from "./css-percentage";
import CssColor from "./css-color";
import { AngleUnits, ColorFormat, NumericLength, Percentage } from "dothtml-interfaces";

export default class CssFilter extends CssDataType{
		
	simpleValue: string;
	filters: Array<{
		filter: string,
		args: Array<any>
	}> = [];

	constructor(value){
		super("filter");
		
		if(typeof value == "string"){
			this.simpleValue = value;
			return; //?? Need a better way to handle this.
		}
		else if(isF(value)){
			value(this);
			// console.log(this.toString());
		}
		//var ret = {value: value, type: cssDataType};

		// The old way of doing transformations was that it was set up to accept a big string. The added complexity was to support animations.
		// The new way is to use the builder. But I might want to come back and revisit the idea of accepting a string.
		// For instance, a use case of accepting a string for a transformation is if we're trying to animate transforms generated by another framework.
		// Not sure if that's realistic.
		// var transformations = value.split(/\)\s*/); transformations.pop(); for(var i = 0; i < transformations.length; i++) transformations[i] += ")";
		// // var cos = Math.cos; var sin = Math.sin; var tan = Math.tan;
		// for(var t = 0; t < transformations.length; t++){
		// 	var trans = transformations[t].trim();
		// 	var parts = trans.split(/[\(\)]/);
		// 	var func = parts[0]
		// 	var p = parts[1].split(/\s*,\s*/)
		
		// 	if(this[func]){
		// 		this[func].apply(this, p);
		// 	}
		// }
	}
	
	toString(){
		if(this.simpleValue){
			return this.simpleValue;
		}

		var ret = "";
		for(var i = 0; i < this.filters.length; i++){
			var t = this.filters[i];
			ret += t.filter + "(";
			for(var k = 0; k < t.args.length; k++){
				ret += t.args[k].toString() + " ";
			}
			ret = ret.trim() + ") ";
		}
		return ret.trim();
	}
	
	private appendFilterString(filter: string, args){
		//this.finalMatrix = dotcss.matrixMultiply3D(m, this.finalMatrix);
		this.filters.push({filter: filter, args: args});
		/*if(this.value.length > 0) this.value += " ";
		this.value += transformation + "(";
		for(var i = 0; i < args.length; i++){
			this.value += args[i] + (i == args.length -1 ? "" : ",")
		}*/
		return this;
	}

	blur(v: NumericLength){
		return this.appendFilterString("blur", [new CssLength(v)]);
	}
	brightness(v: Percentage){
		return this.appendFilterString("brightness", [new CssPercentage(v)]);
	}
	contrast(v: Percentage){
		return this.appendFilterString("contrast", [new CssPercentage(v)]);
	}
	dropShadow(x: NumericLength, y: NumericLength, blur: NumericLength, color: ColorFormat){
		return this.appendFilterString("drop-shadow", [new CssLength(x), new CssLength(y), new CssLength(blur), new CssColor(color)]);
	}
	grayscale(v: Percentage){
		return this.appendFilterString("grayscale", [new CssPercentage(v)]);
	}
	hueRotate(v: AngleUnits){
		return this.appendFilterString("hue-rotate", [new CssPercentage(v)]);
	}
	invert(v: Percentage){
		return this.appendFilterString("invert", [new CssPercentage(v)]);
	}
	opacity(v: Percentage){
		return this.appendFilterString("opacity", [new CssPercentage(v)]);
	}
	sepia(v: Percentage){
		return this.appendFilterString("sepia", [new CssPercentage(v)]);
	}
	saturate(v: Percentage){
		return this.appendFilterString("saturate", [new CssPercentage(v)]);
	}
}

// Extend the above with special length and degree functions.

// TODO: when I have some time it would be nice to do the unit functions the same way we do for transforms.
// const lengthFuncs = "translate|translate3d|translateX|translateY|translateZ|perspective".split("|");
// const angleFuncs = "rotate|rotateX|rotateY|rotateZ|skew|skewX|skewY".split("|");

// for(let i = 0; i < lengthFuncs.length; i++){
// 	let F = lengthFuncs[i];
// 	for(let u = 0; u < AllLengthUnits.length; u++){
// 		let uu = AllLengthUnits[u];
// 		CssTransform.prototype[F + (uu.jsName || uu.unit)] = function(){
// 			for(var i = 0; i < arguments.length; i++) arguments[i] = arguments[i] + uu.unit.toLowerCase();
// 			return CssTransform.prototype[F].apply(this, arguments);
// 		}
// 	}
// }
// for(let i = 0; i < angleFuncs.length; i++){
// 	let F = angleFuncs[i];
// 	for(let u = 0; u < AllAngleUnits.length; u++){
// 		let uu = AllAngleUnits[u];
// 		CssTransform.prototype[F + (uu.unit)] = function(){
// 			for(var i = 0; i < arguments.length; i++) arguments[i] = arguments[i] + uu.unit.toLowerCase();
// 			return CssTransform.prototype[F].apply(this, arguments);
// 		}
// 	}
// }