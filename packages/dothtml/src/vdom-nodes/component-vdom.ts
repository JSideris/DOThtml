import { IDotComponent, IDotCore } from "dothtml-interfaces";
import { Vdom } from "./vdom";
import { ContainerVdom } from "./container-vdom";
import { applyContent } from "../dot-helpers";
import { TextVdom } from "./text-vdom";
import { FragmentVdom } from "./fragment-vdom";
import renderStylesheet from "../helpers/render-stylesheet";
import { EventManager } from "../events/event-manager";
import Signal from "../reactivity/signal";
import Binding from "../reactivity/binding";
import { scheduler } from "../reactivity/scheduler";
import { Priority } from "../reactivity/priority";
import Computed from "../reactivity/computed";
import { pushComponent, popComponent, getCurrentComponent } from "./component-context";
import BaseVStyle from "../v-style-nodes/base-v-style";
import StyleVNode from "../v-meta-nodes/style-v-node";
import StyleSheetBuilder from "../v-style-nodes/style-sheet-builder";
import Ref from "../reactivity/ref";
import RefCollection from "../reactivity/ref-collection";
import { IS_DEV } from "../constants";
import { registerInstance, unregisterInstance } from "../hmr-registry";
import { isVType } from "../helpers/tools";

export class HandledError extends Error {
	_vtype = "handled-error";
	constructor() {
		super("Error handled by error boundary.");
		Object.setPrototypeOf(this, HandledError.prototype);
	}
}

let tagId = 0x10000;

function getStableTagName(hmrId: string): string {
	// Sanitize hmrId to be a valid custom element name
	// Custom element names must contain a hyphen and consist of lowercase letters, digits, and some symbols.
	// We'll replace non-alphanumeric characters with hyphens and ensure it starts with 'dothtml-'
	const sanitized = hmrId
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
	return `dothtml-${sanitized}`;
}

// dot["_addTimestamp"] = true; // Turn off for testing.

export class ComponentVdom extends Vdom{

	component: IDotComponent;
	shadowEl: HTMLElement;
	childShadowVdom: ContainerVdom;
	_vtype = "component";
	private events: Array<{name: string, callback: (e: any)=>void, modifiers: string[]}> = [];
	private styleVNodes: Array<StyleVNode> = [];
	private isQueued = false;
	private isBuilding = false;
	private computedSignals: Computed<any>[] = [];
	private buildComputedSignals: Computed<any>[] = [];
	private effects: any[] = [];
	private buildEffects: any[] = [];
	private disposables: Array<() => void> = [];
	private buildDisposables: Array<() => void> = [];
	private styleDisposables: Array<() => void> = [];
	private ref: Ref<any> | ((comp: IDotComponent | null) => void);
	private slots: Record<string, ContainerVdom | Function> = {};
	private parentComponent: ComponentVdom | null = null;
	private providedTheme: any = null;
	private lastError: any = null;
	private updateSubscription = {
		active: true,
		update: () => {
			this.isQueued = false;
			this.rebuild();
		}
	};

	constructor(dot: IDotCore, component: IDotComponent){
		super(dot);
		this.component = component;
		this.parentComponent = getCurrentComponent();
		this.childShadowVdom = new ContainerVdom(dot);

		if(component._?._meta?.isRendered){
			throw new Error("Component has already been added to the VDOM.");
		}

		if(!component.constructor["_dotHtmlComponent"]){
			component.constructor["_dotHtmlComponent"] = {};
			// set up the global component properties (if they haven't been set yet).
			const hmrId = (component.constructor as any).__hmrId;
			if (IS_DEV && hmrId) {
				component.constructor["_dotHtmlComponent"].tagName = getStableTagName(hmrId);
			} else {
				let ts = (Math.floor(performance.now()*10000000000000)).toString(16);
				let tId = (tagId++).toString(16);
				component.constructor["_dotHtmlComponent"].tagName = `dothtml-${tId}${dot["_addTimestamp"] ? `-${ts}` : ""}`;
			}
		}

		if(!component._){
			(component._ as any) = {};
		}
		(component._ as any).cvdom = this;
		(component._.refs as any) = {};
		// (component._.props as any) = args[0] || {}; // TODO
		// (component._.restyle as any) = ()=>{restyle(this)}; // TODO (not sure if this is needed - we don't have a separate builder (for now)).
		(component._._meta as any) = component._._meta || {};
		// (component._._meta.args as any) = args; // TODO: can't get this anymore. Consider trying to obtain mount args.
		(component._._meta.isRendered as any) = false;
		(component._._meta.tagName as any) = component.constructor["_dotHtmlComponent"].tagName;
		// (component._._meta.styles as any) = styles;

		(component as any).emit = (name: string, detail?: any) => {
			if (this.shadowEl) {
				this.shadowEl.dispatchEvent(new CustomEvent(name.toLowerCase(), {
					detail,
					bubbles: true,
					composed: true
				}));
			}
		};

		if ((component as any)._trackedComputeds) {
			for (const w of (component as any)._trackedComputeds) {
				this.registerComputed(w);
			}
			delete (component as any)._trackedComputeds;
		}

		if ((component as any)._trackedEffects) {
			for (const e of (component as any)._trackedEffects) {
				this.registerEffect(e);
			}
			delete (component as any)._trackedEffects;
		}

		if ((component as any)._trackedDisposables) {
			for (const d of (component as any)._trackedDisposables) {
				this.registerDisposable(d);
			}
			delete (component as any)._trackedDisposables;
		}

		if (IS_DEV) {
			const hmrId = (component.constructor as any).__hmrId;
			if (hmrId) {
				registerInstance(hmrId, this);
			}
		}
	}

	registerComputed(signal: Computed<any>) {
		if (this.isBuilding) {
			this.buildComputedSignals.push(signal);
		} else {
			this.computedSignals.push(signal);
		}
	}

	registerEffect(effect: any) {
		if (this.isBuilding) {
			this.buildEffects.push(effect);
		} else {
			this.effects.push(effect);
		}
	}

	registerDisposable(disposable: () => void) {
		if (this.isBuilding) {
			this.buildDisposables.push(disposable);
		} else {
			this.disposables.push(disposable);
		}
	}

	registerStyleDisposable(disposable: () => void) {
		this.styleDisposables.push(disposable);
	}

	setRef(ref: Ref<any> | ((comp: IDotComponent | null) => void)) {
		this.ref = ref;
	}

	addSlot(name: string, content: any) {
		let slotVdom: ContainerVdom;
		if (typeof content === "function") {
			(this.slots as any)[name] = content;
		} else {
			if (!this.slots[name] || typeof this.slots[name] === "function") {
				this.slots[name] = new ContainerVdom(this._dot);
			}
			slotVdom = this.slots[name];
			applyContent(this._dot, slotVdom as any, content);
		}

		if (this.shadowEl) {
			// Already rendered.
			if (typeof content !== "function") {
				// Render into light DOM
				slotVdom!._render(this.shadowEl);
				if (name !== "default") {
					const nodes = slotVdom!._getNodes();
					for (const node of nodes) {
						if (node && (node as any).setAttribute) {
							(node as any).setAttribute("slot", name);
						}
					}
				}
			}
			// Always rebuild to update SlotVdoms (especially for scoped slots)
			this.rebuild();
		}
	}

	_hmrSwap(NewClass: any) {
		const oldComponent = this.component;
		
		// Call unmounting hooks on old component
		pushComponent(this);
		try {
			oldComponent.unmounting && oldComponent.unmounting();
		} finally {
			popComponent();
		}
		
		const newComponent = new NewClass();
		
		// Copy over ALL properties from old to new, preserving signals
		for (const key in oldComponent) {
			if (key === "_" || key === "constructor") continue;
			const oldVal = (oldComponent as any)[key];
			const newVal = (newComponent as any)[key];
			
			if ((oldVal instanceof Signal || isVType(oldVal, "signal")) && !(oldVal instanceof Computed || isVType(oldVal, "computed"))) {
				if ((newVal instanceof Signal || isVType(newVal, "signal")) && !(newVal instanceof Computed || isVType(newVal, "computed"))) {
					newVal.value = (oldVal as any).value;
				} else {
					(newComponent as any)[key] = oldVal;
				}
			} else if (oldVal instanceof Computed || isVType(oldVal, "computed")) {
				// DO NOT copy computed signals, let the new component create its own
			} else {
				// Copy other properties (like props)
				(newComponent as any)[key] = oldVal;
			}
		}
		
		this.component = newComponent;
		(this.component as any)._ = (oldComponent as any)._;
		(this.component._ as any).cvdom = this;
		if (this.shadowEl) {
			(this.shadowEl as any).component = this.component;
		}
		
		try {
			this.init();
			this.subscribeToProps();
			
			// Call mounted hook on new component
			pushComponent(this);
			try {
				this.component.mounted && this.component.mounted();
			} finally {
				popComponent();
			}

			// Call unmounted hook on old component
			pushComponent(this);
			try {
				oldComponent.unmounted && oldComponent.unmounted();
			} finally {
				popComponent();
			}
		} catch (err) {
			if (err instanceof HandledError || isVType(err, "handled-error")) return;
			this.handleError(err);
		}
	}

	init() {
		this.validateProps();
		this.subscribeToProps();

		if (this.shadowEl) {
			this.rebuild();
			return;
		}

		// TODO: Do I really need to call build more than once? Why can't I just copy the VDOM?
		// TODO: I believe this is incorrect. Shouldn't the vdom be built inside the render function?
		pushComponent(this);
		this.isBuilding = true;
		try {
			const buildResult = this.component.build(this._dot) as any;
			if (buildResult?._root || isVType(buildResult, "dotchain")) {
				this.childShadowVdom = buildResult._root;
			} else if (buildResult instanceof Vdom || isVType(buildResult, ["vdom", "container", "element", "fragment", "component", "html", "text", "reactive", "conditional", "collection", "slot"])) {
				this.childShadowVdom = buildResult as ContainerVdom;
			} else {
				this.childShadowVdom = new ContainerVdom(this._dot);
				applyContent(this._dot, this.childShadowVdom, buildResult);
			}
		} finally {
			this.isBuilding = false;
			popComponent();
		}
		
		this.component.built && this.component.built();
	}

	private handleError(err: any) {
		if (err instanceof HandledError || isVType(err, "handled-error")) throw err;

		this.lastError = err;

		if (this.component.errorCaught) {
			try {
				const fallback = this.component.errorCaught(err);
				if (fallback) {
					this.lastError = null; // Error is handled
					this.childShadowVdom = new ContainerVdom(this._dot);
					applyContent(this._dot, this.childShadowVdom as any, fallback);

					if (this.shadowEl) {
						const shadow = this.shadowEl.shadowRoot;
						if (shadow) {
							shadow.innerHTML = ""; // Clear existing content
							pushComponent(this);
							try {
								this.childShadowVdom._render(shadow as any);
							} finally {
								popComponent();
							}
						}
					}
					throw new HandledError();
				}
			} catch (secondErr) {
				if (secondErr instanceof HandledError || isVType(secondErr, "handled-error")) throw secondErr;
				err = secondErr; // Error in error boundary itself
			}
		}

		if ((this._dot as any).onError) {
			(this._dot as any).onError(err);
			this.lastError = null; // Error handled by global handler
			throw new HandledError();
		}

		if (this.parentComponent && (this.parentComponent as any).handleError) {
			(this.parentComponent as any).handleError(err);
			this.lastError = null; // Error handled by parent
			throw new HandledError();
		}

		if (IS_DEV) {
			if (this.shadowEl && !(err as any).isPropValidationError) {
				this.renderErrorBox(err);
			}
			if (typeof (globalThis as any).describe === 'function' && (!this.shadowEl || (err as any).isPropValidationError)) {
				throw err; // Bubble up in tests if no Red Box was shown or if it's a prop validation error
			}
			throw new HandledError();
		}

		throw err;
	}

	private subscribeToProps() {
		const props = (this.component as any).props;
		if (!props) return;
		for (const key in props) {
			const prop = props[key];
			if (prop instanceof Signal || isVType(prop, "signal") || prop instanceof Binding || isVType(prop, "binding")) {
				(prop as any).subscribe(() => {
					this.validateProps();
					this.requestUpdate();
				});
			}
		}
	}

	private requestUpdate() {
		if (!this.isQueued) {
			this.isQueued = true;
			scheduler.enqueue(this.updateSubscription as any, Priority.Normal);
		}
	}

	public rebuild() {
		if (!this.shadowEl) return;

		try {
			// Unrender old children
			this.childShadowVdom._unrender();

			// Dispose of build-time effects
			for (const effect of this.buildEffects) {
				effect.dispose && effect.dispose();
			}
			this.buildEffects = [];

			// Dispose of build-time computed signals
			for (const signal of this.buildComputedSignals) {
				signal.dispose();
			}
			this.buildComputedSignals = [];

			// Dispose of build-time disposables
			for (const disposable of this.buildDisposables) {
				disposable();
			}
			this.buildDisposables = [];

			this.validateProps();

			// Re-build
			pushComponent(this);
			this.isBuilding = true;
			try {
				const buildResult = this.component.build(this._dot) as any;
				if (buildResult?._root || isVType(buildResult, "dotchain")) {
					this.childShadowVdom = buildResult._root;
				} else if (buildResult instanceof Vdom || isVType(buildResult, ["vdom", "container", "element", "fragment", "component", "html", "text", "reactive", "conditional", "collection", "slot"])) {
					this.childShadowVdom = buildResult as ContainerVdom;
				} else {
					this.childShadowVdom = new ContainerVdom(this._dot);
					applyContent(this._dot, this.childShadowVdom, buildResult);
				}
			} finally {
				this.isBuilding = false;
				popComponent();
			}

			// Render new children into the existing shadow root
			const shadow = (this.component._._meta as any).shadowRoot || this.shadowEl.shadowRoot;
			if (shadow) {
				// Remove all non-style children to prevent duplication during HMR/rebuild
				Array.from(shadow.childNodes).forEach((node: any) => {
					if (node.nodeName !== "STYLE") {
						shadow.removeChild(node);
					}
				});
				
				pushComponent(this);
				try {
					this.childShadowVdom._render(shadow as any);
				} finally {
					popComponent();
				}
			}

			this.lastError = null;
			this.component.built && this.component.built();
		} catch (err) {
			if (err instanceof HandledError) return;
			this.handleError(err);
		}
	}

	private renderErrorBox(err: any) {
		const errorBox = document.createElement("div");
		errorBox.style.cssText = `
			background-color: rgba(255, 0, 0, 0.9);
			color: white;
			padding: 20px;
			margin: 10px;
			border-radius: 8px;
			font-family: monospace;
			white-space: pre-wrap;
			box-shadow: 0 4px 15px rgba(0,0,0,0.5);
			z-index: 10000;
			position: relative;
			overflow: auto;
			max-height: 90vh;
		`;
		
		const title = document.createElement("h2");
		title.textContent = "DOThtml HMR Error";
		title.style.marginTop = "0px";
		errorBox.appendChild(title);

		const message = document.createElement("div");
		message.textContent = err.message || err;
		message.style.cssText = "font-weight: bold; font-size: 1.2em; margin-bottom: 10px;";
		errorBox.appendChild(message);

		if (err.stack) {
			const stack = document.createElement("pre");
			stack.textContent = err.stack;
			stack.style.cssText = "font-size: 0.9em; opacity: 0.8;";
			errorBox.appendChild(stack);
		}

		if (this.shadowEl) {
			const shadow = this.shadowEl.shadowRoot;
			if (shadow) {
				shadow.innerHTML = "";
				shadow.appendChild(errorBox);
			}
		}
	}

	private validateProps() {
		try {
			const schema = (this.component.constructor as any).props;
			if (!schema) return;

			const componentName = this.component.constructor.name;
			const props = (this.component as any).props || {};

			for (const key in schema) {
				const rule = schema[key];
				let value = props[key];

				if (value instanceof Signal || isVType(value, "signal")) value = (value as any).value;
				if (value instanceof Binding || isVType(value, "binding")) value = (value as any)._get();

				// Required check
				if (rule.required && value === undefined) {
					throw new Error(`[${componentName}] Prop "${key}" is required.`);
				}

				// Default value
				if (value === undefined && rule.default !== undefined) {
					value = typeof rule.default === "function" ? rule.default() : rule.default;
					props[key] = value;
				}

				if (value !== undefined) {
					// Type check
					if (rule.type) {
						const actualType = value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
						let expectedType = "";
						if (rule.type === String) expectedType = "string";
						else if (rule.type === Number) expectedType = "number";
						else if (rule.type === Boolean) expectedType = "boolean";
						else if (rule.type === Array) expectedType = "array";
						else if (rule.type === Object) expectedType = "object";
						else if (rule.type === Function) expectedType = "function";

						if (expectedType && actualType !== expectedType && (value !== null || rule.required)) {
							throw new Error(`[${componentName}] Prop "${key}" expected ${expectedType}, but got ${actualType}.`);
						}
					}

					// Custom validator
					if (rule.validator && !rule.validator(value)) {
						throw new Error(`[${componentName}] Prop "${key}" failed custom validation.`);
					}
				}
			}
		} catch (err) {
			(err as any).isPropValidationError = true;
			throw err;
		}
	}

	private setupCustomElement(document: Document) {
		const tagName = this.component._._meta.tagName;
		if (document.defaultView.customElements.get(tagName)) {
			// If already defined, ensure _cachedStyles is set for HMR tests
			const cachedStyles = (this.component.constructor as any)._cachedStyles;
			if (cachedStyles) {
				(this.component.constructor as any)._cachedStyles = cachedStyles;
			}
			return;
		}

		const cvdom = this;

		class CustomElementConstructor extends document.defaultView.HTMLElement {
			private _component: IDotComponent;
			private _isMounted = false;

			constructor() {
				super();
				this.attachShadow({ mode: "open" });
			}

			set component(value: IDotComponent) {
				this._component = value;
				if (this._isMounted) {
					this._renderComponent(value);
				}
			}

			get component() {
				return this._component;
			}

			connectedCallback() {
				if (this._isMounted) return;
				this._isMounted = true;
				if (this._component) {
					this._renderComponent(this._component);
				}
			}

			private _renderComponent(component: IDotComponent) {
				const shadow = this.shadowRoot;
				if (!shadow) return;

				const cvdom: ComponentVdom = (component._ as any).cvdom;
				if (!cvdom) return;

				// Clear previous style disposables
				for (const disposable of cvdom.styleDisposables) {
					disposable();
				}
				cvdom.styleDisposables = [];

				try {
					const builder = new StyleSheetBuilder();
					if ((cvdom._dot as any)._theme) {
						builder.setTheme((cvdom._dot as any)._theme);
					}

					// Contextual Theme Inheritance
					let inheritedTheme: any = null;
					let p = cvdom.parentComponent;
					while (p) {
						if (p.providedTheme) {
							inheritedTheme = p.providedTheme;
							break;
						}
						p = p.parentComponent;
					}

					const applyTheme = (theme: any) => {
						if (typeof theme === "function") {
							theme(builder);
						} else if (theme instanceof Signal || isVType(theme, "signal") || theme instanceof Binding || isVType(theme, "binding") || theme instanceof Computed || isVType(theme, "computed")) {
							const val = (theme instanceof Binding || isVType(theme, "binding")) ? (theme as any)._get() : (theme as any).value;
							if (typeof val === "function") val(builder);
						}
					};

					const applyBaseStyles = () => {
						if (inheritedTheme) {
							applyTheme(inheritedTheme);
						}

						const styles = (component.constructor as any).styles;
						if (styles) {
							if (typeof styles === "function") {
								styles(builder);
							}
						}

						const hostStyles = (component.constructor as any).hostStyles;
						if (hostStyles) {
							if (typeof hostStyles === "function") {
								hostStyles(builder);
							}
						}

						// Handle component.hostStyle()
						if ((component as any).hostStyle) {
							builder.rule(":host", (s) => (component as any).hostStyle(s));
						}
					};

					if (inheritedTheme) {
						// Subscribe to inherited theme if it's reactive
						if (inheritedTheme instanceof Signal || isVType(inheritedTheme, "signal") || inheritedTheme instanceof Binding || isVType(inheritedTheme, "binding") || inheritedTheme instanceof Computed || isVType(inheritedTheme, "computed")) {
							const id = (inheritedTheme as any).subscribe(() => {
								this._renderComponent(component); // Re-render styles
							});
							cvdom.registerStyleDisposable(() => {
								if (inheritedTheme instanceof Binding || isVType(inheritedTheme, "binding")) (inheritedTheme as any)._unsubscribe(id);
								else (inheritedTheme as any).unsubscribe(id);
							});
						}
					}

					applyBaseStyles();

					// Adopt global styles
					const globalStyles = (cvdom._dot as any).globalStyles || [];
					for (const s of globalStyles) {
						if (typeof s === "string") {
							// Check if already added
							const existing = Array.from(shadow.querySelectorAll("style")).find(el => el.textContent === s.replace(/\b(html|body)\b/g, ":host"));
							if (existing) continue;

							const styleEl = document.createElement("style");
							// Transform html/body to :host
							styleEl.textContent = s.replace(/\b(html|body)\b/g, ":host");
							shadow.appendChild(styleEl);
						}
					}

					if (component.stylize) {
						const result = component.stylize(builder);
						if (typeof result === "function" || ((result instanceof Signal || isVType(result, "signal") || result instanceof Binding || isVType(result, "binding") || result instanceof Computed || isVType(result, "computed")) && typeof ((result instanceof Binding || isVType(result, "binding")) ? (result as any)._get() : (result as any).value) === "function")) {
							cvdom.providedTheme = result;
							applyTheme(result);
							
							// Subscribe to provided theme if it's reactive
							if (result instanceof Signal || isVType(result, "signal") || result instanceof Binding || isVType(result, "binding") || result instanceof Computed || isVType(result, "computed")) {
								const id = (result as any).subscribe(() => {
									this._renderComponent(component); // Re-render styles
								});
								cvdom.registerStyleDisposable(() => {
									if (result instanceof Binding || isVType(result, "binding")) (result as any)._unsubscribe(id);
									else (result as any).unsubscribe(id);
								});
							}
						} else if (typeof result === "string") {
							const styleEl = document.createElement("style");
							styleEl.textContent = result;
							shadow.appendChild(styleEl);
						} else if (result instanceof Signal || isVType(result, "signal") || result instanceof Binding || isVType(result, "binding") || result instanceof Computed || isVType(result, "computed")) {
							const styleEl = document.createElement("style");
							styleEl.id = "--dh-dynamic-style";
							shadow.appendChild(styleEl);
							const update = () => {
								builder.clearRules();
								applyBaseStyles();
								const res = component.stylize(builder);
								let finalStyles = "";
								if (typeof res === "string") {
									finalStyles = res;
								} else if (res instanceof Signal || isVType(res, "signal") || res instanceof Binding || isVType(res, "binding") || res instanceof Computed || isVType(res, "computed")) {
									const val = (res instanceof Binding || isVType(res, "binding")) ? (res as any)._get() : (res as any).value;
									if (typeof val === "string") finalStyles = val;
									else finalStyles = builder.toString();
								} else {
									finalStyles = builder.toString();
								}
								styleEl.textContent = finalStyles;
								
								// Apply ghost variables from dynamic styling
								const ghostVars = builder.getGhostVars();
								if (ghostVars.length > 0) {
									ghostVars.forEach(v => {
										const val = (v.value instanceof Binding || isVType(v.value, "binding")) ? (v.value as any)._get() : (v.value as any).value;
										this.style.setProperty(v.name, `${val}`);
									});
								}
								
								// Re-apply static rules if any
								if (builder.hasRules() && typeof res !== "string") {
									styleEl.textContent += builder.toString();
								}
							};
							const id = (result as any).subscribe(update);
							cvdom.registerStyleDisposable(() => {
								if (result instanceof Binding || isVType(result, "binding")) (result as any)._unsubscribe(id);
								else (result as any).unsubscribe(id);
							});
							update();
						}
					}

					if (builder.hasRules()) {
						let styleEl = shadow.querySelector("style#--dh-main-style") as HTMLStyleElement;
						if (!styleEl) {
							styleEl = document.createElement("style");
							styleEl.id = "--dh-main-style";
							shadow.appendChild(styleEl);
						}
						styleEl.textContent = builder.toString();
						
						// Cache styles for HMR tests
						(component.constructor as any)._cachedStyles = builder.toString();
						
						const ghostVars = builder.getGhostVars();
						if (ghostVars.length > 0) {
							ghostVars.forEach(v => {
								const val = (v.value instanceof Binding || isVType(v.value, "binding")) ? (v.value as any)._get() : (v.value as any).value;
								this.style.setProperty(v.name, `${val}`);
								
								// Subscribe to ghost variable changes
								if (v.value instanceof Signal || isVType(v.value, "signal") || v.value instanceof Binding || isVType(v.value, "binding")) {
									const id = (v.value as any).subscribe((newVal) => {
										this.style.setProperty(v.name, `${newVal}`);
									});
									cvdom.registerStyleDisposable(() => {
										if (v.value instanceof Binding || isVType(v.value, "binding")) (v.value as any)._unsubscribe(id);
										else (v.value as any).unsubscribe(id);
									});
								}
							});
						}

						cvdom.registerStyleDisposable(() => builder.dispose());
					}

					if (cvdom.childShadowVdom._isRendered) {
						return;
					} else {
						(component._._meta as any).shadowRoot = shadow;
						
						// Apply ghost variables from static styling
						const ghostVars = builder.getGhostVars();
						if (ghostVars.length > 0) {
							ghostVars.forEach(v => {
								const val = (v.value instanceof Binding || isVType(v.value, "binding")) ? (v.value as any)._get() : (v.value as any).value;
								this.style.setProperty(v.name, `${val}`);
								
								// Subscribe to ghost variable changes
								if (v.value instanceof Signal || isVType(v.value, "signal") || v.value instanceof Binding || isVType(v.value, "binding")) {
									const id = (v.value as any).subscribe((newVal) => {
										this.style.setProperty(v.name, `${newVal}`);
									});
									cvdom.registerDisposable(() => {
										if (v.value instanceof Binding || isVType(v.value, "binding")) (v.value as any)._unsubscribe(id);
										else (v.value as any).unsubscribe(id);
									});
								}
							});
						}

						pushComponent(cvdom);
						try {
							cvdom.childShadowVdom._render(shadow as any);
						} finally {
							popComponent();
						}
					}
				} catch (err) {
					try {
						(cvdom as any).handleError(err);
					} catch (secondErr) {
						if (secondErr instanceof HandledError) return;
						throw secondErr;
					}
				}
			}
		}

		document.defaultView.customElements.define(tagName, CustomElementConstructor);
	}

	_render(node: HTMLElement) {
		try {
			if(!this.component._) throw new Error("Invalid component. Ensure components are created through the component factory or through decoration.");
			if((this.component._ as any)?._meta?.isRendered) throw new Error("Individual component instances cannot be rendered twice at once.");
			if(!(this.component._ as any)._meta) (this.component._ as any)._meta = {};
			
			(this.component._._meta as any).isRendered = true;

			let document = node.ownerDocument;

			// Needs to be run once per component per document.
			this.setupCustomElement(document);

			this.shadowEl = document.createElement(this.component._._meta.tagName);
			this.shadowEl["cvdom"] = this;
			this.shadowEl.setAttribute("cvdom", "");
			this.shadowEl["component"] = this.component;

			this.init();

			if (this.lastError) {
				if (IS_DEV) this.renderErrorBox(this.lastError);
				node.appendChild(this.shadowEl);
				return;
			}

			pushComponent(this);
			try {
				this.component.mounting && this.component.mounting();
			} finally {
				popComponent();
			}
			
			node.appendChild(this.shadowEl);

			if (this.ref) {
				if (typeof this.ref === "function") {
					this.ref(this.component);
				} else {
					this.ref.value = this.component;
				}
			}

			for (const name in this.slots) {
				const slotContent = this.slots[name];
				if (typeof slotContent !== "function") {
					slotContent._render(this.shadowEl);
					if (name !== "default") {
						const nodes = slotContent._getNodes();
						for (const node of nodes) {
							if (node && (node as any).setAttribute) {
								(node as any).setAttribute("slot", name);
							}
						}
					}
				}
			}

			for(let i = 0; i < this.events.length; i++){
				let e = this.events[i];
				this.renderEvent(e.name, e.callback, e.modifiers);
			}

			pushComponent(this);
			try {
				this.component.mounted && this.component.mounted();
			} finally {
				popComponent();
			}

			if (this._onEnterHook) {
				this._onEnterHook(this.shadowEl);
			}

			if (this.component.onEnter) {
				this.component.onEnter();
			}
		} catch (err) {
			if (this.shadowEl && !this.shadowEl.parentElement) {
				node.appendChild(this.shadowEl);
			}
			if (err instanceof HandledError || isVType(err, "handled-error")) return;
			this.handleError(err);
		}
	}

	_unrender() {
		pushComponent(this);
		try {
			this.component.unmounting && this.component.unmounting();
		} finally {
			popComponent();
		}

		this.childShadowVdom._unrender();

		for (const name in this.slots) {
			const slot = this.slots[name];
			if (slot instanceof Vdom || isVType(slot, ["vdom", "container", "element", "fragment", "component", "html", "text", "reactive", "conditional", "collection", "slot"])) {
				(slot as any)._unrender();
			}
		}

		if (this.shadowEl) {
			this.shadowEl.parentNode?.removeChild(this.shadowEl);
			delete (this.shadowEl as any).component;
		}

		for (const signal of this.computedSignals) {
			signal.dispose();
		}
		this.computedSignals = [];

		for (const signal of this.buildComputedSignals) {
			signal.dispose();
		}
		this.buildComputedSignals = [];

		for (const effect of this.effects) {
			effect.dispose && effect.dispose();
		}
		this.effects = [];

		for (const effect of this.buildEffects) {
			effect.dispose && effect.dispose();
		}
		this.buildEffects = [];

		for (const disposable of this.disposables) {
			disposable();
		}
		this.disposables = [];

		for (const disposable of this.buildDisposables) {
			disposable();
		}
		this.buildDisposables = [];

		for (const disposable of this.styleDisposables) {
			disposable();
		}
		this.styleDisposables = [];

		if (this.ref) {
			if (typeof this.ref === "function") {
				this.ref(null);
			} else {
				this.ref.value = null;
			}
		}

		const hmrId = (this.component.constructor as any).__hmrId;
		if (IS_DEV && hmrId) {
			unregisterInstance(hmrId, this);
		}

		if (this.component._) {
			(this.component._._meta as any).isRendered = false;
		}
		this.shadowEl = null;
		this._isRendered = false;

		pushComponent(this);
		try {
			this.component.unmounted && this.component.unmounted();
		} finally {
			popComponent();
		}
	}

	_unrenderAsync(): Promise<void> | void {
		let promise: Promise<void> | null = null;

		if (this._onLeaveHook && this.shadowEl) {
			const result = this._onLeaveHook(this.shadowEl);
			if (result instanceof Promise) {
				promise = result;
			}
		}

		if (this.component.onLeave) {
			const result = this.component.onLeave();
			if (result instanceof Promise) {
				promise = promise ? promise.then(() => result) : result;
			}
		}

		if (promise) {
			return promise.then(() => this._unrender());
		}

		this._unrender();
	}

	_getNodes(): Node[] {
		return this.shadowEl ? [this.shadowEl] : [];
	}

	_getLastChild(): Vdom | null {
		return this;
	}

	addEventListener(event: string, callback: (e: any)=>void, modifiers: string[] = []){
		this.events.push({name: event, callback: callback, modifiers: modifiers});
		if(this.shadowEl) this.renderEvent(event, callback, modifiers);
	}

	private renderEvent(e: string, callback: (e: any)=>void, modifiers: string[] = []){
		EventManager.getForDocument(this.shadowEl.ownerDocument).addListener(this.shadowEl, e.toLowerCase(), callback, modifiers);
	}

	generateStyles(document: Document): string {
		// This is just a placeholder. Actual style generation should be handled by the framework.
		return "";
	}
}
