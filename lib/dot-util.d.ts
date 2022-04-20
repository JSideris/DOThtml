import type Component from "component";
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
export {};
