import { Priority } from "./priority";
import Subscription from "./subscription";

/**
 * The Scheduler is responsible for batching updates to the DOM.
 * It supports priority-based scheduling and time-slicing (concurrent rendering).
 */
class Scheduler {
	private queues: Array<Set<Subscription>> = [
		new Set(), // Immediate
		new Set(), // UserBlocking
		new Set(), // Normal
		new Set(), // Background
	];
	private isPending: boolean = false;
	private startTime: number = 0;
	private frameYieldMs: number = 5; // Yield after 5ms of work.
	private isSync: boolean = typeof process !== "undefined" && process.env.NODE_ENV === "test";

	private channel = typeof MessageChannel !== "undefined" ? new MessageChannel() : null;

	constructor() {
		if (this.channel) {
			this.channel.port1.onmessage = () => this.workLoop();
		}
	}

	/**
	 * Adds a subscription to the next batch with a specific priority.
	 */
	enqueue(subscription: Subscription, priority: Priority = Priority.Normal) {
		if (priority === Priority.Immediate || this.isSync) {
			const originalShouldYield = this.shouldYield;
			this.shouldYield = () => false;
			try {
				subscription.update();
			} finally {
				this.shouldYield = originalShouldYield;
			}
			return;
		}

		this.queues[priority].add(subscription);
		this.scheduleFlush();
	}

	private scheduleFlush() {
		if (this.isPending) return;
		this.isPending = true;

		if (this.channel) {
			this.channel.port2.postMessage(null);
		} else {
			// Fallback for environments without MessageChannel
			setTimeout(() => this.workLoop(), 0);
		}
	}

	/**
	 * Returns true if the current work chunk has exceeded the time budget.
	 */
	shouldYield(): boolean {
		return performance.now() - this.startTime >= this.frameYieldMs;
	}

	/**
	 * The main work loop for processing enqueued updates.
	 */
	private workLoop() {
		this.startTime = performance.now();
		this.isPending = false;

		let hasMoreWork = this.flushQueues();

		if (hasMoreWork) {
			this.scheduleFlush();
		}
	}

	/**
	 * Flushes the queues based on priority.
	 * Returns true if there is still work remaining (due to yielding).
	 */
	private flushQueues(): boolean {
		for (let p = Priority.UserBlocking; p <= Priority.Background; p++) {
			const queue = this.queues[p];
			if (queue.size === 0) continue;

			const currentQueue = Array.from(queue);
			queue.clear();

			for (const subscription of currentQueue) {
				if (subscription.active) {
					// In the future, subscription.update() might return a continuation
					// if it's an interruptible task (like CollectionVdom.updateList).
					const continuation = subscription.update();
					
					if (continuation) {
						// If it yielded, we need to put it back at the front of the queue
						// or handle it as a special case. For now, we'll just re-enqueue it.
						// Note: This is a simplified version. A real implementation would
						// likely store the continuation state.
						this.queues[p].add(subscription);
					}
				}

				if (this.shouldYield()) {
					return true; // We need to yield, work is not finished.
				}
			}
		}

		// Check if any new work was added to higher priority queues while processing lower ones.
		for (let p = Priority.UserBlocking; p <= Priority.Background; p++) {
			if (this.queues[p].size > 0) return true;
		}

		return false;
	}

	/**
	 * Synchronously flushes all pending updates.
	 */
	flushSync() {
		// We don't want the work loop to trigger while we're doing a sync flush.
		this.isPending = true; 
		
		// During flushSync, we should never yield.
		const originalShouldYield = this.shouldYield;
		this.shouldYield = () => false;

		try {
			let hasMoreWork = true;
			while (hasMoreWork) {
				hasMoreWork = false;
				for (let p = Priority.UserBlocking; p <= Priority.Background; p++) {
					const queue = this.queues[p];
					if (queue.size === 0) continue;

					const currentQueue = Array.from(queue);
					queue.clear();

					for (const subscription of currentQueue) {
						if (subscription.active) {
							const continuation = subscription.update();
							if (continuation) {
								queue.add(subscription);
								hasMoreWork = true;
							}
						}
					}
					if (queue.size > 0) hasMoreWork = true;
				}
			}
		} finally {
			this.shouldYield = originalShouldYield;
			this.isPending = false;
		}
	}

	setSync(sync: boolean) {
		this.isSync = sync;
	}

	/**
	 * Clears all pending updates.
	 */
	clear() {
		for (const queue of this.queues) {
			queue.clear();
		}
		this.isPending = false;
	}
}

export const scheduler = new Scheduler();
