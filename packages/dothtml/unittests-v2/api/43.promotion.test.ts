import { dot } from "../../src";
import { DotChain } from "../../src/dot-chain";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

describe("API Promotion to DotChain", () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="target"></div>';
		document.body[DOT_VDOM_PROP_NAME] = null;
	});

	test("dot(selector) returns a DotChain.", () => {
		const result = dot("#target");
		expect(result).toBeInstanceOf(DotChain);
	});

	test("dot(element) returns a DotChain.", () => {
		const el = document.createElement("div");
		const result = dot(el);
		expect(result).toBeInstanceOf(DotChain);
	});

	test("dot.div() (static tag call) returns a DotChain.", () => {
		const result = dot.div();
		expect(result).toBeInstanceOf(DotChain);
	});

	test("dot.mount() returns a DotChain.", () => {
		const component = { build: (d: any) => d.div("test") };
		const result = dot.mount(component);
		expect(result).toBeInstanceOf(DotChain);
	});

	test("dot.each() returns a DotChain.", () => {
		const result = dot.each([1, 2], (x: any) => dot.span(x));
		expect(result).toBeInstanceOf(DotChain);
	});

	test("dot.when() returns a DotChain.", () => {
		const result = dot.when(true, dot.span("true"));
		expect(result).toBeInstanceOf(DotChain);
	});

	test("dot.text() returns a DotChain.", () => {
		const result = dot.text("hello");
		expect(result).toBeInstanceOf(DotChain);
	});

	test("dot.html() returns a DotChain.", () => {
		const result = dot.html("<b>hello</b>");
		expect(result).toBeInstanceOf(DotChain);
	});

	test("Chaining after dot(selector).empty().", () => {
		const target = document.getElementById("target")!;
		target.innerHTML = "<span>Old</span>";
		
		dot("#target").empty().p("New Content");
		
		expect(target.innerHTML).toBe("<p>New Content</p>");
	});

	test("dot(target).p('child') appends INSIDE the target element.", () => {
		const target = document.getElementById("target")!;
		dot(target).p("Child");
		
		expect(target.innerHTML).toBe("<p>Child</p>");
		expect(target.childNodes.length).toBe(1);
	});

	test("Multiple children added to dot(target) are all inside.", () => {
		const target = document.getElementById("target")!;
		dot(target).div("A").div("B");
		
		expect(target.innerHTML).toBe("<div>A</div><div>B</div>");
	});
});
