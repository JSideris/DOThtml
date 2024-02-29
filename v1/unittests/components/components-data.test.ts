import addTest from "../core";
import {dot} from "../../src/dothtml";
import Component from "../../src/component";

// For testing the passing of data into and out of components via properties and events, respectively.

addTest("Prop default value.", function(){
	class MyComp extends Component{
		props = {
			myProp: 1
		}

		builder(){
			var ret = dot.span(()=>this.props.myProp);
			return ret;
		}
	};
    
	var myComp = new MyComp();
	return dot.h(myComp);
}, "<span>1</span>");

addTest("Pass value into component.", function(){
	class MyComp extends Component{
		props = {
			myProp: 0
		}

		constructor(){
			super();
			this.props.myProp = 1;
		}

		builder(){
			var ret = dot.span(()=>this.props.myProp);
			return ret;
		}
	};
    
	var myComp = new MyComp();
    myComp.props.myProp = 2;
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
	class MyComp extends Component{
		props = {
			myProp: 0
		}
		
		// events:["go"],
		events = {
			go: (number)=>undefined
		}

		constructor(){
			super();
			this.props.myProp = 1;
		}

		builder(){
			var ret = dot.span(()=>this.props.myProp);
			return ret;
		}

        ready(){
            this.events.go(5);
        }
	}
    
    var myComp = new MyComp();
    myComp.props.myProp = 2;
    myComp.on("go", x=>{
		myComp.props.myProp=x
	});
	// Experimented with this syntax. 
	// myComp.on(myComp.events.go, ()=>{})
	return dot.h(myComp);
}, "<span>5</span>");

addTest("Raise 2 events from component.", function(){
	class MyComp extends Component{
		constructor(){
			super();
			this.props.myProp = 1;
		}
		builder(){
			var ret = dot.span(()=>this.props.myProp);
			return ret;
		}

        props = {
			myProp: 0
		}

        events = {
			go2: (number) => undefined
		}

        ready(){
            this.events.go2("3");
            this.events.go2("4");
        }
	}
    
    var myComp = new MyComp();
    myComp.props.myProp = 2;
    myComp.on("go2", x=>myComp.props.myProp+=x);
	return dot.h(myComp);
}, "<span>234</span>");

addTest("Call a method from outside a component.", function(){
	class MyComp extends Component{
		constructor(){
			super();
			this.props.myProp = 1;
		}
		builder(){
			var ret = dot.span(()=>this.props.myProp);
			return ret;
		}
        props={
			myProp: 0
		};
        
		go(v){
			this.props.myProp = v;
		}

		
	}
    
    var myComp = new MyComp();
    myComp.props.myProp = 2;
    myComp.go(5);
	return dot.h(myComp);
}, "<span>5</span>");