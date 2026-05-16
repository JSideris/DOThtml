// @ts-nocheck
import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Unlimited Arguments for Element Builders.", () => {

	test("Multiple strings as content.", () => {
		dot(document.body).div("Hello", " ", "World");
		expect(formatHTML(document.body.innerHTML)).toBe("<div>hello world</div>");
	});

	test("Multiple elements as content.", () => {
		dot(document.body).div(
			dot.p("Para 1"),
			dot.p("Para 2"),
			dot.p("Para 3")
		);
		expect(formatHTML(document.body.innerHTML)).toBe("<div><p>para 1</p><p>para 2</p><p>para 3</p></div>");
	});

	test("Mixed attributes and multiple content arguments.", () => {
		dot(document.body).div(
			{ id: "my-div", class: "container" },
			"Start",
			dot.span("Middle"),
			"End"
		);
		expect(formatHTML(document.body.innerHTML)).toBe("<div id=my-div class=container>start<span>middle</span>end</div>");
	});

	test("Attributes can appear anywhere in the argument list.", () => {
		dot(document.body).div(
			"First",
			{ id: "my-div" },
			"Last"
		);
		expect(formatHTML(document.body.innerHTML)).toBe("<div id=my-div>firstlast</div>");
	});

	test("Multiple attribute objects are merged.", () => {
		dot(document.body).div(
			{ id: "my-div" },
			{ class: "my-class" },
			"Content"
		);
		expect(formatHTML(document.body.innerHTML)).toBe("<div id=my-div class=my-class>content</div>");
	});

	test("Nested arrays are flattened.", () => {
		dot(document.body).div(
			["A", "B"],
			["C", ["D", "E"]]
		);
		expect(formatHTML(document.body.innerHTML)).toBe("<div>abcde</div>");
	});

	test("Reactive bindings work with multiple arguments.", () => {
		const name = dot.watch("John");
		dot(document.body).div("Hello ", name, "!");
		expect(formatHTML(document.body.innerHTML)).toBe("<div>hello john!</div>");
		
		name.value = "Jane";
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div>hello jane!</div>");
	});

	test("Components work with multiple arguments.", () => {
		@dot.component
		class MyComp {
			build() { return dot.span("Component"); }
		}

		dot(document.body).div(
			"Before",
			dot.mount(new MyComp()),
			"After"
		);
		const html = formatHTML(document.body.innerHTML);
		expect(html).toContain("before");
		expect(html).toContain("after");
		expect(html).toContain("dothtml-");
	});

	test("The navbar pattern (multiple mounts) works correctly.", () => {
		@dot.component
		class NavBtn {
			text: string;
			constructor(props: { text: string }) { this.text = props.text; }
			build() { return dot.button(this.text); }
		}

		dot(document.body).nav({ class: "navbar" },
			dot.mount(new NavBtn({ text: "Home" })),
			dot.mount(new NavBtn({ text: "About" })),
			dot.mount(new NavBtn({ text: "Contact" }))
		);

		const html = formatHTML(document.body.innerHTML);
		expect(html).toContain("navbar");
		const matches = html.match(/<dothtml-/g);
		expect(matches && matches.length).toBe(3);
	});
});
