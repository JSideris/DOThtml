
import {jest} from '@jest/globals';
//var dot = require("../lib/dothtml.min");
//var dot = require("../src/index");
import dot from "../src/index";
// console.log(JSON.stringify(dot).substring(0, 100));
// console.log(dot);

var onlyRun = null;

if(onlyRun){
	dot("#remove-run-only").t("Running " + onlyRun + " tests. ").a("Click to clear.").href("?");
	$(".basic-test-row").remove();
}

function formatHTML(html){
	html = html.toLowerCase();
	var html2 = "";
	for(var i = 0; i < html.length; i++){
		var chr = html.charAt(i);
		var chrC = chr.charCodeAt(0);
		if(chrC >= 32 && chrC <= 126){
			html2 += chr;
		}
	}
	html = html2;
	html = html.split("=\"disabled\"").join("");
	html = html.split(" value=\"\"").join("");
	html = html.split(" type=submit").join("");
	html = html.split("\"").join("");
	return html;
}


function addTest(description, testFunc, expected, testTimeout){
	// if(description != "Set value in bound array.") return;
	// let exception = null;
	// try{
	// }
	// catch(e){
	// 	exception = e;
	// }
	test(description, done => {
		let testResult;
		testResult = testFunc();
		
		// Exceptions thrown will fail the test.
		// if(exception) throw exception;

		setTimeout(function(){
			let resultHtml = testResult.__document ? testResult.__document.innerHTML : "";

			let processedResult = formatHTML(resultHtml);
			let testExpected = "";
			try{
				if(expected instanceof Array){
					let i = 0;
					for(i = 0; i < expected.length; i++){
						let testExpected = formatHTML(expected[i]);
						if(testExpected == processedResult) break;
					}
					if(!i == expected.length) i = 0;
					expect(processedResult).toBe(formatHTML(expected[i]));
				}
				else{
					testExpected = formatHTML(expected);
					expect(processedResult).toBe(testExpected);
				}
			}
			catch(e){
				done(e);
				return;
			}

			done();

		}, testTimeout ?? 0);
	});
}
//Writing/Appending

//Basic functionality
{
	addTest("Dot object.", function(){ return dot; }, "");
	addTest("Calling dot as a function.", function(){ return dot(); }, "");
	//addTest("Targeting.", function(){ return dot("body"); }, "");
	addTest("Write text.", function(){ return dot.h(1); }, "1");
	addTest("Write 2 texts.", function(){ return dot.h(1).h(2); }, "12");
	addTest("Write HTML.", function(){ return dot.h("<div></div>"); }, "<div></div>");
	addTest("Escape HTML.", function(){ return dot.t("<div></div>"); }, "&lt;div&gt;&lt;/div&gt;");
	addTest("Div.", function(){ return dot.div(); }, "<div></div>");
	addTest("Number in a div.", function(){ return dot.div(1); }, "<div>1</div>");
	addTest("String in a div.", function(){ return dot.div("1"); }, "<div>1</div>");
	addTest("Boolean in a div.", function(){ return dot.div(true); }, "<div>true</div>");
	addTest("JSON object in a div.", function(){ return dot.div({}); }, "<div></div>");
	addTest("Function in a div.", function(){ return dot.div(function(){return dot.h(1)}) }, "<div>1</div>");
	addTest("HTML in a div.", function(){ return dot.div("<div></div>"); }, "<div><div></div></div>");
	addTest("Nested content.", function(){ return dot.div(dot.div(1)); }, "<div><div>1</div></div>");
	addTest("Side by side divs.", function(){ return dot.div().div(); }, "<div></div><div></div>");
	addTest("Side by side w/ content.", function(){ return dot.div(1).div(2); }, "<div>1</div><div>2</div>");
	addTest("Outside the box.", function(){ return dot.h(1).div(2).h(3); }, "1<div>2</div>3");
	addTest("Irregular nesting.", function(){
		return dot.h(1)
		.div(2)
		.h(3)
		.div(
			dot.h(4)
			.div(5)
			.h(6)
			.div(dot.div(7))
			.h(8)
		).h(9); }, "1<div>2</div>3<div>4<div>5</div>6<div><div>7</div></div>8</div>9");
	addTest("Class.", function(){ return dot.div()["class"](1); }, "<div class=\"1\"></div>");
	addTest("2nd class.", function(){ return dot.div().div()["class"](2).div(); }, "<div></div><div class=\"2\"></div><div></div>");
	addTest("Failing class.", function(){ return dot.h(1)["class"](2); }, "1");
	addTest("In class.", function(){ return dot.div(dot["class"](1)); }, "<div class=\"1\"></div>");
	addTest("Wrong class.", function(){ return dot.div(dot.h("2")["class"](1)); }, "<div>2</div>");
	addTest("Wrong class 2.", function(){ return dot.h(dot["class"](1).h(2)); }, "2");
	addTest("Classception.", function(){ return dot.div(dot.div(dot["class"](1))); }, "<div><div class=\"1\"></div></div>");
	addTest("Classception.", function(){ return dot.div(dot.h(dot["class"](1).h(2))); }, "<div>2</div>");
	addTest("Classception - parallel classy divs.", function(){ return dot.div([dot.div(dot["class"](1)), dot.div(dot["class"](2))]); }, "<div><div class=\"1\"></div><div class=\"2\"></div></div>");
	addTest("One class at a time.", function(){ return dot.div(dot["class"](1)); }, "<div class=\"1\"></div>");
	addTest("Skipped class.", function(){ return dot.div().h(1)["class"](2); }, "<div></div>1");
	addTest("Missed class.", function(){ return dot["class"](1); }, "");
	//addTest("Conflicting classes.", function(){ return dot.div(dot)["class"](1)["class"](2); }, "<div class=\"2\"></div>"); // DEPRECATED
	addTest("Conflicting classes.", function(){ return dot.div(dot)["class"](1)["class"](2); }, "<div class=\"1 2\"></div>");
	addTest("Void element.", function(){ return dot.img(); }, "<img>");
	addTest("Self-explaining attribute.", function(){ return dot.button().disabled(); }, "<button disabled=\"disabled\"></button>");
	addTest("Not a self-explaining attribute..", function(){ return dot.input().value(""); }, "<input value=\"\">");
	addTest("Passing dot to h.", function(){ return dot.h(dot.div()); }, "<div></div>");
	addTest("Passing function to h.", function(){ return dot.h(function(){return "<div></div>"}); }, "<div></div>");
	addTest("Two internal attributes.", function(){ return dot.div(dot["class"]("1").id("two-internal-attributes")); }, "<div class=\"1\" id=\"two-internal-attributes\"></div>");
	// Note that empty is required for the core tests to work, but I also want an explicit test for it here in case the core tests change.
	addTest("Empty an element.", function(){ return dot.h(function(){ var ret = dot.i().div(
		dot.span("123").span("abc")
	); var del = ret.getLast(); 
	ret = ret.b(); setTimeout(function(){dot(del).empty() }, 0); return ret; }) }, "<i></i><div></div><b></b>");
	addTest("Remove an element.", function(){ return dot.h(function(){ var ret = dot.i().div(
		dot.span("123").span("abc")
	); var del = ret.getLast(); 
	ret = ret.b(); setTimeout(function(){dot(del).remove() }, 0); return ret; }) }, "<i></i><b></b>");
}

//Array evalutation.
{
	addTest("Evaluate array.", function(){ return dot.div([1, 2, 3, 4]); }, "<div>1234</div>");
	addTest("Evaluate array of functions..", function(){ return dot.div([function(){return 1}, function(){return 2}]); }, "<div>12</div>");
	addTest("Evaluate array of dot.", function(){ return dot.div([dot.div(1), dot.div(2), dot.div(3), dot.div(4)]); }, "<div><div>1</div><div>2</div><div>3</div><div>4</div></div>");
	addTest("Evaluate array of dot into h.", function(){ return dot.h([dot.div(1), dot.div(2), dot.div(3), dot.div(4)]); }, "<div>1</div><div>2</div><div>3</div><div>4</div>");
}

//Ignore undefined (like functions that hane no return, etc).
{
	addTest("Undefined div.", function(){ return dot.div(undefined) }, "<div></div>");
	addTest("Undefined html.", function(){ return dot.h(undefined) }, ""); //On the fence about this.
	addTest("Undefined text.", function(){ return dot.t(undefined) }, "undefined"); //If the user really wants to print out undefined.
}

//Special tags.
{
	addTest("citeE.", function(){ return dot.citeE(); }, "<cite></cite>");
	addTest("dataE.", function(){ return dot.dataE(); }, "<data></data>"); //Element not supported by most browsers.
	addTest("formE.", function(){ return dot.formE(); }, "<form></form>");
	addTest("labelE.", function(){ return dot.labelE(); }, "<label></label>");
	addTest("spanE.", function(){ return dot.spanE(); }, "<span></span>");
	addTest("summaryE.", function(){ return dot.summaryE(); }, "<summary></summary>");
	addTest("citeA.", function(){ return dot.del().citeA(1); }, "<del cite=\"1\"></del>");
	addTest("dataA.", function(){ return dot.object().dataA(1); }, "<object data=\"1\"></object>");
	addTest("formA.", function(){ return dot.input().formA(1); }, "<input form=\"1\">");
	addTest("labelA.", function(){ return dot.track().labelA(1); }, ["<track label=\"1\">", "<track label=\"1\"></track>"]);
	addTest("spanA.", function(){ return dot.col().spanA(1); }, "<col span=\"1\">");
	addTest("summaryA.", function(){ return dot.table().summaryA(1); }, "<table summary=\"1\"></table>");
	addTest("Smart cite - attribute.", function(){ return dot.del().cite(1); }, "<del cite=\"1\"></del>");
	addTest("Smart form - attribute.", function(){ return dot.input().form(1); }, "<input form=\"1\">");
	addTest("Smart label - attribute.", function(){ return dot.track().label(1); }, ["<track label=\"1\">", "<track label=\"1\"></track>"]);
	addTest("Smart span - attribute.", function(){ return dot.col().span(1); }, "<col span=\"1\">");
	addTest("Smart summary - attribute.", function(){ return dot.table().summary(1); }, "<table summary=\"1\"></table>");
	addTest("Smart cite - element.", function(){ return dot.div().cite(); }, "<div></div><cite></cite>");
	addTest("Smart form - element.", function(){ return dot.div().form(); }, "<div></div><form></form>");
	addTest("Smart label - element.", function(){ return dot.div().label(); }, "<div></div><label></label>");
	addTest("Smart span - element.", function(){ return dot.div().span(); }, "<div></div><span></span>");
	addTest("Smart summary - element.", function(){ return dot.div().summary(); }, "<div></div><summary></summary>");
	addTest("Smart cite - append to blank.", function(){ return dot.citeE(); }, "<cite></cite>");
	addTest("Smart form - append to blank.", function(){ return dot.formE(); }, "<form></form>");
	addTest("Smart label - append to blank.", function(){ return dot.labelE(); }, "<label></label>");
	addTest("Smart span - append to blank.", function(){ return dot.spanE(); }, "<span></span>");
	addTest("Smart summary - append to blank.", function(){ return dot.summaryE(); }, "<summary></summary>");
	addTest("Smart data - basic attribute.", function(){ return dot.object().data(1); }, "<object data=\"1\"></object>");
	addTest("Smart data - custom attribute.", function(){ return dot.div().data("a", 1); }, "<div data-a=\"1\"></div>");
}

//If statements.
{
	addTest("Conditional true.", function(){ return dot.h(1).IF(true, dot.h("true")).h(2); }, "1true2");
	addTest("Conditional false.", function(){ return dot.h(1).IF(false, dot.h("false")).h(2); }, "12");
	addTest("Conditional true true.", function(){ return dot.h(1).IF(true, dot.h(2)).IF(true, dot.h(3)).h(4); }, "1234");
	addTest("Conditional class.", function(){ return dot.div(1).IF(true, dot["class"](2)); }, "<div class=\"2\">1</div>");
	//Not sure if the following two cases should be supported. They are broken as of 1.3.0, but I don't know if that matters.
	//addTest("Conditional deep class.", function(){ return dot.div(1).IF(true, dot.IF(true, dot["class"](2))); }, "<div class=\"2\">1</div>");
	//addTest("Conditional deep class with more confusion.", function(){ return dot.div(1).IF(true, dot.IF(true, dot["class"](2)).div(3)); }, "<div class=\"2\">1</div><div>3</div>");
}

//Logic.
{
	addTest("If true else.", function(){ return dot.IF(true, "if").ELSE("else"); }, "if");
	addTest("If false else.", function(){ return dot.IF(false, "if").ELSE("else"); }, "else");
	addTest("If false else else.", function(){ return dot.IF(false, "if").ELSE("else1").ELSE("else2"); }, "else1else2");
	addTest("If true elseif true else.", function(){ return dot.IF(true, "if").ELSEIF(true, "elseif").ELSE("else"); }, "if");
	addTest("If true elseif false else.", function(){ return dot.IF(true, "if").ELSEIF(false, "elseif").ELSE("else"); }, "if");
	addTest("If false elseif true else.", function(){ return dot.IF(false, "if").ELSEIF(true, "elseif").ELSE("else"); }, "elseif");
	addTest("If false elseif false else.", function(){ return dot.IF(false, "if").ELSEIF(false, "elseif").ELSE("else"); }, "else");
	addTest("Nested ifs.", function(){
	return dot.IF(true,
			dot.IF(false, "if if")
			.ELSEIF(true, "if elseif")
			.ELSE("if else")
		).ELSEIF(true, "elseif")
		.ELSE("else");
	}, "if elseif");
}

//Truthiness
{
	addTest("If null.", function(){ return dot.IF(null, "if").ELSE("else"); }, "else");
	addTest("If {}.", function(){ return dot.IF({}, "if").ELSE("else"); }, "if");
}

//Iterations
{
	addTest("Iterate.", function(){ return dot.iterate(3, function(i){return dot.h(i)}); }, "012");
	addTest("Iterate w/ friends.", function(){ return dot.h("s").iterate(3, function(i){return dot.h(i)}).h("f"); }, "s012f");
	addTest("Iterate no return.", function(){ return dot.h("s").iterate(3, function(i){dot.h(i)}).h("f"); }, "sf");
	addTest("Iterate raw dot.", function(){ return dot.h("s").iterate(3, dot.h("-")).h("f"); }, "s---f");
	addTest("Iterate raw dot HTML.", function(){ return dot.h("s").iterate(3, dot.div()).h("f"); }, "s<div></div><div></div><div></div>f");
	addTest("Iterate text.", function(){ return dot.h("s").iterate(3, "-").h("f"); }, "s---f");
	addTest("Nested iterate.", function(){
		return dot.h("s")
		.iterate(2, function(i){
			return dot.iterate(2, function(j){return j})
		}).h("f");
	}, "s0101f");
	addTest("Each.", function(){ return dot.each(["A", "B", "C"], function(x, i){return i + x}); }, "0A1B2C");
	addTest("Nested each.", function(){ return dot.each(["A", "B", "C"], function(x, i){return dot.h(i + x).each(["D", "E", "F"], function(y, j){return j + y})}); }, "0A0D1E2F1B0D1E2F2C0D1E2F");
	addTest("Hash each.", function(){ return dot.each({a: "A", b: "B", c: "C"}, function(x, i){return i + x}); }, "aAbBcC");
}

//Get Last Node
{
	//addTest("Get Last Node.", function(){ return dot.h(dot.div("text").__lastNode.innerHTML)}, "text"); // No longer supported.
	//addTest("Get Last Node - h.", function(){ return dot.h(dot.h("<div>text</div>").__lastNode.innerHTML)}, "text"); // No longer supported.
	addTest("Get Last Node - h.", function(){ return dot.h(dot.h("<div>text</div>").getLast().innerHTML);}, "text");
	addTest("Using getLast() function.", function(){ return dot.h(dot.div("text").getLast().innerHTML);}, "text");
}

{
	dot.resetScopeClass();
	
	//addTest("Get Last Node.", function(){ return dot.h(dot.div("text").__lastNode.innerHTML)}, "text"); // No longer supported.
	//addTest("Get Last Node - h.", function(){ return dot.h(dot.h("<div>text</div>").__lastNode.innerHTML)}, "text"); // No longer supported.
	addTest("Named scope.", function(){ return dot.div().class("before").scopeClass("MYSCOPE1", dot.div().class("test")).div().class("after"); }, "<div class=\"before\"></div><div class=\"dot-MYSCOPE1-test\"></div><div class=\"after\"></div>");
	addTest("No rollover scope.", function(){ return dot.div().class("test"); }, "<div class=\"test\"></div>");
	addTest("Named scope multiple elements.", function(){ return dot.div().scopeClass("MYSCOPE2", dot.div().class("test").div().div().class("test")); }, "<div></div><div class=\"dot-MYSCOPE2-test\"></div><div></div><div class=\"dot-MYSCOPE2-test\"></div>");
	//addTest("Unscope.", function(){ return dot.div().scopeClass("MYSCOPE2").div().class("test").div().div().class("test").unscopeClass().div().class("test"); }, "<div></div><div class=\"dot-MYSCOPE2-test\"></div><div></div><div class=\"dot-MYSCOPE2-test\"></div><div class=\"test\"></div>");
	//addTest("Extra unscope.", function(){ return dot.div().scopeClass("MYSCOPE2").div().class("test").div().div().class("test").unscopeClass().unscopeClass().div().class("test"); }, "<div></div><div class=\"dot-MYSCOPE2-test\"></div><div></div><div class=\"dot-MYSCOPE2-test\"></div><div class=\"test\"></div>");
	addTest("Nested element.", function(){ return dot.div().scopeClass("MYSCOPE", dot.div(dot.div().class("test-inner")).class("test-outer")); }, "<div></div><div class=\"dot-MYSCOPE-test-outer\"><div class=\"dot-MYSCOPE-test-inner\"></div></div>");
	addTest("Nested element new document.", function(){ return dot.scopeClass("MYSCOPE", dot.div(dot.div().class("test-inner")).class("test-outer")); }, "<div class=\"dot-MYSCOPE-test-outer\"><div class=\"dot-MYSCOPE-test-inner\"></div></div>");
	// I really don't care about this behavior. We can leave it as undefined, or accept the current behavior.
	//addTest("Scoped h.", function(){ return dot.scopeClass("MYSCOPE2", dot.h(dot.div().class("test"))); }, "<div class=\"dot-MYSCOPE2-test\"></div>");
	addTest("Nested scope.", function(){ return dot.scopeClass("MYSCOPE3", dot.div(dot.div().class("test-inner-before").scopeClass("MYSCOPE4", dot.div().class("test-inner"))).class("test-outer")); }, "<div class=\"dot-MYSCOPE3-test-outer\"><div class=\"dot-MYSCOPE3-test-inner-before\"></div><div class=\"dot-MYSCOPE4-test-inner\"></div></div>");
	addTest("Autoscope 1.", function(){ return dot.scopeClass(dot.div().class("test")); }, "<div class=\"dot-10000-test\"></div>");
	addTest("Autoscope 2.", function(){ return dot.scopeClass(dot.div().class("test")); }, "<div class=\"dot-10001-test\"></div>");
	addTest("Autoscope 2 with nest.", function(){ return dot.scopeClass(dot.div(dot.div().class("test2")).class("test")); }, "<div class=\"dot-10002-test\"><div class=\"dot-10002-test2\"></div></div>");
	
	addTest("Reset scope.", function(){ dot.resetScopeClass(); return dot.scopeClass(dot.div().class("test")); }, "<div class=\"dot-10000-test\"></div>");
}

//Wait
{

	addTest("Deferred.", function(){ return dot.div(dot.defer(function(v){v.h(1)}))}, "<div>1</div>");
	addTest("Long deferred.", function(){ return dot.div(dot.defer(function(v){setTimeout(function(){v.h(1);},0)})); }, "<div>1</div>", 25);

	addTest("Wait, timing early.", function(){ return dot.div(1).wait(50, dot.div(3)).div(2); }, "<div>1</div><dothtml-defer></dothtml-defer><div>2</div>", 25);
	addTest("Wait, for nothing.", function(){ return dot.div(1).wait(1, function(){}).div(2); }, "<div>1</div><div>2</div>", 25);
	addTest("Wait, for a string.", function(){ return dot.div(1).wait(1, "3").div(2); }, "<div>1</div>3<div>2</div>", 25);
	addTest("Wait, for a div.", function(){ return dot.div(1).wait(1, dot.div(3)).div(2); }, "<div>1</div><div>3</div><div>2</div>", 25);
	addTest("Wait, inside a div.", function(){ return dot.div(1).div(dot.wait(1, dot.div(3))).div(2); }, "<div>1</div><div><div>3</div></div><div>2</div>", 25);
	addTest("Wait, for class.", function(){ return dot.div(1).wait(1, dot["class"](3)).div(2); }, "<div class=\"3\">1</div><div>2</div>", 25);
	addTest("Wait, for class 2.", function(){ return dot.div(dot.div(1).wait(1, dot["class"](3)).div(2)); }, "<div><div class=\"3\">1</div><div>2</div></div>", 25);
	addTest("Wait, for class, internal.", function(){ return dot.div(dot.wait(1, dot["class"](3))).div(2); }, "<div class=\"3\"></div><div>2</div>", 25);
	addTest("Wait, for a function.", function(){ return dot.div(1).wait(1, function(){return dot.div(3)}).div(2); }, "<div>1</div><div>3</div><div>2</div>", 25);
	addTest("Wait, append to nothing.", function(){ return dot.wait(1, dot.div(3)); }, "<div>3</div>", 25);
	addTest("Wait, append to nothing, concat 2.", function(){ return dot.wait(1, dot.div(3)).h(2); }, "<div>3</div>2", 25);
	addTest("Wait, append between text nodes.", function(){ return dot.h(1).wait(1, dot.div(3)).h(2); }, "1<div>3</div>2", 25);
	addTest("Wait, out of order.", function(){ return dot.wait(15, dot.div(1)).wait(10, dot.div(2)).wait(5, dot.div(3)); }, "<div>1</div><div>2</div><div>3</div>", 25);
	addTest("Wait, iterate.", function(){ return dot.div(1).wait(1, dot.h("s").iterate(3, "-").h("f")).div(2); }, "<div>1</div>s---f<div>2</div>", 25);
	addTest("Waitception, early.", function(){ return dot.wait(10, dot.div(dot.wait(50, dot.div(1)))); }, "<div><dothtml-defer></dothtml-defer></div>", 25);
	addTest("Waitception, late, times shouldn't stack.", function(){ return dot.wait(5, dot.div(dot.wait(5, dot.div(1)))); }, "<div><div>1</div></div>", 25);
	// addTest("Waitception, late, times stack for functions 1/2.", function(){ return dot.wait(50, function(){return dot.div(dot.wait(100, dot.div(1)))}); }, "<div><dothtml-defer></dothtml-defer></div>", 75);
	// addTest("Waitception, late, times stack for functions 2/2.", function(){ return dot.wait(1, function(){return dot.div(dot.wait(1, dot.div(1)))}); }, "<div><div>1</div></div>", 25);
	//addTest("Waitception, late, deep class.", function(){ return dot.div().wait(10, dot.wait(10, dot["class"](1)))}, "<div class=\"1\"></div>", 500); //This one fails. Not sure if I should support it though.
	addTest("Waitception, late.", function(){ return dot.wait(10, dot.div(dot.wait(20, dot.div(1)))); }, "<div><div>1</div></div>", 25);
	addTest("Waitception, late, short inner interval.", function(){ return dot.wait(20, dot.div(dot.wait(10, dot.div(1)))); }, "<div><div>1</div></div>", 50);
}

//Components
{
	try{
		dot.component({name: "component_select", builder: function(){return dot.select(dot.option("a").value("a").option("b").value("b").option("c").value("c"));}});

		dot.component({name: "comp_legacy", builder: function(){return dot.div(dot.div(1))}});
		dot.component({name: "comp_std", builder: function(){return dot.div(dot.div(1))}});
		dot.component({name: "comp_ready", builder: function(){return dot.div(dot.div(1))}, ready: function(){this.$el.innerHTML = "OKAY"}});
		dot.component({name: "comp_text", builder: function(){return "1"}});
		dot.component({name: "comp_textreplace", builder: function(){return "1"}, ready: function(){this.$el.parentNode.insertBefore(document.createTextNode("2"), this.$el.nextSibling);this.$el.parentNode.removeChild(this.$el);}});

		dot.component({name: "comp_binding_write",
			builder: function(input, v1, v2){
				this.v1 = v1;
				this.v2 = v2;
				return input.bindTo(this, "v2");
			},
			ready: function(){
				var v = dot(this.$el).getVal();
				dot(this.$el.parentNode).empty()
				.div("Var: " + this.v2)
				.div("Input: " + v);
			}
		});
		dot.component({name: "comp_binding_var_change",
			builder: function(input, v1, v2){
				this.v1 = v1;
				this.v2 = v2;
				return input.bindTo(this, "v1");
			},
			ready: function(){
				this.v1 = this.v2;
				var v = dot(this.$el).getVal();
				dot(this.$el.parentNode).empty()
				.div("Var: " + this.v1)
				.div("Input: " + v);
			}
		});

		dot.component({name: "comp_binding_input_change",
			builder: function(input, v1, v2){
				this.v1 = v1;
				this.v2 = v2;
				//this.myValue = dot.binding(v1);
				return input.bindTo(this, "v1");
			},
			ready: function(){
				dot(this.$el).setVal(this.v2);
				var v = dot(this.$el).getVal();
				this.$el.dispatchEvent(new Event("change"));
				//this.v1 = v;
				dot(this.$el.parentNode).empty()
				.div("Var: " + this.v1)
				.div("Input: " + v);
			}
		});

		dot.component({name: "comp_binding_write_input", builder: function(){return dot.comp_binding_write(dot.input(), "a", "b")}});
		dot.component({name: "comp_binding_var_change_input", builder: function(){return dot.comp_binding_var_change(dot.input(), "a", "b")}});
		dot.component({name: "comp_binding_input_change_input", builder: function(){return dot.comp_binding_input_change(dot.input(), "a", "b")}});
		dot.component({name: "comp_binding_write_textarea", builder: function(){return dot.comp_binding_write(dot.textarea("x"), "a", "b")}});
		dot.component({name: "comp_binding_var_change_textarea", builder: function(){return dot.comp_binding_var_change(dot.textarea("x"), "a", "b")}});
		dot.component({name: "comp_binding_input_change_textarea", builder: function(){return dot.comp_binding_input_change(dot.textarea("x"), "a", "b")}});
		dot.component({name: "comp_binding_write_checkbox_on", builder: function(){return dot.comp_binding_write(dot.input().type("checkbox"), false, true)}});
		dot.component({name: "comp_binding_var_change_checkbox_on", builder: function(){return dot.comp_binding_var_change(dot.input().type("checkbox"), false, true)}});
		dot.component({name: "comp_binding_input_change_checkbox_on", builder: function(){return dot.comp_binding_input_change(dot.input().type("checkbox"), false, true)}});
		dot.component({name: "comp_binding_write_checkbox_off", builder: function(){return dot.comp_binding_write(dot.input().type("checkbox").checked(), true, false)}});
		dot.component({name: "comp_binding_var_change_checkbox_off", builder: function(){return dot.comp_binding_var_change(dot.input().type("checkbox").checked(), true, false)}});
		dot.component({name: "comp_binding_input_change_checkbox_off", builder: function(){return dot.comp_binding_input_change(dot.input().type("checkbox").checked(), true, false)}});
		dot.component({name: "comp_binding_write_radio_on", builder: function(){return dot.comp_binding_write(dot.input().type("radio").name("radiotest1"), false, true)}});
		dot.component({name: "comp_binding_var_change_radio_on", builder: function(){return dot.comp_binding_var_change(dot.input().type("radio").name("radiotest2"), false, true)}});
		dot.component({name: "comp_binding_input_change_radio_on", builder: function(){return dot.comp_binding_input_change(dot.input().type("radio").name("radiotest3"), false, true)}});
		dot.component({name: "comp_binding_write_radio_off", builder: function(){return dot.comp_binding_write(dot.input().type("radio").name("radiotest4"), true, false)}});
		dot.component({name: "comp_binding_var_change_radio_off", builder: function(){return dot.comp_binding_var_change(dot.input().type("radio").name("radiotest5"), true, false)}});
		dot.component({name: "comp_binding_input_change_radio_off", builder: function(){return dot.comp_binding_input_change(dot.input().type("radio").name("radiotest6"), true, false)}});
		dot.component({name: "comp_binding_write_select", builder: function(){return dot.comp_binding_write(dot.component_select(), "a", "b")}});
		dot.component({name: "comp_binding_var_change_select", builder: function(){return dot.comp_binding_var_change(dot.component_select(), "a", "b")}});
		dot.component({name: "comp_binding_input_change_select", builder: function(){return dot.comp_binding_input_change(dot.component_select(), "a", "b")}});
		// dot.component({name: "comp_binding_write_option", builder: function(){return dot.comp_binding_write(dot.input(),  false, true)}});
		// dot.component({name: "comp_binding_var_change_option", builder: function(){return dot.comp_binding_var_change(dot.input(),  false, true)}});
		// dot.component({name: "comp_binding_input_change_option", builder: function(){return dot.comp_binding_input_change(dot.input(),  false, true)}});
		dot.component({name: "comp_binding_write_option",
			builder: function(){
				this.myValue = true;
				return dot.select(
					dot.option("a").value("a").selected()
					.option("b").value("b").bindTo(this, "myValue")
					.option("c").value("c"))
			},
			ready: function(){
				var v = dot(this.$el).getVal();
				dot(this.$el.parentNode).empty()
				.div("Var: " + this.myValue).div("Input: " + v)
			}
		});
		dot.component({name: "comp_binding_var_change_option",
			builder: function(){
				this.myValue = false;
				return dot.select(
					dot.option("a").value("a").selected()
					.option("b").value("b").bindTo(this, "myValue")
					.option("c").value("c"))
				},
			ready: function(){
				this.myValue = true;
				var v = dot(this.$el).getVal();
				dot(this.$el.parentNode).empty()
				.div("Var: " + this.myValue)
				.div("Input: " + v)
			}
		});

		// TODO: not sure if this is a valid test case.
		// The change event is dispatched on the option element, not the select.
		// Need to ensure this works with real elements and user interaction.
		dot.component({name: "comp_binding_input_change_option",
			builder: function(){
				this.myValue = false;
				return dot.select(
					dot.option("a").value("a").selected()
					.option("b").value("b").bindTo(this, "myValue")
					.option("c").value("c"))},
			ready: function(){
				dot(this.$el).setVal("b");
				//this.myValue.setFrom(this.$el.childNodes[1]);
				var v = dot(this.$el).getVal();
				this.$el.children[1].dispatchEvent(new Event("change"));
				dot(this.$el.parentNode).empty()
				.div("Var: " + this.myValue)
				.div("Input: " + v);
			}
		});

		// Testing $el
		dot.component({name: "comp_el_undefined_el", builder: function(){}});
		dot.component({name: "comp_el_zero_el", builder: function(){return dot}});
		dot.component({name: "comp_el_one_el", builder: function(){return dot.div("abc")}});
		dot.component({name: "comp_el_two_el", builder: function(){return dot.div("abc").div("abc")}});
		dot.component({name: "comp_el_deferred_el", builder: function(){return dot.div("abc").wait(function(){}, 1000)}});
		dot.component({name: "comp_el_text_zero_el", builder: function(){return "abc"}});
		dot.component({name: "comp_el_text_one_el", builder: function(){return "<div>abc</div>"}});
		dot.component({name: "comp_el_text_two_el", builder: function(){return "<div>abc</div><div>123</div>"}});

		// Testing methods:
		// TODO: passing callMethod in like this will soon be deprecated.
		dot.component({
			name: "comp_methods_basic",
			builder: function(callMethod){ this.callMethod = callMethod; return dot.div("123");},
			ready: function(){if(this.callMethod) this.setVal("abc");},
			methods: { setVal: function(val){ dot(this.$el).empty().t(val); } }
		});

		// Scoped classes
		dot.resetScopeClass();
		dot.component({
			name: "comp_scoped_class",
			builder: function(){ return dot.div(dot.div().class("test2")).class("test1") }
		});
		dot.component({
			name: "comp_scoped_class_2",
			builder: function(){ return dot.div(dot.div().class("test2")).class("test1") }
		});

	}catch(e){ console.error(e);}

	// Nameless components (exports):
	addTest("Nameless component.", function(){ var comp = dot.component({builder: function(c){return dot.p(c)} }); return dot.div(comp(":)")) }, "<div><p>:)</p></div>");
	addTest("Nameless component as a dot function.", function(){ var comp = dot.component({builder: function(c){return dot.p(c)} }); return comp(":)") }, "<p>:)</p>" );

	// Named components (extend dot):
	addTest("Std params component.", function(){return dot.comp_std()}, "<div><div>1</div></div>");
	addTest("Std params component, nested.", function(){return dot.div(2).comp_std().div(3)}, "<div>2</div><div><div>1</div></div><div>3</div>");
	addTest("Std prams component beside markup.", function(){return dot.h(2).comp_std().h(3)}, "2<div><div>1</div></div>3");
	addTest("Legacy params component.", function(){return dot.comp_legacy()}, "<div><div>1</div></div>");
	addTest("Component w/ ready method.", function(){return dot.comp_ready()}, "<div>OKAY</div>");
	addTest("Text component.", function(){return dot.h("a").comp_text().h("b")}, "a1b");
	addTest("Text component w/ ready method.", function(){return dot.h("a").comp_textreplace().h("b")}, "a2b");

	// $el
	addTest("Undefined $el.", function(){try{return dot.comp_el_undefined_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_undefined_el' must return exactly one child node.</span>");
	addTest("Zero $el.", function(){try{return dot.comp_el_zero_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_zero_el' must return exactly one child node.</span>");
	addTest("One $el.", function(){return dot.comp_el_one_el()}, "<div>abc</div>");
	addTest("Two $el.", function(){try{return dot.comp_el_two_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_two_el' must return exactly one child node.</span>");
	addTest("Deferred $el.", function(){try{return dot.comp_el_deferred_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_deferred_el' must return exactly one child node.</span>");
	addTest("One $el.", function(){return dot.comp_el_text_zero_el()}, "abc");
	addTest("One $el.", function(){return dot.comp_el_text_one_el()}, "<div>abc</div>");
	addTest("Undefined $el.", function(){try{return dot.comp_el_text_two_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_text_two_el' must return exactly one child node.</span>");

	// methods
	addTest("Instantiate comp w/ method.", function(){return dot.comp_methods_basic()}, "<div>123</div>");
	addTest("Method gets called in ready function.", function(){return dot.comp_methods_basic(true)}, "<div>abc</div>"); // TODO: this functionality will soon be removed in favor of params.
	
	// Computed
	addTest("Computed property.", function(){let comp = dot.component({builder: function(firstName,lastName){this.firstName = firstName; this.lastName = lastName; return dot.p(this.fullName.toUpperCase())}, computed: {fullName: function(){return this.firstName + " " + this.lastName;}}});return dot.h(comp("J","S")).h(comp("1","2"));},"<p>J S</p><p>1 2</p>");
	// TODO: setup this test and get it working.
	// addTest("Computed property w/ updated dependency.", function(){
	// 	let comp = dot.component({
	// 		builder: function(firstName,lastName){this.firstName = firstName; this.lastName = lastName; return dot.p(this.fullName.toUpperCase())}, 
	// 		computed: {
	// 			fullName: function(){
	// 				console.log("GETTING COMPUTED PROP!");
	// 				return this.firstName + " " + this.lastName;
	// 			}
	// 		}
	// 	});
	// 	return dot.h(comp("J","S"));
	// },"<p>J S</p>");


	// Events // TODO: get these working.
	// addTest(
	// 	"Named events work.", 
	// 	function(){
	// 		let comp = dot.component({
	// 			builder: function(a,b){this.a = a; this.b = b; return dot.p(a+b)}, 
	// 			events: ["sumReady"],
	// 			methods: {trigger: function(){this.sumReady(this.a+this.b);}}, 
	// 		});
	// 		let sumResult = 0;
	// 		let c = comp(1,2).sumReady(function(v){ console.log("CALLING EVENT!!");sumResult = v});
	// 		c.trigger();
	// 		return dot.p(sumResult);
	// 	},
	// 	"<p>3</p>"
	// );

	// Scoped classes
	// TODO: the tests work in browser, but seem to happen out of order in jest...
	// addTest("Component class scope.", function(){return dot.comp_scoped_class()}, "<div class=\"dot-10000-test1\"><div class=\"dot-10000-test2\"></div></div>");
	// addTest("Component class scope reuse.", function(){return dot.comp_scoped_class()}, "<div class=\"dot-10000-test1\"><div class=\"dot-10000-test2\"></div></div>");
	// addTest("Component class scope alt.", function(){return dot.comp_scoped_class_2()}, "<div class=\"dot-10001-test1\"><div class=\"dot-10001-test2\"></div></div>");

	// Styles
	addTest("Set style directly", function(){var ret = dot.p(":)").style("width:100px;"); return ret;}, "<p style=\"width:100px;\">:)</p>");
	addTest("Set style via dotcss", function(){var ret = dot.p(":)").style(dot.css.width(100)); return ret;}, "<p style=\"width:100px;\">:)</p>");
	addTest("Styled component.", function(){ var comp = dot.component({builder: function(c){return dot.p(c)}, style: function(css){css("p").width(100);} }); return comp(":)") }, "<p style=\"width: 100px;\">:)</p>" );
	addTest("Advanced styled component.", function(){ var comp = dot.component({builder: function(c){return dot.p(c)}, style: function(css){css("p").width(100);} }); return dot.h(comp(":)")).h(comp(":)")) }, "<p style=\"width: 100px;\">:)</p><p style=\"width: 100px;\">:)</p>" );
	addTest("Component with multiple styles.", function(){ var comp = dot.component({builder: function(c, w){ this.w = w; return dot.p(c)}, style: function(css){css("p").width(this.w);} }); return dot.h(comp(":)", 200)).h(comp(":)", 300)) }, "<p style=\"width: 200px;\">:)</p><p style=\"width: 300px;\">:)</p>" );
	addTest("Component with class styles.", function(){ var comp = dot.component({builder: function(c, w,h){ this.w = w; this.h = h; return dot.div(dot.div(c).div("w").class("w").div("ok").class("h")).class("w")}, style: function(css){css(".w").width(this.w);css(".h").width(this.h);} }); return dot.h(comp(":)", 200, 400)).h(comp(":)", 300, 500)).div().class("h") }, "<div class=\"w\" style=\"width: 200px;\"><div>:)</div><div class=\"w\" style=\"width: 200px;\">w</div><div class=\"h\" style=\"width: 400px;\">ok</div></div><div class=\"w\" style=\"width: 300px;\"><div>:)</div><div class=\"w\" style=\"width: 300px;\">w</div><div class=\"h\" style=\"width: 500px;\">ok</div></div><div class=h></div>" );

	// Event Bus

	addTest("Event bus basic usage.", function(){var comp1 = dot.component({builder: function(){var t = this; dot.bus.on("change", function(v){t.$el.innerHTML = v}); return dot.p()}  }); var ret = dot.h(comp1()); dot.bus.emit("change", "hello"); return ret;  }, "<p>hello</p>");
// 
}

{// Advanced Bindings
	addTest("Bind to number prop.", function(){
		const MyComp = dot.component({
			builder(){
				this.myProp = 0;
				var ret = dot.span(()=>this.myProp);
				return ret;
			},
			ready(){
				this.myProp++;
			},
			props:["myProp"]
		});
		
		return dot.h(MyComp());
	}, "<span>1</span>");

	addTest("Bind to calculated prop.", function(){
		const MyComp = dot.component({
			builder(){
				this.myProp = 0;
				var ret = dot.div(()=>dot.p("I have " + this.myProp + "!"));
				return ret;
			},
			ready(){
				this.myProp+=10;
			},
			props:["myProp"]
		});
		
		return dot.h(MyComp());
	}, "<div><p>I have 10!</p></div>");

	addTest("Bind to array.", function(){
		const MyComp = dot.component({
			builder(data){
				this.myData = data;
				return dot.ul(
					dot.each(()=>this.myData, (v, i)=>{
						return dot.li(v.value)
					})
				);
			},
			ready(){
				this.myData.push({value: 5});
				this.myData.push({value: 3});
				this.myData.push({value: 1});
			},
			props:["myData"]
		});
		
		var data = [];

		return dot.h(MyComp(data));
		
	}, "<ul><li>5</li><li>3</li><li>1</li></ul>"); // If stops working, add a delay.
	
	addTest("Bind to start of array.", function(){
		const MyComp = dot.component({
			builder(data){
				this.myData = data;
				return dot.ul(
					dot.each(()=>this.myData, (v, i)=>{
						return dot.li(v.value)
					})
				);
			},
			ready(){
				this.myData.push({value: 5});
				this.myData.push({value: 3});
				this.myData.unshift({value: 1});
			},
			props:["myData"]
		});
		
		var data = [];

		return dot.h(MyComp(data));
		
	}, "<ul><li>1</li><li>5</li><li>3</li></ul>");

	addTest("Bind to array out of order.", function(){
		const MyComp = dot.component({
			builder(data){
				this.myData = data;
				return dot.ul(
					dot.each(()=>this.myData, (v, i)=>{
						return dot.li(v.value)
					})
				);
			},
			ready(){
				this.myData.push({value: 5});
				this.myData.push({value: 3});
				this.myData.splice(1, 0, {value: 1});
			},
			props:["myData"]
		});
		
		var data = [];

		return dot.h(MyComp(data));
		
	}, "<ul><li>5</li><li>1</li><li>3</li></ul>");

	addTest("Bind 2 to array out of order.", function(){
		const MyComp = dot.component({
			builder(data){
				this.myData = data;
				return dot.ul(
					dot.each(()=>this.myData, (v, i)=>{
						return dot.li(v.value)
					})
				);
			},
			ready(){
				this.myData.push({value: 5});
				this.myData.push({value: 3});
				this.myData.splice(1, 0, {value: "a"}, {value: "b"});
			},
			props:["myData"]
		});
		
		var data = [];

		return dot.h(MyComp(data));
		
	}, "<ul><li>5</li><li>a</li><li>b</li><li>3</li></ul>");

	addTest("Remove from bound array.", function(){
		const MyComp = dot.component({
			builder(data){
				this.myData = data;
				return dot.ul(
					dot.each(()=>this.myData, (v, i)=>{
						return dot.li(v.value)
					})
				);
			},
			ready(){
				this.myData.push({value: 5});
				this.myData.push({value: "A"});
				this.myData.push({value: "B"});
				this.myData.push({value: 1});
				// this.myData.splice(1,2);
				this.myData.splice(1,2, {value: 3});
			},
			props:["myData"]
		});
		
		var data = [];

		return dot.h(MyComp(data));
		
	}, "<ul><li>5</li><li>3</li><li>1</li></ul>");

	addTest("Set value in bound array.", function(){
		const MyComp = dot.component({
			builder(data){
				this.myData = data;
				return dot.ul(
					dot.each(()=>this.myData, (v, i)=>{
						return dot.li(v.value)
					})
				);
			},
			ready(){
				this.myData.push({value: 5});
				this.myData.push({value: 3});
				this.myData.push({value: 1});

				this.myData[1] = {value: "YES!"};
			},
			props:["myData"]
		});
		
		var data = [];

		return dot.h(MyComp(data));
		
	}, "<ul><li>5</li><li>YES!</li><li>1</li></ul>"); // If stops working, add a delay.
}

{
	try{
		// Testing hooks:
		dot.component({
			name: "comp_hooks_register",
			register: function(){ this.x = (this.x || 0); this.add1(); },
			builder: function(add1){ if(add1)this.add1(); return dot.div(this.x) },
			methods: { add1: function(){ this.x++ } }
		});

		dot.component({
			name: "comp_hooks_create",
			created: function(val){ this.myEl = this.$el; this.testVal = val },
			builder: function(){ return dot.div("val: " + this.testVal + ", hadEl: " + (this.myEl ? "yes" : "no")) }
		});

		dot.component({
			name: "comp_hooks_delete",
			created: function(deleteMe, addEarlyMessage, addLateMessage, messageInSibling){
				this.deleteMe = deleteMe;
				this.addEarlyMessage = addEarlyMessage;
				this.addLateMessage = addLateMessage;
				this.messageInSibling = messageInSibling;
			},
			builder: function(){ return dot.span("not deleted"); },
			ready: function(){ this.parent = this.messageInSibling ? this.$el.parentNode.nextSibling : this.$el.parentNode; if(this.deleteMe) dot(this.parent).empty(); },
			deleting: function(){ if(this.addEarlyMessage) dot(this.messageInSibling ? this.$el.parentNode.nextSibling : this.$el.parentNode ).p("deleted"); },
			deleted: function(){ if(this.addLateMessage) dot(this.parent).b(this.$el ? "failure" : "success"); },
		});
	}
	catch(e){console.error(e);}
	// register
	addTest("Register hook gets called once.", function(){return dot.comp_hooks_register()}, "<div>1</div>");
	addTest("Register hook gets called only once.", function(){return dot.comp_hooks_register()}, "<div>1</div>");
	addTest("Prototype vars set by register cook can be updated.", function(){return dot.comp_hooks_register(true)}, "<div>2</div>");
	addTest("Prototype vars are cloned from prototype.", function(){return dot.comp_hooks_register()}, "<div>1</div>"); // Kind of a weird javascript behavior. Cool though.

	// create
	addTest("Created hook.", function(){return dot.comp_hooks_create("abc");}, "<div>val: abc, hadEl: no</div>");

	// delete
	addTest("Delete hook doesn't get called right away.", function(){return dot.div(dot.comp_hooks_delete());}, "<div><span>not deleted</span></div>");
	addTest("Deleting hook.", function(){return dot.div(dot.comp_hooks_delete(true, true));}, "<div><p>deleted</p></div>");
	addTest("Deleted hook.", function(){return dot.div(dot.comp_hooks_delete(true, false, true));}, "<div><b>success</b></div>");

	//Ensure deletion happens for inner components when using remove.
	addTest("Nested deleting via remove().", function(){ return dot.h(function(){ var ret = dot.i().div(
		dot.comp_hooks_delete(false, true, false, true)
	); var del = ret.getLast(); 
	ret = ret.b(); setTimeout(function(){dot(del).remove() }, 0); return ret; }) }, "<i></i><b><p>deleted</p></b>");

	addTest("Nested deleted via remove().", function(){ return dot.h(function(){ var ret = dot.i().div(
		dot.comp_hooks_delete(false, false, true, true)
	); var del = ret.getLast(); 
	ret = ret.b(); setTimeout(function(){dot(del).remove() }, 0); return ret; }) }, "<i></i><b><b>success</b></b>");
}

{
	addTest("Var bound to input.", function(){return dot.comp_binding_write_input()}, "<div>Var: b</div><div>Input: b</div>");
	addTest("Var change updating input.", function(){return dot.comp_binding_var_change_input()}, "<div>Var: b</div><div>Input: b</div>");
	addTest("Input change updating var.", function(){return dot.comp_binding_input_change_input()}, "<div>Var: b</div><div>Input: b</div>");
	addTest("Var bound to textarea.", function(){return dot.comp_binding_write_textarea()}, "<div>Var: b</div><div>Input: b</div>");
	addTest("Var change updating textarea.", function(){return dot.comp_binding_var_change_textarea()}, "<div>Var: b</div><div>Input: b</div>");
	addTest("Textarea change updating var.", function(){return dot.comp_binding_input_change_textarea()}, "<div>Var: b</div><div>Input: b</div>");
	addTest("Var bound to checkbox on.", function(){return dot.comp_binding_write_checkbox_on()}, "<div>Var: true</div><div>Input: true</div>");
	addTest("Var change updating checkbox on.", function(){return dot.comp_binding_var_change_checkbox_on()}, "<div>Var: true</div><div>Input: true</div>");
	addTest("Checkbox change updating var on.", function(){return dot.comp_binding_input_change_checkbox_on()}, "<div>Var: true</div><div>Input: true</div>");
	addTest("Var bound to checkbox off.", function(){return dot.comp_binding_write_checkbox_off()}, "<div>Var: false</div><div>Input: false</div>");
	addTest("Var change updating checkbox off.", function(){return dot.comp_binding_var_change_checkbox_off()}, "<div>Var: false</div><div>Input: false</div>");
	addTest("Checkbox change updating var.", function(){return dot.comp_binding_input_change_checkbox_off()}, "<div>Var: false</div><div>Input: false</div>");
	addTest("Var bound to radio on.", function(){return dot.comp_binding_write_radio_on()}, "<div>Var: true</div><div>Input: true</div>");
	addTest("Var change updating radio on.", function(){return dot.comp_binding_var_change_radio_on()}, "<div>Var: true</div><div>Input: true</div>");
	addTest("Radio change updating var on.", function(){return dot.comp_binding_input_change_radio_on()}, "<div>Var: true</div><div>Input: true</div>");
	addTest("Var bound to radio off.", function(){return dot.comp_binding_write_radio_off()}, "<div>Var: false</div><div>Input: false</div>");
	addTest("Var change updating radio off.", function(){return dot.comp_binding_var_change_radio_off()}, "<div>Var: false</div><div>Input: false</div>");
	addTest("Radio change updating var off.", function(){return dot.comp_binding_input_change_radio_off()}, "<div>Var: false</div><div>Input: false</div>");
	addTest("Var bound to select.", function(){return dot.comp_binding_write_select()}, "<div>Var: b</div><div>Input: b</div>");
	addTest("Var change updating select.", function(){return dot.comp_binding_var_change_select()}, "<div>Var: b</div><div>Input: b</div>");
	addTest("Select change updating var.", function(){return dot.comp_binding_input_change_select()}, "<div>Var: b</div><div>Input: b</div>");
	addTest("Var bound to option.", function(){return dot.comp_binding_write_option()}, "<div>Var: true</div><div>Input: b</div>");
	addTest("Var change updating option.", function(){return dot.comp_binding_var_change_option()}, "<div>Var: true</div><div>Input: b</div>");
	addTest("Option change updating var.", function(){return dot.comp_binding_input_change_option()}, "<div>Var: true</div><div>Input: b</div>");
}

//Routing
{
	try{
		dot.component({name: "defaultpage", builder: function(){return dot.h1("Default")}});
		dot.component({name: "page1", builder: function(){return dot.h1("Page 1.")}});
		dot.component({name: "page2", builder: function(){return dot.h1("Page 2.")}});
		dot.component({name: "page3", builder: function(){return dot.h1("Page 3.").router()}});
		dot.component({name: "page4", builder: function(){return dot.h1("Good.")}});
		dot.component({name: "page5", builder: function(){return dot.h1("Bad.")}});
		dot.component({name: "page6_7", builder: function(){return dot.h1("Page 6/7.")}});
		dot.component({name: "page6", builder: function(){return dot.h1("Page 6.")}});
		dot.component({name: "page7", builder: function(){return dot.h1("Page 7.")}});
		dot.component({name: "awesomepage", function(params){return dot.h1(params.params.title).p(params.params.body)}});
		dot.component({name: "notfound", builder: function(){return dot.h1("Not Found.")}});
	}catch(e){console.error(e);}
	var routes = [
		{title: "DOT Tests", path: "/", component: dot.defaultpage},
		{title: "Page 1", path: "1", component: dot.page1},
		{title: "Page 2", path: "2", component: dot.page2},
		{title: "Page 3", path: "3", component: dot.page3},
		{title: "Greedy Page 4", path: "greed", component: dot.page4},
		{title: "Greedy Page 5", path: "greed", component: dot.page5},
		{title: "Page 6/7", path: "6/7", component: dot.page6_7},
		{title: "Awesome", path: "awesome/{title}/{body}", component: dot.awesomepage},
		{title: "Ajax", path: "ajax", component: "testpage.js"},
		{title: "Not Found", path: "*", component: dot.notfound},
	];
	// addTest("Navigate with no router.", function(){return dot.div("abc").navigate("1")}, "<div>abc</div>");
	// addTest("Chainability of navigate.", function(){return dot.div("abc").navigate("1").div("def")}, "<div>abc</div><div>def</div>");
	// addTest("Default content.", function(){return dot.router(routes, true)}, "<dothtml-router></dothtml-router>");
	// addTest("Default content, undefined navigate.", function(){return dot.router(routes, true).navigate()}, "<dothtml-router><h1>Default</h1></dothtml-router>");
	// addTest("Default content, / navigate.", function(){return dot.router(routes, true).navigate("/")}, "<dothtml-router><h1>Default</h1></dothtml-router>");
	// addTest("Unknown route.", function(){return dot.router(routes, true).navigate("unknown")}, "<dothtml-router><h1>Not Found.</h1></dothtml-router>");
	// addTest("Navigate to 1.", function(){return dot.router(routes, true).navigate("1")}, "<dothtml-router><h1>Page 1.</h1></dothtml-router>");
	// addTest("Navigate to 1/.", function(){return dot.router(routes, true).navigate("1/")}, "<dothtml-router><h1>Page 1.</h1></dothtml-router>");
	// addTest("Navigate to 1 then 2.", function(){return dot.router(routes, true).navigate("1").navigate("2")}, "<dothtml-router><h1>Page 2.</h1></dothtml-router>");
	// addTest("Navigate to the same page.", function(){return dot.router(routes, true).navigate("1").navigate("1")}, "<dothtml-router><h1>Page 1.</h1></dothtml-router>");
	// addTest("Navigate from 1 to undefined.", function(){return dot.router(routes, true).navigate("1").navigate()}, "<dothtml-router><h1>Default</h1></dothtml-router>");
	// addTest("Navigate from 1 to /.", function(){return dot.router(routes, true).navigate("1").navigate("/")}, "<dothtml-router><h1>Default</h1></dothtml-router>");
	// addTest("Navigate to 6/7.", function(){return dot.router(routes, true).navigate("6/7")}, "<dothtml-router><h1>Page 6/7.</h1></dothtml-router>");
	// addTest("Navigate to 6/8.", function(){return dot.router(routes, true).navigate("6/8")}, "<dothtml-router><h1>Not Found.</h1></dothtml-router>");
	// addTest("Params.", function(){return dot.router(routes, true).navigate("awesome/Hello/Hello_World")}, "<dothtml-router><h1>Hello</h1><p>Hello_World</p></dothtml-router>");
	// addTest("Greedy route.", function(){return dot.router(routes, true).navigate("greed")}, "<dothtml-router><h1>Good.</h1></dothtml-router>");
	// addTest("Load page file.", function(){return dot.router(routes, true).navigate("ajax")}, "<dothtml-router><h1>Loaded Page</h1><p>This page was loaded from a file!</p></dothtml-router>");
	// NESTED ROUTING (NOT SUPPORTED YET)
	// addTest("Route not found child.", function(){return dot.router(routes, true).navigate("3/notfound")}, "<dothtml-router><h1>Page 3.</h1><dothtml-router>Route \"notfound\" not found.</dothtml-router></dothtml-router>");
	// addTest("Router in router / default.", function(){return dot.router(routes, true).navigate("3")}, "<dothtml-router><h1>Page 3.</h1><dothtml-router><h1>Default</h1></dothtml-router></dothtml-router>");
	// addTest("Router in router / page 3/1.", function(){return dot.router(routes, true).navigate("3/1")}, "<dothtml-router><h1>Page 3.</h1><dothtml-router><h1>Page 1.</h1></dothtml-router></dothtml-router>");
	// addTest("Router in router / page 3/2 => 3/1.", function(){return dot.router(routes, true).navigate("3/2").navigate("3/1")}, "<dothtml-router><h1>Page 3.</h1><dothtml-router><h1>Page 1.</h1></dothtml-router></dothtml-router>");
	// addTest("Router in router / page 3/2 => 2.", function(){return dot.router(routes, true).navigate("3/1").navigate("2")}, "<dothtml-router><h1>Page 2.</h1></dothtml-router>");
	// addTest("Router in router / page 2 => 3/1.", function(){return dot.router(routes, true).navigate("2").navigate("3/1")}, "<dothtml-router><h1>Page 3.</h1><dothtml-router><h1>Page 1.</h1></dothtml-router></dothtml-router>");
	// addTest("Router in router / page 3/3/1.", function(){return dot.router(routes, true).navigate("3/3/1")}, "<dothtml-router><h1>Page 3.</h1><dothtml-router><h1>Page 3.</h1><dothtml-router><h1>Page 1.</h1></dothtml-router></dothtml-router></dothtml-router>");
	// CURRENTLY UNDEFINED:
	//addTest("Two routers.", function(){return dot.router(routes, true).router(routes, true).navigate("1")}, "<dothtml-router></dothtml-router><dothtml-router><h1>Page 1.</h1></dothtml-router>");
	// - Add test case for ensuring routers are removed from the allRouters object after calling empty().
}

//Scripted
{
	//The expected functionality of these test cases changed in version 1.3.0.
	addTest("Script, no return.", function(){ return dot.script(function(){1 + 1;}).div(1); }, "<div>1</div>");
	addTest("Script, return dot.", function(){ return dot.script(function(){return 2;}).div(1); }, "<div>1</div>");
	addTest("Script, return function.", function(){ return dot.script(function(){return function(){return 2};}).div(1); }, "<div>1</div>");
}

// CSS
{
	addTest("CSS module included.", function(){ return dot.h(dot.css?.color ? "yes" : "no"); }, "yes");

	// TODO: more dotcss tests. Dotcss is still a WIP.
}


// 		</script>
// </body>
// </html>
