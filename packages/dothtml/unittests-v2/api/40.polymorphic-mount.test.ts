import { dot, FrameworkItems, IDotComponent, IDotDocument } from "../../src";
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

class SimpleComponent implements IDotComponent {
	_: FrameworkItems;
	build(): IDotDocument {
		return dot.div("Component Content");
	}
}

describe("Polymorphic Mount", () => {
	test("Mount a component (existing behavior).", () => {
		dot(document.body).mount(new SimpleComponent());
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toBe("<div>component content</div>");
	});

	test("Mount a VDOM node.", () => {
		const vdom = dot.div("vdom content");
		dot(document.body).mount(vdom);
		expect(formatHTML(document.body.innerHTML)).toBe("<div>vdom content</div>");
	});

	test("Mount a DotChain.", () => {
		const chain = dot.div("chain content").p("more content");
		dot(document.body).mount(chain);
		expect(formatHTML(document.body.innerHTML)).toBe("<div>chain content</div><p>more content</p>");
	});
});
