import CssDataType from "./css-data-type";

export default class CssNumber extends CssDataType{
	value: number;
	constructor(value){
		super("number");
		this.value = Number(value);
	}
	toString(){
		return this.value;
	}
}