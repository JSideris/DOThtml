import Util from "../../util";
import CssDataType from "./css-data-type";

//TODO: this should support multiple lengths.
// TODO: add some test cases to test these.
export default class CssLength extends CssDataType{
	length: number;
	units: string;
	constructor (value:string|number){
		super("length")
		value = value || "0px";
		if(!isNaN(value as number)) value = Math.round(value as number) + "px";
		this.length = Number((value as string).match(Util.floatRegex)[0]);
		this.units = (value as string).split(Util.floatRegex)[1] || "px";
	}
	
	toString(){
		return `${this.length}${this.units}`;
	}
}