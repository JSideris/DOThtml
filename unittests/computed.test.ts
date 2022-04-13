import addTest from "./core";
import dot from "../src/index";
import Component from "../src/component";

class Comp extends Component{
	props={
		firstName: "",
		lastName: ""
	}
	constructor(firstName, lastName){
		super();
		this.props.firstName = firstName; 
		this.props.lastName = lastName; 

	}
	builder(){
		return dot.p(()=>this.fullName.toUpperCase())
	}
	get fullName(){
		return (this.props.firstName||"notset") + " " + (this.props.lastName||"notset");
	}
}
addTest("Computed property.", function(){

	return dot.h( new Comp("J","S")).h(new Comp("1","2"));
},"<p>J S</p><p>1 2</p>");

addTest("Computed property w/ prop dependency.", function(){

	var instance = new Comp("x", "y");
	var ret = dot.h(instance);
	instance.props.firstName = "j";
    instance.props.lastName = "s";
    return ret;
},"<p>J S</p>");