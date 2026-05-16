import Subscription from "./subscription";

/**
 * The Scheduler is responsible for batching updates to the DOM.
 * Instead of updating the DOM immediately when a Watcher changes,
 * we enqueue the update and flush it in the next microtask.
 */
class Scheduler {
	private queue: Set<Subscription> = new Set();
	private isPending: boolean = false;

	/**
	 * Adds a subscription to the next batch.
	 * Using a Set ensures that even if a Watcher changes multiple times,
	 * its associated Subscription only runs once per tick.
	 */
	enqueue(subscription: Subscription) {
		this.queue.add(subscription);
		this.scheduleFlush();
	}

	private scheduleFlush() {
		if (this.isPending) return;
		this.isPending = true;

		// queueMicrotask runs after the current task but before the next paint.
		queueMicrotask(() => this.flush());
	}

	/**
	 * Flushes the current queue of updates.
	 */
	flush() {
		this.isPending = false;
		
		if (this.queue.size === 0) return;

		// Copy the queue to handle cases where an update triggers another update.
		const currentQueue = Array.from(this.queue);
		this.queue.clear();

		for (const subscription of currentQueue) {
			// Only update if the subscription is still active.
			if (subscription.active) {
				subscription.update();
			}
		}

		// If new items were added during the flush, schedule another one.
		if (this.queue.size > 0) {
			this.scheduleFlush();
		}
	}
}

export const scheduler = new Scheduler();
