import Reactive from "../reactive";
import { Vdom } from "./vdom";
import { ObservableCollection } from "./vdom-types";
type DatumMap = {
    vdom: Vdom;
    value: any;
    keyValue: any;
    afterNode: Node;
    observableIndex: Reactive<number>;
};
export default class CollectionVdom extends Vdom {
    value: ObservableCollection;
    renderCallback: (x: any, i: number | string | Reactive, k: string) => Vdom;
    startNode: Node;
    endNode: Node;
    observerId: number;
    mappedItems: Array<DatumMap>;
    constructor(value: ObservableCollection, renderCallback: (x: any, i: number | string, k: string) => Vdom);
    _render(target: HTMLElement): void;
    _unrender(): void;
    private removeItem;
    updateList(): void;
}
export {};
