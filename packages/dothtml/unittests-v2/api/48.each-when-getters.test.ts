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
		dot(document.body).each((() => box.value.items) as any, x => dot.p(x));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("a").p("b").toString()));

		box.value = { items: ["a", "b", "c"] };
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("a").p("b").p("c").toString()));
	});

	test("when getter toggles then and otherwise.", () => {
		const on = dot.state(false);
		dot(document.body).when((() => on.value) as any, dot.p("yes")).otherwise(dot.p("no"));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("no").toString()));

		on.value = true;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("yes").toString()));
	});

	test("otherwiseWhen getter middle branch.", () => {
		const mode = dot.state(1);

		dot(document.body)
			.when((() => mode.value === 1) as any, dot.p("a"))
			.otherwiseWhen((() => mode.value === 2) as any, dot.p("b"))
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
