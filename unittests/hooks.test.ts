import addTest from "./core";
import {dot} from "../src/dothtml";
import Component from "../src/component";

// Testing hooks:
// class CompHooksRegister extends Component{
// 	x: number = 0;
// 	add: boolean = false;

// 	register(){ this.x = (this.x || 0); this.add1(); }
// 	builder(x, add){this.x = x||this.x; this.add = add||this.add; if(this.add)this.add1(); return dot.div(this.x) }
// 	add1(){ this.x++ }
// }

class CompHooksCreate extends Component{
	myEl: Element;
	testVal: any;
	created(val){ this.myEl = this.$el; this.testVal = val }
	builder(){ return dot.div("val: " + this.testVal + ", hadEl: " + (this.myEl ? "yes" : "no")) }
}

class CompHooksDelete extends Component{
	deleteMe: boolean;
	addEarlyMessage: boolean;
	addLateMessage: boolean;
	messageInSibling: string;
	parent: ChildNode | ParentNode;
	
	created(deleteMe: boolean, addEarlyMessage: boolean, addLateMessage: boolean, messageInSibling: string){
		this.deleteMe = deleteMe;
		this.addEarlyMessage = addEarlyMessage;
		this.addLateMessage = addLateMessage;
		this.messageInSibling = messageInSibling;
	}
	builder(){ return dot.span("not deleted"); }
	ready(){ this.parent = this.messageInSibling ? this.$el.parentNode.nextSibling : this.$el.parentNode; if(this.deleteMe) dot(this.parent).empty(); }
	deleting(){ 
		if(this.addEarlyMessage) dot(this.messageInSibling ? this.$el.parentNode.nextSibling : this.$el.parentNode ).p("deleted"); 
	}
	deleted(){ if(this.addLateMessage) dot(this.parent).b(this.$el ? "failure" : "success"); }
}

// register
// I guess these are no longer valid.
// addTest("Register hook gets called once.", function(){return dot.h(new CompHooksRegister())}, "<div>1</div>");
// addTest("Register hook gets called only once.", function(){return dot.h(new CompHooksRegister())}, "<div>1</div>");
// addTest("Prototype vars set by register cook can be updated.", function(){return dot.h(new CompHooksRegister(true))}, "<div>2</div>");
// addTest("Prototype vars are cloned from prototype.", function(){return dot.h(new CompHooksRegister())}, "<div>1</div>"); // Kind of a weird javascript behavior. Cool though.

// create
addTest("Created hook.", function(){return dot.h(new CompHooksCreate("abc"));}, "<div>val: abc, hadEl: no</div>");

// delete
addTest("Delete hook doesn't get called right away.", function(){return dot.div(new CompHooksDelete());}, "<div><span>not deleted</span></div>");
addTest("Deleting hook.", function(){return dot.div(new CompHooksDelete(true, true));}, "<div><p>deleted</p></div>");
addTest("Deleted hook.", function(){return dot.div(new CompHooksDelete(true, false, true));}, "<div><b>success</b></div>");

//Ensure deletion happens for inner components when using remove.
addTest("Nested deleting via remove().", function(){ 
	return dot.h(function(){ 
		var ret = dot.i().div(
			new CompHooksDelete(false, true, false, true)
		); var del = ret.getLast(); 
		ret = ret.b(); 
		setTimeout(function(){
			dot(del).remove();
		}, 0); 
		return ret; 
	}) 
}, "<i></i><b><p>deleted</p></b>");

addTest("Nested deleted via remove().", function(){ return dot.h(function(){ var ret = dot.i().div(
	new CompHooksDelete(false, false, true, true)
); var del = ret.getLast(); 
ret = ret.b(); setTimeout(function(){dot(del).remove() }, 0); return ret; }) }, "<i></i><b><b>success</b></b>");