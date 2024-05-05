import BoundReactive from "../reactivity/bound-reactive";
import Reactive from "../reactivity/reactive";
import { ContainerVdom } from "./container-vdom";

export type PrimativeAttributeValueType = string|number|boolean;
export type AttributeValueType = PrimativeAttributeValueType|BoundReactive|(()=>AttributeValueType);
export type ConditionalNodeItem = {condition: boolean|BoundReactive, vNode: ContainerVdom, startAnchor: Node, endAnchor: Node, observerId: number};
export type AddChildMode = "inside"|"before"|"after";
export type ObservableCollection = BoundReactive<any, Array<any>|{[key: string|number]: any}>|Array<any>|{[key: string|number]: any};