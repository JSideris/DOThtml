import addTest from "./core";
import dot from "../src/index";

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