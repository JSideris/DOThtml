import { IComponent } from "dothtml-interfaces";
import Reactive from "../reactive";
import { ConditionalVdom } from "./conditional-vdom";
import ElementVdom from "./element-vdom";
import { Vdom } from "./vdom";
import { ObservableCollection } from "./vdom-types";
type ParentVdom = ContainerVdom | ConditionalVdom | ElementVdom;
export declare class ContainerVdom extends Vdom {
    _children: Array<Vdom>;
    _parent: ParentVdom;
    constructor();
    _addChild(content: Vdom): this;
    _render(node: HTMLElement): void;
    _unrender(): void;
    html(c: string | Reactive): this;
    text(c: string | Reactive): this;
    mount(c: IComponent): this;
    when(condition: Reactive | boolean, then: ContainerVdom | string | boolean | number): this;
    otherwiseWhen(condition: Reactive | boolean, then: ContainerVdom | string | boolean | number, seal?: boolean): this;
    otherwise(then: ContainerVdom | string | boolean | number): this;
    each(collection: ObservableCollection, callback: () => Vdom): this;
}
export {};
