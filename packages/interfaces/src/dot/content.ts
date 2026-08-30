import type IDotComponent from "../i-dot-component";
import { IReactive } from "../bindings/i-reactive";
import { IWatcher } from "../bindings/i-watcher";
import type { IDotDocument } from "./i-dot-document";

export type DotContentPrimitive = string | number | boolean | undefined | null;
export type DotContentBasic = DotContentPrimitive | Node | Element | NodeList | IDotComponent | IDotDocument//typeof DotDocument;
export type DotContent = DotContentBasic | Array<DotContent> | IReactive | (() => DotContentPrimitive);

export type ISignal<T = any> = IWatcher<T>;

export type AttrVal<T = string | number | boolean> = T | IReactive | (() => T);

export type DotDictionary<T> = { [key: string | number]: T } & object;
