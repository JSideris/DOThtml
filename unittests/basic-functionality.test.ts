import addTest from "./core";
import dot from "../src/index";

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
// addTest("JSON object in a div.", function(){ return dot.div({}); }, "<div></div>"); // Not supported anymore.
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
// addTest("In class.", function(){ return dot.div(dot["class"](1)); }, "<div class=\"1\"></div>");
addTest("Wrong class.", function(){ return dot.div(dot.h("2")["class"](1)); }, "<div>2</div>");
// addTest("Wrong class 2.", function(){ return dot.h(dot["class"](1).h(2)); }, "2");

// not supported.
// addTest("Classception.", function(){ return dot.div(dot.div(dot["class"](1))); }, "<div><div class=\"1\"></div></div>");
// addTest("Classception.", function(){ return dot.div(dot.h(dot["class"](1).h(2))); }, "<div>2</div>");
// addTest("Classception - parallel classy divs.", function(){ return dot.div([dot.div(dot["class"](1)), dot.div(dot["class"](2))]); }, "<div><div class=\"1\"></div><div class=\"2\"></div></div>");
// addTest("One class at a time.", function(){ return dot.div(dot["class"](1)); }, "<div class=\"1\"></div>");
addTest("Skipped class.", function(){ return dot.div().h(1)["class"](2); }, "<div></div>1");
// Not supported.
// addTest("Missed class.", function(){ return dot["class"](1); }, "");
//addTest("Conflicting classes.", function(){ return dot.div(dot)["class"](1)["class"](2); }, "<div class=\"2\"></div>"); // DEPRECATED
addTest("Conflicting classes.", function(){ return dot.div(dot)["class"](1)["class"](2); }, "<div class=\"1 2\"></div>");
addTest("Void element.", function(){ return dot.img(); }, "<img>");
addTest("Self-explaining attribute.", function(){ return dot.button().disabled(); }, "<button disabled=\"disabled\"></button>");
addTest("Not a self-explaining attribute..", function(){ return dot.input().value(""); }, "<input value=\"\">");
addTest("Passing dot to h.", function(){ return dot.h(dot.div()); }, "<div></div>");
addTest("Passing function to h.", function(){ return dot.h(function(){return "<div></div>"}); }, "<div></div>");
// Not supported.
// addTest("Two internal attributes.", function(){ return dot.div(dot["class"]("1").id("two-internal-attributes")); }, "<div class=\"1\" id=\"two-internal-attributes\"></div>");
// Note that empty is required for the core tests to work, but I also want an explicit test for it here in case the core tests change.
addTest("Empty an element.", function(){ return dot.h(function(){ var ret = dot.i().div(
	dot.span("123").span("abc")
); var del = ret.getLast(); 
ret = ret.b(); setTimeout(function(){dot(del).empty() }, 0); return ret; }) }, "<i></i><div></div><b></b>");
addTest("Remove an element.", function(){ return dot.h(function(){ var ret = dot.i().div(
	dot.span("123").span("abc")
); var del = ret.getLast(); 
ret = ret.b(); setTimeout(function(){dot(del).remove() }, 0); return ret; }) }, "<i></i><b></b>");

// Undefined:

addTest("Undefined div.", function(){ return dot.div(undefined) }, "<div></div>");
addTest("Undefined html.", function(){ return dot.h(undefined) }, ""); //On the fence about this.
addTest("Undefined text.", function(){ return dot.t(undefined) }, "undefined"); //If the user really wants to print out undefined.

// Last node:

//addTest("Get Last Node.", function(){ return dot.h(dot.div("text").__lastNode.innerHTML)}, "text"); // No longer supported.
//addTest("Get Last Node - h.", function(){ return dot.h(dot.h("<div>text</div>").__lastNode.innerHTML)}, "text"); // No longer supported.
addTest("Get Last Node - h.", function(){ return dot.h(dot.h("<div>text</div>").getLast().innerHTML);}, "text");
addTest("Using getLast() function.", function(){ return dot.h(dot.div("text").getLast().innerHTML);}, "text");

// Script

//The expected functionality of these test cases changed in version 1.3.0.
addTest("Script, no return.", function(){ return dot.script(function(){1 + 1;}).div(1); }, "<div>1</div>");
addTest("Script, return dot.", function(){ return dot.script(function(){return 2;}).div(1); }, "<div>1</div>");
addTest("Script, return function.", function(){ return dot.script(function(){return function(){return 2};}).div(1); }, "<div>1</div>");

// CSS 
addTest("CSS module included.", function(){ return dot.h(dot.css?.color ? "yes" : "no"); }, "yes");