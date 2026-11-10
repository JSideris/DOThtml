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

describe("Class-map getters and computeds.", () => {
	test("zero-arg getter as a class-map value is live.", () => {
		const isActive = dot.state(true);
		dot(document.body).div({
			class: { active: () => isActive.value, idle: false },
		} as any);

		expect(formatHTML(document.body.innerHTML)).toBe("<div class=active></div>");

		isActive.value = false;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div></div>");

		isActive.value = true;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div class=active></div>");
	});

	test("computed as a class-map value is evaluated, not treated as always on.", () => {
		const isActive = dot.state(false);
		const active = dot.computed(() => isActive.value);
		dot(document.body).div({
			class: { active },
		} as any);

		expect(formatHTML(document.body.innerHTML)).toBe("<div></div>");

		isActive.value = true;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div class=active></div>");

		isActive.value = false;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div></div>");
	});

	test("bindAs in a class-map still works.", () => {
		const count = dot.state(5);
		dot(document.body).div({
			class: { "high-count": count.bindAs(v => v > 10) },
		} as any);

		expect(formatHTML(document.body.innerHTML)).toBe("<div></div>");

		count.value = 12;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div class=high-count></div>");
	});

	test("getter inside a mixed class array is reactive.", () => {
		const isActive = dot.state(true);
		dot(document.body).div({
			class: ["btn", { active: () => isActive.value }],
		} as any);

		expect(formatHTML(document.body.innerHTML)).toBe("<div class=btn active></div>");

		isActive.value = false;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div class=btn></div>");
	});
});
