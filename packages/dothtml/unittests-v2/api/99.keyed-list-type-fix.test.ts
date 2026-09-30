import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Keyed list type checking (TypeScript DX fix).", () => {

	test("dot.each accepts keyed list signal without cast.", () => {
		interface Row {
			id: string;
			text: string;
		}
		
		const rows = dot.state<Row[]>([
			{ id: 'a', text: 'A' },
			{ id: 'b', text: 'B' }
		], 'id');

		dot(document.body).each(rows, row => dot.p(row.text));
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(2);
		expect(ps[0].textContent).toBe("A");
		expect(ps[1].textContent).toBe("B");
	});

	test("dot.each accepts mutable array signal from dot.state.", () => {
		const items = dot.state(['x', 'y'], 'id');
		
		dot(document.body).each(items, item => dot.span(item));
		(dot as any).flushSync();

		const spans = document.body.querySelectorAll("span");
		expect(spans.length).toBe(2);
		expect(spans[0].textContent).toBe("x");
		expect(spans[1].textContent).toBe("y");
	});

	test("dot.each still accepts readonly array signal.", () => {
		const items = dot.state<readonly string[]>(['a', 'b']);
		
		dot(document.body).each(items, item => dot.div(item));
		(dot as any).flushSync();

		const divs = document.body.querySelectorAll("div");
		expect(divs.length).toBe(2);
		expect(divs[0].textContent).toBe("a");
		expect(divs[1].textContent).toBe("b");
	});

	test("dot.each accepts dictionary signal.", () => {
		const dict = dot.state({ a: 'A', b: 'B' });
		
		dot(document.body).each(dict, (item, _i, key) => dot.p(`${key}: ${item}`));
		(dot as any).flushSync();

		const ps = document.body.querySelectorAll("p");
		expect(ps.length).toBe(2);
	});
});
