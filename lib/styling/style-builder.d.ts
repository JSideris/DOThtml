import IDotCss from "./i-dotcss";
declare const dotcss: IDotCss;
/**
 * The dotcss builder gets extended with all of the css functions at runtime.
*/
export declare class _Builder {
    currentCss: string;
    targets: Array<HTMLElement>;
    constructor(targets?: Array<HTMLElement>);
    toString(): string;
    hide(style?: {
        duration: any;
        hideStyle: any;
        complete: any;
    }): this;
    show(style?: {
        duration: any;
        showStyle: any;
        complete: any;
    }): import("./i-dotcss").IDotcssProp | this;
    fadeOut(duration: any, complete: any): this;
    fadeIn(duration: any, complete: any): import("./i-dotcss").IDotcssProp | this;
}
export default dotcss;
