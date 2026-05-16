import BaseVStyle from "./base-v-style";
import cssProps from "../css/css-props";
import { formatCssLength } from "../css/format-css-type";
import Signal from "../reactivity/signal";
import Binding from "../reactivity/binding";


type StyleRule = 
	| { type: "rule", selector: string, style: BaseVStyle }
	| { type: "media", condition: string, builder: StyleSheetBuilder };

export default class StyleSheetBuilder {
	private rules: Array<StyleRule> = [];

	class(name: string, callback: (s: BaseVStyle) => void) {
		return this.rule(`.${name}`, callback);
	}

	rule(selector: string, callback: (s: BaseVStyle) => void) {
		const style = new BaseVStyle();
		callback(style);
		this.rules.push({ type: "rule", selector, style });
		return this;
	}

	media(condition: string, callback: (s: StyleSheetBuilder) => void) {
		const builder = new StyleSheetBuilder();
		callback(builder);
		this.rules.push({ type: "media", condition, builder });
		return this;
	}

	/**
	 * Returns a CSS variable reference string.
	 * @param name The name of the variable (e.g., "my-color" or "--my-color").
	 * @returns A string in the format "var(--name)".
	 */
	v(name: string): string {
		if (!name.startsWith("--")) name = "--" + name;
		return `var(${name})`;
	}

	toString(indent: string = "") {
		return this.rules.map(r => {
			if (r.type === "media") {
				return `${indent}@media ${r.condition} {\n${r.builder.toString(indent + "  ")}\n${indent}}`;
			}

			const props = r.style.getProps().map(p => {
				const registered = cssProps[p.prop];
				let cssProp = p.prop;
				let cssValue = p.value;

				if (cssValue instanceof Signal || cssValue instanceof Binding) {
					throw new Error(`[DOThtml] Reactive values (Signals/Bindings) cannot be used directly in stylize(). Use CSS variables instead. Prop: "${p.prop}" in selector: "${r.selector}"`);
				}

				if (registered) {
					cssProp = registered.cssName;
					if ((registered.type === "length" || registered.type === "hybrid") && typeof p.value === "number") {
						if (registered.type === "hybrid" && registered.unit === undefined) {
							// Leave as unitless number
						} else {
							cssValue = formatCssLength(p.value, registered.unit);
						}
					} else if (registered.unit && typeof p.value === "number") {
						cssValue = `${p.value}${registered.unit}`;
					}
				}
				return `${cssProp}: ${cssValue};`;
			}).join(" ");
			return `${indent}${r.selector} { ${props} }`;
		}).join("\n");
	}

	hasRules() {
		return this.rules.length > 0;
	}
}
