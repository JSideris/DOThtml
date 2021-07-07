import addTest from "./core";
import dot from "../src/index";

addTest("Computed property.", function(){
	let comp = dot.component({
		builder: function(firstName,lastName){
			this.firstName = firstName; 
			this.lastName = lastName; 
			return dot.p(this.fullName.toUpperCase())}, 
		computed: {
			fullName(){
				return (this.firstName||"notset") + " " + (this.lastName||"notset");
			}
		}
	});
	return dot.h(comp("J","S")).h(comp("1","2"));
},"<p>J S</p><p>1 2</p>");

addTest("Computed property w/ prop dependency.", function(){
	var comp = dot.component({
		builder: function(){
			return dot.p(()=>this.fullName.toUpperCase())
		}, 
		props: ["firstName", "lastName"],
		computed: {
			fullName(){
				return (this.firstName||"notset") + " " + (this.lastName||"notset");
			}
		}
	});
	var instance = comp();
	var ret = dot.h(instance);
	instance.firstName = "j";
    instance.lastName = "s";
    return ret;
},"<p>J S</p>");