// Polyfill for Object.keys(...).forEach.

import type Component from "./component";

export function eachK(obj, cb){
    if(obj){
        var lst = Object.keys(obj);
        for(var i = 0; i < lst.length; i++) cb(lst[i], obj[lst[i]]);
    }
}

export function isF(v){
    return v && v.constructor && v.call && v.apply;
}

export const sT = setTimeout;
export function str(s: number,v?:number){return (s||"").toString(v)} // This function seems really weird.

class _ClassPrefix{
    private current: number = 0x10000; 
    
    reset(){
        this.current = 0x10000;
    }

    get next(): number{
        return this.current++;
    }
}

export const ClassPrefix = new _ClassPrefix()

export const GlobalComponentStack: Array<Component> = [];


export type AnimationType = "geometric"|"exponential"|"ease"|"linear";

export var floatRegex = new RegExp("[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?", "g");

/**
 * Function that takes in a bunch of parameters and steps the start value toward the target based on timeRemaining and style.
 * currentValue is the current value.
 * targetValue is the target valaue.
 * timeRemaining is the time remaining in ms.
 * stepProgress is the size of this step.
 * totalDuration is the duration of the entire animation from start to finish (not just this step).
 * style is the type of transition (geometric=exponential, ease, linear).
 * Returns the result.
*/
export function numberStep(startValue: number, targetValue: number, currentTime: number, totalDuration: number, style: AnimationType){
	
	startValue = Number(startValue);
	targetValue = Number(targetValue);

	var timeRemaining  = totalDuration - currentTime;

	switch(style){
		case "geometric":
		case "exponential"://This is kind of stupid now that we have ease. I might come back and add it in the future. For now assume ease.
		//	var m = Math.exp(-1 / timeRemaining);
		//	return  targetValue + m * (startValue - targetValue);
		case "ease":
			var m = (-Math.cos(Math.PI * (currentTime / totalDuration)) + 1) * 0.5;
			return  startValue + m * (targetValue - startValue);
		case "linear":
		default:
			return startValue + (targetValue - startValue) * (currentTime / totalDuration);
	}
}