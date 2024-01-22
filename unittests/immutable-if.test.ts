import addTest from "./core";
import {dot} from "../src/dothtml";

addTest("Conditional true.", function(){ return dot.h(1).when(true, dot.h("true")).h(2); }, "1true2");
addTest("Conditional false.", function(){ return dot.h(1).when(false, dot.h("false")).h(2); }, "12");
addTest("Conditional true true.", function(){ return dot.h(1).when(true, dot.h(2)).when(true, dot.h(3)).h(4); }, "1234");

// No longer valid - use class bindings.
//addTest("Conditional class.", function(){ return dot.div(1).when(true, dot["class"](2)); }, "<div class=\"2\">1</div>");

//Not sure if the following two cases should be supported. They are broken as of 1.3.0, but I don't know if that matters.
//addTest("Conditional deep class.", function(){ return dot.div(1).when(true, dot.when(true, dot["class"](2))); }, "<div class=\"2\">1</div>");
//addTest("Conditional deep class with more confusion.", function(){ return dot.div(1).when(true, dot.when(true, dot["class"](2)).div(3)); }, "<div class=\"2\">1</div><div>3</div>");

// Truthiness.

// No longer valid in ts.
// addTest("If null.", function(){ return dot.when(null, "if").otherwise("else"); }, "else");
// addTest("If {}.", function(){ return dot.when({}, "if").otherwise("else"); }, "if");