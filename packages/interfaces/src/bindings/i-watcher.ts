import { IBinding } from "./i-binding";

export interface IWatcher<T = any>{
	/**
	 * Gets or sets the current value of the signal.
	 * Accessing this property inside a computed signal or effect automatically registers it as a dependency.
	 */
	get value(): T;
	set value(v: T|null|undefined);
	getValue(): T;
	getValue(): T;

	// Key is used for observable array proxy bindings.
	// If a key is provided, it's used to uniquely identify array elements.
	// If a key is not provided, identification is done automatically by the framework by comparing object references.
	key: string;
	// subscribeNode(node: Node): number;
	// subscribeAttr(node: HTMLElement, attributeName: string): number;
	// subscribeCallback(callback: (value: T)=>void): number;
	// detachBinding(id: number);

	/** 
	 * Subscribe to changes in the reactive object.
	*/
	subscribe(callback: Function): number;

	_subscribe(boundReactive: IBinding, item: any): number;
	_detachBinding(id: number): void;

	/**
	 * Called manually by the user to trigger an update.
	 * Useful for arrays and objects.
	 */
	updateObservers(): void;

	bindAs<Td = string>(transform: (((v: T)=>Td)|({
		display?: (v: T)=>Td;
		read?: (v: string)=>T;
	}))): IBinding<T, Td>;

	bind(): IBinding<T>;
	unsubscribe(id: number): void;
	refresh(priority?: any): void;

	/**
	 * Sets a new value for the signal. 
	 * Equivalent to setting the `.value` property, but allows specifying an update priority.
	 * @param v The new value.
	 * @param priority Optional update priority.
	 */
	setValue(v: T, priority?: any): void;
}
