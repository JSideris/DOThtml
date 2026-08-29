import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => {
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = "";
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("each/when nullary getters.", () => {
	test("each getter renders and updates after source change.", () => {
		const box = dot.state({ items: ["a", "b"] });
		dot(document.body).each(() => box.value.items, x => dot.p(x));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("a").p("b").toString()));

		box.value = { items: ["a", "b", "c"] };
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("a").p("b").p("c").toString()));
	});

	test("when getter toggles then and otherwise.", () => {
		const on = dot.state(false);
		dot(document.body).when(() => on.value, dot.p("yes")).otherwise(dot.p("no"));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("no").toString()));

		on.value = true;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("yes").toString()));
	});

	test("otherwiseWhen getter middle branch.", () => {
		const mode = dot.state(1);

		dot(document.body)
			.when(() => mode.value === 1, dot.p("a"))
			.otherwiseWhen(() => mode.value === 2, dot.p("b"))
			.otherwise(dot.p("c"));

		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("a").toString()));

		mode.value = 2;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("b").toString()));

		mode.value = 3;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("c").toString()));
	});

	test("each(dot.computed(() => ...)) still works.", () => {
		const box = dot.state({ items: ["a", "b"] });
		dot(document.body).each(dot.computed(() => box.value.items), x => dot.p(x));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("a").p("b").toString()));

		box.value = { items: ["a", "b", "c"] };
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("a").p("b").p("c").toString()));
	});

	test("each(dot.state([])) still works.", () => {
		dot(document.body).each(dot.state(["a"]), x => dot.p(x));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("a").toString()));
	});
});

describe("each/when invalid inputs.", () => {
	const row = (x: any) => dot.p(x);

	test("each with arity-1 function collection throws error 12.", () => {
		expect(() => {
			dot(document.body).each((x: any) => x, row);
		}).toThrow(/\[DOThtml\]/);
		expect(() => {
			dot(document.body).each((x: any) => x, row);
		}).toThrow(/12|function with parameters/i);
	});

	test("when with arity-1 function condition throws error 12.", () => {
		expect(() => {
			dot(document.body).when(((x: any) => x) as any, dot.p("x"));
		}).toThrow(/\[DOThtml\]/);
		expect(() => {
			dot(document.body).when(((x: any) => x) as any, dot.p("x"));
		}).toThrow(/12|function with parameters/i);
	});

	test("when with function then-content throws error 13.", () => {
		expect(() => {
			dot(document.body).when(true, (() => dot.p("x")) as any);
		}).toThrow(/\[DOThtml\]/);
		expect(() => {
			dot(document.body).when(true, (() => dot.p("x")) as any);
		}).toThrow(/13|cannot be a function/i);
	});

	test("each with Set throws error 14.", () => {
		expect(() => {
			dot(document.body).each(new Set([1]), row);
		}).toThrow(/\[DOThtml\]/);
		expect(() => {
			dot(document.body).each(new Set([1]), row);
		}).toThrow(/14|not valid collections/i);
	});

	test("each with Map throws error 14.", () => {
		expect(() => {
			dot(document.body).each(new Map([["a", 1]]), row);
		}).toThrow(/\[DOThtml\]/);
		expect(() => {
			dot(document.body).each(new Map([["a", 1]]), row);
		}).toThrow(/14|not valid collections/i);
	});

	test("each with null throws error 14.", () => {
		expect(() => {
			dot(document.body).each(null as any, row);
		}).toThrow(/\[DOThtml\]/);
		expect(() => {
			dot(document.body).each(null as any, row);
		}).toThrow(/14|not valid collections/i);
	});

	test("each with undefined throws error 14.", () => {
		expect(() => {
			dot(document.body).each(undefined as any, row);
		}).toThrow(/\[DOThtml\]/);
		expect(() => {
			dot(document.body).each(undefined as any, row);
		}).toThrow(/14|not valid collections/i);
	});

	test("each with Promise throws error 14.", () => {
		expect(() => {
			dot(document.body).each(Promise.resolve([]), row);
		}).toThrow(/\[DOThtml\]/);
		expect(() => {
			dot(document.body).each(Promise.resolve([]), row);
		}).toThrow(/14|not valid collections/i);
	});

	test("each with computed resolving to Set throws error 14 on render.", () => {
		expect(() => {
			dot(document.body).each(dot.computed(() => new Set([1])), row);
		}).toThrow(/\[DOThtml\]/);
		expect(() => {
			dot(document.body).each(dot.computed(() => new Set([1])), row);
		}).toThrow(/14|not valid collections/i);
	});

	test("each with static dictionary still works.", () => {
		dot(document.body).each({ a: 1, b: 2 }, (x, i, k) => dot.p(`${x}, ${k}`));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("1, a").p("2, b").toString()));
	});

	test("when with component instance then-content does not throw error 13.", () => {
		dot(document.body).when(true, { build() { return dot.p("x"); } });
		const shadow = document.body.children[0]?.shadowRoot;
		expect(formatHTML(shadow?.innerHTML || "")).toBe(formatHTML("<p>x</p>"));
	});
});
