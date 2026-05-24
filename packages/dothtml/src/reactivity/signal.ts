import { IBinding, IDotDocument, IReactive, IWatcher } from "dothtml-interfaces";
import { DOT_VDOM_PROP_NAME } from "../constants";
import ElementVdom from "../vdom-nodes/element-vdom";
import { TextVdom } from "../vdom-nodes/text-vdom";
import { ConditionalVdom } from "../vdom-nodes/conditional-vdom";
import CollectionVdom from "../vdom-nodes/collection-vdom";
import AttributeVNode from "../v-meta-nodes/attribute-v-node";
import VMetaNode from "../v-meta-nodes/v-meta-node";
import Binding from "./binding";
import Subscription from "./subscription";
import { Priority } from "./priority";
import { scheduler } from "./scheduler";

export const dependencyStack: Array<any> = [];

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

export default class Signal<T = any> implements IWatcher<T>{
	_isSignal = true;
	_isRef = false;
	_vtype = "signal";

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

	subscribers = new Map<number, Subscription>();

	get isWritable(): boolean {
		return true;
	}

	constructor() {
	}

	get value(): T {
		const active = dependencyStack[dependencyStack.length - 1];
		if (active && active.addDependency) {
			active.addDependency(this);
		}
		return this._value;
	}

	set value(v: T) {
		this.setValue(v);
	}

	getValue(): T {
		return this.value;
	}

	setValue(v: T, priority: Priority = Priority.Normal) {
		if (this._value === v) return;
		this._value = v;
		this.updater(this._value, priority);
	}

	private updater(value: T, priority: Priority = Priority.Normal){
		for(const sub of this.subscribers.values()){
			if ((sub as any).sync) {
				sub.update();
			} else {
				if (!sub.isQueued || priority === Priority.Immediate) {
					scheduler.enqueue(sub, priority);
				}
			}
		}
	}

	nextId = 1;

	subscribe(callback: Function, sync: boolean = false) {
		let br = new Binding(this);
		return br._subscribe(callback, sync);
	}

	_subscribe(boundReactive: IBinding, item: any, sync: boolean = false){
		let id = this.nextId++;
		const sub = new Subscription(boundReactive, item);
		(sub as any).sync = sync;
		this.subscribers.set(id, sub);

		return id;
	}

	unsubscribe(id: number) {
		if(this.subscribers.has(id)){
			this.subscribers.get(id)!.active = false;
			this.subscribers.delete(id);
		}
	}

	_detachBinding(id: number) {
		this.unsubscribe(id);
	}

	// Called manually by the user to trigger an update.
	// Useful for arrays and objects.
	refresh(priority: Priority = Priority.Normal): void {
		let updatedValue = this.value;
		// this._cachedLastValue = updatedValue;
		this.updater(updatedValue, priority);
	}

	updateObservers(priority: Priority = Priority.Normal): void {
		this.refresh(priority);
	}
	
}
