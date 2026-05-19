import { dot } from "../../src";
import formatHTML from "./formatHTML";

afterEach(() => { 
	(dot as any).clearStores();
	document.body.innerHTML = ''; 
});

describe("DOThtml Store Signal Nesting", () => {

	test("Store adopts pre-configured Signals", () => {
		const keyedSignal = dot.state([{ id: 1, text: "A" }], "id");
		const useStore = (dot as any).store({
			id: "nesting-test",
			state: () => ({ 
				list: keyedSignal 
			})
		});

		const store = useStore();
		
		// The store property should be the exact same Signal instance
		expect(store.list).toBe(keyedSignal);
		expect(store._state.list).toBe(keyedSignal);
		expect(store.list.key).toBe("id");
	});

	test("dot.each iterates correctly over store-managed keyed signals", () => {
		const useStore = (dot as any).store({
			id: "each-test",
			state: () => ({ 
				list: dot.state([
					{ id: 1, text: "A" },
					{ id: 2, text: "B" }
				], "id") 
			})
		});

		const store = useStore();
		
		dot(document.body).each(store.list, (item: any) => dot.p(item.text));
		(dot as any).flushSync();

		expect(formatHTML(document.body.innerHTML)).toBe("<p>a</p><p>b</p>");
	});

	test("Keyed diffing works correctly in stores (stable DOM nodes)", () => {
		const useStore = (dot as any).store({
			id: "diff-test",
			state: () => ({ 
				list: dot.state([
					{ id: 1, text: "A" },
					{ id: 2, text: "B" }
				], "id") 
			})
		});

		const store = useStore();
		
		dot(document.body).each(store.list, (item: any) => dot.p(item.text));
		(dot as any).flushSync();

		const p1 = document.body.querySelectorAll("p")[0];
		const p2 = document.body.querySelectorAll("p")[1];
		(p1 as any)._marked = "A";
		(p2 as any)._marked = "B";

		// Swap items
		store.list.value = [
			{ id: 2, text: "B" },
			{ id: 1, text: "A" }
		];
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps[0].textContent).toBe("B");
		expect(ps[1].textContent).toBe("A");
		
		// Verify stable nodes (keyed diffing worked)
		expect(ps[0]).toBe(p2);
		expect(ps[1]).toBe(p1);
		expect((ps[0] as any)._marked).toBe("B");
		expect((ps[1] as any)._marked).toBe("A");
	});
});
