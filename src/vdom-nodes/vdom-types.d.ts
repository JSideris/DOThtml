import Reactive from "../reactive";
import { ContainerVdom } from "./container-vdom";

export type PrimativeAttributeValueType = string|number|boolean;
export type AttributeValueType = PrimativeAttributeValueType|Reactive|(()=>AttributeValueType);
export type ConditionalNodeItem = {condition: boolean|Reactive, vNode: ContainerVdom, startAnchor: Node, endAnchor: Node, observerId: number};
export type AddChildMode = "inside"|"before"|"after";
export type ObservableCollection = Reactive<any, Array<any>|{[key: string|number]: any}>|Array<any>|{[key: string|number]: any};