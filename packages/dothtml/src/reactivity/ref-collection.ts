import Ref from "./ref";

export default class RefCollection<T = any> {
	private _refs: Map<string | number, Ref<T>> = new Map();

	get(key: string | number): Ref<T> {
		if (!this._refs.has(key)) {
			this._refs.set(key, new Ref<T>());
		}
		return this._refs.get(key)!;
	}

	get elements(): Record<string | number, T | null> {
		const result: Record<string | number, T | null> = {};
		this._refs.forEach((ref, key) => {
			result[key] = ref.value;
		});
		return result;
	}

	/**
	 * Iterates over each populated element in the collection.
	 */
	forEach(callback: (el: T | null, key: string | number) => void): void {
		this._refs.forEach((ref, key) => {
			callback(ref.value, key);
		});
	}

	/**
	 * Maps each populated element in the collection to a new array.
	 */
	map<U>(callback: (el: T | null, key: string | number) => U): U[] {
		const result: U[] = [];
		this._refs.forEach((ref, key) => {
			result.push(callback(ref.value, key));
		});
		return result;
	}
}
