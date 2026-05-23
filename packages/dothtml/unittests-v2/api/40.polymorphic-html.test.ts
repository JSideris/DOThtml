import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Polymorphic .html() and .mount()", () => {

	test(".html() accepts a string (legacy behavior)", () => {
		dot(document.body).html("<b>Hello</b>");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<b>Hello</b>"));
	});

	test(".html() accepts a VNode and preserves interactivity", () => {
		let clicked = false;
		const vnode = dot.button({ onClick: () => clicked = true }, "Click Me");
		
		dot(document.body).html(vnode);
		
		const btn = document.querySelector("button");
		expect(btn).not.toBeNull();
		btn?.click();
		expect(clicked).toBe(true);
	});

	test(".html() accepts a Binding that switches between string and VNode", () => {
		let clicked = false;
		const vnode = dot.button({ onClick: () => clicked = true }, "Click Me");
		const state = dot.state<any>("<b>Initial</b>");
		
		dot(document.body).html(state);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<b>Initial</b>"));
		
		state.value = vnode;
		dot.flushSync();
		
		const btn = document.querySelector("button");
		expect(btn).not.toBeNull();
		btn?.click();
		expect(clicked).toBe(true);
		
		state.value = "<i>Back to string</i>";
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<i>Back to string</i>"));
	});

	test(".mount() accepts a string (new behavior)", () => {
		dot(document.body).mount("<b>Hello from mount</b>");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<b>Hello from mount</b>"));
	});

	test(".mount() accepts a Binding (new behavior)", () => {
		const state = dot.state("<b>Initial</b>");
		dot(document.body).mount(state);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<b>Initial</b>"));
		
		state.value = "<i>Updated</i>";
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("<i>Updated</i>"));
	});

	test(".html() and .mount() are interchangeable for VNodes", () => {
		let clicked1 = false;
		let clicked2 = false;
		const vnode1 = dot.button({ onClick: () => clicked1 = true }, "Btn 1");
		const vnode2 = dot.button({ onClick: () => clicked2 = true }, "Btn 2");
		
		dot(document.body).html(vnode1).mount(vnode2);
		
		const buttons = document.querySelectorAll("button");
		expect(buttons.length).toBe(2);
		
		buttons[0].click();
		expect(clicked1).toBe(true);
		
		buttons[1].click();
		expect(clicked2).toBe(true);
	});
});
