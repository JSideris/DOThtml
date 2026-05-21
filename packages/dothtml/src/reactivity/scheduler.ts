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
	private isSync: boolean = false;
	private isSyncing: boolean = false;

	public onError?: (err: any) => void;

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
		if (!subscription.isQueued) {
			subscription.isQueued = true;
			this.queues[priority].add(subscription);
		}

		if (priority === Priority.Immediate || this.isSync) {
			this.flushSync();
		} else {
			this.scheduleFlush();
		}
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
		for (let p = Priority.Immediate; p <= Priority.Background; p++) {
			const queue = this.queues[p];
			if (queue.size === 0) continue;

			// Take a snapshot and clear the queue immediately.
			const items = Array.from(queue);
			queue.clear();

			for (let i = 0; i < items.length; i++) {
				const subscription = items[i];
				subscription.isQueued = false;

				if (subscription.active) {
					try {
						const continuation = subscription.update();
						
						if (continuation) {
							subscription.isQueued = true;
							queue.add(subscription);
						}
					} catch (err) {
						if (this.onError) {
							this.onError(err);
						} else {
							console.error("Scheduler error:", err);
						}
					}
				}

				if (this.shouldYield()) {
					// Put remaining items from the snapshot back into the queue.
					for (let j = i + 1; j < items.length; j++) {
						queue.add(items[j]);
						// items[j].isQueued is already true.
					}
					return true; // We need to yield, work is not finished.
				}
			}
		}

		// Check if any new work was added to higher priority queues while processing lower ones.
		for (let p = Priority.Immediate; p <= Priority.Background; p++) {
			if (this.queues[p].size > 0) return true;
		}

		return false;
	}

	/**
	 * Synchronously flushes all pending updates.
	 */
	flushSync() {
		if (this.isSyncing) return;

		this.isSyncing = true;
		// We don't want the work loop to trigger while we're doing a sync flush.
		this.isPending = true; 
		
		// During flushSync, we should never yield.
		const originalShouldYield = this.shouldYield;
		this.shouldYield = () => false;

		try {
			let hasMoreWork = true;
			while (hasMoreWork) {
				hasMoreWork = false;
				for (let p = Priority.Immediate; p <= Priority.Background; p++) {
					const queue = this.queues[p];
					if (queue.size === 0) continue;

					const items = Array.from(queue);
					queue.clear();

					for (const subscription of items) {
						subscription.isQueued = false;
						if (subscription.active) {
							try {
								const continuation = subscription.update();
								if (continuation) {
									subscription.isQueued = true;
									queue.add(subscription);
									hasMoreWork = true;
								}
							} catch (err) {
								if (this.onError) {
									this.onError(err);
								} else {
									console.error("Scheduler error (sync):", err);
								}
							}
						}
					}
					if (queue.size > 0) hasMoreWork = true;
				}
			}
		} finally {
			this.shouldYield = originalShouldYield;
			this.isPending = false;
			this.isSyncing = false;
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
