import { NumericAngle, NumericLength } from "dothtml-interfaces";
import CssFunctionBuilderVStyle from "./css-function-builder-v-style";
import { formatCssAngle, formatCssLength } from "../css/format-css-type";


export default class TransformVStyle extends CssFunctionBuilderVStyle{

	matrix3d(a1:number, b1:number, c1:number, d1:number, a2:number, b2:number, c2:number, d2:number, a3:number, b3:number, c3:number, d3:number, a4:number, b4:number, c4:number, d4:number){
		return this.appendFunction("matrix3d", arguments);
	}
	
	matrix(a: number, b: number, c: number, d: number, tx: number, ty: number){
		return this.appendFunction("matrix", arguments);
	}
	
	translate(x:NumericLength,y?:NumericLength){
		return arguments.length == 1 
			? this.appendFunction("translate", [{f:formatCssLength, v:x}]/*, [1,0,0,0,0,1,0,0,0,0,1,0,x,0,0,1]*/) 
			: this.appendFunction("translate", [{f:formatCssLength, v:x}, {f:formatCssLength, v:y}]/*, [1,0,0,0,0,1,0,0,0,0,1,0,x,y,0,1]*/);
	}
	
	translate3d(x:NumericLength,y:NumericLength,z:NumericLength){
		return this.appendFunction("translate3d", [{f:formatCssLength, v:x}, {f:formatCssLength, v:y}, {f:formatCssLength, v:z}]/*, [1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]*/);
	}
	
	translateX(x:NumericLength){
		
		//var x = dotcss.lengthToPx(p[0]);
		//this.updateValue("translateX", [{f:formatCssLength, v:x + "px")]/*, [1,0,0,0,0,1,0,0,0,0,1,0,x,0,0,1]*/);
		return this.appendFunction("translateX", [{f:formatCssLength, v:x}]);
	}
	
	translateY(y:NumericLength){
		//var y = dotcss.lengthToPx(p[0]);
		//this.updateValue("translateY", [{f:formatCssLength, v:y + "px")]/*, [1,0,0,0,0,1,0,0,0,0,1,0,0,y,0,1]*/);
		return this.appendFunction("translateY", [{f:formatCssLength, v:y}]);
	}
	
	translateZ(z:NumericLength){
		
		//var z = dotcss.lengthToPx(p[0]);
		//this.updateValue("translateZ", [{f:formatCssLength, v:z + "px")]/*, [1,0,0,0,0,1,0,0,0,0,1,0,0,0,z,1]*/);
		return this.appendFunction("translateZ", [{f:formatCssLength, v:z}]);
	}
	
	scale(x:number,y?:number){
		return this.appendFunction("scale", [x,y??1]/*, [x,0,0,0,0,y,0,0,0,0,1,0,0,0,0,1]*/);
	}
	
	scale3d(x:number,y:number,z:number){
		return this.appendFunction("scale3d", [x,y,z]/*, [p[0],0,0,0,0,p[1],0,0,0,0,p[2],0,0,0,0,1]*/);
	}
	
	scaleX(x:number){
		//this.updateValue("scaleX", p/*, [p[0],0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]*/);
		return this.appendFunction("scaleX", [x]);
	}
	
	scaleY(y:number){
		//this.updateValue("scaleY", p/*, [1,0,0,0,0,p[0],0,0,0,0,1,0,0,0,0,1]*/);
		return this.appendFunction("scaleY", [y]);
	}
	
	scaleZ(z:number){
		//this.updateValue("scaleZ", p/*, [1,0,0,0,0,1,0,0,0,0,p[0],0,0,0,0,1]*/);
		return this.appendFunction("scaleZ", [z]);
	}
	
	rotate(x: NumericAngle){
		// var a = Util.angleToDeg(x);
		return this.appendFunction("rotate", [{f:formatCssAngle, v:x}]/*, [Math.cos(a),Math.sin(a),0,0,-Math.sin(axxx),Math.cos(axxx),0,0,0,0,1,0,0,0,0,1]*/);
	}
	
	rotate3d(x: number, y: number, z: number, a: NumericAngle){
		
		return this.appendFunction("rotate3d", [x, y, z, {f:formatCssAngle, v:a}]/*, 
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
		return this.appendFunction("rotateX", [{f:formatCssAngle, v:x}]/*, [1,0,0,0,0,Math.cos(axx),Math.sin(axx),0,0,-Math.sin(axx),Math.cos(axx),0,0,0,0,1]*/);
	}
	
	rotateY(y: NumericAngle){
		return this.appendFunction("rotateY", [{f:formatCssAngle, v:y}]);
	}
	
	rotateZ(z: NumericAngle){
		return this.appendFunction("rotateZ", [{f:formatCssAngle, v:z}]);
	}
	
	skew(x: NumericAngle, y?: NumericAngle){
		
		return arguments.length == 1 
			? this.appendFunction("skew", [{f:formatCssAngle, v:x}]/*, [1,0,0,0,Math.tan(axxxxx),1,0,0,0,0,1,0,0,0,0,1]*/)
			: this.appendFunction("skew", [{f:formatCssAngle, v:x}, {f:formatCssAngle, v:y}]/*, [1,Math.tan(axxxy),0,0,Math.tan(axxxx),1,0,0,0,0,1,0,0,0,0,1]*/);
	}
	
	skewX(x: NumericAngle){
		return this.appendFunction("skewX", [{f:formatCssAngle, v:x}]);
	}
	
	skewY(y: NumericAngle){
		return this.appendFunction("skewY", [{f:formatCssAngle, v:y}]);
	}
	
	perspective(d: NumericLength){
		return this.appendFunction("perspective", [{f:formatCssLength, v:d}]/*, [1,0,0,0,0,1,0,0,0,0,1,0,0,0,dotcss.formatNumberValue(-1 / d),1]*/);
	}

	
}