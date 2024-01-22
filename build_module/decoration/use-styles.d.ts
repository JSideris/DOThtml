import { IComponent } from "dothtml-interfaces";
export declare function useStyles(styleCallback: any): (Base: new (...args: Array<any>) => IComponent) => {
    new (...args: any[]): {
        events?: string[];
        readonly _?: import("dothtml-interfaces").FrameworkItems;
        build(...args: any[]): import("dothtml-interfaces").IDotGenericElement;
        style?(css: import("dothtml-interfaces").IDotCss): void;
        creating?(...args: any[]): void;
        ready?(): void;
        deleting?(): void;
        deleted?(): void;
        built?(): void;
    };
};
