import { dot } from "../../src";
import { Priority } from "../../src/reactivity/priority";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import { scheduler } from "../../src/reactivity/scheduler";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
	scheduler.clear();
	jest.restoreAllMocks();
});

describe("Concurrent Rendering.", () => {

	test("Priority-based updates work.", async () => {
		const results: string[] = [];
		const low = dot.watch("Low");
		const high = dot.watch("High");
		
		low.subscribe((v) => results.push(v));
		high.subscribe((v) => results.push(v));
		
		(low as any).setValue("Low Updated", Priority.Background);
		(high as any).setValue("High Updated", Priority.UserBlocking);
		
		await new Promise(resolve => setTimeout(resolve, 20));
		
		expect(results).toEqual(["High Updated", "Low Updated"]);
	});

	test("setValue with Priority.Immediate is synchronous.", () => {
		const name = dot.watch("A");
		dot(document.body).div(name);
		
		(name as any).setValue("B", Priority.Immediate);
		
		expect(document.body.innerHTML).toBe("<div>B</div>");
	});

	test("Background updates don't block UserBlocking updates.", async () => {
		const bg = dot.watch("BG");
		const ui = dot.watch("UI");
		
		const results: string[] = [];
		bg.subscribe((v) => {
			results.push(v);
			// Simulate a high priority update coming in during a low priority one
			if (v === "BG2") {
				(ui as any).setValue("UI2", Priority.UserBlocking);
			}
		});
		ui.subscribe((v) => results.push(v));
		
		(bg as any).setValue("BG2", Priority.Background);
		
		// Wait for everything to finish
		while ((scheduler as any).queues.some(q => q.size > 0)) {
			await new Promise(resolve => setTimeout(resolve, 10));
		}
		
		// The UI2 update should have been processed
		expect(results).toContain("BG2");
		expect(results).toContain("UI2");
	});

	test("A second update aborts a yielded in-progress update.", async () => {
		const list = dot.watch(["A", "B"]);
		dot(document.body).each(list, (item) => dot.p(item));
		(dot as any).flushSync();

		// 1. Start a background update that will yield
		// We'll mock shouldYield to yield after the first item
		let callCount = 0;
		jest.spyOn(scheduler, 'shouldYield').mockImplementation(() => {
			callCount++;
			return callCount > 1; // Yield after first item in diff
		});

		(list as any).setValue(["A", "C"], Priority.Background);
		
		// Wait for the first chunk to process and yield
		await new Promise(resolve => setTimeout(resolve, 0));

		// 2. While the first update is yielded, trigger a new update
		(list as any).setValue(["X", "Y"], Priority.Immediate);

		// 3. Verify the DOM matches the LATEST update, not the interrupted one
		expect(document.body.innerHTML).toContain("<p>X</p><p>Y</p>");
		expect(document.body.innerHTML).not.toContain("<p>C</p>");
		
		// Wait for any background tasks to finish (they should abort)
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(document.body.innerHTML).toContain("<p>X</p><p>Y</p>");
		expect(document.body.innerHTML).not.toContain("<p>C</p>");
	});

	test("Memory Management: _unrender cleans up all subscriptions.", () => {
		const externalWatcher = dot.watch("External");
		const list = dot.watch([1, 2, 3]);
		
		dot(document.body).each(list, (item) => {
			return dot.p(externalWatcher);
		});
		(dot as any).flushSync();
		
		// 3 items in list + 1 initial render = 3 subscriptions to externalWatcher
		expect(Object.keys((externalWatcher as any).allBindings).length).toBe(3);
		
		// Clear the list
		list.value = [];
		(dot as any).flushSync();
		
		// All subscriptions should be removed
		expect(Object.keys((externalWatcher as any).allBindings).length).toBe(0);
	});

	test("Nested Concurrent Rendering: parent and child both yield.", async () => {
		const data = dot.watch([
			{ id: 1, sub: [1, 2] },
			{ id: 2, sub: [3, 4] }
		], "id");
		
		dot(document.body).each(data, (item) => {
			return dot.div(
				dot.each(item.sub, (s) => dot.p(s))
			);
		});
		(dot as any).flushSync();
		
		// Setup yielding
		let yieldCount = 0;
		jest.spyOn(scheduler, 'shouldYield').mockImplementation(() => {
			yieldCount++;
			return yieldCount % 3 === 0; // Yield every 3rd call
		});
		
		// Trigger update
		(data as any).setValue([
			{ id: 1, sub: [1, 2, 5] },
			{ id: 2, sub: [3, 4, 6] }
		], Priority.Normal);
		
		// Wait for everything to finish
		while ((scheduler as any).queues.some(q => q.size > 0)) {
			await new Promise(resolve => setTimeout(resolve, 10));
		}
		
		expect(document.body.querySelectorAll("p").length).toBe(6);
		expect(document.body.innerHTML).toContain("<p>5</p>");
		expect(document.body.innerHTML).toContain("<p>6</p>");
	});

	test("Sync-Over-Async: flushSync forces completion of yielded task.", async () => {
		const list = dot.watch(["A", "B"]);
		dot(document.body).each(list, (item) => dot.p(item));
		(dot as any).flushSync();
		
		// Start background update and yield
		jest.spyOn(scheduler, 'shouldYield').mockReturnValue(true);
		(list as any).setValue(["A", "C"], Priority.Background);
		
		await new Promise(resolve => setTimeout(resolve, 0));
		
		// DOM should still be ["A", "B"] or partial
		// Now force sync
		jest.spyOn(scheduler, 'shouldYield').mockReturnValue(false);
		(dot as any).flushSync();
		
		expect(document.body.innerHTML).toContain("<p>A</p><p>C</p>");
		expect(document.body.innerHTML).not.toContain("<p>B</p>");
	});

	test("Event Listener Integrity: moved elements keep listeners.", async () => {
		let clickCount = 0;
		const list = dot.watch([
			{ id: 1, text: "A" },
			{ id: 2, text: "B" }
		], "id");
		
		dot(document.body).each(list, (item) => {
			return dot.button({ onClick: () => clickCount++ }, item.text);
		});
		(dot as any).flushSync();
		
		// Swap items
		(list as any).setValue([
			{ id: 2, text: "B" },
			{ id: 1, text: "A" }
		], Priority.Normal);
		
		// Wait for everything to finish
		while ((scheduler as any).queues.some(q => q.size > 0)) {
			await new Promise(resolve => setTimeout(resolve, 10));
		}
		
		const buttons = document.body.querySelectorAll("button");
		expect(buttons[0].textContent).toBe("B");
		expect(buttons[1].textContent).toBe("A");
		
		// Click them
		buttons[0].click();
		buttons[1].click();
		
		expect(clickCount).toBe(2);
	});
});
