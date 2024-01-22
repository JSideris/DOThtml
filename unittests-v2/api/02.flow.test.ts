import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Basic conditional.", () => {

	describe("Basic tests.", () => {

		test("When true.", () => {
			dot(document.body).when(true, dot.p("yes"));
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("yes").toString()));
		});	
		
		test("When false.", () => {
			dot(document.body).when(false, dot.p("yes"));
			expect(formatHTML(document.body.innerHTML)).toBe(``);
		});

		test("When true otherwise false.", () => {
			dot(document.body)
				.when(true, dot.p("yes"))
				.otherwise(dot.p("no"))
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("yes").toString()));
		});	
		
		test("When false otherwise true.", () => {
			dot(document.body)
				.when(false, dot.p("yes"))
				.otherwise(dot.p("no"))
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("no").toString()));
		});

		test("When true otherwise when false otherwise false.", () => {
			dot(document.body)
				.when(true, dot.p("yes"))
				.otherwiseWhen(false, dot.p("maybe"))
				.otherwise(dot.p("no"))
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("yes").toString()));
		});	
		
		test("When true otherwise when true otherwise false.", () => {
			dot(document.body)
				.when(true, dot.p("yes"))
				.otherwiseWhen(true, dot.p("maybe"))
				.otherwise(dot.p("no"))
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("yes").toString()));
		});

		test("When false otherwise when true otherwise false.", () => {
			dot(document.body)
				.when(false, dot.p("yes"))
				.otherwiseWhen(true, dot.p("maybe"))
				.otherwise(dot.p("no"))
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("maybe").toString()));
		});

		test("When false otherwise when false otherwise true.", () => {
			dot(document.body)
				.when(false, dot.p("yes"))
				.otherwiseWhen(false, dot.p("maybe"))
				.otherwise(dot.p("no"))
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("no").toString()));
		});
	});

	describe("Inline.", () => {
		test("When true otherwise when false otherwise false inline.", () => {
			dot(document.body)
				.span().id("1")
				.when(true, dot.p("yes").id("2"))
				.otherwiseWhen(false, dot.p("maybe").id("2"))
				.otherwise(dot.p("no").id("2"))
				.span().id("3");
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.span().id("1").p("yes").id("2").span().id("3").toString()));
		});	
		
		test("When true otherwise when true otherwise false inline.", () => {
			dot(document.body)
				.span().id("1")
				.when(true, dot.p("yes").id("2"))
				.otherwiseWhen(true, dot.p("maybe").id("2"))
				.otherwise(dot.p("no").id("2"))
				.span().id("3");
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.span().id("1").p("yes").id("2").span().id("3").toString()));
		});
	
		test("When false otherwise when true otherwise false inline.", () => {
			dot(document.body)
				.span().id("1")
				.when(false, dot.p("yes").id("2"))
				.otherwiseWhen(true, dot.p("maybe").id("2"))
				.otherwise(dot.p("no").id("2"))
				.span().id("3");
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.span().id("1").p("maybe").id("2").span().id("3").toString()));
		});
	
		test("When false otherwise when false otherwise true inline.", () => {
			dot(document.body)
				.span().id("1")
				.when(false, dot.p("yes").id("2"))
				.otherwiseWhen(false, dot.p("maybe").id("2"))
				.otherwise(dot.p("no").id("2"))
				.span().id("3");
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.span().id("1").p("no").id("2").span().id("3").toString()));
		});
	});

	describe("Nested.", () => {
		test("When true otherwise when false otherwise false nested.", () => {
			dot(document.body)
				.div(
					dot.when(true, dot.p("yes").id("2"))
					.otherwiseWhen(false, dot.p("maybe").id("2"))
					.otherwise(dot.p("no").id("2"))
					.span().id("3")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.p("yes").id("2").span().id("3")).id("0").toString()));
		});	
		
		test("When true otherwise when true otherwise false nested.", () => {
			dot(document.body)
				.div(
					dot.when(true, dot.p("yes").id("2"))
					.otherwiseWhen(true, dot.p("maybe").id("2"))
					.otherwise(dot.p("no").id("2"))
					.span().id("3")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.p("yes").id("2").span().id("3")).id("0").toString()));
		});
	
		test("When false otherwise when true otherwise false nested.", () => {
			dot(document.body)
				.div(
					dot.when(false, dot.p("yes").id("2"))
					.otherwiseWhen(true, dot.p("maybe").id("2"))
					.otherwise(dot.p("no").id("2"))
					.span().id("3")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.p("maybe").id("2").span().id("3")).id("0").toString()));
		});
	
		test("When false otherwise when false otherwise true nested.", () => {
			dot(document.body)
				.div(
					dot.when(false, dot.p("yes").id("2"))
					.otherwiseWhen(false, dot.p("maybe").id("2"))
					.otherwise(dot.p("no").id("2"))
					.span().id("3")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.p("no").id("2").span().id("3")).id("0").toString()));
		});
	});

	describe("Nested inline.", () => {
		test("When true otherwise when false otherwise false nested inline.", () => {
			dot(document.body)
				.div(
					dot.span().id("1")
					.when(true, dot.p("yes").id("2"))
					.otherwiseWhen(false, dot.p("maybe").id("2"))
					.otherwise(dot.p("no").id("2"))
					.span().id("3")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span().id("1").p("yes").id("2").span().id("3")).id("0").toString()));
		});	
		
		test("When true otherwise when true otherwise false nested inline.", () => {
			dot(document.body)
				.div(
					dot.span().id("1")
					.when(true, dot.p("yes").id("2"))
					.otherwiseWhen(true, dot.p("maybe").id("2"))
					.otherwise(dot.p("no").id("2"))
					.span().id("3")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span().id("1").p("yes").id("2").span().id("3")).id("0").toString()));
		});
	
		test("When false otherwise when true otherwise false nested inline.", () => {
			dot(document.body)
				.div(
					dot.span().id("1")
					.when(false, dot.p("yes").id("2"))
					.otherwiseWhen(true, dot.p("maybe").id("2"))
					.otherwise(dot.p("no").id("2"))
					.span().id("3")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span().id("1").p("maybe").id("2").span().id("3")).id("0").toString()));
		});
	
		test("When false otherwise when false otherwise true nested inline.", () => {
			dot(document.body)
				.div(
					dot.span().id("1")
					.when(false, dot.p("yes").id("2"))
					.otherwiseWhen(false, dot.p("maybe").id("2"))
					.otherwise(dot.p("no").id("2"))
					.span().id("3")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span().id("1").p("no").id("2").span().id("3")).id("0").toString()));
		});
	});

	describe("More complex conditional.", () => {
		test("Two otherwise whens not hit.", () => {
			dot(document.body)
				.div(
					dot.span().id("1")
					.when(true, dot.p("yes").id("2"))
					.otherwiseWhen(true, dot.p("maybe 1").id("2"))
					.otherwiseWhen(true, dot.p("maybe 2").id("2"))
					.otherwise(dot.p("no").id("2"))
					.span().id("3")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span().id("1").p("yes").id("2").span().id("3")).id("0").toString()));
		});	

		test("Two otherwise whens first hit.", () => {
			dot(document.body)
				.div(
					dot.span().id("1")
					.when(false, dot.p("yes").id("2"))
					.otherwiseWhen(true, dot.p("maybe 1").id("2"))
					.otherwiseWhen(true, dot.p("maybe 2").id("2"))
					.otherwise(dot.p("no").id("2"))
					.span().id("3")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span().id("1").p("maybe 1").id("2").span().id("3")).id("0").toString()));
		});	

		test("Two otherwise whens second hit.", () => {
			dot(document.body)
				.div(
					dot.span().id("1")
					.when(false, dot.p("yes").id("2"))
					.otherwiseWhen(false, dot.p("maybe 1").id("2"))
					.otherwiseWhen(true, dot.p("maybe 2").id("2"))
					.otherwise(dot.p("no").id("2"))
					.span().id("3")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span().id("1").p("maybe 2").id("2").span().id("3")).id("0").toString()));
		});	

		test("Two whens both true.", () => {
			dot(document.body)
				.div(
					dot.span().id("1")
					.when(true, dot.p("yes 1").id("2"))
					.otherwise(dot.p("no 1").id("2"))
					.when(true, dot.p("yes 2").id("3"))
					.otherwise(dot.p("no 2").id("3"))
					.span().id("4")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span().id("1").p("yes 1").id("2").p("yes 2").id("3").span().id("4")).id("0").toString()));
		});	

		test("Two whens both false.", () => {
			dot(document.body)
				.div(
					dot.span().id("1")
					.when(false, dot.p("yes 1").id("2"))
					.otherwise(dot.p("no 1").id("2"))
					.when(false, dot.p("yes 2").id("3"))
					.otherwise(dot.p("no 2").id("3"))
					.span().id("4")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span().id("1").p("no 1").id("2").p("no 2").id("3").span().id("4")).id("0").toString()));
		});	

		test("Two whens first true.", () => {
			dot(document.body)
				.div(
					dot.span().id("1")
					.when(true, dot.p("yes 1").id("2"))
					.otherwise(dot.p("no 1").id("2"))
					.when(false, dot.p("yes 2").id("3"))
					.otherwise(dot.p("no 2").id("3"))
					.span().id("4")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span().id("1").p("yes 1").id("2").p("no 2").id("3").span().id("4")).id("0").toString()));
		});	

		test("Two whens second true.", () => {
			dot(document.body)
				.div(
					dot.span().id("1")
					.when(false, dot.p("yes 1").id("2"))
					.otherwise(dot.p("no 1").id("2"))
					.when(true, dot.p("yes 2").id("3"))
					.otherwise(dot.p("no 2").id("3"))
					.span().id("4")
				).id("0")
			expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span().id("1").p("no 1").id("2").p("yes 2").id("3").span().id("4")).id("0").toString()));
		});	
	});
});

describe("Basic iteration.", () => {
	test("Iterate over nothing.", () => {
		dot(document.body).each([], ()=>dot.p("yes"));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(""));
	});

	test("Iterate over misc array.", () => {
		dot(document.body).each(["a", "b", "c"], (x,i,k)=>dot.p(`${x}, ${i}`));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("a, 0").p("b, 1").p("c, 2").toString()));
	});

	test("Iterate inline.", () => {
		dot(document.body).div().each(["a", "b", "c"], (x,i,k)=>dot.p(`${x}, ${i}`)).div();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div().p("a, 0").p("b, 1").p("c, 2").div().toString()));
	});

	test("Iterate inline with attributes.", () => {
		dot(document.body).div().each(["a", "b", "c"], (x,i,k)=>dot.p(`${i}`).class(x)).div();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div().p("0").class("a").p("1").class("b").p("2").class("c").div().toString()));
	});

	test("Iterate over misc array nested.", () => {
		dot(document.body).div(dot.each(["a", "b", "c"], (x,i,k)=>dot.p(`${i}`).class(x)));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.p("0").class("a").p("1").class("b").p("2").class("c")).toString()));
	});

	test("Iterate over object.", () => {
		dot(document.body).each({a: 1, b: 2, c: 3}, (x,i,k)=>dot.p(`${x}, ${i}, ${k}`));
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.p("1, 0, a").p("2, 1, b").p("3, 2, c").toString()));
	});

	test("Target and iterate.", () => {
		dot(document.body).div().id("my-div");
		dot("#my-div").each(["a", "b", "c"], (x,i,k)=>dot.p(`${i}`).class(x))
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.p("0").class("a").p("1").class("b").p("2").class("c")).id("my-div").toString()));
	});
});
