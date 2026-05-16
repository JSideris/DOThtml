import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Keyed Diffing.", () => {

	test("Items are reused when swapped.", () => {
		const list = dot.state([
			{ id: 1, text: "A" },
			{ id: 2, text: "B" }
		], "id");

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const p1 = document.body.querySelectorAll("p")[0];
		const p2 = document.body.querySelectorAll("p")[1];
		
		// Mark the nodes to track them
		(p1 as any)._marked = "A";
		(p2 as any)._marked = "B";

		// Swap them
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

	test("Middle insertion doesn't re-render everything.", () => {
		const list = dot.state([
			{ id: 1, text: "A" },
			{ id: 3, text: "C" }
		], "id");

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const p1 = document.body.querySelectorAll("p")[0];
		const p3 = document.body.querySelectorAll("p")[1];
		(p1 as any)._marked = "A";
		(p3 as any)._marked = "C";

		// Insert in middle
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

	test("Deletion removes correct node.", () => {
		const list = dot.state([
			{ id: 1, text: "A" },
			{ id: 2, text: "B" },
			{ id: 3, text: "C" }
		], "id");

		dot(document.body).each(list, (item) => dot.p(item.text));
		(dot as any).flushSync();

		const p1 = document.body.querySelectorAll("p")[0];
		const p3 = document.body.querySelectorAll("p")[2];

		// Delete middle
		list.value = [
			{ id: 1, text: "A" },
			{ id: 3, text: "C" }
		];
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(2);
		expect(ps[0]).toBe(p1);
		expect(ps[1]).toBe(p3);
	});

	test("Unkeyed (index-based) still works.", () => {
		const list = dot.state(["A", "B"]);

		dot(document.body).each(list, (item) => dot.p(item));
		(dot as any).flushSync();

		const p1 = document.body.querySelectorAll("p")[0];
		(p1 as any)._marked = "A";

		list.value = ["A", "C"];
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps[0]).toBe(p1); // Should be reused because index 0 is still "A"
		expect(ps[1].textContent).toBe("C");
	});
});
