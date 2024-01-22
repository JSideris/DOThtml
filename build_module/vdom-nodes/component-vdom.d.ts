import { IComponent } from "dothtml-interfaces";
import { Vdom } from "./vdom";
import { ContainerVdom } from "./container-vdom";
export declare class ComponentVdom extends Vdom {
    component: IComponent;
    shadowEl: HTMLElement;
    childShadowVdom: ContainerVdom;
    sharedStyles: CSSStyleSheet;
    constructor(component: IComponent);
    private setupCustomElement;
    _render(node: HTMLElement): void;
    _unrender(): void;
    toString(): string;
}
