import BaseVStyle from "./base-v-style";

export interface IStylePropHost {
	formatPropsForBlock(style: BaseVStyle): string;
}

export default class KeyframesBuilder {
	private steps: Array<{ selector: string, style: BaseVStyle }> = [];

	constructor(private sheet: IStylePropHost) {}

	private step(selector: string, callback: (s: BaseVStyle) => void) {
		const style = new BaseVStyle();
		callback(style);
		this.steps.push({ selector, style });
		return this;
	}

	from(callback: (s: BaseVStyle) => void) {
		return this.step("from", callback);
	}

	to(callback: (s: BaseVStyle) => void) {
		return this.step("to", callback);
	}

	at(percent: number | string, callback: (s: BaseVStyle) => void) {
		const selector = typeof percent === "number" ? `${percent}%` : percent;
		return this.step(selector, callback);
	}

	toString(indent: string = "") {
		return this.steps.map(s =>
			`${indent}${s.selector} { ${this.sheet.formatPropsForBlock(s.style)} }`
		).join("\n");
	}
}
