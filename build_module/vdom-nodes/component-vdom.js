import { Vdom } from "./vdom";
export class ComponentVdom extends Vdom {
    constructor(component) {
        super();
        this.component = component;
        this.component.creating && this.component.creating();
        this.childShadowVdom = this.component.build && this.component.build(...component._._meta.args);
        this.component.built && this.component.built();
    }
    setupCustomElement(component, document) {
        let customElementConstructor = document.defaultView.customElements.get(component._._meta.tagName);
        if (customElementConstructor == undefined) {
            customElementConstructor = class extends HTMLElement {
                set component(value) {
                    this._component = value;
                    this._renderComponent();
                }
                _renderComponent() {
                    if (this.cvdom instanceof Vdom) {
                        let shadow = this.attachShadow({ mode: 'open' });
                        this._component._._meta.shadowRoot = shadow;
                        this.cvdom.childShadowVdom._render(shadow);
                        console.log("Shadow INNERHTML???", shadow.innerHTML);
                    }
                    else {
                        throw new Error("Component build function returned invalid object.");
                    }
                }
            };
            document.defaultView.customElements.define(component._._meta.tagName, customElementConstructor);
        }
    }
    _render(node) {
        if (!this.component._)
            throw new Error("Invalid component. Ensure components are created through the component factory or through decoration.");
        if (this.component._?._meta?.isRendered)
            throw new Error("Individual component instances cannot be rendered twice at once.");
        if (!this.component._._meta)
            this.component._._meta = {};
        this.component._._meta.isRendered = true;
        let document = node.ownerDocument;
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
        this.component._._meta.isRendered = false;
        this.component.deleted && this.component.deleted();
    }
    toString() {
        return `<${this.component._._meta.tagName}></${this.component._._meta.tagName}>`;
    }
}
//# sourceMappingURL=component-vdom.js.map