import addTest from "./core";
import dot from "../src/index";
import Component from "../src/component";

abstract class BaseComp extends Component{
	args: Array<any>

	props:{
		propA: string,
		propB: string,
		propC: string,
		prop1: number,
		prop2: number,
		prop3: number,
		propYN1: boolean,
		propYN2: boolean,
		propYN3: boolean,
		propAbc: Array<{[key: string]: any}>,
		propXyz: Array<{[key: string]: any}>,
	}={
		propA: "",
		propB: "",
		propC: "",
		prop1: 0,
		prop2: 0,
		prop3: 0,
		propYN1: false,
		propYN2: false,
		propYN3: false,
		propAbc: [],
		propXyz: [],
	}

	constructor(...args: Array<any>){
		super();
		this.args = args;
	}
}

addTest("Bind to number prop.", function(){
	class MyComp extends BaseComp{
		builder(){
			var ret = dot.span(()=>this.props.prop1);
			return ret;
		}
		ready(){
			this.props.prop1++;
		}
		
	}
	
	return dot.h(new MyComp());
}, "<span>1</span>");

addTest("Bind to calculated prop.", function(){
	class MyComp extends BaseComp{
		builder(){
			var ret = dot.div(()=>dot.p("I have " + this.props.prop1 + "!"));
			return ret;
		}
		ready(){
			this.props.prop1+=10;
		}
		
	}
	
	return dot.h(new MyComp());
}, "<div><p>I have 10!</p></div>");

addTest("Bind to array.", function(){
	class MyComp extends BaseComp{
		builder(){
			return dot.ul(
				dot.each(()=>this.props.propXyz, (v, i)=>{
					return dot.li(v.value)
				})
			);
		}
		ready(){
			this.props.propXyz.push({value: 5});
			this.props.propXyz.push({value: 3});
			this.props.propXyz.push({value: 1});
		}
		
	}
	
	var data = [];

	return dot.h(new MyComp(data));
	
}, "<ul><li>5</li><li>3</li><li>1</li></ul>"); // If stops working, add a delay.

addTest("Bind to array, modify original.", function(){
	class MyComp extends BaseComp{
		builder(){
			this.props.propAbc = this.props.propXyz;
			return dot.ul(
				dot.each(()=>this.props.propAbc, (v, i)=>{
					return dot.li(v.value)
				})
			);
		}
		ready(){
			this.props.propXyz.push({value: 5});
			this.props.propXyz.push({value: 3});
			this.props.propXyz.push({value: 1});
		}
		
	}
	
	var data = [];

	return dot.h(new MyComp(data));
	
}, "<ul><li>5</li><li>3</li><li>1</li></ul>"); // If stops working, add a delay.

addTest("Bind to start of array.", function(){
	class MyComp extends BaseComp{
		builder(){
			return dot.ul(
				dot.each(()=>this.props.propAbc, (v, i)=>{
					return dot.li(v.value)
				})
			);
		}
		ready(){
			this.props.propAbc.push({value: 5});
			this.props.propAbc.push({value: 3});
			this.props.propAbc.unshift({value: 1});
		}
		
	}

	return dot.h(new MyComp());
	
}, "<ul><li>1</li><li>5</li><li>3</li></ul>");

addTest("Bind to array out of order.", function(){
	class MyComp extends BaseComp{
		builder(){
			return dot.ul(
				dot.each(()=>this.props.propAbc, (v, i)=>{
					return dot.li(v.value)
				})
			);
		}
		ready(){
			this.props.propAbc.push({value: 5});
			this.props.propAbc.push({value: 3});
			this.props.propAbc.splice(1, 0, {value: 1});
		}
		
	}

	return dot.h(new MyComp());
	
}, "<ul><li>5</li><li>1</li><li>3</li></ul>");

addTest("Bind 2 to array out of order.", function(){
	class MyComp extends BaseComp{
		builder(){
			return dot.ul(
				dot.each(()=>this.props.propAbc, (v, i)=>{
					return dot.li(v.value)
				})
			);
		}
		ready(){
			this.props.propAbc.push({value: 5});
			this.props.propAbc.push({value: 3});
			this.props.propAbc.splice(1, 0, {value: "a"}, {value: "b"});
		}
		
	}

	return dot.h(new MyComp());
	
}, "<ul><li>5</li><li>a</li><li>b</li><li>3</li></ul>");

addTest("Remove from bound array.", function(){
	class MyComp extends BaseComp{
		builder(){
			return dot.ul(
				dot.each(()=>this.props.propAbc, (v, i)=>{
					return dot.li(v.value)
				})
			);
		}
		ready(){
			this.props.propAbc.push({value: 5});
			this.props.propAbc.push({value: "A"});
			this.props.propAbc.push({value: "B"});
			this.props.propAbc.push({value: 1});
			// this.props.propAbc.splice(1,2);
			this.props.propAbc.splice(1,2, {value: 3});
		}
		
	}

	return dot.h(new MyComp());
	
}, "<ul><li>5</li><li>3</li><li>1</li></ul>");

addTest("Set value in bound array.", function(){
	class MyComp extends BaseComp{
		builder(){
			return dot.ul(
				dot.each(()=>this.props.propAbc, (v, i)=>{
					return dot.li(v.value)
				})
			);
		}
		ready(){
			this.props.propAbc.push({value: 5});
			this.props.propAbc.push({value: 3});
			this.props.propAbc.push({value: 1});

			this.props.propAbc[1] = {value: "YES!"};
		}
		
	}

	return dot.h(new MyComp());
	
}, "<ul><li>5</li><li>YES!</li><li>1</li></ul>"); // If stops working, add a delay.

addTest("Conditional rendering.", function(){
	class MyComp extends BaseComp{
		builder(){
			this.props.propYN1 = false;
			this.props.propYN2 = true;
			var ret = dot.div(
				dot.div("OUTER1")
				.when(()=>this.props.propYN1, ()=>dot
					.p("A"))
				.when(()=>this.props.propYN2, ()=>dot
					.p("B"))
				.div("OUTER2")
			);
			return ret;
		}
		ready(){
			this.props.propYN1 = !this.props.propYN1;
			this.props.propYN2 = !this.props.propYN2;
		}
	}
	
	return dot.h(new MyComp());
}, "<div><div>OUTER1</div><p>A</p><div>OUTER2</div></div>");

addTest("Conditional rendering - out of order.", function(){
	class MyComp extends BaseComp{
		builder(){
			this.props.propYN1 = false;
			this.props.propYN2 = false;
			this.props.propYN3 = false;
			var ret = dot.div(dot.div().when(()=>this.props.propYN1, ()=>dot.p("A")).when(()=>this.props.propYN2, ()=>dot.p("B")).when(()=>this.props.propYN3, ()=>dot.p("C")).div());
			return ret;
		}
		ready(){
			this.props.propYN2 = true;
			this.props.propYN3 = true;
			this.props.propYN1 = true;
		}
	}
	
	return dot.h(new MyComp());
}, "<div><div></div><p>A</p><p>B</p><p>C</p><div></div></div>");


addTest("Conditional rendering - if true->false else.", function(){
	class MyComp extends BaseComp{
		builder(){
			this.props.propYN1 = false;
			var ret = dot.div(
				dot.div("OUTER1")
				.when(()=>this.props.propYN1, ()=>dot
					.p("A"))
				.otherwise(()=>dot
					.p("B"))
				.div("OUTER2")
			);
			return ret;
		}
		ready(){
			this.props.propYN1 = !this.props.propYN1;
		}
		
	}
	
	return dot.h(new MyComp());
}, "<div><div>OUTER1</div><p>A</p><div>OUTER2</div></div>");


addTest("Conditional rendering - if true->false elseif true.", function(){
	class MyComp extends BaseComp{
		builder(){
			this.props.propYN1 = true;
			this.props.propYN2 = true;
			var ret = dot.div(
				dot.div("OUTER1")
				.when(()=>this.props.propYN1, ()=>dot
					.p("A"))
				.otherwiseWhen(()=>this.props.propYN2, ()=>dot
					.p("B"))
				.otherwise(()=>dot
					.p("C"))
				.div("OUTER2")
			);
			return ret;
		}
		ready(){
			this.props.propYN1 = false;
		}
	}
	
	return dot.h(new MyComp());
}, "<div><div>OUTER1</div><p>B</p><div>OUTER2</div></div>");

addTest("Conditional rendering - if true->false elseif true->false.", function(){
	class MyComp extends BaseComp{
		builder(){
			this.props.propYN1 = true;
			this.props.propYN2 = true;
			var ret = dot.div(
				dot.div("OUTER1")
				.when(()=>this.props.propYN1, ()=>dot
					.p("A"))
				.otherwiseWhen(()=>this.props.propYN2, ()=>dot
					.p("B"))
				.otherwise(()=>dot
					.p("C"))
				.div("OUTER2")
			);
			return ret;
		}
		ready(){
			this.props.propYN1 = false;
			this.props.propYN2 = false;
		}
	}
	
	return dot.h(new MyComp());
}, "<div><div>OUTER1</div><p>C</p><div>OUTER2</div></div>");

addTest("Conditional rendering - if true->false elseif false->true.", function(){
	class MyComp extends BaseComp{
		builder(){
			this.props.propYN1 = true;
			this.props.propYN2 = false;
			var ret = dot.div(
				dot.div("OUTER1")
				.when(()=>this.props.propYN1, ()=>dot
					.p("A"))
				.otherwiseWhen(()=>this.props.propYN2, ()=>dot
					.p("B"))
				.otherwise(()=>dot
					.p("C"))
				.div("OUTER2")
			);
			return ret;
		}
		ready(){
			this.props.propYN1 = false;
			this.props.propYN2 = true;
		}
	}
	
	return dot.h(new MyComp());
}, "<div><div>OUTER1</div><p>B</p><div>OUTER2</div></div>");

addTest("Conditional rendering - if true else true.", function(){
	class MyComp extends BaseComp{
		builder(){
			this.props.propYN1 = false;
			this.props.propYN2 = true;
			var ret = dot.div(
				dot.div("OUTER1")
				.when(()=>this.props.propYN1, ()=>dot
					.p("A"))
				.otherwiseWhen(()=>this.props.propYN2, ()=>dot
					.p("B"))
				.otherwise(()=>dot
					.p("C"))
				.div("OUTER2")
			);
			return ret;
		}
		ready(){
			this.props.propYN1 = true;
		}
	}
	
	return dot.h(new MyComp());
}, "<div><div>OUTER1</div><p>A</p><div>OUTER2</div></div>");

addTest("Conditional rendering - if true else false->true.", function(){
	class MyComp extends BaseComp{
		builder(){
			this.props.propYN1 = false;
			this.props.propYN2 = false;
			var ret = dot.div(
				dot.div("OUTER1")
				.when(()=>this.props.propYN1, ()=>dot
					.p("A"))
				.otherwiseWhen(()=>this.props.propYN2, ()=>dot
					.p("B"))
				.otherwise(()=>dot
					.p("C"))
				.div("OUTER2")
			);
			return ret;
		}
		ready(){
			this.props.propYN1 = true;
			
		}
	}
	
	return dot.h(new MyComp());
}, "<div><div>OUTER1</div><p>A</p><div>OUTER2</div></div>");