export type AnimationType = "geometric" | "exponential" | "ease" | "linear";
declare const Util: {
    floatRegex: RegExp;
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
    numberStep(startValue: number, targetValue: number, currentTime: number, totalDuration: number, style: AnimationType): number;
};
export default Util;
