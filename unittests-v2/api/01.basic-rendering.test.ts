import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import { ContainerVdom } from "../../src/vdom-nodes/container-vdom";
import ElementVdom from "../../src/vdom-nodes/element-vdom";
import formatHTML from "./formatHTML";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Targeting and Rendering.", ()=>{

	test("Dot gets exported.", () => {
		expect(typeof dot).toBe("function");
	});

	test("Dot can be called like a function.", () => {
		expect(typeof dot(document.body)).toBe("object");
	});

	test("Able to append the DOM.", () => {
		dot(document.body).div("123");
		expect(formatHTML(document.body.innerHTML)).toBe("<div>123</div>");
	});

	test("Able to append the DOM by tag name.", () => {
		dot("body").div("123");
		expect(formatHTML(document.body.innerHTML)).toBe("<div>123</div>");
	});

	test("Attribute on an element.", () => {
		dot(document.body).div("123").id("my-div");
		expect(formatHTML(document.body.innerHTML)).toBe("<div id=my-div>123</div>");
	});

	test("Able to append an element.", () => {
		dot(document.body).div().id("my-div");
		dot("#my-div").p("123").id("my-p");
		expect(formatHTML(document.body.innerHTML)).toBe(`<div id=my-div><p id=my-p>123</p></div>`);
	});

	test("Element chain.", () => {
		dot(document.body).div(123).id("my-div").p(456).class("my-p");
		expect(formatHTML(document.body.innerHTML)).toBe(`<div id=my-div>123</div><p class=my-p>456</p>`);
	});
});

describe("Writing data types.", ()=>{
	test("HTML content.", () => {
		dot(document.body).div(dot.html("<p>hello!</p>"));
		expect(formatHTML(document.body.innerHTML)).toBe("<div><p>hello!</p></div>");
	});
	test("Text content.", () => {
		dot(document.body).div(dot.text("<p>hello!</p>"));
		expect(formatHTML(document.body.innerHTML)).toBe("<div>&lt;p&gt;hello!&lt;/p&gt;</div>");
	});
	test("Numeric content.", () => {
		dot(document.body).div(123);
		expect(formatHTML(document.body.innerHTML)).toBe("<div>123</div>");
	});
	test("Boolean content.", () => {
		dot(document.body).div(true);
		expect(formatHTML(document.body.innerHTML)).toBe("<div>true</div>");
	});
	test("Boolean false content.", () => {
		dot(document.body).div(false);
		expect(formatHTML(document.body.innerHTML)).toBe("<div>false</div>");
	});
	test("String attribute.", () => {
		dot(document.body).div().title("123");
		expect(formatHTML(document.body.innerHTML)).toBe("<div title=123></div>");
	});
	test("Numeric attribute.", () => {
		// Types help but it should still work regardless.
		dot(document.body).img().width(123);
		expect(formatHTML(document.body.innerHTML)).toBe("<img width=123>");
	});
	test("Boolean attribute true.", () => {
		dot(document.body).input().type("checkbox").checked(true);
		expect(formatHTML(document.body.innerHTML)).toBe("<input type=checkbox checked=true>");
	});
	test("Boolean attribute false.", () => {
		dot(document.body).input().type("checkbox").checked(false);
		expect(formatHTML(document.body.innerHTML)).toBe("<input type=checkbox>");
	});
});

describe("Nesting.", ()=>{

	test("Nesting an element.", () => {
		dot(document.body).div(dot.p("123").id("my-p")).id("my-div");
		expect(formatHTML(document.body.innerHTML)).toBe(`<div id=my-div><p id=my-p>123</p></div>`);
	});	

	test("Complex nesting an element.", () => {
		dot(document.body)
		.textArea("text").id("my-text")
		.div(
			dot.span("span").id("my-span")
			.p("p").id("my-p")
			.a("a").id("my-a")
		).id("my-div")
		.h1("h1").id("my-h1");
		expect(formatHTML(document.body.innerHTML)).toBe(`<textarea id=my-text>text</textarea><div id=my-div><span id=my-span>span</span><p id=my-p>p</p><a id=my-a>a</a></div><h1 id=my-h1>h1</h1>`);
	});	

	test("Complex targeting.", () => {
		dot(document.body)
		.textArea("text").id("my-text")
		.div(
			dot.span("span").id("my-span")
			.p().id("my-p")
			.a("a").id("my-a")
		).id("my-div")
		.h1("h1").id("my-h1");

		dot("#my-p").html("hello, world!")

		expect(formatHTML(document.body.innerHTML)).toBe(`<textarea id=my-text>text</textarea><div id=my-div><span id=my-span>span</span><p id=my-p>hello, world!</p><a id=my-a>a</a></div><h1 id=my-h1>h1</h1>`);
	});	
});

// TODO: these may or may not be legitimate. 
// describe("Updating attributes on the target.", ()=>{
// 	test("Set class name on target.", ()=>{
// 		dot(document.body).div().id("my-div");
// 		dot("#my-div").class("d-class");
// 		expect(formatHTML(document.body.innerHTML)).toBe(`<div id=my-div class=d-class></div>`);
// 	});

// 	test("Set class name on target then add elements.", ()=>{
// 		dot(document.body).div().id("my-div");
// 		dot("#my-div").class("d-class").p("").class("p-class");
// 		expect(formatHTML(document.body.innerHTML)).toBe(`<div id=my-div class=d-class><p class=p-class></p></div>`);
// 	});

// 	test("Set class name on target that has children.", ()=>{
// 		dot(document.body).div(dot.p()).id("my-div");
// 		dot("#my-div").class("d-class");
// 		expect(formatHTML(document.body.innerHTML)).toBe(`<div id=my-div class=d-class><p></p></div>`);
// 	});
// });

describe("Nuanced rendering.", ()=>{
	test("Appending content.", () => {
		dot(document.body).p("123").id("my-p");
		dot("#my-p").html("abc")
		expect(formatHTML(document.body.innerHTML)).toBe(`<p id=my-p>123abc</p>`);
	});	

	test("Mixed content sequential.", () => {
		dot(document.body).div("a").id("my-div");
		dot("#my-div").html("b")
		dot("#my-div").p("c")
		dot("#my-div").html("<span>d</span>")
		dot("#my-div").text("<p>e</p>")

		expect(formatHTML(document.body.innerHTML)).toBe(`<div id=my-div>ab<p>c</p><span>d</span>&lt;p&gt;e&lt;/p&gt;</div>`);
	});	

	test("Null content.", () => {
		dot(document.body).div(null as any);

		expect(formatHTML(document.body.innerHTML)).toBe(`<div></div>`);
	});	

	test("Null text element.", () => {
		dot(document.body).div(dot.text(null as any));

		expect(formatHTML(document.body.innerHTML)).toBe(`<div></div>`);
	});	

	test("Null html.", () => {
		dot(document.body).div(dot.html(null as any));

		expect(formatHTML(document.body.innerHTML)).toBe(`<div></div>`);
	});	

	test("Null attribute.", () => {
		dot(document.body).div().class(null);

		expect(formatHTML(document.body.innerHTML)).toBe(`<div></div>`);
	});	
});

describe("To string.", ()=>{
	// If to string can be shown to work, we can use it for all further tetst rather than using inline HTML.

	test("Simple render to string.", () => {
		let html = dot.p("123").id("my-p").toString();
		expect(formatHTML(html)).toBe(`<p id=my-p>123</p>`);
	});	

	test("Render text node to string.", () => {
		let html = dot.p(dot.text("<span>123</span>")).id("my-p").toString();
		expect(formatHTML(html)).toBe(`<p id=my-p>&lt;span&gt;123&lt;/span&gt;</p>`);
	});	

	test("Render html node to string.", () => {
		let html = dot.p(dot.html("<span>123</span>")).id("my-p").toString();
		expect(formatHTML(html)).toBe(`<p id=my-p><span>123</span></p>`);
	});	

	test("Render html node to string.", () => {
		let html = dot.p(dot.span(123)).id("my-p").toString();
		expect(formatHTML(html)).toBe(`<p id=my-p><span>123</span></p>`);
	});	

	test("Complex markup to string.", () => {
		let html = dot
		.textArea("text").id("my-text")
		.div(
			dot.span("span").id("my-span")
			.p("hello, world!").id("my-p")
			.a("a").id("my-a")
		).id("my-div")
		.h1("h1").id("my-h1");

		expect(formatHTML(html.toString())).toBe(`<textarea id=my-text>text</textarea><div id=my-div><span id=my-span>span</span><p id=my-p>hello, world!</p><a id=my-a>a</a></div><h1 id=my-h1>h1</h1>`);
	});
});

describe("Under the hood.", ()=>{
	test("Appending existing element extends VDOM.", () => {
		let original = dot(document.body).div().id("my-div") as unknown as ContainerVdom;
		dot("#my-div").div().div().div();
		expect((original._children[0] as ElementVdom).children._children.length).toBe(3);
	});
});