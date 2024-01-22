import { DOT_VDOM_PROP_NAME } from "../constants";
import Reactive from "../reactive";
import { ContainerVdom } from "./container-vdom";
import { Vdom } from "./vdom";
export default class ElementVdom extends Vdom {
    constructor(tag) {
        super();
        this.children = null;
        this.tag = null;
        this.attributes = {};
        this.events = [];
        this.attributeObserverIds = [];
        this.tag = tag;
        this.children = new ContainerVdom();
        this.children._parent = this;
    }
    _render(node) {
        this.element = node.ownerDocument.createElement(this.tag);
        this.element[DOT_VDOM_PROP_NAME] = this;
        for (let a in this.attributes) {
            this.renderAttr(a, this.attributes[a], this.element);
        }
        node.appendChild(this.element);
        for (let i = 0; i < this.events.length; i++) {
            let e = this.events[i];
            this.renderEvent(e.name, e.callback);
        }
        if (this.children) {
            this.children._render(this.element);
        }
    }
    _unrender() {
        this.children._unrender();
        this.element.parentNode?.removeChild(this.element);
        this.element = null;
        for (let i = 0; i < this.attributeObserverIds.length; i++) {
            let item = this.attributeObserverIds[i];
            item.observable.detachBinding(item.id);
        }
        this.attributeObserverIds.length = 0;
    }
    toString() {
        if (this.element) {
            return this.element.outerHTML;
        }
        else {
            return super.toString();
        }
    }
    setAttr(attr, value) {
        this.attributes[attr] = value;
        if (this.element) {
            this.renderAttr(attr, value, this.element);
        }
    }
    renderAttr(attr, value, node) {
        if (typeof value === "string" || typeof value === "number") {
            node.setAttribute(attr, `${value}`);
        }
        else if (typeof value === "boolean" || value == null || value == undefined) {
            if (value)
                node.setAttribute(attr, `${value}`);
            else
                node.removeAttribute(attr);
        }
        else if (value instanceof Reactive) {
            this.renderAttr(attr, value.getValue(), node);
            let id = value.subscribeAttr(this, attr);
            this.attributeObserverIds.push({ id: id, observable: value });
            if (attr == "value" || attr == "checked") {
                this.element.addEventListener("input", (e) => {
                    value.setValue(this.element[attr]);
                });
            }
        }
        else {
        }
    }
    addEventListener(event, callback) {
        this.events.push({ name: event, callback: callback });
        if (this.element)
            this.renderEvent(event, callback);
    }
    renderEvent(e, callback) {
        this.element.addEventListener(e.toLowerCase(), callback);
    }
}
//# sourceMappingURL=element-vdom.js.map