
import addTest from "./core";
import { dot, DotComponent, IDotElement } from "../lib/dothtml";

addTest("Callable selector.", function(){ 
	dot(document.body)(dot.p("yes"));

    return document.body;
}, "<p>yes</p>");

addTest("Callable document.", function(){ 
    return dot.div("d")(dot.p("yes"));
}, "<div>d</div><p>yes</p>");

addTest("Callable document is chainable.", function(){ 
    return dot.div("d")(dot.p("yes")).span("s");
}, "<div>d</div><p>yes</p><span>s</span>");

addTest("Attributes are callable.", function(){ 
    return dot.div("d").class("my-class")(dot.p("yes"));
}, "<div class=\"my-class\">d</div><p>yes</p>");

addTest("Callable document can have attributes (internal).", function(){ 
    return dot.div("d")(dot.p("yes").class("my-class"));
}, "<div>d</div><p class=\"my-class\">yes</p><span>s</span>");

addTest("Callable document can have attributes (external).", function(){ 
    return dot.div("d")(dot.p("yes")).class("my-class");
}, "<div>d</div><p class=\"my-class\">yes</p><span>s</span>");

addTest("Callable document internal attribute is chainable.", function(){ 
    return dot.div("d")(dot.p("yes").class("my-class")).span("s");
}, "<div>d</div><p class=\"my-class\">yes</p><span>s</span>");

addTest("Callable document external attribute is chainable.", function(){ 
    return dot.div("d")(dot.p("yes")).class("my-class").span("s");
}, "<div>d</div><p class=\"my-class\">yes</p><span>s</span>");

addTest("Callable document renders components.", function(){ 
	class Comp extends DotComponent{
		builder(...args: any[]): IDotElement {
			return dot.p("yes");
		}
	}

    return dot.div("d")(new Comp()).span("s");
}, "<div>d</div><p>yes</p><span>s</span>");