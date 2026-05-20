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
import { pushComponent, popComponent } from "./component-context";
import BaseVStyle from "../v-style-nodes/base-v-style";
import StyleVNode from "../v-meta-nodes/style-v-node";
import StyleSheetBuilder from "../v-style-nodes/style-sheet-builder";
import Ref from "../reactivity/ref";

let tagId = 0x10000;

// dot["_addTimestamp"] = true; // Turn off for testing.

export class ComponentVdom extends Vdom{

	component: IDotComponent;
	shadowEl: HTMLElement;
	childShadowVdom: ContainerVdom;
	private events: Array<{name: string, callback: (e: any)=>void, modifiers: string[]}> = [];
	private styleVNodes: Array<StyleVNode> = [];
	private isQueued = false;
	private isBuilding = false;
	private computedSignals: Computed<any>[] = [];
	private buildComputedSignals: Computed<any>[] = [];
	private disposables: Array<() => void> = [];
	private ref: Ref<any> | ((comp: IDotComponent | null) => void);
	private slots: Record<string, ContainerVdom> = {};
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

		if(component._?._meta){
			throw new Error("Component has already been added to the VDOM.");
		}

		if(!component.constructor["_dotHtmlComponent"]){
			component.constructor["_dotHtmlComponent"] = {};
			// set up the global component properties (if they haven't been set yet).
			let ts = (Math.floor(performance.now()*10000000000000)).toString(16);
			let tId = (tagId++).toString(16);
			component.constructor["_dotHtmlComponent"].tagName = `dothtml-${tId}${dot["_addTimestamp"] ? `-${ts}` : ""}`;
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

		if ((component as any)._trackedDisposables) {
			for (const d of (component as any)._trackedDisposables) {
				this.registerDisposable(d);
			}
			delete (component as any)._trackedDisposables;
		}
	}

	registerComputed(signal: Computed<any>) {
		if (this.isBuilding) {
			this.buildComputedSignals.push(signal);
		} else {
			this.computedSignals.push(signal);
		}
	}

	registerDisposable(disposable: () => void) {
		this.disposables.push(disposable);
	}

	setRef(ref: Ref<any> | ((comp: IDotComponent | null) => void)) {
		this.ref = ref;
	}

	init() {
		this.validateProps();

		// TODO: Do I really need to call build more than once? Why can't I just copy the VDOM?
		// TODO: I believe this is incorrect. Shouldn't the vdom be built inside the render function?
		pushComponent(this);
		this.isBuilding = true;
		try {
			this.childShadowVdom = this.component.build(this._dot) as unknown as ContainerVdom;
		} finally {
			this.isBuilding = false;
			popComponent();
		}
		
		this.component.built && this.component.built();

		this.subscribeToProps();
	}

	private subscribeToProps() {
		const props = (this.component as any).props;
		if (!props) return;
		for (const key in props) {
			const prop = props[key];
			if (prop instanceof Signal || prop instanceof Binding) {
				prop.subscribe(() => this.requestUpdate());
			}
		}
	}

	private requestUpdate() {
		if (!this.isQueued) {
			this.isQueued = true;
			scheduler.enqueue(this.updateSubscription as any, Priority.Normal);
		}
	}

	private rebuild() {
		if (!this.shadowEl) return;

		// Unrender old children
		this.childShadowVdom._unrender();

		// Dispose of build-time computed signals
		for (const signal of this.buildComputedSignals) {
			signal.dispose();
		}
		this.buildComputedSignals = [];

		this.validateProps();

		// Re-build
		pushComponent(this);
		this.isBuilding = true;
		try {
			this.childShadowVdom = this.component.build(this._dot) as unknown as ContainerVdom;
		} finally {
			this.isBuilding = false;
			popComponent();
		}

		// Render new children into the existing shadow root
		const shadow = (this.component._._meta as any).shadowRoot;
		pushComponent(this);
		try {
			this.childShadowVdom._render(shadow);
		} finally {
			popComponent();
		}

		this.component.built && this.component.built();
	}

	private validateProps() {
		const schema = (this.component.constructor as any).props;
		if (!schema) return;

		const props = (this.component as any).props || {};
		const componentName = this.component.constructor.name;

		for (const key in schema) {
			const rule = schema[key];
			let value = props[key];

			// Apply default
			if (value === undefined && rule.default !== undefined) {
				if (typeof rule.default === "function" && (rule.type === Object || rule.type === Array)) {
					value = rule.default();
				} else {
					value = rule.default;
				}
				props[key] = value;
			}

			// Check required
			if (rule.required && value === undefined) {
				throw new Error(`[${componentName}] Prop "${key}" is required.`);
			}

			// Extract value for validation if it's a Signal or Binding
			let valueToValidate = value;
			if (value instanceof Signal || value instanceof Binding) {
				valueToValidate = value.value;
			}

			// Check type
			if (valueToValidate !== undefined && valueToValidate !== null && rule.type) {
				const actualType = typeof valueToValidate;
				if (rule.type === String && actualType !== "string") {
					throw new Error(`[${componentName}] Prop "${key}" expected string, but got ${actualType}.`);
				} else if (rule.type === Number && actualType !== "number") {
					throw new Error(`[${componentName}] Prop "${key}" expected number, but got ${actualType}.`);
				} else if (rule.type === Boolean && actualType !== "boolean") {
					throw new Error(`[${componentName}] Prop "${key}" expected boolean, but got ${actualType}.`);
				} else if (rule.type === Function && actualType !== "function") {
					throw new Error(`[${componentName}] Prop "${key}" expected function, but got ${actualType}.`);
				} else if (rule.type === Array && !Array.isArray(valueToValidate)) {
					throw new Error(`[${componentName}] Prop "${key}" expected array, but got ${actualType}.`);
				} else if (rule.type === Object && (actualType !== "object" || Array.isArray(valueToValidate))) {
					throw new Error(`[${componentName}] Prop "${key}" expected object, but got ${Array.isArray(valueToValidate) ? "array" : actualType}.`);
				}
			}

			// Custom validator
			if (valueToValidate !== undefined && typeof rule.validator === "function") {
				if (!rule.validator(valueToValidate)) {
					throw new Error(`[${componentName}] Prop "${key}" failed custom validation.`);
				}
			}
		}
		(this.component as any).props = props;
	}

	// Sets up the custom element for the component.
	private setupCustomElement(document: Document){
		let CustomElementConstructor = document.defaultView.customElements.get(this.component._._meta.tagName);
		if(CustomElementConstructor == undefined){
			
			// Check for cached styles on the constructor.
			let cachedStyles = (this.component.constructor as any)._cachedStyles;
			let sharedStylesheets = [];
			let styleTags = [];

			if (cachedStyles) {
				sharedStylesheets = cachedStyles.sharedStylesheets;
				styleTags = cachedStyles.styleTags;
			} else {
				// Constructed stylesheets.
				const builder = new StyleSheetBuilder();
				if ((this._dot as any)._theme) {
					builder.setTheme((this._dot as any)._theme);
				}
				let styles: any = this.component.stylize && (this.component.stylize as any)(builder) || [];

				if (styles instanceof Signal || styles instanceof Binding) {
					// Dynamic stylesheet. We'll handle this per-instance.
					(this.component.constructor as any)._isDynamicStyle = true;
					styles = null; 
				}

				if (styles === builder || (!styles && builder.hasRules())) {
					styles = builder.toString();
				}

				if(typeof styles == "string") styles = [styles];
				
				if(styles){
					for(let i = 0; i < styles.length; i++){
						let styleItem = renderStylesheet(styles[i], document);
						if(styleItem instanceof (document.defaultView as any).CSSStyleSheet){
							sharedStylesheets.push(styleItem);
						}
						else{
							styleTags.push(styleItem);
						}
					}
				}
				const ghostVars = builder.getGhostVars();
				// Cache them.
				(this.component.constructor as any)._cachedStyles = { sharedStylesheets, styleTags, ghostVars };
				builder.dispose();
			}

			// Add global styles.
			let allSharedStylesheets = [...sharedStylesheets];
			let allStyleTags = [...styleTags];
			let globalStyles = (this._dot as any).globalStyles || [];
			for (let gs of globalStyles) {
				if (gs instanceof (document.defaultView as any).CSSStyleSheet) {
					allSharedStylesheets.push(gs);
				} else if (typeof gs === "string") {
					// Transform html/body to :host for shadow dom.
					const transformedGs = gs.replace(/\b(html|body)(?=[\s,{.#[:]|$)/g, ':host');
					let styleItem = renderStylesheet(transformedGs, document);
					if (styleItem instanceof (document.defaultView as any).CSSStyleSheet) {
						allSharedStylesheets.push(styleItem);
					} else {
						allStyleTags.push(styleItem);
					}
				}
			}

			let DocSpecificHtmlEl = document.defaultView.HTMLElement;
			
			CustomElementConstructor = class extends DocSpecificHtmlEl{
				private _component: IDotComponent;
				set component(value: IDotComponent){
					this._component = value;
					this._renderComponent();
				}

				cvdom: ComponentVdom;

				_renderComponent(){
					if(this.cvdom instanceof Vdom){
						let shadow = this.attachShadow({ mode: 'open' });
						shadow.adoptedStyleSheets = [...allSharedStylesheets];
						for(let i = 0; i < allStyleTags.length; i++){
							shadow.appendChild(allStyleTags[i].cloneNode(true));
						}
						(this._component._._meta as any).shadowRoot = shadow;

						if ((this._component.constructor as any)._isDynamicStyle) {
							const updateDynamicStyle = () => {
								const builder = new StyleSheetBuilder();
								if ((this.cvdom._dot as any)._theme) {
									builder.setTheme((this.cvdom._dot as any)._theme);
								}
								const styles = (this._component.stylize as any)(builder);
								const styleVal = styles instanceof Binding ? styles._get() : (styles instanceof Signal ? styles.value : styles);
								
								let finalStyle = styleVal;
								if (styleVal === builder || (!styleVal && builder.hasRules())) {
									finalStyle = builder.toString();
								}

								// For dynamic styles, we'll use a dedicated style tag in the shadow root.
								let dynamicStyleTag = shadow.getElementById("--dh-dynamic-style") as HTMLStyleElement;
								if (!dynamicStyleTag) {
									dynamicStyleTag = document.createElement("style");
									dynamicStyleTag.id = "--dh-dynamic-style";
									shadow.appendChild(dynamicStyleTag);
								}
								dynamicStyleTag.textContent = finalStyle;
							};

							const styles = (this._component.stylize as any)(new StyleSheetBuilder());
							if (styles instanceof Signal || styles instanceof Binding) {
								const subId = (styles as any).subscribe(updateDynamicStyle);
								this.cvdom.registerDisposable(() => (styles as any).unsubscribe(subId));
							}
							updateDynamicStyle();
						}

						pushComponent(this.cvdom);
						try {
							this.cvdom.childShadowVdom._render(shadow as any);
						} finally {
							popComponent();
						}
					}
					else{
						throw new Error("Component build function returned invalid object.");
					}
				}
			}

			document.defaultView.customElements.define(this.component._._meta.tagName, CustomElementConstructor);

			// return customElementConstructor;
		}
	}

	addSlot(name: string, content: any) {
		if (typeof content === "function") {
			if (!(this.component as any).slots) (this.component as any).slots = {};
			(this.component as any).slots[name] = content;
			if (this.shadowEl) {
				this.requestUpdate();
			}
			return;
		}

		if (!this.slots[name]) {
			this.slots[name] = new ContainerVdom(this._dot);
		}
		
		applyContent(this._dot, this.slots[name] as any, content);
		
		if (this.shadowEl) {
			this.slots[name]._render(this.shadowEl);
			this.applySlotAttribute(name);
		}
	}

	private applySlotAttribute(name: string) {
		if (name !== "default") {
			const nodes = this.slots[name]._getNodes();
			for (const node of nodes) {
				if (node instanceof HTMLElement) {
					node.setAttribute("slot", name);
				}
			}
		}
	}

	_render(node: HTMLElement) {
		if(!this.component._) throw new Error("Invalid component. Ensure components are created through the component factory or through decoration.");
		if((this.component._ as any)?._meta?.isRendered) throw new Error("Individual component instances cannot be rendered twice at once.");
		if(!(this.component._ as any)._meta) (this.component._ as any)._meta = {};
		
		this.component.mounting && this.component.mounting();
		
		(this.component._._meta as any).isRendered = true;

		let document = node.ownerDocument;

		// Needs to be run once per component per document.
		this.setupCustomElement(document);

		this.shadowEl = document.createElement(this.component._._meta.tagName);
		this.shadowEl["cvdom"] = this;
		this.shadowEl["component"] = this.component;

		// Render slots into the light DOM
		pushComponent(this);
		try {
			for (const name in this.slots) {
				this.slots[name]._render(this.shadowEl);
				this.applySlotAttribute(name);
			}
		} finally {
			popComponent();
		}

		if(this.ref){
			if (typeof this.ref === "function") {
				this.ref(this.component);
			} else {
				this.ref.value = this.component;
			}
		}

		// Apply host styles if defined.
		if ((this.component as any).hostStyle) {
			const hostStyleBuilder = new BaseVStyle();
			(this.component as any).hostStyle(hostStyleBuilder);
			const hostStyleVNode = new StyleVNode(hostStyleBuilder);
			hostStyleVNode.render(this.shadowEl, document);
			this.styleVNodes.push(hostStyleVNode);
		}

		// Sync ghost variables.
		const cachedStyles = (this.component.constructor as any)._cachedStyles;
		if (cachedStyles && cachedStyles.ghostVars) {
			// We need to re-run stylize to get the bindings for THIS instance.
			const builder = new StyleSheetBuilder();
			if ((this._dot as any)._theme) {
				builder.setTheme((this._dot as any)._theme);
			}
			this.component.stylize && (this.component.stylize as any)(builder);
			builder.toString(); // Collect ghost variables
			const instanceGhostVars = builder.getGhostVars();

			for (const gv of instanceGhostVars) {
				// Register the Computed signal itself for disposal
				let valToRegister = gv.value;
				if (valToRegister instanceof Binding) {
					valToRegister = (valToRegister as any)._source;
				}
				if (valToRegister instanceof Computed) {
					this.registerComputed(valToRegister);
				}

				const updateSubscription = {
					active: true,
					update: () => {
						if (!this.shadowEl) return;
						const val = gv.value instanceof Binding ? gv.value._get() : (gv.value as any).value;
						this.shadowEl.style.setProperty(gv.name, `${val}`);
					}
				};
				const subId = (gv.value as any).subscribe(() => {
					scheduler.enqueue(updateSubscription as any, Priority.Normal);
				});
				this.registerDisposable(() => (gv.value as any).unsubscribe(subId));
				updateSubscription.update(); // Initial value
			}
		}

		this.component._.restyle && this.component._.restyle();
		
		node.appendChild(this.shadowEl);

		for(let i = 0; i < this.events.length; i++){
			let e = this.events[i];
			this.renderEvent(e.name, e.callback, e.modifiers);
		}

		this.component.mounted && this.component.mounted();
	}

	_unrender() {
		this.component.unmounting && this.component.unmounting();

		this.childShadowVdom._unrender();

		for (const name in this.slots) {
			this.slots[name]._unrender();
		}

		const eventManager = EventManager.getForDocument(this.shadowEl.ownerDocument);
		for(let i = 0; i < this.events.length; i++){
			let e = this.events[i];
			eventManager.removeListener(this.shadowEl, e.name.toLowerCase(), e.callback);
		}

		// this.childShadowVdom = null; // This makes sense only if shadow dom creation happens inside the render function (which it probably should?).
		this.shadowEl.remove();
		this.shadowEl = null;

		for (let i = 0; i < this.styleVNodes.length; i++) {
			this.styleVNodes[i].unrender();
		}
		this.styleVNodes = [];

		for (const signal of this.computedSignals) {
			signal.dispose();
		}
		this.computedSignals = [];

		for (const signal of this.buildComputedSignals) {
			signal.dispose();
		}
		this.buildComputedSignals = [];

		for (const disposable of this.disposables) {
			disposable();
		}
		this.disposables = [];

		(this.component._._meta as any).isRendered = false;
		this.component.unmounted && this.component.unmounted();

		if(this.ref){
			if (typeof this.ref === "function") {
				this.ref(null);
			} else {
				this.ref.value = null;
			}
		}
	}

	_getNodes(): Node[] {
		return this.shadowEl ? [this.shadowEl] : [];
	}

	_getLastChild(): Vdom | null {
		return this;
	}

	_moveTo(target: HTMLElement){
		const oldDoc = this.shadowEl?.ownerDocument;
		const newDoc = target.ownerDocument;
		
		if(oldDoc && newDoc && oldDoc !== newDoc){
			// Re-setup custom element in the new document
			this.setupCustomElement(newDoc);
		}
		
		super._moveTo(target);
	}

	addEventListener(event: string, callback: (e: any)=>void, modifiers: string[] = []){
		this.events.push({name: event, callback: callback, modifiers: modifiers});
		if(this.shadowEl) this.renderEvent(event, callback, modifiers);
	}

	private renderEvent(e: string, callback: (e: any)=>void, modifiers: string[] = []){
		EventManager.getForDocument(this.shadowEl.ownerDocument).addListener(this.shadowEl, e.toLowerCase(), callback, modifiers);
	}

	on(event: string, callback: (e: any)=>void){
		this.addEventListener(event, callback);
		return this;
	}

	toString(){
		// TODO: would be nice to have something more sophisitacetd. 
		// It doesn't even handle slots.
		return `<${this.component._._meta.tagName}></${this.component._._meta.tagName}>`;
	}
}
