import addTest from "./core";
import dot from "../src/dothtml";

addTest("citeE.", function(){ return dot.cite(); }, "<cite></cite>");
addTest("dataE.", function(){ return dot.data(); }, "<data></data>"); //Element not supported by most browsers.
addTest("formE.", function(){ return dot.form(); }, "<form></form>");
addTest("labelE.", function(){ return dot.label(); }, "<label></label>");
addTest("spanE.", function(){ return dot.span(); }, "<span></span>");
addTest("summaryE.", function(){ return dot.summary(); }, "<summary></summary>");

addTest("citeA.", function(){ return dot.del().quoteCite(1); }, "<del cite=\"1\"></del>");
addTest("dataA.", function(){ return dot.object().objectData(1); }, "<object data=\"1\"></object>");
addTest("formA.", function(){ return dot.input().whichForm(1); }, "<input form=\"1\">");
addTest("labelA.", function(){ return dot.track().trackLabel(1); }, ["<track label=\"1\">", "<track label=\"1\"></track>"]);
addTest("spanA.", function(){ return dot.col().colSpan(1); }, "<col span=\"1\">");
addTest("summaryA.", function(){ return dot.table().tableSummary(1); }, "<table summary=\"1\"></table>");
addTest("optionLabelA.", function(){ return dot.option().optionLabel(1); }, "<option label=\"1\"></option>");
addTest("acceptCharsetA.", function(){ return dot.form().acceptCharset("utf-8"); }, "<form accept-charset=\"utf-8\"></form>");

// These aren't required anymore because all the overlapping names have been resolved.
// addTest("Smart cite - attribute.", function(){ return dot.del().cite(1); }, "<del cite=\"1\"></del>");
// addTest("Smart form - attribute.", function(){ return dot.input().form(1); }, "<input form=\"1\">");
// addTest("Smart label - attribute.", function(){ return dot.track().label(1); }, ["<track label=\"1\">", "<track label=\"1\"></track>"]);
// addTest("Smart span - attribute.", function(){ return dot.col().span(1); }, "<col span=\"1\">");
// addTest("Smart summary - attribute.", function(){ return dot.table().summary(1); }, "<table summary=\"1\"></table>");
// addTest("Smart cite - element.", function(){ return dot.div().cite(); }, "<div></div><cite></cite>");
// addTest("Smart form - element.", function(){ return dot.div().form(); }, "<div></div><form></form>");
// addTest("Smart label - element.", function(){ return dot.div().label(); }, "<div></div><label></label>");
// addTest("Smart span - element.", function(){ return dot.div().span(); }, "<div></div><span></span>");
// addTest("Smart summary - element.", function(){ return dot.div().summary(); }, "<div></div><summary></summary>");
// addTest("Smart cite - append to blank.", function(){ return dot.citeE(); }, "<cite></cite>");
// addTest("Smart form - append to blank.", function(){ return dot.formE(); }, "<form></form>");
// addTest("Smart label - append to blank.", function(){ return dot.labelE(); }, "<label></label>");
// addTest("Smart span - append to blank.", function(){ return dot.spanE(); }, "<span></span>");
// addTest("Smart summary - append to blank.", function(){ return dot.summaryE(); }, "<summary></summary>");
// addTest("Smart data - basic attribute.", function(){ return dot.object().data(1); }, "<object data=\"1\"></object>");

addTest("Smart data - custom attribute.", function(){ return dot.div().customData("a", 1); }, "<div data-a=\"1\"></div>");