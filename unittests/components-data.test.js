import addTest from "./core";
import dot from "../src/index";

// For testing the passing of data into and out of components via properties and events, respectively.

addTest("Pass value into component.", function(){
	const MyComp = dot.component({
		builder(){
			this.myProp = 1;
			var ret = dot.span(()=>this.myProp);
			return ret;
		},
		props:["myProp"]
	});
    
	var myComp = MyComp();
    myComp.myProp = 2;
	return dot.h(myComp);
}, "<span>2</span>");

// TODO
// addTest("Binding value into component.", function(){
// 	const MyComp = dot.component({
// 		builder(){
// 			this.myProp = 1;
// 			var ret = dot.span(()=>this.myProp);
// 			return ret;
// 		},
// 		props:["myProp"]
// 	});
    
// 	var myComp = MyComp();
//     myComp.myProp = 2;
// 	return dot.h(myComp);
// }, "<span>2</span>");

addTest("Raise event from component.", function(){
	const MyComp = dot.component({
		builder(){
			this.myProp = 1;
			var ret = dot.span(()=>this.myProp);
			return ret;
		},
        props:["myProp"],
        events:["go"],
        ready(){
            this.go(5);
        }
	});
    
    var myComp = MyComp();
    myComp.myProp = 2;
    myComp.onGo(x=>myComp.myProp=x);
	return dot.h(myComp);
}, "<span>5</span>");

addTest("Raise 2 events from component.", function(){
	const MyComp = dot.component({
		builder(){
			this.myProp = "1";
			var ret = dot.span(()=>this.myProp);
			return ret;
		},
        props:["myProp"],
        events:["go2"],
        ready(){
            this.go2("3");
            this.go2("4");
        }
	});
    
    var myComp = MyComp();
    myComp.myProp = 2;
    myComp.onGo2(x=>myComp.myProp+=x);
	return dot.h(myComp);
}, "<span>234</span>");

addTest("Call a method from outside a component.", function(){
	const MyComp = dot.component({
		builder(){
			this.myProp = 1;
			var ret = dot.span(()=>this.myProp);
			return ret;
		},
        props:["myProp"],
        methods:{
            go(v){
                this.myProp = v;
            }
        }
	});
    
    var myComp = MyComp();
    myComp.myProp = 2;
    myComp.go(5);
	return dot.h(myComp);
}, "<span>5</span>");