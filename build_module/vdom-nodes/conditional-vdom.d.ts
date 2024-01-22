import Reactive from "../reactive";
import { ContainerVdom } from "./container-vdom";
import { Vdom } from "./vdom";
import { ConditionalNodeItem } from "./vdom-types";
export declare class ConditionalVdom extends Vdom {
    private conditions;
    private sealed;
    private renderedIndex;
    addCondition(condition: Reactive | boolean, vNode: ContainerVdom, seal?: boolean): void;
    addAnchor(C: ConditionalNodeItem, node: HTMLElement): void;
    _render(node: HTMLElement): void;
    _unrender(): void;
    updateConditions(): void;
}
