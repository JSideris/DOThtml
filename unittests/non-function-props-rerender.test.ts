
/**
 * 2022-07-28
 * The goal of these tests is to verify that the builder and style functions are called once when properties are updated.
 * The previous behavior was that specific elements within components would only be re-rendered if a property was used inside of a function.
 * This resulted in some annoying syntax, such as `dot.div(()=>{return this.props.x})`. And then restyling wouldn't happen at all unless expliticly executed.
*/

import dot, { DotComponent, IDotCss, IDotElement } from "../src/dothtml";
import addTest from "./core";

class TestComponentA extends DotComponent{
	props={
		myValue: "not-set",
		rebuild: "no",
		restyle: "no",
	}

	builds: number = 0;
	styled: number = 0;

	builder(): IDotElement {
		this.builds++;

		this.props.rebuild;

		return dot.div(
			dot.div(this.props.myValue).div(this.props.myValue).div(()=>{ return this.props.myValue })
		);
	}
	
	style(css: IDotCss){
		this.styled++;

		this.props.restyle;
		this.props.myValue;
	}
}

addTest("Basic build and style.", function(){ 
	let component = new TestComponentA();
	dot(document.body).h(component);

	return dot.h(`${component.$el.outerHTML} ${component.builds} ${component.styled}`);
}, "<div><div>not-set</div><div>not-set</div><div>not-set</div></div> 1 1");

addTest("Update rebuild prop.", function(){ 
	let component = new TestComponentA();
	dot(document.body).h(component);

	component.props.rebuild = "yes 1";
	component.props.rebuild = "yes 2";

	return dot.h(`${component.$el.outerHTML} ${component.builds} ${component.styled}`);
}, "<div><div>not-set</div><div>not-set</div><div>not-set</div></div> 3 1");

addTest("Update restyle prop.", function(){ 
	let component = new TestComponentA();
	dot(document.body).h(component);

	component.props.restyle = "yes 1";
	component.props.restyle = "yes 2";

	return dot.h(`${component.$el.outerHTML} ${component.builds} ${component.styled}`);
}, "<div><div>not-set</div><div>not-set</div><div>not-set</div></div> 1 3");

addTest("Update value.", function(){ 
	let component = new TestComponentA();
	dot(document.body).h(component);

	component.props.myValue = "set";

	return dot.h(`${component.$el.outerHTML} ${component.builds} ${component.styled}`);
}, "<div><div>set</div><div>set</div><div>set</div></div> 2 2");

addTest("Update value and other props.", function(){ 
	let component = new TestComponentA();
	dot(document.body).h(component);

	component.props.rebuild = "yes";
	component.props.restyle = "yes";
	component.props.myValue = "set";

	return dot.h(`${component.$el.outerHTML} ${component.builds} ${component.styled}`);
}, "<div><div>set</div><div>set</div><div>set</div></div> 3 3");