import Util from "../../util";
import CssDataType from "./css-data-type";

export default class CssAngle extends CssDataType{
	angle: number;
	units: string;
	constructor(value: string|number){
		super("angle");
		value = value || "0deg";
		if(!isNaN(value as number)) value = `${Math.round(value as number)}deg`;
		this.angle = Number((value as string).match(Util.floatRegex)[0]);
		this.units = (value as string).split(Util.floatRegex)[1] || "deg";
	}

	toString(){
		return this.angle + this.units;
	}
}