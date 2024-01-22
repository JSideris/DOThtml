import { removeNodesBetween } from "../helpers";
import Reactive from "../reactive";
import { Vdom } from "./vdom";
export class HtmlVdom extends Vdom {
    constructor(html) {
        super();
        this.observerId = 0;
        this.html = html;
    }
    updateHtml(html) {
        if (this.beforeNode) {
            removeNodesBetween(this.beforeNode, this.afterNode);
            let temp = this.beforeNode.ownerDocument.createElement("div");
            temp.innerHTML = html;
            while (temp.firstChild) {
                this.afterNode.parentElement.insertBefore(temp.firstChild, this.afterNode);
            }
        }
    }
    _render(target) {
        let html = "";
        if (this.html instanceof Reactive) {
            html = this.html.getValue();
            this.observerId = this.html.subscribeHtml(this);
        }
        else {
            html = this.html;
        }
        this.beforeNode = target.ownerDocument.createTextNode("");
        this.afterNode = target.ownerDocument.createTextNode("");
        target.appendChild(this.beforeNode);
        target.appendChild(this.afterNode);
        this.updateHtml(html ?? "");
    }
    _unrender() {
        if (this.beforeNode) {
            let parent = this.beforeNode.parentElement;
            removeNodesBetween(this.beforeNode, this.afterNode);
            parent.removeChild(this.beforeNode);
            parent.removeChild(this.afterNode);
            this.beforeNode = null;
            this.afterNode = null;
        }
        if (this.observerId && this.html instanceof Reactive) {
            this.html.detachBinding(this.observerId);
            this.observerId = 0;
        }
    }
    toString() {
        return this.html instanceof Reactive ? this.html.getValue() : this.html;
    }
}
//# sourceMappingURL=html-vdom.js.map