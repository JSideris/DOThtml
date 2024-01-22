import { IComponent } from "dothtml-interfaces";
import { Vdom } from "./vdom";
import { ContainerVdom } from "./container-vdom";

export class ComponentVdom extends Vdom{

	component: IComponent;
	shadowEl: HTMLElement;
	childShadowVdom: ContainerVdom;
	sharedStyles: CSSStyleSheet;

	constructor(component: IComponent){
		super();
		this.component = component;

		
		this.component.creating && this.component.creating();
		this.childShadowVdom = this.component.build && this.component.build(...component._._meta.args) as unknown as ContainerVdom;
		this.component.built && this.component.built();

	}

	private setupCustomElement(component: IComponent, document: Document){

		let customElementConstructor = document.defaultView.customElements.get(component._._meta.tagName);

		if(customElementConstructor == undefined){

			
			customElementConstructor = class extends HTMLElement{
				private _component: IComponent;
				set component(value: IComponent){
					this._component = value;
					this._renderComponent();
				}

				cvdom: ComponentVdom;

				_renderComponent(){
					// let vdom = this._component.build(...this._component._._meta.args);
					if(this.cvdom instanceof Vdom){
						let shadow = this.attachShadow({ mode: 'open' });
						(this._component._._meta as any).shadowRoot = shadow;
						this.cvdom.childShadowVdom._render(shadow as any);
						console.log("Shadow INNERHTML???", shadow.innerHTML);
					}
					else{
						throw new Error("Component build function returned invalid object.");
					}

				}
			}

			document.defaultView.customElements.define(component._._meta.tagName, customElementConstructor);
		}

		// return customElementConstructor;
	}

	_render(node: HTMLElement) {
		if(!this.component._) throw new Error("Invalid component. Ensure components are created through the component factory or through decoration.");
		if((this.component._ as any)?._meta?.isRendered) throw new Error("Individual component instances cannot be rendered twice at once.");
		if(!(this.component._ as any)._meta) (this.component._ as any)._meta = {};
		(this.component._._meta as any).isRendered = true;

		let document = node.ownerDocument;

		// Needs to be run once per component per document.
		this.setupCustomElement(this.component, document);

		this.shadowEl = document.createElement(this.component._._meta.tagName);
		this.shadowEl["cvdom"] = this;
		this.shadowEl["component"] = this.component;
		
		this.component._.restyle && this.component._.restyle();
		
		node.appendChild(this.shadowEl);
	}

	_unrender() {
		this.component.deleting && this.component.deleting();

		this.childShadowVdom._unrender();
		this.childShadowVdom = null;
		this.shadowEl.remove();
		this.shadowEl = null;

		(this.component._._meta as any).isRendered = false;
		this.component.deleted && this.component.deleted();
	}

	toString(){
		// TODO: would be nice to have something more sophisitacetd. 
		// It doesn't even handle slots.
		return `<${this.component._._meta.tagName}></${this.component._._meta.tagName}>`;
	}
}