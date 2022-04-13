// import { ClassPrefix, eachK, isF, str } from "./dot-util";
// import ERR from "./err";
// import ObservableArray from "./observable-array";
// import { AttrArgCallback } from "./arg-callback-obj";

// /** How it works:
//  * 
//  * DotComponent represents the prototype for all components.
//  * You create a component with dot.component().
//  * This creates a new class (CC), which acts as the prototype to that component.
//  * The prototype of CC is set to a new DotComponent.
//  * Instantiating the component creates a new CC.
//  * This CC is the `this` for each method of the component.
//  * 
//  * 
//  * */ 

// /** How computed props work.
//  * 
//  * If a computed property has a dependency on a regular property, 
//  * assigning the computed property to an element will cause the regular property's getter to trigger, establishing the dependency.
//  * */

// function DotComponent(){
// 	this.$el = null;
// 	this.$refs = {};
// 	this.__handlers = {};
// }

// DotComponent.prototype.__addHandler = function(eventName, event){
// 	var h = this.__handlers[eventName];
// 	if(!h) h = this.__handlers[eventName] = [];
// 	h.push(event);
// }

// var dot, _p, _D;







// /**
 
//  */
// export function addComponent(prms: ComponentParams){
	
// 	// Setting this potentially allows automatic code completion to get the method signature from builder. 
// 	// var comp = prms.builder;

// 	let n = prms.name;

// 	n && (componentNames[n] = 1);
// 	var CC = function(){
// 		DotComponent.call(this);
// 		this.rawProps = {};
// 		this.__propDependencies = {};
// 		this.__prms = prms;
// 	}
// 	CC.prototype = Object.create(DotComponent.prototype);
// 	CC.prototype.constructor = CC;



	

// 	prms.registered && prms.registered.apply(CC.prototype);

// 	return comp;
// };

// // export function removeComponent(name){
// // 	if(componentNames[name]){
// // 		delete componentNames[name];
// // 		delete dot[name];
// // 		delete _p[name];
// // 	}
// // }