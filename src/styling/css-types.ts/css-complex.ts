import Util from "../../util";
import CssDataType from "./css-data-type";

export default class CssComplex extends CssDataType{
	parts: string[];
	numbers: string;
	constructor(value){
		super("complex");
		this.parts = (" " + value + " ").split(Util.floatRegex);
		this.numbers = value.match(Util.floatRegex);
	}
	
	toString(){
		var ret = this.parts[0];
		for(var i = 0; i < this.numbers.length; i++){
			ret += this.numbers[i] + this.parts[i+1];
		}
		return ret;
	}
}