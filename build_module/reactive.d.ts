import { IReactive } from "dothtml-interfaces";
import ElementVdom from "./vdom-nodes/element-vdom";
import { TextVdom } from "./vdom-nodes/text-vdom";
import { HtmlVdom } from "./vdom-nodes/html-vdom";
import { ConditionalVdom } from "./vdom-nodes/conditional-vdom";
import CollectionVdom from "./vdom-nodes/collection-vdom";
export default class Reactive<Ti = any, To = Ti> implements IReactive<Ti, To> {
    _value: Ti;
    private _cachedLastValue;
    key: string;
    observingTextNodes: Record<number, TextVdom>;
    observingHtmlNodes: Record<number, HtmlVdom>;
    observingAttributes: Record<number, {
        element: ElementVdom;
        attribute: string;
    }>;
    observingCollections: Record<number, {
        collection: CollectionVdom;
        key?: string;
    }>;
    observingConditionals: Record<number, ConditionalVdom>;
    observingCallbacks: Record<number, (value: To) => void>;
    constructor();
    getValue(): To;
    setValue(v: Ti): void;
    private updater;
    transformer?: (input: Ti) => To;
    nextId: number;
    subscribeText(node: TextVdom): number;
    subscribeHtml(node: HtmlVdom): number;
    subscribeAttr(node: ElementVdom, attributeName: string): number;
    subscribeCollection(node: CollectionVdom): number;
    subscribeCond(node: ConditionalVdom): number;
    subscribeCallback(callback: (value: To) => void): number;
    detachBinding(id: number): void;
    updateObservers(): void;
}
