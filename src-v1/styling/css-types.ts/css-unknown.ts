import CssDataType from "./css-data-type";

export default class CssUnknown extends CssDataType{
	value: any;
	constructor(value: any){
		super("unknown");
		this.value = value;
	}

	toString(){
		return this.value;
	}
}