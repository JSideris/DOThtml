import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import { scheduler } from "../../src/reactivity/scheduler";

afterEach(() => {
	document.body.innerHTML = "";
	document.body[DOT_VDOM_PROP_NAME] = null;
	scheduler.clear();
	jest.restoreAllMocks();
});

describe("Batch render nested reactive blocks.", () => {

	test("Nested dot.when inside dot.each during batch render should not throw Error 4.", () => {
		const list = dot.state([
			{ id: 1, text: "Item 1", show: true },
			{ id: 2, text: "Item 2", show: true }
		], "id");

		// We need to trigger a batch render. 
		// Initial render of a collection uses batching if there are multiple items.
		// In collection-vdom.ts, updateList is called during _render.
		// If we have multiple items, it will use batchRenderNewItems.
		
		const renderNested = () => {
			dot(document.body).each(list, (item) => 
				dot.when(item.show, dot.p(item.text))
			);
			(dot as any).flushSync();
		};

		expect(renderNested).not.toThrow();
		
		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(2);
		expect(ps[0].textContent).toBe("Item 1");
		expect(ps[1].textContent).toBe("Item 2");
	});

	test("Dynamic update of nested reactive block inside batched collection should not throw.", () => {
		const list = dot.state([
			{ id: 1, text: "Item 1", show: false },
			{ id: 2, text: "Item 2", show: false },
			{ id: 3, text: "Item 3", show: false }
		], "id");

		dot(document.body).each(list, (item) => 
			dot.when(item.show, dot.p(item.text))
		);
		(dot as any).flushSync();

		// Now trigger a batch update that also triggers the nested reactivity.
		// If we update multiple items at once, and they were previously unrendered,
		// they might be batch rendered.
		
		list.value = [
			{ id: 1, text: "Item 1", show: true },
			{ id: 2, text: "Item 2", show: true },
			{ id: 3, text: "Item 3", show: true }
		];
		
		expect(() => (dot as any).flushSync()).not.toThrow();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(3);
	});
});
