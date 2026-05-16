import Binding from "../reactivity/binding";
import Ref from "../reactivity/ref";
import Watcher from "../reactivity/watcher";
import { ContainerVdom } from "./container-vdom";

export type PrimativeAttributeValueType = string|number|boolean;
export type AttributeValueType = PrimativeAttributeValueType|Binding|Ref|((el: any) => void)|(()=>AttributeValueType);
export type ConditionalNodeItem = {condition: boolean|Binding, vNode: ContainerVdom, startAnchor: Node, endAnchor: Node, observerId: number};
export type AddChildMode = "inside"|"before"|"after";
export type ObservableCollection = Binding<any, Array<any>|{[key: string|number]: any}>|Array<any>|{[key: string|number]: any};