import addTest from "./core";
import dot from "../src/index";

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