
import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Text data binding.", () => {
	test("Render empty observable.", ()=>{
		let binding = dot.watch();
		dot(document.body).div(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div()));
	});

	test("Render observable string.", ()=>{
		let binding = dot.watch({value: "hello"});
		dot(document.body).div(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("hello")));
	});

	test("Render observable modified string.", ()=>{
		let binding = dot.watch({value: "hello" as string});
		dot(document.body).div(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("hello")));
		
		binding.setValue("world");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("world")));
	});

	test("Render observable modified HTML.", ()=>{
		let binding = dot.watch({value: "<p></p>" as string});
		dot(document.body).div(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("<p></p>")));
		
		binding.setValue("<span></span>");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("<span></span>")));
	});

	test("Multi render observable modified string.", ()=>{
		let binding = dot.watch({value: "hello" as string});
		dot(document.body).div(binding).div(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("hello").div("hello")));
		
		binding.setValue("world");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("world").div("world")));
	});

	test("Render observable delete value.", ()=>{
		let binding = dot.watch({value: "hello" as any});
		dot(document.body).div(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("hello")));
		
		binding.setValue(null);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div()));
	});

	test("Render observable transformed.", ()=>{
		let binding = dot.watch({value: 3 as number, transformer: (value)=>value*2});
		dot(document.body).div(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(6)));

		binding.setValue(5);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(10)));
	});
});

describe("HTML data binding.", () => {
	test("Render empty observable html.", ()=>{
		let binding = dot.watch();
		dot(document.body).div(dot.html(binding));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div()));
	});

	test("Render observable string html.", ()=>{
		let binding = dot.watch({value: "<p></p>"});
		dot(document.body).div(dot.html(binding));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.p())));
	});

	test("Render observable modified string html.", ()=>{
		let binding = dot.watch({value: "<p></p>" as string});
		dot(document.body).div(dot.html(binding));
		// expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.p())));
		
		binding.setValue("<span></span>");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span())));
	});

	test("Render observable delete value html.", ()=>{
		let binding = dot.watch({value: "<p></p>" as any});
		dot(document.body).div(dot.html(binding));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.p())));
		
		binding.setValue(null);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div()));
	});
});


describe("Attribute data binding.", () => {
	test("Render empty observable attribute.", ()=>{
		let binding = dot.watch();
		dot(document.body).div().class(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div()));
	});

	test("Render observable string attribute.", ()=>{
		let binding = dot.watch({value: "hello"});
		dot(document.body).div().class(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div().class("hello")));
	});

	test("Render observable modified string attribute.", ()=>{
		let binding = dot.watch({value: "hello" as string});
		dot(document.body).div().class(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div().class("hello")));
		
		binding.setValue("world");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div().class("world")));
	});

	test("Multi render observable modified string attribute.", ()=>{
		let binding = dot.watch({value: "hello" as string});
		dot(document.body).div(binding).class(binding).div(binding).class(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("hello").class("hello").div("hello").class("hello")));
		
		binding.setValue("world");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("world").class("world").div("world").class("world")));
	});

	test("Render observable delete value attribute.", ()=>{
		let binding = dot.watch({value: "hello" as any});
		dot(document.body).div().class(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div().class("hello")));
		
		binding.setValue(null);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div()));
	});
});

describe("Conditional w/ binding.", () => {
	test("When binding true.", () => {
		let binding = dot.watch({value: true});
		dot(document.body).when(binding, dot.p("yes")).otherwise(dot.p("no"));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("yes")));
	});
	test("When binding false.", () => {
		let binding = dot.watch({value: false});
		dot(document.body).when(binding, dot.p("yes")).otherwise(dot.p("no"));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("no")));
	});
	test("When binding but rendering a binding directly.", () => {
		let cond = dot.watch({value: true});
		let val = dot.watch({value: "abc"});
		dot(document.body).when(cond, val).otherwise(cond);
		expect(formatHTML(document.body.innerHTML)).toBe("abc");

		val.setValue("123");
		expect(formatHTML(document.body.innerHTML)).toBe("123");

		cond.setValue(false);
		expect(formatHTML(document.body.innerHTML)).toBe("false");

		val.setValue("xyz");
		expect(formatHTML(document.body.innerHTML)).toBe("false");

		cond.setValue(true);
		expect(formatHTML(document.body.innerHTML)).toBe("xyz");
	});
	test("When binding changes.", () => {
		let binding = dot.watch({value: true});
		dot(document.body).when(binding, dot.p("yes")).otherwise(dot.p("no"));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("yes")));

		binding.setValue(false);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("no")));
	});
	test("When othewise when binding changes.", () => {
		let binding = dot.watch({value: 1});
		let binding1 = dot.watch({value: true});
		let binding2 = dot.watch({value: false});
		let binding3 = dot.watch({value: false});

		binding.subscribeCallback(v=>{
			binding1.setValue(v == 1);
			binding2.setValue(v == 2);
			binding3.setValue(v == 3);
		});

		dot(document.body)
			.when(			binding1, 	dot.p("a")	)
			.otherwiseWhen( binding2, 	dot.p("b")	)
			.otherwiseWhen( binding3, 	dot.p("c")	)
			.otherwise(					dot.p("d")	);

		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("a")));

		binding.setValue(2);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("b")));

		binding.setValue(3);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("c")));

		binding.setValue(4);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("d")));

		binding.setValue(1);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("a")));
	});

	test("Nested in conditionals.", () => {
		let cBinding = dot.watch({value: true});
		let xValue = dot.watch({value: "abc"});
		dot(document.body).when(cBinding, dot.p(xValue)).otherwise(dot.span(xValue));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("abc")));

		xValue.setValue("123");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("123")));
		
		cBinding.setValue(false);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.span("123")));

		xValue.setValue("abc");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.span("abc")));

		cBinding.setValue(true);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("abc")));
	});

	test("Nested attributes in conditionals.", () => {
		let cBinding = dot.watch({value: true});
		let xValue = dot.watch({value: "abc"});
		
		dot(document.body).when(cBinding, dot.p().class(xValue)).otherwise(dot.span().class(xValue));
		expect(formatHTML(document.body.innerHTML)).toBe("<p class=abc></p>");

		xValue.setValue("123");
		expect(formatHTML(document.body.innerHTML)).toBe("<p class=123></p>");
		
		cBinding.setValue(false);
		expect(formatHTML(document.body.innerHTML)).toBe("<span class=123></span>");
		
		xValue.setValue("abc");
		expect(formatHTML(document.body.innerHTML)).toBe("<span class=abc></span>");
		
		cBinding.setValue(true);
		expect(formatHTML(document.body.innerHTML)).toBe("<p class=abc></p>");
	});

	test("Nested in html.", () => {
		let cBinding = dot.watch({value: true});
		let xValue = dot.watch({value: "abc"});
		dot(document.body).when(cBinding, dot.html(xValue).div(true)).otherwise(dot.html(xValue).div(false));
		expect(formatHTML(document.body.innerHTML)).toBe("abc<div>true</div>");

		xValue.setValue("123");
		expect(formatHTML(document.body.innerHTML)).toBe("123<div>true</div>");
		
		cBinding.setValue(false);
		expect(formatHTML(document.body.innerHTML)).toBe("123<div>false</div>");

		xValue.setValue("abc");
		expect(formatHTML(document.body.innerHTML)).toBe("abc<div>false</div>");

		cBinding.setValue(true);
		expect(formatHTML(document.body.innerHTML)).toBe("abc<div>true</div>");
	});

	// This is a special test. It should behave the same as the one above, but it doesn't.
	// There was a very nuanced issue when rendering raw HTML beside text nodes. This test protects against that.
	test("Nested in html - special (text).", () => {
		let cBinding = dot.watch({value: true});
		let xValue = dot.watch({value: "abc"});
		dot(document.body).when(cBinding, dot.html(xValue).text(true)).otherwise(dot.html(xValue).text(false));
		expect(formatHTML(document.body.innerHTML)).toBe("abctrue");

		xValue.setValue("123");
		expect(formatHTML(document.body.innerHTML)).toBe("123true");
		
		cBinding.setValue(false);
		expect(formatHTML(document.body.innerHTML)).toBe("123false");

		xValue.setValue("abc");
		expect(formatHTML(document.body.innerHTML)).toBe("abcfalse");

		cBinding.setValue(true);
		expect(formatHTML(document.body.innerHTML)).toBe("abctrue");
	});

	test("Nested in text.", () => {
		let cBinding = dot.watch({value: true});
		let xValue = dot.watch({value: "abc"});
		dot(document.body).when(cBinding, dot.text(xValue).text("-").text(cBinding)).otherwise(dot.text(xValue).text("-").text(cBinding));
		expect(formatHTML(document.body.innerHTML)).toBe("abc-true");

		xValue.setValue("123");
		expect(formatHTML(document.body.innerHTML)).toBe("123-true");
		
		cBinding.setValue(false);
		expect(formatHTML(document.body.innerHTML)).toBe("123-false");

		xValue.setValue("abc");
		expect(formatHTML(document.body.innerHTML)).toBe("abc-false");

		cBinding.setValue(true);
		expect(formatHTML(document.body.innerHTML)).toBe("abc-true");
	});

	test("Conditional order preserved.", () => {
		let binding1 = dot.watch({value: true});
		let binding2 = dot.watch({value: true});
		dot(document.body).text("0").when(binding1, "1").otherwise("x").when(binding2, "2").otherwise("y").text("3");
		// expect(formatHTML(document.body.innerHTML)).toBe("0123");
		
		binding1.setValue(false);
		expect(formatHTML(document.body.innerHTML)).toBe("0x23");

		binding1.setValue(true);
		expect(formatHTML(document.body.innerHTML)).toBe("0123");

		binding1.setValue(false);
		binding2.setValue(false);
		expect(formatHTML(document.body.innerHTML)).toBe("0xy3");

		binding2.setValue(true);
		binding1.setValue(true);
		expect(formatHTML(document.body.innerHTML)).toBe("0123");

	});

	test("Conditional order preserved w/o placeholders.", () => {
		let binding1 = dot.watch({value: true});
		let binding2 = dot.watch({value: true});
		dot(document.body).text("0").when(binding1, "1").when(binding2, "2").text("3");
		expect(formatHTML(document.body.innerHTML)).toBe("0123");
		
		binding1.setValue(false);
		expect(formatHTML(document.body.innerHTML)).toBe("023");

		binding1.setValue(true);
		expect(formatHTML(document.body.innerHTML)).toBe("0123");

		binding1.setValue(false);
		binding2.setValue(false);
		expect(formatHTML(document.body.innerHTML)).toBe("03");

		binding2.setValue(true);
		binding1.setValue(true);
		expect(formatHTML(document.body.innerHTML)).toBe("0123");

	});

	test("Nested conditionals.", () => {
		let binding1 = dot.watch({value: true});
		let binding2 = dot.watch({value: true});
		dot(document.body).when(binding1, dot.when(binding2, 0).otherwise(1)).otherwise(dot.when(binding2, 2).otherwise(3));
		expect(formatHTML(document.body.innerHTML)).toBe("0");
		
		binding2.setValue(false);
		expect(formatHTML(document.body.innerHTML)).toBe("1");

		binding1.setValue(false);
		expect(formatHTML(document.body.innerHTML)).toBe("3");

		binding2.setValue(true);
		expect(formatHTML(document.body.innerHTML)).toBe("2");

		binding1.setValue(true);
		expect(formatHTML(document.body.innerHTML)).toBe("0");

	});
});

describe("Iteration w/ binding.", () => {
	// Bonud arrays.
	test("Basic bound array.", ()=>{
		let obs = dot.watch({value: ["a", "b", "c"]});
		dot(document.body).each(obs, x=>dot.div(x))
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("a").div("b").div("c")));
	});

	test("Manipulating the array.", ()=>{
		let array = ["a", "b", "c"];
		let obs = dot.watch({value: array});
		dot(document.body).each(obs, x=>dot.div(x))
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("a").div("b").div("c")));
		
		array.push("d");
		obs.updateObservers();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("a").div("b").div("c").div("d")));

		array.splice(1,1);
		obs.updateObservers();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("a").div("c").div("d")));
	});

	// TODO: this test case should be failing.
	// We don't currently update the i observable. 
	// This indicates that the whole list is being rerendered each time.
	test("Preserving index.", ()=>{
		let array = [{value: "a"}, {value: "b"}, {value: "c"}];
		let obs = dot.watch({value: array, key: "value"});
		dot(document.body).each(obs, (x, i, k)=>dot.div(dot.text(x.value).text("-").text(i)))
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("a-0").div("b-1").div("c-2")));
		
		array.push({value: "d"});
		obs.updateObservers();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("a-0").div("b-1").div("c-2").div("d-3")));

		array.splice(1,1);
		obs.updateObservers();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("a-0").div("c-1").div("d-2")));
	});

	// Bound objects.
	
	test("Binding an object and manipulating it.", ()=>{
		let object = {"a":"x", "b":"y", "c":"z"} as Record<string, string>;
		let obs = dot.watch({value: object});
		dot(document.body).each(obs, (x, i, k)=>dot.div(dot.text(`${x}, `).text(i).text(`, ${k}`)))
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("x, 0, a").div("y, 1, b").div("z, 2, c")));
		
		object.d = "helloworld";
		obs.updateObservers();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("x, 0, a").div("y, 1, b").div("z, 2, c").div("helloworld, 3, d")));

		delete object.b;
		obs.updateObservers();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("x, 0, a").div("z, 1, c").div("helloworld, 2, d")));
	});

	// There's potential for a test case about objects of objects.

	// TODO: need a more sophisticated way to test with keys.

	test("Array of objects.", ()=>{
		let array = [{id: 1, isTrue: false}, {id: 2, isTrue: false}, {id: 3, isTrue: false}];
		let obs = dot.watch({value: array, key: "id"});
		dot(document.body).each(obs, (x, i, k)=>dot.div(x.id).div(k).div(x.isTrue))
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("1").div("1").div("false").div("2").div("2").div("false").div("3").div("3").div("false")));
		
		array[1] = {id: 2, isTrue: true};
		obs.updateObservers();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("1").div("1").div("false").div("2").div("2").div("true").div("3").div("3").div("false")));
		
		array.splice(1,1);
		obs.updateObservers();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("1").div("1").div("false").div("3").div("3").div("false")));
	});

	// Aggregation.

	test("Get total.", ()=>{
		let array = [{id: 1, amount: 1}, {id: 2, amount: 2}, {id: 3, amount: 3}];
		let obs = dot.watch({value: array, key: "id", transformer: v=>v.reduce((a,c)=>a+c.amount, 0)});
		dot(document.body).div(obs)
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("6")));
		
		array[1] = {id: 2, amount: 10};
		obs.updateObservers();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("14")));
	});

	// Bindings nested in the rendered array.
});