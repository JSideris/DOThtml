import { IBinding, IWatcher } from "dothtml-interfaces";
import Watcher from "./watcher";

export default class Binding<T = any, Td = T> implements IBinding<T, Td> {
	_source: IWatcher<T>;

	_transform: {
		display?: (v: T)=>Td;
		read?: (v: string)=>T;
	}

	get value(): Td {
		return this._get();
	}

	_get(): Td{
		
		let v = this._transform?.display ? this._transform.display(this._source.value) : this._source.value as unknown as Td;

		return v;
	}

	_set(v: string|number|boolean){
		let value = this._transform?.read ? this._transform.read(v as string) : v as unknown as T;
		this._source.value = value;
	}

	_subscribe(subscriber: any, sync: boolean = false): number{
		return (this._source as any)._subscribe(this, subscriber, sync);
	}

	subscribe(callback: Function, sync: boolean = false): number {
		return this._subscribe(callback, sync);
	}

	_unsubscribe(id: number){
		this._source._detachBinding(id);
	}

	constructor(source: IWatcher<T>){
		this._source = source;
	}
}