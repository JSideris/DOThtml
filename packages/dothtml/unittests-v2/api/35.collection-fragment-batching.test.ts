import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import { scheduler } from "../../src/reactivity/scheduler";
import { Vdom } from "../../src/vdom-nodes/vdom";

afterEach(() => {
	document.body.innerHTML = "";
	document.body[DOT_VDOM_PROP_NAME] = null;
	scheduler.clear();
	jest.restoreAllMocks();
});

describe("Collection fragment batching.", () => {

	test("Initial bulk create renders all items in correct order.", () => {
		const list = dot.state(
			Array.from({ length: 10 }, (_, i) => ({ id: i + 1, text: `Item ${i + 1}` })),
			"id"
		);

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(10);
		for (let i = 0; i < 10; i++) {
			expect(ps[i].textContent).toBe(`Item ${i + 1}`);
		}
	});

	test("Bulk tail append preserves prefix DOM nodes.", () => {
		const list = dot.state(
			[
				{ id: 1, text: "1" },
				{ id: 2, text: "2" },
				{ id: 3, text: "3" },
				{ id: 4, text: "4" },
				{ id: 5, text: "5" }
			],
			"id"
		);

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const original = Array.from(document.body.querySelectorAll("p"));

		list.value = [
			...list.value,
			{ id: 6, text: "6" },
			{ id: 7, text: "7" },
			{ id: 8, text: "8" },
			{ id: 9, text: "9" },
			{ id: 10, text: "10" }
		];
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(10);
		for (let i = 0; i < original.length; i++) {
			expect(ps[i]).toBe(original[i]);
		}
		expect(ps[5].textContent).toBe("6");
		expect(ps[9].textContent).toBe("10");
	});

	test("Batch uses DocumentFragment with fewer insertBefore calls than item count.", () => {
		const list = dot.state(
			Array.from({ length: 10 }, (_, i) => ({ id: i + 1, text: `Item ${i + 1}` })),
			"id"
		);

		const fragmentSpy = jest.spyOn(Document.prototype, "createDocumentFragment");
		const insertBeforeSpy = jest.spyOn(Node.prototype, "insertBefore");

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		expect(fragmentSpy).toHaveBeenCalled();
		expect(insertBeforeSpy.mock.calls.length).toBeLessThan(10);
	});

	test("Single middle insert uses per-item render path.", () => {
		const list = dot.state([
			{ id: 1, text: "A" },
			{ id: 3, text: "C" }
		], "id");

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const renderAfterSpy = jest.spyOn(Vdom.prototype, "_renderAfter");

		list.value = [
			{ id: 1, text: "A" },
			{ id: 2, text: "B" },
			{ id: 3, text: "C" }
		];
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(3);
		expect(ps[1].textContent).toBe("B");
		expect(renderAfterSpy).toHaveBeenCalledTimes(1);
	});

	test("Yielded bulk append completes with correct prefix reuse.", async () => {
		const list = dot.state([
			{ id: 1, text: "A" },
			{ id: 2, text: "B" }
		], "id");

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const p1 = document.body.querySelectorAll("p")[0];
		const p2 = document.body.querySelectorAll("p")[1];

		let callCount = 0;
		jest.spyOn(scheduler, "shouldYield").mockImplementation(() => {
			callCount++;
			return callCount % 2 === 0;
		});

		list.value = [
			...list.value,
			{ id: 3, text: "C" },
			{ id: 4, text: "D" },
			{ id: 5, text: "E" }
		];
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(5);
		expect(ps[0]).toBe(p1);
		expect(ps[1]).toBe(p2);
		expect(ps[2].textContent).toBe("C");
		expect(ps[4].textContent).toBe("E");
	});

	test("Nested row structure keeps items separated in DOM.", () => {
		const list = dot.state([
			{ id: 1, text: "A" },
			{ id: 2, text: "B" },
			{ id: 3, text: "C" }
		], "id");

		dot(document.body).each(list, (item) =>
			dot.div(dot.p(item.text))
		);
		(dot as any).flushSync();

		const divs = document.body.querySelectorAll("div");
		const ps = document.body.querySelectorAll("p");
		expect(divs.length).toBe(3);
		expect(ps.length).toBe(3);
		expect(ps[0].textContent).toBe("A");
		expect(ps[1].textContent).toBe("B");
		expect(ps[2].textContent).toBe("C");
		expect(divs[0].contains(ps[0])).toBe(true);
		expect(divs[1].contains(ps[1])).toBe(true);
		expect(divs[2].contains(ps[2])).toBe(true);
	});

	test("Swap and delete still work after batching.", () => {
		const list = dot.state([
			{ id: 1, text: "A" },
			{ id: 2, text: "B" },
			{ id: 3, text: "C" }
		], "id");

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const p1 = document.body.querySelectorAll("p")[0];
		const p2 = document.body.querySelectorAll("p")[1];
		const p3 = document.body.querySelectorAll("p")[2];
		(p1 as any)._marked = "A";
		(p2 as any)._marked = "B";
		(p3 as any)._marked = "C";

		list.value = [
			{ id: 2, text: "B" },
			{ id: 1, text: "A" }
		];
		(dot as any).flushSync();

		const swapped = document.body.querySelectorAll("p");
		expect(swapped.length).toBe(2);
		expect(swapped[0].textContent).toBe("B");
		expect(swapped[1].textContent).toBe("A");
		expect((swapped[0] as any)._marked).toBe("B");

		list.value = [{ id: 2, text: "B" }];
		(dot as any).flushSync();

		const remaining = document.body.querySelectorAll("p");
		expect(remaining.length).toBe(1);
		expect(remaining[0].textContent).toBe("B");
	});
});
