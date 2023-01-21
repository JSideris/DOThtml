import { floatRegex } from "../../dot-util";
import CssDataType from "./css-data-type";
import CssLength from "./css-length";

export default class CssPercentage extends CssLength{
	length: number;
	constructor (value:string|number){
		super(isNaN(value as any) ? value : `${value}%`)
	}
}