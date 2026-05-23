import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("HTML Primitives", () => {
	test("html with string.", () => {
		dot(document.body).html("<span>string content</span>");
		expect(formatHTML(document.body.innerHTML)).toBe("<span>string content</span>");
	});

	test("html with number.", () => {
		dot(document.body).html(123);
		expect(formatHTML(document.body.innerHTML)).toBe("123");
	});

	test("html with boolean.", () => {
		dot(document.body).html(true);
		expect(formatHTML(document.body.innerHTML)).toBe("true");
	});

	test("html with reactive signal.", () => {
		const state = dot.state("<b>initial</b>");
		dot(document.body).html(state);
		expect(formatHTML(document.body.innerHTML)).toBe("<b>initial</b>");

		state.value = "<i>updated</i>";
		(dot as any).flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<i>updated</i>");
	});
});
