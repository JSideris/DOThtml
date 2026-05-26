import Binding from "../reactivity/binding";
import Signal from "../reactivity/signal";
import cssProps from "../css/css-props";
import { IDotStyleBuilder } from "dothtml-interfaces";

export default class BaseVStyle implements IDotStyleBuilder {
	[key: string]: any;
	_vtype = "base-v-style";

	// Used internally to indicate that this is the base style builder.
	// Calling style functions on this object will create (and return) a new BaseVStyle, rather than extend this one.
	private readonly _isBase = false;
	private props: Array<{ prop: string, value: any }> = [];
	private onUpdate: () => void;

	setProp(propName: string, value: any) {
		if (this._isBase) {
			let newStyle = new BaseVStyle();
			return newStyle.setProp(propName, value);
		}
		else {
			this.props.push({ prop: propName, value: value });
			if (this.onUpdate) this.onUpdate();
			return this;
		}
	}

	_setOnUpdate(callback: () => void) {
		this.onUpdate = callback;
	}

	/**
	 * Sets a CSS variable (custom property).
	 * @param name The name of the variable (e.g., "my-color" or "--my-color").
	 * @param value The value of the variable.
	 */
	variable(name: string, value: any) {
		if (!name.startsWith("--")) name = "--" + name;
		return this.setProp(name, value);
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

	getProps() {
		return this.props;
	}
}

// Generate fluent methods from cssProps.
for (let key in cssProps) {
	BaseVStyle.prototype[key] = function (value: any) {
		// If it's a length property with a unit, we might want to handle it specially later.
		// For now, just pass it through.
		return this.setProp(key, value);
	};
}
