import dot from "dothtml";
import { IDotElement, IDotGenericElement } from "dothtml/lib/i-dot";

let d1 = ["a", "b", "c"];
let d2 = ["1", "2", "3"];

export default class HomePage extends dot.Component{
	builder(...args: any[]): IDotElement<IDotGenericElement> {
		throw new Error("Method not implemented.");
	}

}