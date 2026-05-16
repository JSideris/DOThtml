import BaseVStyle from "./base-v-style";
import cssProps from "../css/css-props";
import { formatCssLength } from "../css/format-css-type";
import Watcher from "../reactivity/watcher";
import Binding from "../reactivity/binding";

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

	/**
	 * Returns a CSS variable reference string.
	 * @param name The name of the variable (e.g., "my-color" or "--my-color").
	 * @returns A string in the format "var(--name)".
	 */
	v(name: string): string {
		if (!name.startsWith("--")) name = "--" + name;
		return `var(${name})`;
	}

	toString() {
		return this.rules.map(r => {
			const props = r.style.getProps().map(p => {
				const registered = cssProps[p.prop];
				let cssProp = p.prop;
				let cssValue = p.value;

				if (cssValue instanceof Watcher || cssValue instanceof Binding) {
					throw new Error(`[DOThtml] Reactive values (Watchers/Bindings) cannot be used directly in stylize(). Use CSS variables instead. Prop: "${p.prop}" in selector: "${r.selector}"`);
				}

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
