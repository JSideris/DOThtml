import addTest from "./core";
import dot from "../src/index";

addTest("Conditional true.", function(){ return dot.h(1).IF(true, dot.h("true")).h(2); }, "1true2");
addTest("Conditional false.", function(){ return dot.h(1).IF(false, dot.h("false")).h(2); }, "12");
addTest("Conditional true true.", function(){ return dot.h(1).IF(true, dot.h(2)).IF(true, dot.h(3)).h(4); }, "1234");
addTest("Conditional class.", function(){ return dot.div(1).IF(true, dot["class"](2)); }, "<div class=\"2\">1</div>");
//Not sure if the following two cases should be supported. They are broken as of 1.3.0, but I don't know if that matters.
//addTest("Conditional deep class.", function(){ return dot.div(1).IF(true, dot.IF(true, dot["class"](2))); }, "<div class=\"2\">1</div>");
//addTest("Conditional deep class with more confusion.", function(){ return dot.div(1).IF(true, dot.IF(true, dot["class"](2)).div(3)); }, "<div class=\"2\">1</div><div>3</div>");

// Truthiness.

addTest("If null.", function(){ return dot.IF(null, "if").ELSE("else"); }, "else");
addTest("If {}.", function(){ return dot.IF({}, "if").ELSE("else"); }, "if");