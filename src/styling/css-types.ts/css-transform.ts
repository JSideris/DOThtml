import { isF } from "../../dot-util";
import Util from "../../util";
import {AllAngleUnits, AllLengthUnits} from "../unit-function-tables";
import { BasicCommonValues, ITransformationContext, NumericAngle, NumericLength } from "../i-dotcss";
import dotcss from "../style-builder";
import CssAngle from "./css-angle";
import CssDataType from "./css-data-type";
import CssLength from "./css-length";

export default class CssTransform extends CssDataType{
	
	transformations: Array<{
		transformation: string,
		args: Array<any>
	}>;
	finalMatrix: number[];
	simpleValue: string;
	
	constructor(value){
		super("transformation");
		this.transformations = [];
		//this.finalMatrix = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
		if(typeof value == "string"){
			//this.value = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
			this.simpleValue = value;
			return; //?? Need a better way to handle this.
		}
		else if(isF(value)){
			value(this);
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
		for(var i = 0; i < this.transformations.length; i++){
			var t = this.transformations[i];
			ret += t.transformation + "(";
			for(var k = 0; k < t.args.length; k++){
				ret += t.args[k].toString() + ",";
			}
			ret = ret.substring(0, ret.length - 1);
			ret += ") ";
		}
		return ret.trim();
	}
	
	private appendTransformString(transformation, args){
		//this.finalMatrix = dotcss.matrixMultiply3D(m, this.finalMatrix);
		this.transformations.push({transformation: transformation, args: args});
		/*if(this.value.length > 0) this.value += " ";
		this.value += transformation + "(";
		for(var i = 0; i < args.length; i++){
			this.value += args[i] + (i == args.length -1 ? "" : ",")
		}*/
		return this;
	}
	
	matrix3d(a1:number, b1:number, c1:number, d1:number, a2:number, b2:number, c2:number, d2:number, a3:number, b3:number, c3:number, d3:number, a4:number, b4:number, c4:number, d4:number){
		// Why do we need this again?
		// Going to try to remove it to see what breaks. I believe it's used for animations.
		// this.finalMatrix = dotcss.matrixMultiply3D(arguments as unknown as Array<number>, this.finalMatrix);
		return this.appendTransformString("matrix3d", arguments);
	}
	
	matrix(a: number, b: number, c: number, d: number, tx: number, ty: number){
		return this.appendTransformString("matrix", arguments);
	}
	
	translate(x:NumericLength,y?:NumericLength){
		return arguments.length == 1 
			? this.appendTransformString("translate", [new CssLength(x)]/*, [1,0,0,0,0,1,0,0,0,0,1,0,x,0,0,1]*/) 
			: this.appendTransformString("translate", [new CssLength(x), new CssLength(y)]/*, [1,0,0,0,0,1,0,0,0,0,1,0,x,y,0,1]*/);
	}
	
	translate3d(x:NumericLength,y:NumericLength,z:NumericLength){
		return this.appendTransformString("translate3d", [new CssLength(x), new CssLength(y), new CssLength(z)]/*, [1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]*/);
	}
	
	translateX(x:NumericLength){
		
		//var x = dotcss.lengthToPx(p[0]);
		//this.updateValue("translateX", [new CssLength(x + "px")]/*, [1,0,0,0,0,1,0,0,0,0,1,0,x,0,0,1]*/);
		return this.appendTransformString("translateX", [new CssLength(x)]);
	}
	
	translateY(y:NumericLength){
		//var y = dotcss.lengthToPx(p[0]);
		//this.updateValue("translateY", [new CssLength(y + "px")]/*, [1,0,0,0,0,1,0,0,0,0,1,0,0,y,0,1]*/);
		return this.appendTransformString("translateY", [new CssLength(y)]);
	}
	
	translateZ(z:NumericLength){
		
		//var z = dotcss.lengthToPx(p[0]);
		//this.updateValue("translateZ", [new CssLength(z + "px")]/*, [1,0,0,0,0,1,0,0,0,0,1,0,0,0,z,1]*/);
		return this.appendTransformString("translateZ", [new CssLength(z)]);
	}
	
	scale(x:number,y?:number){
		return this.appendTransformString("scale", [x,y??1]/*, [x,0,0,0,0,y,0,0,0,0,1,0,0,0,0,1]*/);
	}
	
	scale3d(x:number,y:number,z:number){
		return this.appendTransformString("scale3d", [x,y,z]/*, [p[0],0,0,0,0,p[1],0,0,0,0,p[2],0,0,0,0,1]*/);
	}
	
	scaleX(x:number){
		//this.updateValue("scaleX", p/*, [p[0],0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]*/);
		return this.appendTransformString("scaleX", [x]);
	}
	
	scaleY(y:number){
		//this.updateValue("scaleY", p/*, [1,0,0,0,0,p[0],0,0,0,0,1,0,0,0,0,1]*/);
		return this.appendTransformString("scaleY", [y]);
	}
	
	scaleZ(z:number){
		//this.updateValue("scaleZ", p/*, [1,0,0,0,0,1,0,0,0,0,p[0],0,0,0,0,1]*/);
		return this.appendTransformString("scaleZ", [z]);
	}
	
	rotate(x: NumericAngle){
		// var a = Util.angleToDeg(x);
		return this.appendTransformString("rotate", [new CssAngle(x)]/*, [Math.cos(a),Math.sin(a),0,0,-Math.sin(axxx),Math.cos(axxx),0,0,0,0,1,0,0,0,0,1]*/);
	}
	
	rotate3d(x: number, y: number, z: number, a: NumericAngle){
		
		return this.appendTransformString("rotate3d", [x, y, z, new CssAngle(a)]/*, 
			[1+C*(x*x-1),	z*S+x*y*C,		-y*S+x*z*C,		0,
			-z*S+x*y*C,		1+C*(y*y-1),	x*S+y*z*C,		0,
			y*S+x*z*C,		-x*S+y*z*C,		1+C*(z*z-1),	0,
			0,				0,				0,				1]*/
		);
	}

	// Manually create the 4 unit functions for rotate 3d since the arg structure is mixed.
	rotate3dDeg(x: number, y: number, z: number, a: number){return this.rotate3d(x,y,z,a);}
	rotate3dRad(x: number, y: number, z: number, a: number){return this.rotate3d(x,y,z,`${a}rad`);}
	rotate3dGrad(x: number, y: number, z: number, a: number){return this.rotate3d(x,y,z,`${a}grad`);}
	rotate3dTurn(x: number, y: number, z: number, a: number){return this.rotate3d(x,y,z,`${a}turn`);}
	
	rotateX(x: NumericAngle){
		return this.appendTransformString("rotateX", [new CssAngle(x)]/*, [1,0,0,0,0,Math.cos(axx),Math.sin(axx),0,0,-Math.sin(axx),Math.cos(axx),0,0,0,0,1]*/);
	}
	
	rotateY(y: NumericAngle){
		return this.appendTransformString("rotateY", [new CssAngle(y)]);
	}
	
	rotateZ(z: NumericAngle){
		return this.appendTransformString("rotateZ", [new CssAngle(z)]);
	}
	
	skew(x: NumericAngle, y?: NumericAngle){
		
		return arguments.length == 1 
			? this.appendTransformString("skew", [new CssAngle(x)]/*, [1,0,0,0,Math.tan(axxxxx),1,0,0,0,0,1,0,0,0,0,1]*/)
			: this.appendTransformString("skew", [new CssAngle(x), new CssAngle(y)]/*, [1,Math.tan(axxxy),0,0,Math.tan(axxxx),1,0,0,0,0,1,0,0,0,0,1]*/);
	}
	
	skewX(x: NumericAngle){
		return this.appendTransformString("skewX", [new CssAngle(x)]);
	}
	
	skewY(y: NumericAngle){
		return this.appendTransformString("skewY", [new CssAngle(y)]);
	}
	
	perspective(d: NumericLength){
		return this.appendTransformString("perspective", [new CssLength(d)]/*, [1,0,0,0,0,1,0,0,0,0,1,0,0,0,dotcss.formatNumberValue(-1 / d),1]*/);
	}
}

// Extend the above with special length and degree functions.

const lengthFuncs = "translate|translate3d|translateX|translateY|translateZ|perspective".split("|");
const angleFuncs = "rotate|rotateX|rotateY|rotateZ|skew|skewX|skewY".split("|");

for(let i = 0; i < lengthFuncs.length; i++){
	let F = lengthFuncs[i];
	for(let u = 0; u < AllLengthUnits.length; u++){
		let uu = AllLengthUnits[u];
		CssTransform.prototype[F + (uu.jsName || uu.unit)] = function(){
			for(var i = 0; i < arguments.length; i++) arguments[i] = arguments[i] + uu.unit.toLowerCase();
			return CssTransform.prototype[F].apply(this, arguments);
		}
	}
}
for(let i = 0; i < angleFuncs.length; i++){
	let F = angleFuncs[i];
	for(let u = 0; u < AllAngleUnits.length; u++){
		let uu = AllAngleUnits[u];
		CssTransform.prototype[F + (uu.unit)] = function(){
			for(var i = 0; i < arguments.length; i++) arguments[i] = arguments[i] + uu.unit.toLowerCase();
			return CssTransform.prototype[F].apply(this, arguments);
		}
	}
}