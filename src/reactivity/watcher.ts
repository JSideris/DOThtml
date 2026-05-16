import { IBinding, IDotDocument, IReactive, IWatcher } from "dothtml-interfaces";
import { DOT_VDOM_PROP_NAME } from "../constants";
import ElementVdom from "../vdom-nodes/element-vdom";
import { TextVdom } from "../vdom-nodes/text-vdom";
import { HtmlVdom } from "../vdom-nodes/html-vdom";
import { ConditionalVdom } from "../vdom-nodes/conditional-vdom";
import CollectionVdom from "../vdom-nodes/collection-vdom";
import VStyle from "../v-style-nodes/v-style";
import AttributeVNode from "../v-meta-nodes/attribute-v-node";
import VMetaNode from "../v-meta-nodes/v-meta-node";
import Binding from "./binding";
import Subscription from "./subscription";
import { scheduler } from "./scheduler";

const TEXT_OFFSET = 0;
const HTML_OFFSET = 1;
const ATTR_OFFSET = 2;
// Note: this specific interface is extremely simple, and it may be possible to generalize it and use it for other places
// where we need reactive values. All you need is an update function pretty much.
const ATTR_COLLECTION_OFFSET = 3;
const STYLE_OFFSET = 4;
const COND_OFFSET = 5;
const ARRAY_OFFSET = 6;
const CB_OFFSET = 7; // Always last. User callbacks happen after the DOM is updated.

const CATEGORIES = CB_OFFSET + 1;

export default class Watcher<T = any> implements IWatcher<T>{

	bindAs<Td>(transform: ((v:T)=>Td)|{
		display?: (v: T)=>Td;
		read?: (v: string)=>T;
	}): IBinding<T, Td> {
		let br = new Binding<T, Td>(this) as IBinding<T, Td>;

		if(transform["call"] && transform["apply"]){
			br._transform = {
				display: transform as (v: T)=>Td
			};
		}
		else{
			br._transform = transform as any;
		}

		return br;
	}

	bind(): Binding<T, T> {
		return new Binding<T, T>(this);
	}

	_value: T;
	key: string;

	allBindings: Record<number, Subscription> = {};

	constructor() {
	}

	get value(): T {
		return this._value;
	}

	set value(v: T) {
		this._value = v;
		// let newValue = this.value;
		// if(this._cachedLastValue != newValue){
		// 	this._cachedLastValue = newValue;
		// }
		this.updater(this._value);
	}

	private updater(value: T){
		for(let b in this.allBindings){
			scheduler.enqueue(this.allBindings[b]);
		}
	}

	nextId = 1;

	subscribe(callback: Function) {
		let br = new Binding(this);
		return br._subscribe(callback);
	}

	_subscribe(boundReactive: IBinding, item: any){
		let id = this.nextId++;
		this.allBindings[id] = new Subscription(boundReactive, item);

		return id;
	}

	_detachBinding(id: number) {
		if(this.allBindings[id]){
			this.allBindings[id].active = false;
			delete this.allBindings[id];
		}
	}

	// Called manually by the user to trigger an update.
	// Useful for arrays and objects.
	updateObservers(): void {
		let updatedValue = this.value;
		// this._cachedLastValue = updatedValue;
		this.updater(updatedValue);
	}
	
}