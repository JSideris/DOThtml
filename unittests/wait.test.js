import addTest from "./core";
import dot from "../src/index";

addTest("Deferred.", function(){ return dot.div(dot.defer(function(v){v.h(1)}))}, "<div>1</div>");
// TODO: running
// addTest("Long deferred.", function(){ return dot.div(dot.defer(function(v){setTimeout(function(){v.h(1);},0)})); }, "<div>1</div>", 25);

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