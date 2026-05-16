import { IDotCss } from "dothtml-interfaces";
import cssProps from "../css/css-props";
import VMetaNode from "./v-meta-node";
import CssFunctionBuilderVStyle from "../v-style-nodes/css-function-builder-v-style";
import FilterVStyle from "../v-style-nodes/filter-v-style";
import TransformVStyle from "../v-style-nodes/transform-v-style";
import { formatCssLength } from "../css/format-css-type";
import Binding from "../reactivity/binding";
import BaseVStyle from "../v-style-nodes/base-v-style";
import { scheduler } from "../reactivity/scheduler";
import { Priority } from "../reactivity/priority";

import Watcher from "../reactivity/watcher";

export default class StyleVNode extends VMetaNode {
	target: HTMLElement | string;
	document: Document;
	shadowRoot: ShadowRoot;
	styleSource: IDotCss | BaseVStyle;
	private styleElement: HTMLStyleElement;

	private observables: Array<Binding> = [];
	private observableIds: Array<number> = [];
	private isQueued = false;
	private updateSubscription = {
		active: true,
		update: () => {
			this.isQueued = false;
			this.applyStyles();
		}
	};

	constructor(styleSource: IDotCss | BaseVStyle) {
		super();
		this.styleSource = styleSource;

		if (this.styleSource instanceof BaseVStyle) {
			this.styleSource._setOnUpdate(() => this.update());
		}

		this.extractObservables();
	}

	private extractObservables() {
		const source = this.styleSource instanceof BaseVStyle ? this.styleSource.getProps() : this.styleSource;

		if (Array.isArray(source)) {
			// It's from BaseVStyle.getProps()
			for (let i = 0; i < source.length; i++) {
				let p = source[i];
				this.processValue(p.prop, p.value, (newVal) => p.value = newVal);
			}
		} else {
			// It's a plain IDotCss object.
			for (let prop in source) {
				this.processValue(prop, source[prop], (newVal) => source[prop] = newVal);
			}
		}
	}

	private processValue(prop: string, value: any, setter: (v: any) => void) {
		if (!this.tryExtractObservable(value)) {
			if (typeof value === "object" && value !== null && !(value instanceof CssFunctionBuilderVStyle)) {
				// Handle nested builders like filter: { blur: 5 }
				let builder: CssFunctionBuilderVStyle;
				switch (prop) {
					case "filter": {
						builder = new FilterVStyle(prop);
						break;
					}
					case "transform": {
						builder = new TransformVStyle(prop);
						break;
					}
				}

				if (builder) {
					let funcArray = Array.isArray(value) ? value : [value];
					for (let funcValue of funcArray) {
						for (let k in funcValue) {
							let v = funcValue[k];
							this.tryExtractObservable(v);
							if (Array.isArray(v)) {
								for (let w of v) {
									this.tryExtractObservable(w);
								}
							}

							if (typeof builder[k] === "function") {
								if (Array.isArray(v)) {
									builder[k](...v);
								} else {
									builder[k](v);
								}
							}
						}
					}
					setter(builder);
				}
			}
		}
	}

	private tryExtractObservable(value: any): boolean {
		if (value instanceof Binding || value instanceof Watcher) {
			if (this.observables.indexOf(value as any) === -1) {
				this.observables.push(value as any);
				if (this.target) {
					// If already rendered, subscribe immediately.
					let id = (value as any).subscribe(() => this.update());
					this.observableIds.push(id);
				}
			}
			return true;
		}
		return false;
	}

	render(target: HTMLElement | string, document: Document = window.document, shadowRoot?: ShadowRoot) {
		this.target = target;
		this.document = document;
		this.shadowRoot = shadowRoot;

		for (let observable of this.observables) {
			let id = (observable as any).subscribe(() => this.update());
			this.observableIds.push(id);
		}

		if (typeof target === "string") {
			this.styleElement = this.document.createElement("style");
			if (this.shadowRoot) {
				this.shadowRoot.appendChild(this.styleElement);
			} else {
				this.document.head.appendChild(this.styleElement);
			}
		}

		this.applyStyles();
	}

	update() {
		if (!this.isQueued) {
			this.isQueued = true;
			scheduler.enqueue(this.updateSubscription as any, Priority.Normal);
		}
	}

	private applyStyles() {
		if (!this.target) return;

		if (typeof this.target === "string") {
			if (this.styleElement) {
				this.styleElement.textContent = `${this.target} { ${this.getStyleString()} }`;
			}
		} else {
			this.extractObservables();

			const source = this.styleSource instanceof BaseVStyle ? this.styleSource.getProps() : this.styleSource;

			if (Array.isArray(source)) {
				for (const p of source) {
					const value = p.value instanceof Binding ? p.value._get() : (p.value instanceof Watcher ? p.value.value : p.value);
					this.applySingleStyle(p.prop, value);
				}
			} else {
				for (let prop in source) {
					const value = source[prop] instanceof Binding ? source[prop]._get() : (source[prop] instanceof Watcher ? source[prop].value : source[prop]);
					this.applySingleStyle(prop, value);
				}
			}
		}
	}

	private applySingleStyle(prop: string, value: any) {
		let cssValue;
		if (value instanceof CssFunctionBuilderVStyle) {
			cssValue = value.toString();
		} else {
			cssValue = value;
		}

		let cssProp = prop;
		let cssUnit = undefined;

		const registeredProp = cssProps[prop];
		if (registeredProp) {
			cssProp = registeredProp.cssName;
			cssUnit = registeredProp.unit;
			if (registeredProp.type === "length" && typeof cssValue === "number") {
				cssValue = formatCssLength(cssValue, cssUnit);
			}
		}

		if (this.target instanceof HTMLElement) {
			this.target.style.setProperty(cssProp, `${cssValue}`);
		}
	}

	private getStyleString(): string {
		let styles = "";
		const source = this.styleSource instanceof BaseVStyle ? this.styleSource.getProps() : this.styleSource;

		if (Array.isArray(source)) {
			for (const p of source) {
				styles += this.formatSingleStyle(p.prop, p.value);
			}
		} else {
			for (let prop in source) {
				styles += this.formatSingleStyle(prop, source[prop]);
			}
		}
		return styles;
	}

	private formatSingleStyle(prop: string, value: any): string {
		let cssValue = value instanceof Binding ? value._get() : (value instanceof Watcher ? value.value : value);
		if (cssValue instanceof CssFunctionBuilderVStyle) {
			cssValue = cssValue.toString();
		}

		let cssProp = prop;
		let cssUnit = undefined;

		const registeredProp = cssProps[prop];
		if (registeredProp) {
			cssProp = registeredProp.cssName;
			cssUnit = registeredProp.unit;
			if (registeredProp.type === "length" && typeof cssValue === "number") {
				cssValue = formatCssLength(cssValue, cssUnit);
			}
		}
		return `${cssProp}: ${cssValue}; `;
	}

	unrender() {
		for (let i = 0; i < this.observableIds.length; i++) {
			let id = this.observableIds[i];
			let observable = this.observables[i];
			if (observable instanceof Binding) {
				(observable as any)._unsubscribe(id);
			} else {
				(observable as any)._detachBinding(id);
			}
		}
		this.observableIds = [];
		this.observables = [];
		
		if (this.styleElement) {
			this.styleElement.remove();
			this.styleElement = null;
		}

		this.target = null;
		this.updateSubscription.active = false;
	}

	toString() {
		if (typeof this.target === "string") {
			return `${this.target} { ${this.getStyleString()} }`;
		} else {
			return this.getStyleString();
		}
	}
}
