import { dot } from "../../src";
import { ContainerVdom } from "../../src/vdom-nodes/container-vdom";
import ElementVdom from "../../src/vdom-nodes/element-vdom";
import { Vdom } from "../../src/vdom-nodes/vdom";
import { DotChain } from "../../src/dot-chain";
import formatHTML from "./formatHTML";

import { FragmentVdom } from "../../src/vdom-nodes/fragment-vdom";

describe("VDOM Overhaul Baseline.", () => {

	test("dot.div() returns an ElementVdom directly (lazy wrapping).", () => {
		const result = dot.div("hello");
		expect(result).toBeInstanceOf(ElementVdom);
	});

	test("dot.div().p() promotes to DotChain wrapping a FragmentVdom.", () => {
		const result = dot.div("A").p("B") as any;
		expect(result).toBeInstanceOf(DotChain);
		expect(result._root).toBeInstanceOf(FragmentVdom);
		expect(result._root._children.length).toBe(2);
	});

	test("dot.div().p() returns a Vdom-compatible object (sibling chaining).", () => {
		const result = dot.div("A").p("B");
		expect(result).toBeInstanceOf(Vdom);
		expect(formatHTML(result.toString())).toBe("<div>a</div><p>b</p>");
	});

	test("Nested standalone calls dot.div(dot.p()).", () => {
		const result = dot.div(dot.p("inner"));
		expect(formatHTML(result.toString())).toBe("<div><p>inner</p></div>");
	});

	test("Mixed chaining dot.div().text('hi').p().", () => {
		const result = dot.div("A").text("hi").p("B");
		expect(formatHTML(result.toString())).toBe("<div>a</div>hi<p>b</p>");
	});

	test("Conditional with standalone call dot.when(true, dot.p('yes')).", () => {
		const container = new ContainerVdom(dot);
		container.when(true, dot.p("yes") as any);
		expect(formatHTML(container.toString())).toBe("<p>yes</p>");
	});

	test("Collection with standalone call dot.each([1], x => dot.li(x)).", () => {
		const container = new ContainerVdom(dot);
		container.each([1, 2], (x => dot.li(x)) as any);
		expect(formatHTML(container.toString())).toBe("<li>1</li><li>2</li>");
	});
});
