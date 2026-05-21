import Binding from "../reactivity/binding";
import Signal from "../reactivity/signal";

export default abstract class CssFunctionBuilderVStyle{

	funcs: Array<{
		func: string,
		args: Array<{v: number|boolean|string|Binding, f: (v:number|boolean|string|Binding)=>string}>
	}> = [];
	readonly propName: string;

	constructor(propName: string){
		this.propName = propName;
	}

	toString(): string {
		let result = "";

		// Set the bindings.
		for (let t of this.funcs) {
			let argValues = Array.from(t.args).map(arg => {
				let v = (arg as any).v !== undefined ? (arg as any).v : arg;
				let f = (arg as any).f || ((val) => `${val}`);

				if (v instanceof Binding) {
					return f(v._get());
				} else if (v instanceof Signal) {
					return f(v.value);
				}
				else {
					return f(v).toString().split(" ").join(", ");
				}
			}).join(", ");


			result += `${t.func}(${argValues}) `;
		}

		return result.trim();
	}

	appendFunction(filter: string, args){
		this.funcs.push({func: filter, args: args});
		return this;
	}

}
