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

describe("attribute and content nullary getters.", () => {
	test("range value getter tracks n and does not open at max.", () => {
		const n = dot.state(2);
		dot(document.body).input({ type: "range", min: 0, max: 4, value: () => n.value, id: "slider" } as any);
		const input = document.getElementById("slider") as HTMLInputElement;

		expect(input.value).toBe("2");
		expect(input.value).not.toBe("4");

		n.value = 1;
		dot.flushSync();
		expect(input.value).toBe("1");
	});

	test("div content getter renders and updates as text.", () => {
		const n = dot.state("hello");
		dot(document.body).div(() => n.value);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("hello").toString()));

		n.value = "world";
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("world").toString()));
	});

	test("text getter renders and updates.", () => {
		const n = dot.state("hello");
		dot(document.body).text(() => n.value);
		expect(formatHTML(document.body.innerHTML)).toBe("hello");

		n.value = "world";
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("world");
	});

	test("attr getter updates after source change.", () => {
		const n = dot.state(2);
		dot(document.body).div({ id: "box" }).attr("data-n", () => n.value);
		const el = document.getElementById("box");
		expect(el?.getAttribute("data-n")).toBe("2");

		n.value = 7;
		dot.flushSync();
		expect(el?.getAttribute("data-n")).toBe("7");
	});
});

describe("attribute and content invalid inputs.", () => {
	test("bind getter throws error 15.", () => {
		const n = dot.state("x");
		expect(() => {
			dot(document.body).input({ bind: () => n.value } as any);
		}).toThrow(/\[DOThtml\]/);
		expect(() => {
			dot(document.body).input({ bind: () => n.value } as any);
		}).toThrow(/15|bind/i);
	});

	test("arity-1 attribute function throws error 15.", () => {
		expect(() => {
			dot(document.body).div({ id: (x: any) => x } as any);
		}).toThrow(/\[DOThtml\]/);
		expect(() => {
			dot(document.body).div({ id: (x: any) => x } as any);
		}).toThrow(/15|cannot be a function/i);
	});

	test("arity-1 element content throws error 15.", () => {
		expect(() => {
			dot(document.body).div((x: any) => x);
		}).toThrow(/\[DOThtml\]/);
		expect(() => {
			dot(document.body).div((x: any) => x);
		}).toThrow(/15|cannot be a function/i);
	});
});

describe("attribute and content getter exclusions.", () => {
	test("onClick still registers as an event, not a computed.", () => {
		let clicked = false;
		dot(document.body).button({ id: "btn", onClick: () => { clicked = true; } }, "Click");
		document.getElementById("btn")?.click();
		expect(clicked).toBe(true);
	});

	test("style attribute builder still applies.", () => {
		dot(document.body).div({
			id: "styled",
			style: (s: any) => s.color("red"),
		} as any);
		expect(document.getElementById("styled")?.style.color).toBe("red");
	});

	test("ref callback still receives the element.", () => {
		let node: HTMLElement | null = null;
		dot(document.body).div({ id: "refed", ref: (el: HTMLElement | null) => { node = el; } } as any, "x");
		expect(node).toBe(document.getElementById("refed"));
	});

	test("svg child builder is not treated as content.", () => {
		dot(document.body).svg(s => s.circle({ r: 5 }));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<svg><circle r=5></circle></svg>"));
	});
});
