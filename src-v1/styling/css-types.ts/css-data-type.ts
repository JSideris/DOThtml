export declare type CssDataTypeToken = "url"|"number"|"length"|"angle"|"color"|"transformation"|"filter"|"complex"|"unknown";

export default abstract class CssDataType{
	type: CssDataTypeToken;

	constructor(type: CssDataTypeToken){
		this.type = type;
	}
}