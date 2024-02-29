import { AngleUnits, Color, NumericLength, Percentage } from "dothtml-interfaces";
import VStyle from "./v-style";
import Reactive from "../reactive";
import { formatCssColor, formatCssLength, formatCssPercentage } from "../css/format-css-type";
import CssFunctionBuilderVStyle from "./css-function-builder-v-style";

export default class FilterVStyle extends CssFunctionBuilderVStyle{

	blur(v: NumericLength){
		return this.appendFunction("blur", [{v, f: formatCssLength}]);
	}
	brightness(v: Percentage){
		return this.appendFunction("brightness", [{v, f: formatCssPercentage}]);
	}
	contrast(v: Percentage){
		return this.appendFunction("contrast", [{v, f: formatCssLength}]);
	}
	dropShadow(x: NumericLength, y: NumericLength, blur: NumericLength, color: Color){
		return this.appendFunction("drop-shadow", [{v: x, f: formatCssLength}, {v: y, f: formatCssLength}, {v: blur, f: formatCssLength}, {v: color, f: formatCssColor}]);
	}
	grayscale(v: Percentage){
		return this.appendFunction("grayscale", [{v, f: formatCssLength}]);
	}
	hueRotate(v: AngleUnits){
		return this.appendFunction("hue-rotate", [{v, f: formatCssLength}]);
	}
	invert(v: Percentage){
		return this.appendFunction("invert", [{v, f: formatCssLength}]);
	}
	opacity(v: Percentage){
		return this.appendFunction("opacity", [{v, f: formatCssLength}]);
	}
	sepia(v: Percentage){
		return this.appendFunction("sepia", [{v, f: formatCssLength}]);
	}
	saturate(v: Percentage){
		return this.appendFunction("saturate", [{v, f: formatCssLength}]);
	}
}