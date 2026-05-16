import BaseVStyle from "./base-v-style";
import cssProps from "../css/css-props";
import { formatCssLength } from "../css/format-css-type";

export default class StyleSheetBuilder {
	private rules: Array<{ selector: string, style: BaseVStyle }> = [];

	class(name: string, callback: (s: BaseVStyle) => void) {
		return this.rule(`.${name}`, callback);
	}

	rule(selector: string, callback: (s: BaseVStyle) => void) {
		const style = new BaseVStyle();
		callback(style);
		this.rules.push({ selector, style });
		return this;
	}

	toString() {
		return this.rules.map(r => {
			const props = r.style.getProps().map(p => {
				const registered = cssProps[p.prop];
				let cssProp = p.prop;
				let cssValue = p.value;
				if (registered) {
					cssProp = registered.cssName;
					if (registered.type === "length" && typeof p.value === "number") {
						cssValue = formatCssLength(p.value, registered.unit);
					} else if (registered.unit && typeof p.value === "number") {
						cssValue = `${p.value}${registered.unit}`;
					}
				}
				return `${cssProp}: ${cssValue};`;
			}).join(" ");
			return `${r.selector} { ${props} }`;
		}).join("\n");
	}

	hasRules() {
		return this.rules.length > 0;
	}
}
