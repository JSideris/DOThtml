import { IRef } from "dothtml-interfaces/src/bindings/i-ref";
import Signal from "./signal";

/**
 * A reactive reference to a DOM element or component instance.
 * Supports method proxying, allowing direct calls like `myRef.focus()`.
 */
export default class Ref<T = any> extends Signal<T | null> implements IRef<any>{
	private _dot: any;
	_isRef = true;
	_vtype = "ref";

	constructor(dotInstance?: any) {
		super();
		this._value = null;
		this._dot = dotInstance;

		return this._proxy();
	}

	/**
	 * Returns the underlying element or component instance.
	 */
	get element(): T {
		return this.value as T;
	}

	/**
	 * Returns a promise that resolves when the reference is populated.
	 */
	async ready(): Promise<T> {
		if (this.value) return this.value as T;
		return new Promise((resolve) => {
			const id = this.subscribe((val: T | null) => {
				if (val) {
					this.unsubscribe(id);
					resolve(val);
				}
			});
		});
	}

	/**
	 * Appends content to the referenced element.
	 */
	append(content: any): this {
		if (this.value instanceof HTMLElement) {
			const d = this._dot || (globalThis as any).dot;
			if (d) d(this.value).append(content);
			else console.warn("DOThtml: Ref.append called but dot instance is not available.");
		}
		return this;
	}

	/**
	 * Prepends content to the referenced element.
	 */
	prepend(content: any): this {
		if (this.value instanceof HTMLElement) {
			const d = this._dot || (globalThis as any).dot;
			if (d) d(this.value).prepend(content);
			else console.warn("DOThtml: Ref.prepend called but dot instance is not available.");
		}
		return this;
	}
}
