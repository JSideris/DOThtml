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
});
