import Signal, { dependencyStack } from "./signal";
import { scheduler } from "./scheduler";
import { Priority } from "./priority";

export type EffectCallback = () => (void | (() => void));

export default class Effect {
	private callback: EffectCallback;
	private cleanup?: () => void;
	private dependencies = new Map<Signal, number>();
	private isQueued = false;
	private isEvaluating = false;
	private active = true;
	private dirty = true;
	private newDependencies = new Set<Signal>();

	private updateSubscription = {
		active: true,
		update: () => {
			this.isQueued = false;
			if (this.dirty) {
				this.run();
			}
		}
	};

	constructor(callback: EffectCallback) {
		this.callback = callback;
		this.run();
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

	run() {
		if (!this.active) return;
		if (this.isEvaluating) {
			throw new Error("Circular dependency detected in effect.");
		}

		// Run cleanup from previous execution
		if (this.cleanup) {
			try {
				this.cleanup();
			} catch (e) {
				console.error("Error during effect cleanup:", e);
			}
			this.cleanup = undefined;
		}

		this.isEvaluating = true;
		this.dirty = false;
		this.newDependencies.clear();
		dependencyStack.push(this);

		try {
			const result = this.callback();
			if (typeof result === "function") {
				this.cleanup = result;
			}
		} catch (e) {
			console.error("Error during effect execution:", e);
		} finally {
			dependencyStack.pop();
			this.isEvaluating = false;
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
		if (!this.active) return;
		this.active = false;
		if (this.cleanup) {
			try {
				this.cleanup();
			} catch (e) {
				console.error("Error during effect disposal cleanup:", e);
			}
			this.cleanup = undefined;
		}
		for (const [signal, subId] of this.dependencies) {
			signal.unsubscribe(subId);
		}
		this.dependencies.clear();
	}
}
