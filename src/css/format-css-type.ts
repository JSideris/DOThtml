import { floatRegex } from "../helpers";
import Reactive from "../reactive";

export function formatCssLength(value:string|number|Reactive|Array<string|number|Reactive>, defaultUnits = "px"){
	value = value || "0px";
	if(value instanceof Reactive) value = value.getValue();
	if(value instanceof Array){
		return value.map(v=>formatCssLength(v, defaultUnits)).join(" ");
	}
	if(!isNaN(value as number)) value = Math.round(value as number) + defaultUnits;
	let tokens = (value as string).trim().split(" ");
	if(tokens.length > 1){
		return tokens.map(t=>formatCssLength(t, defaultUnits)).join(" ");
	}
	else{
		let length = Number((value as string).match(floatRegex)[0]);
		let units = (value as string).split(floatRegex)[1] || defaultUnits;

		return `${length}${units}`;
	}
}

export function formatCssPercentage(value: string|number|Reactive|Array<string|number|Reactive>){
	value = value || "0%";
	if(value instanceof Reactive) value = value.getValue();
	if(value instanceof Array){
		return value.map(v=>formatCssPercentage(v)).join(" ");
	}
	let tokens = (value as string).trim().split(" ");
	if(tokens.length > 1){
		return tokens.map(t=>formatCssPercentage(t)).join(" ");
	}
	else{
		return isNaN(value as any) ? value : `${value}%`;
	}
}

export function formatCssColor(value: string|number){

	// Probably will not take arrays anymore. They don't actually solve any problems.
	// if(Array.isArray(value) && value.length == 1) value = value[0];

	// TODO: should add provisions for more complex types. Either a builder or JSON.
	// TODO: doesn't currently handle reactive or arrays. Arrays might not be used in CSS (doesn't make sense - you only set one color).

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

export function formatCssAngle(value: string|number|Reactive|Array<string|number|Reactive>){
	value = value || "0deg";
	if(value instanceof Reactive) value = value.getValue();
	if(value instanceof Array){
		return value.map(v=>formatCssAngle(v)).join(" ");
	}
	if(!isNaN(value as number)) value = `${Math.round(value as number)}deg`;
	let tokens = (value as string).trim().split(" ");
	if(tokens.length > 1){
		return tokens.map(t=>formatCssAngle(t)).join(" ");
	}
	else{
		let angle = Number((value as string).match(floatRegex)[0]);
		let units = (value as string).split(floatRegex)[1] || "deg";

		return `${angle}${units}`;
	}
}