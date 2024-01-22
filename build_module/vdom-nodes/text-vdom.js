import Reactive from "../reactive";
import { Vdom } from "./vdom";
export class TextVdom extends Vdom {
    constructor(text) {
        super();
        this.textNode = null;
        this.observerId = 0;
        this.text = text;
    }
    _render(node) {
        if (this.text instanceof Reactive) {
            this.textNode = node.ownerDocument.createTextNode(this.text.getValue() ?? "");
            this.observerId = this.text.subscribeText(this);
        }
        else {
            this.textNode = node.ownerDocument.createTextNode(`${this.text ?? ""}`);
        }
        node.appendChild(this.textNode);
    }
    _unrender() {
        if (this.textNode) {
            this.textNode.parentElement.removeChild(this.textNode);
            this.textNode = null;
        }
        if (this.observerId && this.text instanceof Reactive) {
            this.text.detachBinding(this.observerId);
            this.observerId = 0;
        }
    }
    toString() {
        let temp = document.createTextNode((this.text instanceof Reactive ? this.text.getValue() : this.text) ?? "");
        let div = document.createElement("div");
        div.appendChild(temp);
        return div.innerHTML;
    }
}
//# sourceMappingURL=text-vdom.js.map