import Reactive from "../reactive";
import VStyle from "./v-style";

export default abstract class CssFunctionBuilderVStyle{

	simpleValue: string;
	funcs: Array<{
		func: string,
		args: Array<{v: number|boolean|string|Reactive, f: (v:number|boolean|string|Reactive)=>string}>
	}> = [];
	readonly propName: string;
	subscriptions: Record<number, Reactive> = {};
	target: HTMLElement;

	constructor(propName: string){
		this.propName = propName;
	}

	toString(): string {
		let result = "";

		// Set the bindings.
		for(let t of this.funcs){
			// TODO: need to handle units and special types.
			let argValues = t.args.map(arg => {
				if(arg.v instanceof Reactive){
					return arg.f(arg.v.getValue());
				}
				else{
					return arg.f(arg.v).split(" ").join(", ");
				}
			}).join(", ");

			
			result += `${t.func}(${argValues}) `;
		}
		
		return result.trim();
	}

	// _render(target: HTMLElement) {
	// 	this.target = target;
	// 	let result = "";


	// 	// Set the bindings.
	// 	for(let i = 0; i < this.funcs.length; i++){
	// 		let t = this.funcs[i];
	// 		for(let k = 0; k < t.args.length; k++){
	// 			let arg = t.args[k];
	// 			if(arg.v instanceof Reactive){
	// 				let subscriptionId = arg.v.subscribeStyle(this, t.func);
	// 				this.subscriptions[subscriptionId] = arg.v;
	// 			}
	// 		}
	// 	}

	// 	// console.log("Setting prop", this.propName);
	// 	// console.log("Is simple?", this.simpleValue);

	// 	if(this.simpleValue){
	// 		result = this.simpleValue;
	// 		target.style[this.propName] = result;
	// 	}
	// 	else{
	// 		this.updateProp(null, null);
	// 	}
	// }

	// _unrender() {
	// 	for(let s in this.subscriptions){
	// 		this.subscriptions[s].detachBinding(Number(s));
	// 	}

	// 	this.subscriptions = {};

	// 	this.target = null;
	// }

	// There's no updating props. All you can do is rerender the whole thing.
	// updateProp(prop: string, value: string) {
	// 	throw new Error("Don't call updateProp.");
	// 	let isSimple = true;
	// 	let ret = "";

	// 	for(let i = 0; i < this.funcs.length; i++){
	// 		let t = this.funcs[i];
	// 		ret += t.func + "(";
	// 		for(let k = 0; k < t.args.length; k++){
	// 			let arg = t.args[k];
	// 			// let v = arg.f ? arg.f(arg.v) : arg.v;
	// 			let argVal = "";
	// 			if(arg.v instanceof Reactive){
	// 				argVal = arg.v.getValue();
	// 				isSimple = false;
	// 			}
	// 			else{
	// 				argVal = `${arg.v}`;
	// 			}

	// 			if(arg.f) argVal = arg.f(argVal);

	// 			ret += argVal.toString();
	// 		}
	// 		ret = ret.trim() + ") ";
	// 	}
	// 	ret = ret.trim();

	// 	if(isSimple){
	// 		this.simpleValue = ret;
	// 	}
	// 	this.target.style[this.propName] = ret;
	// }


	appendFunction(filter: string, args){
		this.funcs.push({func: filter, args: args});
		return this;
	}

}