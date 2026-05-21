import Signal, { dependencyStack } from "./signal";
import { scheduler } from "./scheduler";
import { Priority } from "./priority";

export default class Computed<T> extends Signal<T> {
	private getter: () => T;
	private dependencies = new Map<Signal, number>();
	private isQueued = false;
	private isEvaluating = false;
	private active = true;
	private dirty = true;
	private error: any = null;

	get isWritable(): boolean {
		return false;
	}

	private updateSubscription = {
		active: true,
		update: () => {
			this.isQueued = false;
			if (this.dirty) {
				this._update();
			}
		}
	};

	constructor(getter: () => T) {
		super();
		this.getter = getter;
		// Initial evaluation is done immediately to set up initial dependencies.
		this._update();
	}

	get value(): T {
		if (this.isEvaluating) {
			throw new Error("Circular dependency detected in computed signal.");
		}
		if (this.dirty) {
			this._update();
		}
		if (this.error) {
			throw this.error;
		}
		return super.value;
	}

	addDependency(signal: Signal) {
		if (!this.active) return;
		if (!this.newDependencies.has(signal)) {
			this.newDependencies.add(signal);
		}
	}

	private requestUpdate() {
		if (!this.active) return;
		this.dirty = true;
		if (!this.isQueued) {
			this.isQueued = true;
			scheduler.enqueue(this.updateSubscription as any, Priority.Normal);
		}
	}

	private newDependencies = new Set<Signal>();

	private _update() {
		if (!this.active) return;
		if (this.isEvaluating) {
			throw new Error("Circular dependency detected in computed signal.");
		}

		this.isEvaluating = true;
		this.dirty = false;
		this.error = null;
		this.newDependencies.clear();
		dependencyStack.push(this);

		let newValue: T;
		let hasError = false;

		try {
			newValue = this.getter();
		} catch (e) {
			this.error = e;
			hasError = true;
		} finally {
			dependencyStack.pop();
			this.isEvaluating = false;
		}

		if (!hasError) {
			this.setValue(newValue);
		}

		// Update dependencies
		const toRemove: Signal[] = [];
		for (const [signal, subId] of this.dependencies) {
			if (!this.newDependencies.has(signal)) {
				signal.unsubscribe(subId);
				toRemove.push(signal);
			}
		}
		for (const signal of toRemove) {
			this.dependencies.delete(signal);
		}

		for (const signal of this.newDependencies) {
			if (!this.dependencies.has(signal)) {
				const subId = signal.subscribe(() => this.requestUpdate(), true);
				this.dependencies.set(signal, subId);
			}
		}
	}

	dispose() {
		this.active = false;
		for (const [signal, subId] of this.dependencies) {
			signal.unsubscribe(subId);
		}
		this.dependencies.clear();
	}
}
