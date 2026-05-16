import Watcher, { dependencyStack } from "./watcher";
import { scheduler } from "./scheduler";
import { Priority } from "./priority";

export default class Computed<T> extends Watcher<T> {
	private getter: () => T;
	private dependencies = new Map<Watcher, number>();
	private isQueued = false;
	private isEvaluating = false;
	private active = true;
	private dirty = true;

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
			throw new Error("Circular dependency detected in computed watcher.");
		}
		if (this.dirty) {
			this._update();
		}
		return super.value;
	}

	addDependency(watcher: Watcher) {
		if (!this.active) return;
		if (!this.newDependencies.has(watcher)) {
			this.newDependencies.add(watcher);
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

	private newDependencies = new Set<Watcher>();

	private _update() {
		if (!this.active) return;
		if (this.isEvaluating) {
			throw new Error("Circular dependency detected in computed watcher.");
		}

		this.isEvaluating = true;
		this.dirty = false;
		this.newDependencies.clear();
		dependencyStack.push(this);
		try {
			this.setValue(this.getter());
		} finally {
			dependencyStack.pop();
			this.isEvaluating = false;
		}

		// Update dependencies
		const toRemove: Watcher[] = [];
		for (const [watcher, subId] of this.dependencies) {
			if (!this.newDependencies.has(watcher)) {
				watcher._detachBinding(subId);
				toRemove.push(watcher);
			}
		}
		for (const watcher of toRemove) {
			this.dependencies.delete(watcher);
		}

		for (const watcher of this.newDependencies) {
			if (!this.dependencies.has(watcher)) {
				const subId = watcher.subscribe(() => this.requestUpdate());
				this.dependencies.set(watcher, subId);
			}
		}
	}

	dispose() {
		this.active = false;
		for (const [watcher, subId] of this.dependencies) {
			watcher._detachBinding(subId);
		}
		this.dependencies.clear();
	}
}
