import CssFunctionBuilderVStyle from "./css-function-builder-v-style";
import { formatCssAngle, formatCssLength } from "../css/format-css-type";


export default class TransformVStyle extends CssFunctionBuilderVStyle{

	matrix3d(a1:number, b1:number, c1:number, d1:number, a2:number, b2:number, c2:number, d2:number, a3:number, b3:number, c3:number, d3:number, a4:number, b4:number, c4:number, d4:number){
		return this.appendFunction("matrix3d", arguments);
	}
	
	matrix(a: number, b: number, c: number, d: number, tx: number, ty: number){
		return this.appendFunction("matrix", arguments);
	}
	
	translate(x,y?){
		return arguments.length == 1 
			? this.appendFunction("translate", [{f:formatCssLength, v:x}]) 
			: this.appendFunction("translate", [{f:formatCssLength, v:x}, {f:formatCssLength, v:y}]);
	}
	
	translate3d(x,y,z){
		return this.appendFunction("translate3d", [{f:formatCssLength, v:x}, {f:formatCssLength, v:y}, {f:formatCssLength, v:z}]);
	}
	
	translateX(x){
		return this.appendFunction("translateX", [{f:formatCssLength, v:x}]);
	}
	
	translateY(y){
		return this.appendFunction("translateY", [{f:formatCssLength, v:y}]);
	}
	
	translateZ(z){
		return this.appendFunction("translateZ", [{f:formatCssLength, v:z}]);
	}
	
	scale(x:number,y?:number){
		return this.appendFunction("scale", [x,y??1]);
	}
	
	scale3d(x:number,y:number,z:number){
		return this.appendFunction("scale3d", [x,y,z]);
	}
	
	scaleX(x:number){
		return this.appendFunction("scaleX", [x]);
	}
	
	scaleY(y:number){
		return this.appendFunction("scaleY", [y]);
	}
	
	scaleZ(z:number){
		return this.appendFunction("scaleZ", [z]);
	}
	
	rotate(x){
		return this.appendFunction("rotate", [{f:formatCssAngle, v:x}]);
	}
	
	rotate3d(x: number, y: number, z: number, a){
		return this.appendFunction("rotate3d", [x, y, z, {f:formatCssAngle, v:a}]);
	}

	// Manually create the 4 unit functions for rotate 3d since the arg structure is mixed.
	rotate3dDeg(x: number, y: number, z: number, a: number){return this.rotate3d(x,y,z,a);}
	rotate3dRad(x: number, y: number, z: number, a: number){return this.rotate3d(x,y,z,`${a}rad`);}
	rotate3dGrad(x: number, y: number, z: number, a: number){return this.rotate3d(x,y,z,`${a}grad`);}
	rotate3dTurn(x: number, y: number, z: number, a: number){return this.rotate3d(x,y,z,`${a}turn`);}
	
	rotateX(x){
		return this.appendFunction("rotateX", [{f:formatCssAngle, v:x}]);
	}
	
	rotateY(y){
		return this.appendFunction("rotateY", [{f:formatCssAngle, v:y}]);
	}
	
	rotateZ(z){
		return this.appendFunction("rotateZ", [{f:formatCssAngle, v:z}]);
	}
	
	skew(x, y?){
		return arguments.length == 1 
			? this.appendFunction("skew", [{f:formatCssAngle, v:x}])
			: this.appendFunction("skew", [{f:formatCssAngle, v:x}, {f:formatCssAngle, v:y}]);
	}
	
	skewX(x){
		return this.appendFunction("skewX", [{f:formatCssAngle, v:x}]);
	}
	
	skewY(y){
		return this.appendFunction("skewY", [{f:formatCssAngle, v:y}]);
	}
	
	perspective(d){
		return this.appendFunction("perspective", [{f:formatCssLength, v:d}]);
	}
}
