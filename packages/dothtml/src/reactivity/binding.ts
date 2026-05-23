import { IBinding, IWatcher } from "dothtml-interfaces";
import Signal from "./signal";

export default class Binding<T = any, Td = T> implements IBinding<T, Td> {
	_isBinding = true;
	_source: IWatcher<T>;

	_transform: {
		display?: (v: T)=>Td;
		read?: (v: string)=>T;
	}

	get isWritable(): boolean {
		return (this._source as any).isWritable && (!this._transform || !!this._transform.read);
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
		this._source.unsubscribe(id);
	}

	unsubscribe(id: number) {
		this._source.unsubscribe(id);
	}

	constructor(source: IWatcher<T>){
		this._source = source;
	}
}
