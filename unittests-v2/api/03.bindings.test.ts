
import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

// TODO: ensure that if an attribute is set twice, the previous one will unsubscibe from any reactives (or unrender).

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
		let binding = dot.watch("hello");
		dot(document.body).div(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("hello")));
	});

	test("Render observable string using a bound reactive.", ()=>{
		let binding = dot.watch("hello");
		dot(document.body).div(binding.bind());
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("hello")));
	});

	test("Render observable modified string.", ()=>{
		let binding = dot.watch("hello");
		dot(document.body).div(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("hello")));
		
		binding.value = "world";
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("world")));
	});

	test("Render observable modified HTML.", ()=>{
		let binding = dot.watch("<p></p>");
		dot(document.body).div(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("<p></p>")));
		
		binding.value = "<span></span>";
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("<span></span>")));
	});

	test("Multi render observable modified string.", ()=>{
		let binding = dot.watch("hello");
		dot(document.body).div(binding).div(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("hello").div("hello")));
		
		binding.value = "world";
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("world").div("world")));
	});

	test("Render observable delete value.", ()=>{
		let binding = dot.watch("hello");
		dot(document.body).div(binding);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("hello")));
		
		binding.value = null;
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div()));
	});

	test("Render observable transformed.", ()=>{
		let binding = dot.watch(3);
		dot(document.body).div(binding.bindAs({display: v=>v*2}));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(6)));

		binding.value = 5;
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(10)));
	});

	test("Render observable transformed in input display.", ()=>{
		let binding = dot.watch(3);
		dot(document.body).input({id: "my-input", value: binding.bindAs({display: v=>`${v*2}`}) });
		expect(formatHTML((document.getElementById("my-input") as HTMLInputElement).value)).toBe("6");

		binding.value = 5;
		expect(formatHTML((document.getElementById("my-input") as HTMLInputElement).value)).toBe("10");
	});

	test("Render observable transformed to a style.", ()=>{
		let binding = dot.watch(3);
		dot(document.body).div({id: "my-element", style: {
			transform: {
				translateX: binding.bindAs({display: v=>v*2})
			}
		}});
		expect(formatHTML(document.getElementById("my-element")?.style.transform)).toBe("translatex(6px)");

		binding.value = 5;
		expect(formatHTML(document.getElementById("my-element")?.style.transform)).toBe("translatex(10px)");
	});
});

describe("HTML data binding.", () => {
	test("Render empty observable html.", ()=>{
		let binding = dot.watch();
		dot(document.body).div(dot.html(binding));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div()));
	});

	test("Render observable string html.", ()=>{
		let binding = dot.watch("<p></p>");
		dot(document.body).div(dot.html(binding));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.p())));
	});

	test("Render observable modified string html.", ()=>{
		let binding = dot.watch("<p></p>");
		dot(document.body).div(dot.html(binding));
		// expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.p())));
		
		binding.value = "<span></span>";
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span())));
	});

	test("Render observable delete value html.", ()=>{
		let binding = dot.watch("<p></p>");
		dot(document.body).div(dot.html(binding));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.p())));
		
		binding.value = null;
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div()));
	});
});


describe("Attribute data binding.", () => {
	test("Render empty observable attribute.", ()=>{
		let binding = dot.watch(undefined as unknown as string);
		dot(document.body).div({class: binding});
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div()));
	});

	test("Render observable string attribute.", ()=>{
		let binding = dot.watch("hello");
		dot(document.body).div({class: binding});
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div({class: "hello"})));
	});

	test("Render observable modified string attribute.", ()=>{
		let binding = dot.watch("hello");
		dot(document.body).div({class: binding});
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div({class: "hello"})));
		
		binding.value = ("world");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div({class: "world"})));
	});

	test("Multi render observable modified string attribute.", ()=>{
		let binding = dot.watch("hello");
		dot(document.body).div(binding, {class: binding}).div(binding,{class: binding});
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("hello", {class: "hello"}).div("hello", {class: "hello"})));
		
		binding.value = ("world");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("world", {class: "world"}).div("world", {class: "world"})));
	});

	test("Render observable delete value attribute.", ()=>{
		let binding = dot.watch("hello");
		dot(document.body).div({class: binding});
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div({class: "hello"})));
		
		binding.value = (null);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div()));
	});
});

describe("Conditional w/ binding.", () => {
	test("When binding true.", () => {
		let binding = dot.watch(true);
		dot(document.body).when(binding, dot.p("yes")).otherwise(dot.p("no"));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("yes")));
	});
	test("When binding false.", () => {
		let binding = dot.watch(false);
		dot(document.body).when(binding, dot.p("yes")).otherwise(dot.p("no"));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("no")));
	});
	test("When binding but rendering a binding directly.", () => {
		let cond = dot.watch(true);
		let val = dot.watch("abc");
		dot(document.body).when(cond, val).otherwise(cond);
		expect(formatHTML(document.body.innerHTML)).toBe("abc");

		val.value = ("123");
		expect(formatHTML(document.body.innerHTML)).toBe("123");

		cond.value = (false);
		expect(formatHTML(document.body.innerHTML)).toBe("false");

		val.value = ("xyz");
		expect(formatHTML(document.body.innerHTML)).toBe("false");

		cond.value = (true);
		expect(formatHTML(document.body.innerHTML)).toBe("xyz");
	});
	test("When binding changes.", () => {
		let binding = dot.watch(true);
		dot(document.body).when(binding, dot.p("yes")).otherwise(dot.p("no"));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("yes")));

		binding.value = (false);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("no")));
	});
	test("When othewise when binding changes.", () => {
		let binding = dot.watch(1);
		let binding1 = dot.watch(true);
		let binding2 = dot.watch(false);
		let binding3 = dot.watch(false);

		binding.subscribe(v=>{
			binding1.value = (v == 1);
			binding2.value = (v == 2);
			binding3.value = (v == 3);
		});

		dot(document.body)
			.when(			binding1, 	dot.p("a")	)
			.otherwiseWhen( binding2, 	dot.p("b")	)
			.otherwiseWhen( binding3, 	dot.p("c")	)
			.otherwise(					dot.p("d")	);

		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("a")));

		binding.value = (2);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("b")));

		binding.value = (3);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("c")));

		binding.value = (4);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("d")));

		binding.value = (1);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("a")));
	});

	test("Nested in conditionals.", () => {
		let cBinding = dot.watch(true);
		let xValue = dot.watch("abc");
		dot(document.body).when(cBinding, dot.p(xValue)).otherwise(dot.span(xValue));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("abc")));

		xValue.value = ("123");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("123")));
		
		cBinding.value = (false);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.span("123")));

		xValue.value = ("abc");
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.span("abc")));

		cBinding.value = (true);
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("abc")));
	});

	test("Nested attributes in conditionals.", () => {
		let cBinding = dot.watch(true);
		let xValue = dot.watch("abc");
		
		dot(document.body)
			.when(cBinding, 
				dot.p({class: xValue})
			)
			.otherwise(
				dot.span({class: xValue})
			);

		expect(formatHTML(document.body.innerHTML)).toBe("<p class=abc></p>");

		xValue.value = ("123");
		expect(formatHTML(document.body.innerHTML)).toBe("<p class=123></p>");
		
		cBinding.value = (false);
		expect(formatHTML(document.body.innerHTML)).toBe("<span class=123></span>");
		
		xValue.value = ("abc");
		expect(formatHTML(document.body.innerHTML)).toBe("<span class=abc></span>");
		
		cBinding.value = (true);
		expect(formatHTML(document.body.innerHTML)).toBe("<p class=abc></p>");
	});

	test("Nested in html.", () => {
		let cBinding = dot.watch(true);
		let xValue = dot.watch("abc");
		dot(document.body).when(cBinding, dot.html(xValue).div(true)).otherwise(dot.html(xValue).div(false));
		expect(formatHTML(document.body.innerHTML)).toBe("abc<div>true</div>");

		xValue.value = ("123");
		expect(formatHTML(document.body.innerHTML)).toBe("123<div>true</div>");
		
		cBinding.value = (false);
		expect(formatHTML(document.body.innerHTML)).toBe("123<div>false</div>");

		xValue.value = ("abc");
		expect(formatHTML(document.body.innerHTML)).toBe("abc<div>false</div>");

		cBinding.value = (true);
		expect(formatHTML(document.body.innerHTML)).toBe("abc<div>true</div>");
	});

	// This is a special test. It should behave the same as the one above, but it doesn't.
	// There was a very nuanced issue when rendering raw HTML beside text nodes. This test protects against that.
	test("Nested in html - special (text).", () => {
		let cBinding = dot.watch(true);
		let xValue = dot.watch("abc");
		dot(document.body).when(cBinding, dot.html(xValue).text(true)).otherwise(dot.html(xValue).text(false));
		expect(formatHTML(document.body.innerHTML)).toBe("abctrue");

		xValue.value = ("123");
		expect(formatHTML(document.body.innerHTML)).toBe("123true");
		
		cBinding.value = (false);
		expect(formatHTML(document.body.innerHTML)).toBe("123false");

		xValue.value = ("abc");
		expect(formatHTML(document.body.innerHTML)).toBe("abcfalse");

		cBinding.value = (true);
		expect(formatHTML(document.body.innerHTML)).toBe("abctrue");
	});

	test("Nested in text.", () => {
		let cBinding = dot.watch(true);
		let xValue = dot.watch("abc");
		dot(document.body).when(cBinding, dot.text(xValue).text("-").text(cBinding)).otherwise(dot.text(xValue).text("-").text(cBinding));
		expect(formatHTML(document.body.innerHTML)).toBe("abc-true");

		xValue.value = ("123");
		expect(formatHTML(document.body.innerHTML)).toBe("123-true");
		
		cBinding.value = (false);
		expect(formatHTML(document.body.innerHTML)).toBe("123-false");

		xValue.value = ("abc");
		expect(formatHTML(document.body.innerHTML)).toBe("abc-false");

		cBinding.value = (true);
		expect(formatHTML(document.body.innerHTML)).toBe("abc-true");
	});

	test("Conditional order preserved.", () => {
		let binding1 = dot.watch(true);
		let binding2 = dot.watch(true);
		dot(document.body).text("0").when(binding1, "1").otherwise("x").when(binding2, "2").otherwise("y").text("3");
		// expect(formatHTML(document.body.innerHTML)).toBe("0123");
		
		binding1.value = (false);
		expect(formatHTML(document.body.innerHTML)).toBe("0x23");

		binding1.value = (true);
		expect(formatHTML(document.body.innerHTML)).toBe("0123");

		binding1.value = (false);
		binding2.value = (false);
		expect(formatHTML(document.body.innerHTML)).toBe("0xy3");

		binding2.value = (true);
		binding1.value = (true);
		expect(formatHTML(document.body.innerHTML)).toBe("0123");

	});

	test("Conditional order preserved w/o placeholders.", () => {
		let binding1 = dot.watch(true);
		let binding2 = dot.watch(true);
		dot(document.body).text("0").when(binding1, "1").when(binding2, "2").text("3");
		expect(formatHTML(document.body.innerHTML)).toBe("0123");
		
		binding1.value = (false);
		expect(formatHTML(document.body.innerHTML)).toBe("023");

		binding1.value = (true);
		expect(formatHTML(document.body.innerHTML)).toBe("0123");

		binding1.value = (false);
		binding2.value = (false);
		expect(formatHTML(document.body.innerHTML)).toBe("03");

		binding2.value = (true);
		binding1.value = (true);
		expect(formatHTML(document.body.innerHTML)).toBe("0123");

	});

	test("Nested conditionals.", () => {
		let binding1 = dot.watch(true);
		let binding2 = dot.watch(true);
		dot(document.body).when(binding1, dot.when(binding2, 0).otherwise(1)).otherwise(dot.when(binding2, 2).otherwise(3));
		expect(formatHTML(document.body.innerHTML)).toBe("0");
		
		binding2.value = (false);
		expect(formatHTML(document.body.innerHTML)).toBe("1");

		binding1.value = (false);
		expect(formatHTML(document.body.innerHTML)).toBe("3");

		binding2.value = (true);
		expect(formatHTML(document.body.innerHTML)).toBe("2");

		binding1.value = (true);
		expect(formatHTML(document.body.innerHTML)).toBe("0");

	});
});

describe("Iteration w/ binding.", () => {
	// Bonud arrays.
	// test.only("Basic array.", ()=>{
	// 	let array = ["a", "b", "c"];
	// 	dot(document.body).each(array, x=>dot.div(x))
	// 	expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("a").div("b").div("c")));
	// });

	test("Basic bound array.", ()=>{
		let obs = dot.watch(["a", "b", "c"]);
		dot(document.body).each(obs, x=>{
			// console.log(x);
			return dot.div(x)
		})
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("a").div("b").div("c")));
	});

	test("Manipulating the array.", ()=>{
		let array = ["a", "b", "c"];
		let obs = dot.watch(array);
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
		let array = [{value:"a"}, {value:"b"}, {value:"c"}];
		let obs = dot.watch(array, "value");
		dot(document.body).each(obs, (x, i, k)=>dot.div(dot.text(x.value).text("-").text(i)))
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("a-0").div("b-1").div("c-2")));
		
		array.push({value:"d"});
		obs.updateObservers();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("a-0").div("b-1").div("c-2").div("d-3")));

		array.splice(1,1);
		obs.updateObservers();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("a-0").div("c-1").div("d-2")));
	});

	// Bound objects.
	
	test("Binding an object and manipulating it.", ()=>{
		let object = {"a":"x", "b":"y", "c":"z"} as Record<string, string>;
		let obs = dot.watch(object);
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
		let array: Array<{id: number, isTrue: boolean}> = [{id: 1, isTrue: false}, {id: 2, isTrue: false}, {id: 3, isTrue: false}];
		let obs = dot.watch(array, "id");
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
		let array: Array<{id: number, amount: number}> = [{id: 1, amount: 1}, {id: 2, amount: 2}, {id: 3, amount: 3}];
		let obs = dot.watch(array, "id");
		dot(document.body).div(obs.bindAs({display: v=>v.reduce((a,c)=>a+c.amount, 0)}))
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("6")));
		
		array[1] = {id: 2, amount: 10};
		obs.updateObservers();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("14")));
	});

	// Bindings nested in the rendered array.
});

// This may be a stupid feature. Let's leave it out for now.
// describe.only("Chainable bindings.", ()=>{
// 	test("Basic chain.", ()=>{
// 		let obsMaster = dot.watch("a");
// 		let obsSlave = dot.watch(obsMaster);
// 		dot(document.body).text(obsMaster).text(obsSlave);
// 		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("aa"));
// 		// This particular test may not be needed.
// 		// It's already forbidden by the type system.
// 		// I'm also not certain what the approriate defined outcome should be (should it change or throw?).
// 		// obsSlave.value = ("b");
// 		// expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("aa"));
// 		obsMaster.value = ("c");
// 		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML("cc"));
// 	});
// });

describe("Special attributes.", ()=>{
	test("Class attribute as a JSON object.", () => {
		let binding = dot.watch(false);
		dot(document.body).div({ class: { "my-class": true, "your-class": binding } });
		expect(formatHTML(document.body.innerHTML)).toBe(`<div class=my-class></div>`);
		binding.value = (true);
		expect(formatHTML(document.body.innerHTML)).toBe(`<div class=my-class your-class></div>`);
	});

	test("Class attribute as an array.", () => {
		let data = ["class-a", "class-b", "class-c"];
		let bindings = dot.watch(data);

		dot(document.body).div({ class: bindings });
		expect(formatHTML(document.body.innerHTML)).toBe(`<div class=class-a class-b class-c></div>`);

		data.splice(1, 1);
		bindings.updateObservers();
		expect(formatHTML(document.body.innerHTML)).toBe(`<div class=class-a class-c></div>`);
	});

	// TODO: should we allow arrays of bindings?

	// TODO: All this should work with rerendering.
});