import { IWatcher } from "./i-watcher";

export interface IBinding<T = any, Td = T>{
	_source: IWatcher<T>;
	_get: ()=>Td;
	_set: (v: string|number|boolean)=>void;
	
	_transform: {
		display?: (v: T)=>Td;
		read?: (v: string)=>T;
	}
}