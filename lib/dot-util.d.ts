import type Component from "./component";
export declare function eachK(obj: any, cb: any): void;
export declare function isF(v: any): any;
export declare const sT: typeof setTimeout;
export declare function str(s: number, v?: number): string;
declare class _ClassPrefix {
    private current;
    reset(): void;
    get next(): number;
}
export declare const ClassPrefix: _ClassPrefix;
export declare const GlobalComponentStack: Array<Component>;
export type AnimationType = "geometric" | "exponential" | "ease" | "linear";
export declare var floatRegex: RegExp;
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
export declare function numberStep(startValue: number, targetValue: number, currentTime: number, totalDuration: number, style: AnimationType): number;
export {};
