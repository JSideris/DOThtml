import { floatRegex } from "../helpers";
import Reactive from "../reactive";


export function formatCssLength(value:string|number){
	value = value || "0px";
	if(!isNaN(value as number)) value = Math.round(value as number) + "px";
	let length = Number((value as string).match(floatRegex)[0]);
	let units = (value as string).split(floatRegex)[1] || "px";

	return `${length}${units}`;
}

export function formatCssPercentage(value: string|number){
	return isNaN(value as any) ? value : `${value}%`;
}

export function formatCssColor(value: string|number){

	// Probably will not take arrays anymore. They don't actually solve any problems.
	// if(Array.isArray(value) && value.length == 1) value = value[0];

	// TODO: should add provisions for more complex types. Either a builder or JSON.

	if(typeof value == "number") {

		let r = 0;
		let g = 0;
		let b = 0;
		let a = 1;

		b = value & 0xFF;
		value >>= 8;
		g = value & 0xFF;
		value >>= 8;
		r = value & 0xFF;

		return `rgb(${r} ${g} ${b})`;
	}
	else if(typeof value == "string") {
		return value;
	}
}

export function formatCssAngle(value: string|number){
	value = value || "0deg";
	if(!isNaN(value as number)) value = `${Math.round(value as number)}deg`;
	let angle = Number((value as string).match(floatRegex)[0]);
	let units = (value as string).split(floatRegex)[1] || "deg";

	return `${angle}${units}`;
}