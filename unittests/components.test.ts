import addTest from "./core";
import dot from "../src/dothtml";
import Component from "../src/component";

class comp_legacy extends dot.Component{
	
	builder(){
		return dot.div(dot.div(1));
	}
}
class comp_std extends dot.Component{
	builder(){
		return dot.div(dot.div(1));
	}
}
class comp_ready extends dot.Component{
	builder(){
		return dot.div(dot.div(1));
	}

	ready(){
		this.$el.innerHTML = "OKAY";
	}
}

class comp_el_one_el extends dot.Component{
	builder(){
		return dot.div("abc");
	}
} 

class comp_el_two_el extends dot.Component{
	builder(){
		return dot.div("abc").div("abc");
	}
} 

abstract class ParameterizedComponent extends dot.Component{
	params: Array<any>;
	constructor(...params: Array<any>){
		super();
		this.params = params;
	}
}

// class comp_el_deferred_el extends dot.Component{
// 	builder(){
// 		return dot.div("abc").wait(function(){}, 1000);
// 	}
// } 

// Testing methods:
// TODO: passing callMethod in like this will soon be deprecated.
class comp_methods_basic extends dot.Component{
	callMethod: boolean;
	constructor(callMethod: boolean){
		super();
		this.callMethod = callMethod;
	}

	builder(){ 
		return dot.div("123");
	}

	ready(){
		if(this.callMethod) this.setVal("abc");
	}
	setVal(val){ 
		dot(this.$el).empty().t(val); 
	}
};

// Scoped classes
dot.resetScopeClass();
class comp_scoped_class extends dot.Component{
	builder(){ 
		return dot.div(dot.div().class("test2")).class("test1") 
	}
};
class comp_scoped_class_2 extends dot.Component{
	builder(){ return dot.div(dot.div().class("test2")).class("test1") }
};


// Nameless components (exports):
//addTest("Nameless component.", function(){ var comp = dot.component({builder: function(c){return dot.p(c)} }); return dot.div(comp(":)")) }, "<div><p>:)</p></div>");
// This behavior was deprecated.
//addTest("Nameless component as a dot function.", function(){ var comp = dot.component({builder: function(c){return dot.p(c)} }); return comp(":)") }, "<p>:)</p>" );

// Named components (extend dot):
addTest("Std params component.", function(){return dot.h(new comp_std())}, "<div><div>1</div></div>");
// addTest("Std params component, nested.", function(){return dot.div(2).comp_std().div(3)}, "<div>2</div><div><div>1</div></div><div>3</div>");
// addTest("Std prams component beside markup.", function(){return dot.h(2).comp_std().h(3)}, "2<div><div>1</div></div>3");
addTest("Legacy params component.", function(){return dot.h(new comp_legacy())}, "<div><div>1</div></div>");
addTest("Component w/ ready method.", function(){return dot.h(new comp_ready())}, "<div>OKAY</div>");
// addTest("Text component.", function(){return dot.h("a").comp_text().h("b")}, "a1b");
//addTest("Text component w/ ready method.", function(){return dot.h("a").comp_textreplace().h("b")}, "a2b");

// $el
// addTest("Undefined $el.", function(){try{return new comp_el_undefined_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_undefined_el' must return exactly one child node.</span>");
// addTest("Zero $el.", function(){try{return new comp_el_zero_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_zero_el' must return exactly one child node.</span>");
addTest("One $el.", function(){return dot.h( new comp_el_one_el())}, "<div>abc</div>");
addTest("Two $el.", function(){try{return dot.h( new comp_el_two_el())}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_two_el' must return exactly one child node.</span>");
// addTest("Deferred $el.", function(){try{return new comp_el_deferred_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_deferred_el' must return exactly one child node.</span>");
// addTest("One $el.", function(){return new comp_el_text_zero_el()}, "abc");
// addTest("One $el.", function(){return new comp_el_text_one_el()}, "<div>abc</div>");
// addTest("Undefined $el.", function(){try{return new comp_el_text_two_el()}catch(e){return dot.span(e)}}, "<span>Component 'comp_el_text_two_el' must return exactly one child node.</span>");

// methods
addTest("Instantiate comp w/ method.", function(){return dot.h(new comp_methods_basic(false))}, "<div>123</div>");
addTest("Method gets called in ready function.", function(){return dot.h(new comp_methods_basic(true))}, "<div>abc</div>"); // TODO: this functionality will soon be removed in favor of params.


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

addTest("Styled component.", function(){ 
	class comp extends ParameterizedComponent{
		builder(){
			return dot.p(this.params[0]);
		}
		style(css){
			css("p").width(100);
		}
	}
	return dot.h(new comp(":)")) }, "<p style=\"width: 100px;\">:)</p>" 
);

addTest("Advanced styled component.", function(){ 
	class comp extends ParameterizedComponent{
		builder(){
			return dot.p(this.params[0])
		}
		style(css){
			css("p").width(100);
		} 
	}
	return dot.h(new comp(":)")).h(new comp(":)")) 
}, "<p style=\"width: 100px;\">:)</p><p style=\"width: 100px;\">:)</p>" );

addTest("Component with multiple styles.", function(){ 
	class comp extends ParameterizedComponent{
		builder(){ 
			return dot.p(this.params[0])
		} 
		style(css){
			css("p").width(this.params[1]);
		} 
	} 
	return dot.h(new comp(":)", 200)).h(new comp(":)", 300)) 
}, "<p style=\"width: 200px;\">:)</p><p style=\"width: 300px;\">:)</p>" );

addTest("Component with class styles.", function(){ 
	class comp extends ParameterizedComponent{
		builder(){ 
			return dot.div(
				dot.div(this.params[0])
				.div("w").class("w")
				.div("ok").class("h")
			).class("w");
		}
		style(css){
			css(".w").width(this.params[1]);css(".h").width(this.params[2]);
		}
	} 
	return dot.h(new comp(":)", 200, 400)).h(new comp(":)", 300, 500)).div().class("h");
}, "<div class=\"w\" style=\"width: 200px;\"><div>:)</div><div class=\"w\" style=\"width: 200px;\">w</div><div class=\"h\" style=\"width: 400px;\">ok</div></div><div class=\"w\" style=\"width: 300px;\"><div>:)</div><div class=\"w\" style=\"width: 300px;\">w</div><div class=\"h\" style=\"width: 500px;\">ok</div></div><div class=h></div>" );

addTest("Styles should not apply to nested elements.", function(){
	class CompOuter extends ParameterizedComponent{
		builder(){
			return dot.div(this.params[0]);
		}
		style(css){
			css("div").backgroundColor("#FF0000");
		}
	};

	class CompInner extends dot.Component{
		builder(){
			return dot.div("FOOBAR");
		}
	};

	return dot.h(new CompOuter(new CompInner()))
}, "<div style=\"background-color: rgb(255, 0, 0);\"><div>FOOBAR</div></div>");

addTest("Styles should not apply to nested elements 2.", function(){
	class CompOuter extends ParameterizedComponent{
		builder(){
			return dot.div(this.params[0]);
		}
		style(css){
			css("div").backgroundColor("#FF0000");
		}
	}

	class CompInner extends dot.Component{
		builder(){return dot.div(dot.div("FOOBAR"));}
	}

	return dot.h(new CompOuter(new CompInner()))
}, "<div style=\"background-color: rgb(255, 0, 0);\"><div><div>FOOBAR</div></div></div>");

// Event Bus

addTest("Event bus basic usage.", function(){
	class comp1 extends dot.Component{
		builder(){
			var t = this; 
			dot.bus.on("change", function(v){t.$el.innerHTML = v}); 
			return dot.p();
		}  
	}
	
	var ret = dot.h(new comp1()); dot.bus.emit("change", "hello"); 
	return ret;  
}, "<p>hello</p>");