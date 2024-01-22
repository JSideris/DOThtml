import Reactive from "../reactive";
import { Vdom } from "./vdom";
export declare class TextVdom extends Vdom {
    text: string | boolean | number | Reactive;
    textNode: Node;
    observerId: number;
    constructor(text: string | boolean | number | Reactive);
    _render(node: HTMLElement): void;
    _unrender(): void;
    toString(): string;
}
