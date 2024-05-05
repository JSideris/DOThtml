import { IBoundReactive, IReactive } from "dothtml-interfaces";
import Reactive from "./reactive";

export default class BoundReactive<T = any, Td = T> implements IBoundReactive<T, Td> {
	_source: IReactive<T>;

	_transform: {
		display?: (v: T)=>Td;
		read?: (v: string)=>T;
	}

	_get(): Td{
		
		let v = this._transform?.display ? this._transform.display(this._source.value) : this._source.value as unknown as Td;

		return v;
	}

	_set(v: string|number|boolean){
		let value = this._transform?.read ? this._transform.read(v as string) : v as unknown as T;
		this._source.value = value;
	}

	_subscribe(subscriber: any): number{
		return this._source._subscribe(this, subscriber);
	}

	_unsubscribe(id: number){
		this._source._detachBinding(id);
	}

	constructor(source: IReactive<T>){
		this._source = source;
	}
}