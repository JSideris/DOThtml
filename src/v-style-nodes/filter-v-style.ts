import VStyle from "./v-style";
import Reactive from "../reactive";
import { formatCssColor, formatCssLength, formatCssPercentage } from "../css/format-css-type";
import CssFunctionBuilderVStyle from "./css-function-builder-v-style";

export default class FilterVStyle extends CssFunctionBuilderVStyle{

	blur(v){
		return this.appendFunction("blur", [{v, f: formatCssLength}]);
	}
	brightness(v){
		return this.appendFunction("brightness", [{v, f: formatCssPercentage}]);
	}
	contrast(v){
		return this.appendFunction("contrast", [{v, f: formatCssLength}]);
	}
	dropShadow(x, y, blur, color){
		return this.appendFunction("drop-shadow", [{v: x, f: formatCssLength}, {v: y, f: formatCssLength}, {v: blur, f: formatCssLength}, {v: color, f: formatCssColor}]);
	}
	grayscale(v){
		return this.appendFunction("grayscale", [{v, f: formatCssLength}]);
	}
	hueRotate(v){
		return this.appendFunction("hue-rotate", [{v, f: formatCssLength}]);
	}
	invert(v){
		return this.appendFunction("invert", [{v, f: formatCssLength}]);
	}
	opacity(v){
		return this.appendFunction("opacity", [{v, f: formatCssLength}]);
	}
	sepia(v){
		return this.appendFunction("sepia", [{v, f: formatCssLength}]);
	}
	saturate(v){
		return this.appendFunction("saturate", [{v, f: formatCssLength}]);
	}
}