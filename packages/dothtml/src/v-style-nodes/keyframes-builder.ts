import BaseVStyle from "./base-v-style";
import { IAtKeyframesBuilder, IDotStyleBuilder } from "dothtml-interfaces";

export interface IStylePropHost {
	formatPropsForBlock(style: BaseVStyle): string;
}

export default class KeyframesBuilder implements IAtKeyframesBuilder {
	private steps: Array<{ selector: string, style: BaseVStyle }> = [];

	constructor(private sheet: IStylePropHost) {}

	private step(selector: string, callback: (s: IDotStyleBuilder) => void) {
		const style = new BaseVStyle();
		callback(style as unknown as IDotStyleBuilder);
		this.steps.push({ selector, style });
		return this;
	}

	from(callback: (s: IDotStyleBuilder) => void) {
		return this.step("from", callback);
	}

	to(callback: (s: IDotStyleBuilder) => void) {
		return this.step("to", callback);
	}

	at(percent: number | string, callback: (s: IDotStyleBuilder) => void) {
		const selector = typeof percent === "number" ? `${percent}%` : percent;
		return this.step(selector, callback);
	}

	toString(indent: string = "") {
		return this.steps.map(s =>
			`${indent}${s.selector} { ${this.sheet.formatPropsForBlock(s.style)} }`
		).join("\n");
	}
}
