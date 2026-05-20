import { dot, IDotComponent, IDotDocument, FrameworkItems } from "../../src";
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

class DisplayRow implements IDotComponent {
	_: FrameworkItems;
	value: any;
	constructor(value: any) {
		this.value = value;
	}
	build(): IDotDocument {
		return dot.div(this.value);
	}
}

describe("Issue #182: Optional mount in each and when", () => {
	test("dot.each should automatically mount returned components", () => {
		const values = ["A", "B"];
		dot(document.body).each(values, (v) => {
			return new DisplayRow(v);
		});

		// Currently, this is expected to fail and render [object Object] inside a TextVdom
		// instead of mounting the component.
		expect(formatHTML(document.body.innerHTML)).toMatch(/<dothtml-[0-9a-f]+><\/dothtml-[0-9a-f]+><dothtml-[0-9a-f]+><\/dothtml-[0-9a-f]+>/);
		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>A</div>");
		expect(document.body.children[1].shadowRoot?.innerHTML).toBe("<div>B</div>");
	});

	test("dot.when should automatically mount returned components", () => {
		dot(document.body).when(true, new DisplayRow("True Case"));

		expect(formatHTML(document.body.innerHTML)).toMatch(/<dothtml-[0-9a-f]+><\/dothtml-[0-9a-f]+>/);
		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>True Case</div>");
	});

	test("dot.otherwiseWhen should automatically mount returned components", () => {
		dot(document.body)
			.when(false, "False")
			.otherwiseWhen(true, new DisplayRow("Otherwise True Case"));

		expect(formatHTML(document.body.innerHTML)).toMatch(/<dothtml-[0-9a-f]+><\/dothtml-[0-9a-f]+>/);
		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>Otherwise True Case</div>");
	});

	test("dot.otherwise should automatically mount returned components", () => {
		dot(document.body)
			.when(false, "False")
			.otherwise(new DisplayRow("Otherwise Case"));

		expect(formatHTML(document.body.innerHTML)).toMatch(/<dothtml-[0-9a-f]+><\/dothtml-[0-9a-f]+>/);
		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>Otherwise Case</div>");
	});
});
