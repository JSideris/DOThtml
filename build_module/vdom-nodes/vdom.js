export class Vdom {
    toString() {
        let el = document.createElement("div");
        this._render(el);
        return el.innerHTML;
    }
    _renderBefore(reference) {
        let dummy = reference.ownerDocument.createElement("div");
        this._render(dummy);
        while (dummy.childNodes.length > 0) {
            let cn = dummy.childNodes[0];
            cn.parentElement.removeChild(cn);
            reference.parentElement.insertBefore(cn, reference);
        }
    }
    _renderAfter(reference) {
        if (reference.nextSibling) {
            this._renderBefore(reference.nextSibling);
        }
        else {
            let temp = reference.ownerDocument.createTextNode("");
            reference.parentElement.appendChild(temp);
            this._renderBefore(temp);
            temp.parentElement.removeChild(temp);
        }
    }
}
//# sourceMappingURL=vdom.js.map