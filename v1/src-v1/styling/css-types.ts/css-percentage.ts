import CssLength from "./css-length";

export default class CssPercentage extends CssLength{
	length: number;
	constructor (value:string|number){
		super(isNaN(value as any) ? value : `${value}%`)
	}
}