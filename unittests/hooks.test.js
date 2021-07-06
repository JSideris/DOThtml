import addTest from "./core";
import dot from "../src/index";

try{
	// Testing hooks:
	dot.component({
		name: "comp_hooks_register",
		register: function(){ this.x = (this.x || 0); this.add1(); },
		builder: function(add1){ if(add1)this.add1(); return dot.div(this.x) },
		methods: { add1: function(){ this.x++ } }
	});

	dot.component({
		name: "comp_hooks_create",
		created: function(val){ this.myEl = this.$el; this.testVal = val },
		builder: function(){ return dot.div("val: " + this.testVal + ", hadEl: " + (this.myEl ? "yes" : "no")) }
	});

	dot.component({
		name: "comp_hooks_delete",
		created: function(deleteMe, addEarlyMessage, addLateMessage, messageInSibling){
			this.deleteMe = deleteMe;
			this.addEarlyMessage = addEarlyMessage;
			this.addLateMessage = addLateMessage;
			this.messageInSibling = messageInSibling;
		},
		builder: function(){ return dot.span("not deleted"); },
		ready: function(){ this.parent = this.messageInSibling ? this.$el.parentNode.nextSibling : this.$el.parentNode; if(this.deleteMe) dot(this.parent).empty(); },
		deleting: function(){ if(this.addEarlyMessage) dot(this.messageInSibling ? this.$el.parentNode.nextSibling : this.$el.parentNode ).p("deleted"); },
		deleted: function(){ if(this.addLateMessage) dot(this.parent).b(this.$el ? "failure" : "success"); },
	});
}
catch(e){console.error(e);}
// register
addTest("Register hook gets called once.", function(){return dot.comp_hooks_register()}, "<div>1</div>");
addTest("Register hook gets called only once.", function(){return dot.comp_hooks_register()}, "<div>1</div>");
addTest("Prototype vars set by register cook can be updated.", function(){return dot.comp_hooks_register(true)}, "<div>2</div>");
addTest("Prototype vars are cloned from prototype.", function(){return dot.comp_hooks_register()}, "<div>1</div>"); // Kind of a weird javascript behavior. Cool though.

// create
addTest("Created hook.", function(){return dot.comp_hooks_create("abc");}, "<div>val: abc, hadEl: no</div>");

// delete
addTest("Delete hook doesn't get called right away.", function(){return dot.div(dot.comp_hooks_delete());}, "<div><span>not deleted</span></div>");
addTest("Deleting hook.", function(){return dot.div(dot.comp_hooks_delete(true, true));}, "<div><p>deleted</p></div>");
addTest("Deleted hook.", function(){return dot.div(dot.comp_hooks_delete(true, false, true));}, "<div><b>success</b></div>");

//Ensure deletion happens for inner components when using remove.
addTest("Nested deleting via remove().", function(){ return dot.h(function(){ var ret = dot.i().div(
	dot.comp_hooks_delete(false, true, false, true)
); var del = ret.getLast(); 
ret = ret.b(); setTimeout(function(){dot(del).remove() }, 0); return ret; }) }, "<i></i><b><p>deleted</p></b>");

addTest("Nested deleted via remove().", function(){ return dot.h(function(){ var ret = dot.i().div(
	dot.comp_hooks_delete(false, false, true, true)
); var del = ret.getLast(); 
ret = ret.b(); setTimeout(function(){dot(del).remove() }, 0); return ret; }) }, "<i></i><b><b>success</b></b>");