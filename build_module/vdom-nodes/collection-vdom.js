import { deepEqual } from "../helpers";
import Reactive from "../reactive";
import { TextVdom } from "./text-vdom";
import { Vdom } from "./vdom";
export default class CollectionVdom extends Vdom {
    constructor(value, renderCallback) {
        super();
        this.observerId = 0;
        this.mappedItems = [];
        this.value = value;
        this.renderCallback = renderCallback;
    }
    _render(target) {
        if (this.value instanceof Reactive) {
            this.observerId = this.value.subscribeCollection(this);
        }
        this.startNode = target.ownerDocument.createTextNode("");
        this.endNode = target.ownerDocument.createTextNode("");
        target.appendChild(this.startNode);
        target.appendChild(this.endNode);
        this.updateList();
    }
    _unrender() {
        if (this.observerId && this.value instanceof Reactive) {
            this.value.detachBinding(this.observerId);
            this.observerId = null;
        }
        for (let i = 0; i < this.mappedItems.length; i++) {
            let I = this.mappedItems[i];
            I.vdom._unrender();
            I.afterNode.parentElement.removeChild(I.afterNode);
        }
        this.mappedItems.length = 0;
        this.startNode.parentElement.removeChild(this.startNode);
        this.endNode.parentElement.removeChild(this.endNode);
        this.startNode = null;
        this.endNode = null;
    }
    removeItem(item) {
        item.vdom._unrender();
        item.afterNode.parentElement.removeChild(item.afterNode);
    }
    updateList() {
        let key = null;
        let mappedData;
        {
            let unmappedCollection = null;
            if (this.value instanceof Reactive) {
                unmappedCollection = this.value.getValue();
                key = this.value.key ?? null;
            }
            else {
                unmappedCollection = this.value;
            }
            if (unmappedCollection instanceof Array) {
                mappedData = unmappedCollection.map((v, i) => {
                    let kv = !!key ? v[key] : null;
                    return {
                        vdom: null,
                        value: v,
                        keyValue: kv,
                        afterNode: null,
                        observableIndex: new Reactive()
                    };
                });
            }
            else {
                mappedData = [];
                for (let k in unmappedCollection) {
                    let v = unmappedCollection[k];
                    let kv = !!key ? v[key] : k;
                    mappedData.push({
                        vdom: null,
                        value: v,
                        keyValue: kv,
                        afterNode: null,
                        observableIndex: new Reactive()
                    });
                }
            }
        }
        {
            let oi = 0;
            let ns = 0;
            let ni = 0;
            while (oi < this.mappedItems.length) {
                let existing = this.mappedItems[oi];
                let candidate = mappedData[ni];
                if (!candidate) {
                    this.removeItem(existing);
                    this.mappedItems.splice(oi, 1);
                    ni = ns;
                    continue;
                }
                else if ((candidate == existing) || (key && candidate.keyValue == existing.keyValue)) {
                    ns++;
                    oi++;
                    ni = ns;
                    continue;
                }
                else {
                    ni++;
                }
            }
        }
        {
            let oi = 0;
            let ni = 0;
            let afterTarget = this.startNode;
            while (ni < mappedData.length) {
                let existing = this.mappedItems[oi];
                let candidate = mappedData[ni];
                if (existing && ((candidate == existing) || (key && candidate.keyValue == existing.keyValue))) {
                    if (!deepEqual(existing.value, candidate.value)) {
                        existing.vdom._unrender();
                        existing.vdom = this.renderCallback(candidate.value, this.value instanceof Reactive ? existing.observableIndex : ni, candidate.keyValue);
                        existing.value = candidate.value;
                        existing.vdom._renderBefore(existing.afterNode);
                    }
                    else {
                        existing.observableIndex.setValue(ni);
                    }
                    afterTarget = existing.afterNode;
                    ni++;
                    oi++;
                    continue;
                }
                else {
                    let beforeTarget = afterTarget.ownerDocument.createTextNode("");
                    let ns = afterTarget.parentElement.nextSibling;
                    if (ns) {
                        this.startNode.parentElement.insertBefore(beforeTarget, ns);
                    }
                    else {
                        this.startNode.parentElement.appendChild(beforeTarget);
                    }
                    candidate.afterNode = beforeTarget;
                    candidate.observableIndex._value = ni;
                    let content = this.renderCallback(candidate.value, this.value instanceof Reactive ? candidate.observableIndex : ni, candidate.keyValue);
                    if (content instanceof Vdom) {
                        candidate.vdom = content;
                    }
                    else {
                        candidate.vdom = new TextVdom(content);
                    }
                    candidate.vdom._renderBefore(candidate.afterNode);
                    this.mappedItems.splice(ni, 0, candidate);
                    ni++;
                }
            }
        }
    }
}
//# sourceMappingURL=collection-vdom.js.map