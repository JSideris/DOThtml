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

export default class StyleVNode extends VMetaNode {
	target: HTMLElement;
	document: Document;
	shadowRoot: ShadowRoot;
	styleSource: IDotCss | BaseVStyle;

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

		this.extractObservables();
	}

	private extractObservables() {
		const source = this.styleSource instanceof BaseVStyle ? this.styleSource.getProps() : this.styleSource;

		if (Array.isArray(source)) {
			// It's from BaseVStyle.getProps()
			for (const p of source) {
				if (p.value instanceof Binding) {
					this.observables.push(p.value);
				}
				// TODO: handle nested builders in BaseVStyle if they are ever added.
			}
		} else {
			// It's a plain IDotCss object.
			for (let prop in source) {
				let value = source[prop];
				if (value instanceof Binding) {
					this.observables.push(value);
				}
				else if (typeof value === "object" && value !== null && !(value instanceof Binding)) {
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
								if (v instanceof Binding) {
									this.observables.push(v);
								}
								else if (Array.isArray(v)) {
									for (let w of v) {
										if (w instanceof Binding) this.observables.push(w);
									}
								}

								if (builder[k]) builder[k](v);
							}
						}
						source[prop] = builder;
					}
				}
			}
		}
	}

	render(target: HTMLElement | string, document: Document = window.document, shadowRoot?: ShadowRoot) {
		if (typeof target === "string") {
			// TODO: Support string targets (selectors) in Phase 2/3.
			return;
		}
		this.target = target;
		this.document = document;
		this.shadowRoot = shadowRoot;

		for (let observable of this.observables) {
			let id = observable._subscribe(this);
			this.observableIds.push(id);
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

		const source = this.styleSource instanceof BaseVStyle ? this.styleSource.getProps() : this.styleSource;

		if (Array.isArray(source)) {
			for (const p of source) {
				const value = p.value instanceof Binding ? p.value._get() : p.value;
				this.applySingleStyle(p.prop, value);
			}
		} else {
			for (let prop in source) {
				const value = source[prop] instanceof Binding ? source[prop]._get() : source[prop];
				this.applySingleStyle(prop, value);
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

		// Check if it's a registered property to get the correct CSS name and unit.
		const registeredProp = cssProps[prop];
		if (registeredProp) {
			cssProp = registeredProp.cssName;
			cssUnit = registeredProp.unit;
			if (registeredProp.type === "length" && typeof cssValue === "number") {
				cssValue = formatCssLength(cssValue, cssUnit);
			}
		}

		if (cssProp.startsWith("--")) {
			this.target.style.setProperty(cssProp, `${cssValue}`);
		} else {
			// Use setProperty for consistency, even for standard props.
			this.target.style.setProperty(cssProp, `${cssValue}`);
		}
	}

	unrender() {
		for (let i = 0; i < this.observableIds.length; i++) {
			this.observables[i]._unsubscribe(this.observableIds[i]);
		}
		this.observableIds = [];
		this.observables = [];
		this.target = null;
		this.updateSubscription.active = false;
	}

	toString() {
		// TODO: Implement toString for SSR or debugging.
		return "";
	}
}
