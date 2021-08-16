import addTest from "./core";
import dot from "../src/index";

try{

	dot.component({name: "comp_legacy", builder: function(){return dot.div(dot.div(1))}});
	dot.component({name: "comp_std", builder: function(){return dot.div(dot.div(1))}});
	dot.component({name: "comp_ready", builder: function(){return dot.div(dot.div(1))}, ready: function(){this.$el.innerHTML = "OKAY"}});
	dot.component({name: "comp_text", builder: function(){return "1"}});
	dot.component({name: "comp_textreplace", builder: function(){return "1"}, ready: function(){this.$el.parentNode.insertBefore(document.createTextNode("2"), this.$el.nextSibling);this.$el.parentNode.removeChild(this.$el);}});

	// Testing $el
	dot.component({name: "comp_el_undefined_el", builder: function(){}});
	dot.component({name: "comp_el_zero_el", builder: function(){return dot}});
	dot.component({name: "comp_el_one_el", builder: function(){return dot.div("abc")}});
	dot.component({name: "comp_el_two_el", builder: function(){return dot.div("abc").div("abc")}});
	dot.component({name: "comp_el_deferred_el", builder: function(){return dot.div("abc").wait(function(){}, 1000)}});
	dot.component({name: "comp_el_text_zero_el", builder: function(){return "abc"}});
	dot.component({name: "comp_el_text_one_el", builder: function(){return "<div>abc</div>"}});
	dot.component({name: "comp_el_text_two_el", builder: function(){return "<div>abc</div><div>123</div>"}});

	// Testing methods:
	// TODO: passing callMethod in like this will soon be deprecated.
	dot.component({
		name: "comp_methods_basic",
		builder: function(callMethod){ this.callMethod = callMethod; return dot.div("123");},
		ready: function(){if(this.callMethod) this.setVal("abc");},
		methods: { setVal: function(val){ dot(this.$el).empty().t(val); } }
	});

	// Scoped classes
	dot.resetScopeClass();
	dot.component({
		name: "comp_scoped_class",
		builder: function(){ return dot.div(dot.div().class("test2")).class("test1") }
	});
	dot.component({
		name: "comp_scoped_class_2",
		builder: function(){ return dot.div(dot.div().class("test2")).class("test1") }
	});

}catch(e){ console.error(e);}

// Nameless components (exports):
addTest("Nameless component.", function(){ var comp = dot.component({builder: function(c){return dot.p(c)} }); return dot.div(comp(":)")) }, "<div><p>:)</p></div>");
// This behavior was deprecated.
//addTest("Nameless component as a dot function.", function(){ var comp = dot.component({builder: function(c){return dot.p(c)} }); return comp(":)") }, "<p>:)</p>" );

// Named components (extend dot):
addTest("Std params component.", function(){return dot.comp_std()}, "<div><div>1</div></div>");
addTest("Std params component, nested.", function(){return dot.div(2).comp_std().div(3)}, "<div>2</div><div><div>1</div></div><div>3</div>");
addTest("Std prams component beside markup.", function(){return dot.h(2).comp_std().h(3)}, "2<div><div>1</div></div>3");
addTest("Legacy params component.", function(){return dot.comp_legacy()}, "<div><div>1</div></div>");
addTest("Component w/ ready method.", function(){return dot.comp_ready()}, "<div>OKAY</div>");
addTest("Text component.", function(){return dot.h("a").comp_text().h("b")}, "a1b");
addTest("Text component w/ ready method.", function(){return dot.h("a").comp_textreplace().h("b")}, "a2b");

// $el
addTest("Undefined $el.", function(){try{return dot.comp_el_undefined_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_undefined_el' must return exactly one child node.</span>");
addTest("Zero $el.", function(){try{return dot.comp_el_zero_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_zero_el' must return exactly one child node.</span>");
addTest("One $el.", function(){return dot.comp_el_one_el()}, "<div>abc</div>");
addTest("Two $el.", function(){try{return dot.comp_el_two_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_two_el' must return exactly one child node.</span>");
addTest("Deferred $el.", function(){try{return dot.comp_el_deferred_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_deferred_el' must return exactly one child node.</span>");
addTest("One $el.", function(){return dot.comp_el_text_zero_el()}, "abc");
addTest("One $el.", function(){return dot.comp_el_text_one_el()}, "<div>abc</div>");
addTest("Undefined $el.", function(){try{return dot.comp_el_text_two_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_text_two_el' must return exactly one child node.</span>");

// methods
addTest("Instantiate comp w/ method.", function(){return dot.comp_methods_basic()}, "<div>123</div>");
addTest("Method gets called in ready function.", function(){return dot.comp_methods_basic(true)}, "<div>abc</div>"); // TODO: this functionality will soon be removed in favor of params.


// TODO: setup this test and get it working.
// addTest("Computed property w/ updated dependency.", function(){
// 	let comp = dot.component({
// 		builder: function(firstName,lastName){this.firstName = firstName; this.lastName = lastName; return dot.p(this.fullName.toUpperCase())}, 
// 		computed: {
// 			fullName: function(){
// 				console.log("GETTING COMPUTED PROP!");
// 				return this.firstName + " " + this.lastName;
// 			}
// 		}
// 	});
// 	return dot.h(comp("J","S"));
// },"<p>J S</p>");


// Events // TODO: get these working.
// addTest(
// 	"Named events work.", 
// 	function(){
// 		let comp = dot.component({
// 			builder: function(a,b){this.a = a; this.b = b; return dot.p(a+b)}, 
// 			events: ["sumReady"],
// 			methods: {trigger: function(){this.sumReady(this.a+this.b);}}, 
// 		});
// 		let sumResult = 0;
// 		let c = comp(1,2).sumReady(function(v){ console.log("CALLING EVENT!!");sumResult = v});
// 		c.trigger();
// 		return dot.p(sumResult);
// 	},
// 	"<p>3</p>"
// );

// Scoped classes
// TODO: the tests work in browser, but seem to happen out of order in jest...
// addTest("Component class scope.", function(){return dot.comp_scoped_class()}, "<div class=\"dot-10000-test1\"><div class=\"dot-10000-test2\"></div></div>");
// addTest("Component class scope reuse.", function(){return dot.comp_scoped_class()}, "<div class=\"dot-10000-test1\"><div class=\"dot-10000-test2\"></div></div>");
// addTest("Component class scope alt.", function(){return dot.comp_scoped_class_2()}, "<div class=\"dot-10001-test1\"><div class=\"dot-10001-test2\"></div></div>");

// Styles
addTest("Set style directly", function(){var ret = dot.p(":)").style("width:100px;"); return ret;}, "<p style=\"width:100px;\">:)</p>");
addTest("Set style via dotcss", function(){var ret = dot.p(":)").style(dot.css.width(100)); return ret;}, "<p style=\"width:100px;\">:)</p>");
addTest("Styled component.", function(){ var comp = dot.component({builder: function(c){return dot.p(c)}, style: function(css){css("p").width(100);} }); return dot.h(comp(":)")) }, "<p style=\"width: 100px;\">:)</p>" );
addTest("Advanced styled component.", function(){ var comp = dot.component({builder: function(c){return dot.p(c)}, style: function(css){css("p").width(100);} }); return dot.h(comp(":)")).h(comp(":)")) }, "<p style=\"width: 100px;\">:)</p><p style=\"width: 100px;\">:)</p>" );
addTest("Component with multiple styles.", function(){ var comp = dot.component({builder: function(c, w){ this.w = w; return dot.p(c)}, style: function(css){css("p").width(this.w);} }); return dot.h(comp(":)", 200)).h(comp(":)", 300)) }, "<p style=\"width: 200px;\">:)</p><p style=\"width: 300px;\">:)</p>" );
addTest("Component with class styles.", function(){ var comp = dot.component({builder: function(c, w,h){ this.w = w; this.h = h; return dot.div(dot.div(c).div("w").class("w").div("ok").class("h")).class("w")}, style: function(css){css(".w").width(this.w);css(".h").width(this.h);} }); return dot.h(comp(":)", 200, 400)).h(comp(":)", 300, 500)).div().class("h") }, "<div class=\"w\" style=\"width: 200px;\"><div>:)</div><div class=\"w\" style=\"width: 200px;\">w</div><div class=\"h\" style=\"width: 400px;\">ok</div></div><div class=\"w\" style=\"width: 300px;\"><div>:)</div><div class=\"w\" style=\"width: 300px;\">w</div><div class=\"h\" style=\"width: 500px;\">ok</div></div><div class=h></div>" );

// Event Bus

addTest("Event bus basic usage.", function(){var comp1 = dot.component({builder: function(){var t = this; dot.bus.on("change", function(v){t.$el.innerHTML = v}); return dot.p()}  }); var ret = dot.h(comp1()); dot.bus.emit("change", "hello"); return ret;  }, "<p>hello</p>");