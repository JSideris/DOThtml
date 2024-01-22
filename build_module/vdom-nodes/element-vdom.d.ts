import { ContainerVdom } from "./container-vdom";
import { Vdom } from "./vdom";
export default class ElementVdom extends Vdom {
    children: ContainerVdom;
    element: HTMLElement;
    tag: string;
    private attributes;
    private events;
    private attributeObserverIds;
    constructor(tag: string);
    _render(node: HTMLElement): void;
    _unrender(): void;
    toString(): string;
    setAttr(attr: any, value: any): void;
    private renderAttr;
    addEventListener(event: string, callback: (e: Event) => void): void;
    private renderEvent;
}
