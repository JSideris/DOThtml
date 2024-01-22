import Reactive from "../reactive";
import { Vdom } from "./vdom";
export declare class HtmlVdom extends Vdom {
    beforeNode: Node;
    afterNode: Node;
    html: string | Reactive;
    observerId: number;
    constructor(html: string | Reactive);
    updateHtml(html: any): void;
    _render(target: HTMLElement): void;
    _unrender(): void;
    toString(): any;
}
