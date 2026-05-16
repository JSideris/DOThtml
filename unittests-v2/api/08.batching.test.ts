import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Update Batching.", () => {

	beforeEach(() => {
		(dot as any).setSync(false);
	});

	afterEach(() => {
		(dot as any).setSync(true);
	});

	test("Multiple updates are batched.", async () => {
		const counter = dot.watch(0);
		let updateCount = 0;
		
		// We can track updates by subscribing to the watcher.
		// However, the scheduler batches the *subscriptions* that update the DOM.
		// So we'll check the DOM content.
		
		dot(document.body).div(counter);
		
		counter.value = 1;
		counter.value = 2;
		counter.value = 3;
		
		// Synchronously, it should still be 0.
		expect(document.body.innerHTML).toBe("<div>0</div>");
		
		// Wait for microtask.
		await Promise.resolve();
		
		expect(document.body.innerHTML).toBe("<div>3</div>");
	});

	test("Asynchronous updates.", async () => {
		const name = dot.watch("A");
		dot(document.body).div(name);
		
		name.value = "B";
		expect(document.body.innerHTML).toBe("<div>A</div>");
		
		await Promise.resolve();
		expect(document.body.innerHTML).toBe("<div>B</div>");
	});

	test("dot.flushSync() forces immediate update.", () => {
		const name = dot.watch("A");
		dot(document.body).div(name);
		
		name.value = "B";
		expect(document.body.innerHTML).toBe("<div>A</div>");
		
		(dot as any).flushSync();
		expect(document.body.innerHTML).toBe("<div>B</div>");
	});

	test("Unsubscription prevents pending updates.", async () => {
		const name = dot.watch("A");
		const binding = name.bind();
		dot(document.body).div(binding);
		
		name.value = "B"; // Enqueued.
		
		// Manually unsubscribe.
		// In a real app, this happens when a component is unrendered.
		(binding as any)._unsubscribe(1); // The first subscription ID is 1.
		
		await Promise.resolve();
		
		// Should still be A because the subscription was deactivated.
		expect(document.body.innerHTML).toBe("<div>A</div>");
	});

	test("Nested updates are handled.", async () => {
		const a = dot.watch(1);
		const b = dot.watch(10);
		
		dot(document.body).div(a).div(b);
		
		a.subscribe((val) => {
			if (val === 2) {
				b.value = 20;
			}
		});
		
		a.value = 2;
		
		expect(document.body.innerHTML).toBe("<div>1</div><div>10</div>");
		
		await Promise.resolve(); // First flush for 'a'.
		// The flush for 'a' triggers a change in 'b', which schedules another flush.
		// Since our scheduler handles re-scheduling if the queue is not empty, 
		// it might take another tick or happen in the same tick depending on implementation.
		// Our implementation calls scheduleFlush() again if queue.size > 0.
		
		// Wait one more microtask just in case.
		await Promise.resolve();
		
		expect(document.body.innerHTML).toBe("<div>2</div><div>20</div>");
	});
});
