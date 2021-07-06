import addTest from "./core";
import dot from "../src/index";

addTest("Bind to number prop.", function(){
	const MyComp = dot.component({
		builder(){
			this.myProp = 0;
			var ret = dot.span(()=>this.myProp);
			return ret;
		},
		ready(){
			this.myProp++;
		},
		props:["myProp"]
	});
	
	return dot.h(MyComp());
}, "<span>1</span>");

addTest("Bind to calculated prop.", function(){
	const MyComp = dot.component({
		builder(){
			this.myProp = 0;
			var ret = dot.div(()=>dot.p("I have " + this.myProp + "!"));
			return ret;
		},
		ready(){
			this.myProp+=10;
		},
		props:["myProp"]
	});
	
	return dot.h(MyComp());
}, "<div><p>I have 10!</p></div>");

addTest("Bind to array.", function(){
	const MyComp = dot.component({
		builder(data){
			this.myData = data;
			return dot.ul(
				dot.each(()=>this.myData, (v, i)=>{
					return dot.li(v.value)
				})
			);
		},
		ready(){
			this.myData.push({value: 5});
			this.myData.push({value: 3});
			this.myData.push({value: 1});
		},
		props:["myData"]
	});
	
	var data = [];

	return dot.h(MyComp(data));
	
}, "<ul><li>5</li><li>3</li><li>1</li></ul>"); // If stops working, add a delay.

addTest("Bind to start of array.", function(){
	const MyComp = dot.component({
		builder(data){
			this.myData = data;
			return dot.ul(
				dot.each(()=>this.myData, (v, i)=>{
					return dot.li(v.value)
				})
			);
		},
		ready(){
			this.myData.push({value: 5});
			this.myData.push({value: 3});
			this.myData.unshift({value: 1});
		},
		props:["myData"]
	});
	
	var data = [];

	return dot.h(MyComp(data));
	
}, "<ul><li>1</li><li>5</li><li>3</li></ul>");

addTest("Bind to array out of order.", function(){
	const MyComp = dot.component({
		builder(data){
			this.myData = data;
			return dot.ul(
				dot.each(()=>this.myData, (v, i)=>{
					return dot.li(v.value)
				})
			);
		},
		ready(){
			this.myData.push({value: 5});
			this.myData.push({value: 3});
			this.myData.splice(1, 0, {value: 1});
		},
		props:["myData"]
	});
	
	var data = [];

	return dot.h(MyComp(data));
	
}, "<ul><li>5</li><li>1</li><li>3</li></ul>");

addTest("Bind 2 to array out of order.", function(){
	const MyComp = dot.component({
		builder(data){
			this.myData = data;
			return dot.ul(
				dot.each(()=>this.myData, (v, i)=>{
					return dot.li(v.value)
				})
			);
		},
		ready(){
			this.myData.push({value: 5});
			this.myData.push({value: 3});
			this.myData.splice(1, 0, {value: "a"}, {value: "b"});
		},
		props:["myData"]
	});
	
	var data = [];

	return dot.h(MyComp(data));
	
}, "<ul><li>5</li><li>a</li><li>b</li><li>3</li></ul>");

addTest("Remove from bound array.", function(){
	const MyComp = dot.component({
		builder(data){
			this.myData = data;
			return dot.ul(
				dot.each(()=>this.myData, (v, i)=>{
					return dot.li(v.value)
				})
			);
		},
		ready(){
			this.myData.push({value: 5});
			this.myData.push({value: "A"});
			this.myData.push({value: "B"});
			this.myData.push({value: 1});
			// this.myData.splice(1,2);
			this.myData.splice(1,2, {value: 3});
		},
		props:["myData"]
	});
	
	var data = [];

	return dot.h(MyComp(data));
	
}, "<ul><li>5</li><li>3</li><li>1</li></ul>");

addTest("Set value in bound array.", function(){
	const MyComp = dot.component({
		builder(data){
			this.myData = data;
			return dot.ul(
				dot.each(()=>this.myData, (v, i)=>{
					return dot.li(v.value)
				})
			);
		},
		ready(){
			this.myData.push({value: 5});
			this.myData.push({value: 3});
			this.myData.push({value: 1});

			this.myData[1] = {value: "YES!"};
		},
		props:["myData"]
	});
	
	var data = [];

	return dot.h(MyComp(data));
	
}, "<ul><li>5</li><li>YES!</li><li>1</li></ul>"); // If stops working, add a delay.

addTest("Conditional rendering.", function(){
	const MyComp = dot.component({
		builder(){
			this.myPropA = false;
			this.myPropB = true;
			var ret = dot.div(
				dot.div("OUTER1")
				.if(()=>this.myPropA, ()=>dot
					.p("A"))
				.if(()=>this.myPropB, ()=>dot
					.p("B"))
				.div("OUTER2")
			);
			return ret;
		},
		ready(){
			this.myPropA = !this.myPropA;
			this.myPropB = !this.myPropB;
		},
		props:["myPropA", "myPropB"]
	});
	
	return dot.h(MyComp());
}, "<div><div>OUTER1</div><p>A</p><div>OUTER2</div></div>");

addTest("Conditional rendering - out of order.", function(){
	const MyComp = dot.component({
		builder(){
			this.myPropA = false;
			this.myPropB = false;
			this.myPropC = false;
			var ret = dot.div(dot.div().if(()=>this.myPropA, ()=>dot.p("A")).if(()=>this.myPropB, ()=>dot.p("B")).if(()=>this.myPropC, ()=>dot.p("C")).div());
			return ret;
		},
		ready(){
			this.myPropB = true;
			this.myPropC = true;
			this.myPropA = true;
		},
		props:["myPropA", "myPropB", "myPropC"]
	});
	
	return dot.h(MyComp());
}, "<div><div></div><p>A</p><p>B</p><p>C</p><div></div></div>");


addTest("Conditional rendering - if true->false else.", function(){
	const MyComp = dot.component({
		builder(){
			this.myProp = false;
			var ret = dot.div(
				dot.div("OUTER1")
				.if(()=>this.myProp, ()=>dot
					.p("A"))
				.else(()=>dot
					.p("B"))
				.div("OUTER2")
			);
			return ret;
		},
		ready(){
			this.myProp = !this.myProp;
		},
		props:["myProp"]
	});
	
	return dot.h(MyComp());
}, "<div><div>OUTER1</div><p>A</p><div>OUTER2</div></div>");


addTest("Conditional rendering - if true->false elseif true.", function(){
	const MyComp = dot.component({
		builder(){
			this.myProp = true;
			this.myElseProp = true;
			var ret = dot.div(
				dot.div("OUTER1")
				.if(()=>this.myProp, ()=>dot
					.p("A"))
				.elseif(()=>this.myElseProp, ()=>dot
					.p("B"))
				.else(()=>dot
					.p("C"))
				.div("OUTER2")
			);
			return ret;
		},
		ready(){
			this.myProp = false;
		},
		props:["myProp", "myElseProp"]
	});
	
	return dot.h(MyComp());
}, "<div><div>OUTER1</div><p>B</p><div>OUTER2</div></div>");

addTest("Conditional rendering - if true->false elseif true->false.", function(){
	const MyComp = dot.component({
		builder(){
			this.myProp = true;
			this.myElseProp = true;
			var ret = dot.div(
				dot.div("OUTER1")
				.if(()=>this.myProp, ()=>dot
					.p("A"))
				.elseif(()=>this.myElseProp, ()=>dot
					.p("B"))
				.else(()=>dot
					.p("C"))
				.div("OUTER2")
			);
			return ret;
		},
		ready(){
			this.myProp = false;
			this.myElseProp = false;
		},
		props:["myProp", "myElseProp"]
	});
	
	return dot.h(MyComp());
}, "<div><div>OUTER1</div><p>C</p><div>OUTER2</div></div>");

addTest("Conditional rendering - if true->false elseif false->true.", function(){
	const MyComp = dot.component({
		builder(){
			this.myProp = true;
			this.myElseProp = false;
			var ret = dot.div(
				dot.div("OUTER1")
				.if(()=>this.myProp, ()=>dot
					.p("A"))
				.elseif(()=>this.myElseProp, ()=>dot
					.p("B"))
				.else(()=>dot
					.p("C"))
				.div("OUTER2")
			);
			return ret;
		},
		ready(){
			this.myProp = false;
			this.myElseProp = true;
		},
		props:["myProp", "myElseProp"]
	});
	
	return dot.h(MyComp());
}, "<div><div>OUTER1</div><p>B</p><div>OUTER2</div></div>");

addTest("Conditional rendering - if true else true.", function(){
	const MyComp = dot.component({
		builder(){
			this.myProp = false;
			this.myElseProp = true;
			var ret = dot.div(
				dot.div("OUTER1")
				.if(()=>this.myProp, ()=>dot
					.p("A"))
				.elseif(()=>this.myElseProp, ()=>dot
					.p("B"))
				.else(()=>dot
					.p("C"))
				.div("OUTER2")
			);
			return ret;
		},
		ready(){
			this.myProp = true;
		},
		props:["myProp", "myElseProp"]
	});
	
	return dot.h(MyComp());
}, "<div><div>OUTER1</div><p>A</p><div>OUTER2</div></div>");

addTest("Conditional rendering - if true else false->true.", function(){
	const MyComp = dot.component({
		builder(){
			this.myProp = false;
			this.myElseProp = false;
			var ret = dot.div(
				dot.div("OUTER1")
				.if(()=>this.myProp, ()=>dot
					.p("A"))
				.elseif(()=>this.myElseProp, ()=>dot
					.p("B"))
				.else(()=>dot
					.p("C"))
				.div("OUTER2")
			);
			return ret;
		},
		ready(){
			this.myProp = true;
			
		},
		props:["myProp", "myElseProp"]
	});
	
	return dot.h(MyComp());
}, "<div><div>OUTER1</div><p>A</p><div>OUTER2</div></div>");