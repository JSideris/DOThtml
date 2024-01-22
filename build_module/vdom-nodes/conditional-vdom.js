import Reactive from "../reactive";
import { Vdom } from "./vdom";
export class ConditionalVdom extends Vdom {
    constructor() {
        super(...arguments);
        this.conditions = [];
        this.sealed = false;
        this.renderedIndex = -1;
    }
    addCondition(condition, vNode, seal = false) {
        if (this.sealed) {
            throw new Error("Cannot add additional conditions to a sealed block.");
        }
        this.sealed = seal;
        let C = {
            condition,
            vNode,
            startAnchor: null,
            endAnchor: null,
            observerId: 0
        };
        this.conditions.push(C);
        if (this.conditions[0].startAnchor) {
            this.addAnchor(C, this.conditions[0].startAnchor.parentElement);
            if (condition instanceof Reactive) {
                C.observerId = condition.subscribeCond(this);
            }
            this.updateConditions();
        }
    }
    addAnchor(C, node) {
        C.startAnchor = node.ownerDocument.createTextNode("");
        C.endAnchor = node.ownerDocument.createTextNode("");
        node.appendChild(C.startAnchor);
        node.appendChild(C.endAnchor);
    }
    _render(node) {
        for (let c = 0; c < this.conditions.length; c++) {
            let C = this.conditions[c];
            if (C.startAnchor) {
                throw new Error("Item is already rendered.");
            }
            this.addAnchor(C, node);
            if (C.condition instanceof Reactive) {
                C.observerId = C.condition.subscribeCond(this);
            }
        }
        if (this.conditions.length)
            this.updateConditions();
    }
    _unrender() {
        if (this.conditions[0].startAnchor) {
            for (let i = 0; i < this.conditions.length; i++) {
                let C = this.conditions[i];
                let start = C.startAnchor;
                let end = C.endAnchor;
                C.vNode._unrender();
                start.parentElement.removeChild(start);
                end.parentElement.removeChild(end);
                C.startAnchor = null;
                C.endAnchor = null;
                if (C.condition instanceof Reactive) {
                    C.condition.detachBinding(C.observerId);
                    C.observerId = 0;
                }
            }
            this.renderedIndex = -1;
        }
    }
    updateConditions() {
        let node = this.conditions[0].startAnchor.parentElement;
        let newIndex = -1;
        for (let c = 0; c < this.conditions.length; c++) {
            let C = this.conditions[c];
            if (C.condition instanceof Reactive ? C.condition.getValue() : C.condition) {
                newIndex = c;
                break;
            }
        }
        if (newIndex != this.renderedIndex) {
            {
                if (this.renderedIndex != -1) {
                    let C = this.conditions[this.renderedIndex];
                    C.vNode._unrender();
                }
            }
            {
                this.renderedIndex = newIndex;
                if (newIndex != -1) {
                    let C = this.conditions[newIndex];
                    C.vNode._renderBefore(C.endAnchor);
                }
            }
        }
    }
}
//# sourceMappingURL=conditional-vdom.js.map