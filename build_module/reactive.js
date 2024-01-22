const TEXT_OFFSET = 0;
const HTML_OFFSET = 1;
const ATTR_OFFSET = 2;
const COND_OFFSET = 3;
const ARRAY_OFFSET = 4;
const CB_OFFSET = 5;
const CATEGORIES = CB_OFFSET + 1;
export default class Reactive {
    constructor() {
        this.observingTextNodes = {};
        this.observingHtmlNodes = {};
        this.observingAttributes = {};
        this.observingCollections = {};
        this.observingConditionals = {};
        this.observingCallbacks = {};
        this.nextId = 1;
    }
    getValue() {
        return this.transformer ? this.transformer(this._value) : this._value;
    }
    setValue(v) {
        this._value = v;
        let newValue = this.getValue();
        if (this._cachedLastValue != newValue) {
            this._cachedLastValue = newValue;
            this.updater(newValue);
        }
    }
    updater(value) {
        for (let o in this.observingTextNodes) {
            let n = this.observingTextNodes[o];
            n.textNode.textContent = value ?? "";
        }
        for (let o in this.observingHtmlNodes) {
            let n = this.observingHtmlNodes[o];
            n.updateHtml(value);
        }
        for (let o in this.observingAttributes) {
            let a = this.observingAttributes[o];
            a.element.setAttr(a.attribute, this);
        }
        for (let o in this.observingCollections) {
            let c = this.observingCollections[o];
            c.collection.updateList();
        }
        for (let o in this.observingConditionals) {
            let a = this.observingConditionals[o];
            a.updateConditions();
        }
        for (let o in this.observingCallbacks) {
            let cb = this.observingCallbacks[o];
            cb(value);
        }
    }
    subscribeText(node) {
        let id = TEXT_OFFSET + CATEGORIES * this.nextId++;
        this.observingTextNodes[id] = node;
        return id;
    }
    subscribeHtml(node) {
        let id = HTML_OFFSET + CATEGORIES * this.nextId++;
        this.observingHtmlNodes[id] = node;
        return id;
    }
    subscribeAttr(node, attributeName) {
        let id = ATTR_OFFSET + CATEGORIES * this.nextId++;
        this.observingAttributes[id] = { element: node, attribute: attributeName };
        return id;
    }
    subscribeCollection(node) {
        let id = ARRAY_OFFSET + CATEGORIES * this.nextId++;
        this.observingCollections[id] = { collection: node, key: null };
        return id;
    }
    subscribeCond(node) {
        let id = COND_OFFSET + CATEGORIES * this.nextId++;
        this.observingConditionals[id] = node;
        return id;
    }
    subscribeCallback(callback) {
        let id = CB_OFFSET + CATEGORIES * this.nextId++;
        this.observingCallbacks[id] = callback;
        return id;
    }
    detachBinding(id) {
        let category = id % CATEGORIES;
        switch (category) {
            case TEXT_OFFSET: {
                delete this.observingTextNodes[id];
                break;
            }
            case ATTR_OFFSET: {
                delete this.observingAttributes[id];
                break;
            }
            case HTML_OFFSET: {
                delete this.observingHtmlNodes[id];
                break;
            }
            case ARRAY_OFFSET: {
                delete this.observingCollections[id];
                break;
            }
            case COND_OFFSET: {
                delete this.observingConditionals[id];
                break;
            }
            case CB_OFFSET: {
                delete this.observingCallbacks[id];
                break;
            }
        }
    }
    updateObservers() {
        let updatedValue = this.getValue();
        this._cachedLastValue = updatedValue;
        this.updater(updatedValue);
    }
}
//# sourceMappingURL=reactive.js.map