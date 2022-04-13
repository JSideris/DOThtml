import addTest from "./core";
import dot from "../src/index";

addTest("Iterate.", function(){ return dot.iterate(3, function(i){return dot.h(i)}); }, "012");
addTest("Iterate w/ friends.", function(){ return dot.h("s").iterate(3, function(i){return dot.h(i)}).h("f"); }, "s012f");
addTest("Iterate no return.", function(){ return dot.h("s").iterate(3, function(i){dot.h(i); return dot.t("")}).h("f"); }, "sf");
// addTest("Iterate raw dot.", function(){ return dot.h("s").iterate(3, dot.h("-")).h("f"); }, "s---f");
// addTest("Iterate raw dot HTML.", function(){ return dot.h("s").iterate(3, dot.div()).h("f"); }, "s<div></div><div></div><div></div>f");
// addTest("Iterate text.", function(){ return dot.h("s").iterate(3, "-").h("f"); }, "s---f");
addTest("Nested iterate.", function(){
	return dot.h("s")
	.iterate(2, function(i){
		return dot.iterate(2, function(j){return j})
	}).h("f");
}, "s0101f");
addTest("Each.", function(){ return dot.each(["A", "B", "C"], function(x, i){return i + x}); }, "0A1B2C");
addTest("Nested each.", function(){ return dot.each(["A", "B", "C"], function(x, i){return dot.h(i + x).each(["D", "E", "F"], function(y, j){return j + y})}); }, "0A0D1E2F1B0D1E2F2C0D1E2F");
addTest("Hash each.", function(){ return dot.each({a: "x", b: "y", c: "z"}, function(x, i){return i + x}); }, "axbycz");