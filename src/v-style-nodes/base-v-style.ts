import Binding from "../reactivity/binding";
import Watcher from "../reactivity/watcher";
import VStyle from "./v-style";
import cssProps from "../css/css-props";

export default class BaseVStyle extends VStyle {

	// Used internally to indicate that this is the base style builder.
	// Calling style functions on this object will create (and return) a new BaseVStyle, rather than extend this one.
	private readonly _isBase = false;
	private props: Array<{ prop: string, value: any }> = [];

	_render(target: HTMLElement) {
		// No-op. StyleVNode handles rendering now.
	}
	_unrender() {
		// No-op. StyleVNode handles unrendering now.
	}
	updateProp(prop: string, value: string) {
		// No-op. StyleVNode handles updates now.
	}

	setProp(propName: string, value: any) {
		if (this._isBase) {
			let newStyle = new BaseVStyle();
			return newStyle.setProp(propName, value);
		}
		else {
			this.props.push({ prop: propName, value: value });
			return this;
		}
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

	getProps() {
		return this.props;
	}
}

// Generate fluent methods from cssProps.
for (let key in cssProps) {
	const prop = cssProps[key];
	BaseVStyle.prototype[key] = function (value: any) {
		// If it's a length property with a unit, we might want to handle it specially later.
		// For now, just pass it through.
		return this.setProp(prop.cssName, value);
	};
}
