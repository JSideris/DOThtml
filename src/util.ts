import type { LengthProp } from "./styling/i-dotcss";

export type AnimationType = "geometric"|"exponential"|"ease"|"linear";

const Util = {
	floatRegex: new RegExp("[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?", "g"),

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
	numberStep(startValue: number, targetValue: number, currentTime: number, totalDuration: number, style: AnimationType){
		
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
}

export default Util;