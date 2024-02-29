import addTest from "./core";
import {dot} from "../src/dothtml";

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
addTest("Autoscope 1.", function(){ return dot.scopeClass(null, dot.div().class("test")); }, "<div class=\"dot-10000-test\"></div>");
addTest("Autoscope 2.", function(){ return dot.scopeClass(null, dot.div().class("test")); }, "<div class=\"dot-10001-test\"></div>");
addTest("Autoscope 2 with nest.", function(){ return dot.scopeClass(null, dot.div(dot.div().class("test2")).class("test")); }, "<div class=\"dot-10002-test\"><div class=\"dot-10002-test2\"></div></div>");

addTest("Reset scope.", function(){ dot.resetScopeClass(); return dot.scopeClass(null, dot.div().class("test")); }, "<div class=\"dot-10000-test\"></div>");