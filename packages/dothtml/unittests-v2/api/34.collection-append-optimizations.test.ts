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

describe("Collection append optimizations.", () => {

	test("Tail append reuses keyed DOM nodes.", () => {
		const list = dot.state([
			{ id: 1, text: "A" },
			{ id: 2, text: "B" }
		], "id");

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const p1 = document.body.querySelectorAll("p")[0];
		const p2 = document.body.querySelectorAll("p")[1];

		list.value = [...list.value, { id: 3, text: "C" }];
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(3);
		expect(ps[0]).toBe(p1);
		expect(ps[1]).toBe(p2);
		expect(ps[2].textContent).toBe("C");
	});

	test("Tail append reuses unkeyed (index) DOM nodes.", () => {
		const list = dot.state(["A", "B"]);

		dot(document.body).each(list, (item) => dot.p(item));
		(dot as any).flushSync();

		const p1 = document.body.querySelectorAll("p")[0];
		const p2 = document.body.querySelectorAll("p")[1];

		list.value = [...list.value, "C"];
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(3);
		expect(ps[0]).toBe(p1);
		expect(ps[1]).toBe(p2);
		expect(ps[2].textContent).toBe("C");
	});

	test("Tail append with many items preserves original nodes.", () => {
		const list = dot.state([
			{ id: 1, text: "1" },
			{ id: 2, text: "2" },
			{ id: 3, text: "3" },
			{ id: 4, text: "4" },
			{ id: 5, text: "5" }
		], "id");

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const original = Array.from(document.body.querySelectorAll("p"));

		list.value = [
			...list.value,
			{ id: 6, text: "6" },
			{ id: 7, text: "7" },
			{ id: 8, text: "8" }
		];
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(8);
		for (let i = 0; i < original.length; i++) {
			expect(ps[i]).toBe(original[i]);
		}
		expect(ps[5].textContent).toBe("6");
		expect(ps[6].textContent).toBe("7");
		expect(ps[7].textContent).toBe("8");
	});

	test("Append re-renders changed prefix item while preserving others.", () => {
		const list = dot.state([
			{ id: 1, text: "A" },
			{ id: 2, text: "B" }
		], "id");

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const p2 = document.body.querySelectorAll("p")[1];

		list.value = [
			{ id: 1, text: "A!" },
			{ id: 2, text: "B" },
			{ id: 3, text: "C" }
		];
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(3);
		expect(ps[0].textContent).toBe("A!");
		expect(ps[1]).toBe(p2);
		expect(ps[2].textContent).toBe("C");
	});

	test("Position skip: no redundant moves on stable prefix during append.", () => {
		const list = dot.state([
			{ id: 1, text: "A" },
			{ id: 2, text: "B" },
			{ id: 3, text: "C" }
		], "id");

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const moveBeforeSpy = jest.spyOn(Vdom.prototype, "_moveBefore");

		list.value = [...list.value, { id: 4, text: "D" }];
		(dot as any).flushSync();

		expect(moveBeforeSpy).not.toHaveBeenCalled();
	});

	test("Middle insert still moves nodes.", () => {
		const list = dot.state([
			{ id: 1, text: "A" },
			{ id: 3, text: "C" }
		], "id");

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const p1 = document.body.querySelectorAll("p")[0];
		const p3 = document.body.querySelectorAll("p")[1];

		list.value = [
			{ id: 1, text: "A" },
			{ id: 2, text: "B" },
			{ id: 3, text: "C" }
		];
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(3);
		expect(ps[0]).toBe(p1);
		expect(ps[2]).toBe(p3);
		expect(ps[1].textContent).toBe("B");
	});

	test("Swap still reorders.", () => {
		const list = dot.state([
			{ id: 1, text: "A" },
			{ id: 2, text: "B" }
		], "id");

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const p1 = document.body.querySelectorAll("p")[0];
		const p2 = document.body.querySelectorAll("p")[1];
		(p1 as any)._marked = "A";
		(p2 as any)._marked = "B";

		list.value = [
			{ id: 2, text: "B" },
			{ id: 1, text: "A" }
		];
		(dot as any).flushSync();

		const newP1 = document.body.querySelectorAll("p")[0];
		const newP2 = document.body.querySelectorAll("p")[1];

		expect(newP1.textContent).toBe("B");
		expect(newP2.textContent).toBe("A");
		expect((newP1 as any)._marked).toBe("B");
		expect((newP2 as any)._marked).toBe("A");
		expect(newP1).toBe(p2);
		expect(newP2).toBe(p1);
	});

	test("Yielded tail append completes correctly.", async () => {
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
			{ id: 4, text: "D" }
		];
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(4);
		expect(ps[0]).toBe(p1);
		expect(ps[1]).toBe(p2);
		expect(ps[2].textContent).toBe("C");
		expect(ps[3].textContent).toBe("D");
	});
});
