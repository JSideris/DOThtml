import { IDotComponent, IDotCore } from "dothtml-interfaces";
import { Vdom } from "./vdom";
import { ContainerVdom } from "./container-vdom";
import renderStylesheet from "../helpers/render-stylesheet";
import { EventManager } from "../events/event-manager";

let tagId = 0x10000;

// dot["_addTimestamp"] = true; // Turn off for testing.

export class ComponentVdom extends Vdom{

	component: IDotComponent;
	shadowEl: HTMLElement;
	childShadowVdom: ContainerVdom;
	private events: Array<{name: string, callback: (e: any)=>void, modifiers: string[]}> = [];

	constructor(dot: IDotCore, component: IDotComponent){
		super();
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

		// TODO: Do I really need to call build more than once? Why can't I just copy the VDOM?
		// TODO: I believe this is incorrect. Shouldn't the vdom be built inside the render function?
		this.childShadowVdom = this.component.build(dot) as unknown as ContainerVdom;
		this.component.built && this.component.built();

	}

	// Sets up the custom element for the component.
	private setupCustomElement(document: Document){
		let CustomElementConstructor = document.defaultView.customElements.get(this.component._._meta.tagName);
		if(CustomElementConstructor == undefined){
			
			// Constructed stylesheets.
			let styles: Array<string>|string = this.component.stylize && this.component.stylize() || [];
			if(typeof styles == "string") styles = [styles];
			let sharedStylesheets = [];
			let styleTags = [];
			if(styles){
				for(let i = 0; i < styles.length; i++){
					let styleItem = renderStylesheet(styles[i], document);
					if(styleItem instanceof document.defaultView.CSSStyleSheet){
						sharedStylesheets.push(styleItem);
					}
					else{
						styleTags.push(styleItem);
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
						shadow.adoptedStyleSheets = sharedStylesheets;
						for(let i = 0; i < styleTags.length; i++){
							shadow.appendChild(styleTags[i]);
						}
						(this._component._._meta as any).shadowRoot = shadow;
						this.cvdom.childShadowVdom._render(shadow as any);
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

		const eventManager = EventManager.getForDocument(this.shadowEl.ownerDocument);
		for(let i = 0; i < this.events.length; i++){
			let e = this.events[i];
			eventManager.removeListener(this.shadowEl, e.name.toLowerCase(), e.callback);
		}

		// this.childShadowVdom = null; // This makes sense only if shadow dom creation happens inside the render function (which it probably should?).
		this.shadowEl.remove();
		this.shadowEl = null;

		(this.component._._meta as any).isRendered = false;
		this.component.unmounted && this.component.unmounted();
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