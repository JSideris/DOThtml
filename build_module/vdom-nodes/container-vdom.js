import CollectionVdom from "./collection-vdom";
import { ConditionalVdom } from "./conditional-vdom";
import ElementVdom from "./element-vdom";
import { HtmlVdom } from "./html-vdom";
import { TextVdom } from "./text-vdom";
import { Vdom } from "./vdom";
import { ComponentVdom } from "./component-vdom";
export class ContainerVdom extends Vdom {
    constructor() {
        super();
        this._children = [];
        this._parent = null;
    }
    _addChild(content) {
        this._children.push(content);
        if (this._parent && this._parent instanceof ElementVdom && this._parent.element)
            content._render(this._parent.element);
        return this;
    }
    _render(node) {
        for (let c = 0; c < this._children.length; c++) {
            this._children[c]._render(node);
        }
    }
    _unrender() {
        for (let c = 0; c < this._children.length; c++) {
            this._children[c]._unrender();
        }
    }
    html(c) {
        let hn = new HtmlVdom(c);
        return this._addChild(hn);
    }
    text(c) {
        let tn = new TextVdom(c);
        return this._addChild(tn);
    }
    mount(c) {
        let cn = new ComponentVdom(c);
        return this._addChild(cn);
    }
    when(condition, then) {
        let condNode = new ConditionalVdom();
        let thenContainer;
        if (then instanceof ContainerVdom) {
            thenContainer = then;
        }
        else {
            thenContainer = new ContainerVdom();
            let textVdom = new TextVdom(then);
            thenContainer._addChild(textVdom);
            then = thenContainer;
        }
        condNode.addCondition(condition, then);
        this._addChild(condNode);
        return this;
    }
    otherwiseWhen(condition, then, seal = false) {
        let condNode = this._children[this._children.length - 1];
        if (condNode instanceof ConditionalVdom) {
            let thenContainer;
            if (then instanceof ContainerVdom) {
                thenContainer = then;
            }
            else {
                thenContainer = new ContainerVdom();
                let textVdom = new TextVdom(then);
                thenContainer._addChild(textVdom);
                then = thenContainer;
            }
            condNode.addCondition(condition, then, seal);
        }
        else {
            throw new Error("Can't branch off of a non-conditional node.");
        }
        return this;
    }
    otherwise(then) { return this.otherwiseWhen(true, then, true); }
    each(collection, callback) {
        let collectionVdom = new CollectionVdom(collection, callback);
        this._addChild(collectionVdom);
        return this;
    }
}
//# sourceMappingURL=container-vdom.js.map