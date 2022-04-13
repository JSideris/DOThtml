import { IDotDocument } from "./i-dot";
export declare abstract class ArgCallback {
    el: Element;
    f: (content?: any, index?: number) => string;
    constructor(element: Element, value: (content?: any, index?: number) => string);
    abstract updateContent(dot: IDotDocument, propVal?: any): any;
}
export declare class AttrArgCallback extends ArgCallback {
    attr: string;
    constructor(element: Element, attributeName: string, value: (content?: any) => string);
    updateContent(dot: any): void;
}
export declare class ContentArgCallback extends ArgCallback {
    constructor(element: Element, content: () => string);
    updateContent(dot: any, propVal: string): void;
}
export declare class ArrayArgCallback extends ArgCallback {
    dotTarget: IDotDocument;
    constructor(dotTarget: any, content: any);
    updateContent(): void;
}
export declare class ConditionalArgCallback extends ArgCallback {
    startNode: Node;
    endNode: Node;
    condition: () => boolean | boolean;
    lastValue: boolean;
    constructor(startNode: any, endNode: any, content: any, condition: any);
    updateContent(dot: any): void;
}
