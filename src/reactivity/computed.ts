import Watcher, { dependencyStack } from "./watcher";
import { scheduler } from "./scheduler";
import { Priority } from "./priority";

export default class Computed<T> extends Watcher<T> {
	private getter: () => T;
	private dependencies = new Set<Watcher>();
	private isQueued = false;

	constructor(getter: () => T) {
		super();
		this.getter = getter;
		this._update();
	}

	addDependency(watcher: Watcher) {
		if (!this.dependencies.has(watcher)) {
			this.dependencies.add(watcher);
			watcher.subscribe(() => this.requestUpdate());
		}
	}

	private requestUpdate() {
		if (!this.isQueued) {
			this.isQueued = true;
			scheduler.enqueue({
				active: true,
				update: () => {
					this.isQueued = false;
					this._update();
				}
			} as any, Priority.Normal);
		}
	}

	private _update() {
		dependencyStack.push(this);
		try {
			this.value = this.getter();
		} finally {
			dependencyStack.pop();
		}
	}
}
