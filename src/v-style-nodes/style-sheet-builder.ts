import BaseVStyle from "./base-v-style";
import cssProps from "../css/css-props";
import { formatCssLength } from "../css/format-css-type";
import Signal from "../reactivity/signal";
import Binding from "../reactivity/binding";
import Computed from "../reactivity/computed";
import CssFunctionBuilderVStyle from "./css-function-builder-v-style";
import FilterVStyle from "./filter-v-style";
import TransformVStyle from "./transform-v-style";


type StyleRule = 
	| { type: "rule", selector: string, style: BaseVStyle }
	| { type: "media", condition: string, builder: StyleSheetBuilder };

export default class StyleSheetBuilder {
	private rules: Array<StyleRule> = [];
	public theme: any = null;
	private ghostVars: Array<{ name: string, value: Signal | Binding }> = [];
	private varCounter = 0;

	getGhostVars() {
		return this.ghostVars;
	}

	setTheme(theme: any) {
		this.theme = theme;
		return this;
	}

	template(strings: TemplateStringsArray, ...values: any[]) {
		return new Computed(() => {
			let result = "";
			for (let i = 0; i < strings.length; i++) {
				result += strings[i];
				if (i < values.length) {
					let val = values[i];
					if (val instanceof Signal || val instanceof Binding) {
						result += val instanceof Binding ? val._get() : val.value;
					} else {
						result += val;
					}
				}
			}
			return result;
		});
	}

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

				if (typeof cssValue === "object" && cssValue !== null && !(cssValue instanceof CssFunctionBuilderVStyle) && !(cssValue instanceof Signal) && !(cssValue instanceof Binding)) {
					// Handle nested builders like filter: { blur: 5 }
					let builder: CssFunctionBuilderVStyle;
					switch (p.prop) {
						case "filter": {
							builder = new FilterVStyle(p.prop);
							break;
						}
						case "transform": {
							builder = new TransformVStyle(p.prop);
							break;
						}
					}

					if (builder) {
						let funcArray = Array.isArray(cssValue) ? cssValue : [cssValue];
						for (let funcValue of funcArray) {
							for (let k in funcValue) {
								let v = funcValue[k];
								let methodKey = k.replace(/_\d+$/, "");
								if (typeof builder[methodKey] === "function") {
									if (Array.isArray(v)) {
										builder[methodKey](...v);
									} else {
										builder[methodKey](v);
									}
								}
							}
						}
						cssValue = builder;
					}
				}

				if (cssValue instanceof Signal || cssValue instanceof Binding || cssValue instanceof CssFunctionBuilderVStyle) {
					// Check if it's actually reactive (CssFunctionBuilderVStyle might not be)
					let isReactive = cssValue instanceof Signal || cssValue instanceof Binding;
					if (cssValue instanceof CssFunctionBuilderVStyle) {
						for (const f of cssValue.funcs) {
							for (const arg of f.args) {
								if ((arg as any).v instanceof Signal || (arg as any).v instanceof Binding || arg instanceof Signal || arg instanceof Binding) {
									isReactive = true;
									break;
								}
							}
							if (isReactive) break;
						}
					}

					if (isReactive) {
						const varName = `--dh-v${++this.varCounter}`;
						const reactiveSource = cssValue;
						let reactiveValue: any = cssValue;

						// If it's a length property and we have a number signal, wrap it to add units.
						if (registered && (registered.type === "length" || registered.type === "hybrid") && !(reactiveSource instanceof CssFunctionBuilderVStyle)) {
							reactiveValue = new Computed(() => {
								const val = reactiveSource instanceof Binding ? reactiveSource._get() : (reactiveSource as any).value;
								if (typeof val === "number") {
									return formatCssLength(val, registered.unit);
								}
								return val;
							});
						} else if (reactiveSource instanceof CssFunctionBuilderVStyle) {
							reactiveValue = new Computed(() => {
								const val = reactiveSource.toString();
								return val;
							});
						}

						this.ghostVars.push({ name: varName, value: reactiveValue as any });
						cssValue = `var(${varName})`;
					}
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

	dispose() {
		for (const gv of this.ghostVars) {
			if (gv.value instanceof Computed) {
				gv.value.dispose();
			} else if (gv.value instanceof Binding && (gv.value as any)._source instanceof Computed) {
				(gv.value as any)._source.dispose();
			}
		}
		for (const r of this.rules) {
			if (r.type === "media") {
				r.builder.dispose();
			}
		}
	}
}
