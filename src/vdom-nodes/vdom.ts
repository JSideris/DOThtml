export abstract class Vdom{

	// One (and only one) of these is valid:

	abstract _render(target: HTMLElement);
	abstract _unrender();
	toString(): string {
		let el = document.createElement("div");
		this._render(el);
		return el.innerHTML;
	}

	_renderBefore(reference: Node){
		let dummy = reference.ownerDocument.createElement("div");
		this._render(dummy);
		while(dummy.childNodes.length > 0){
			let cn = dummy.childNodes[0];
			cn.parentElement.removeChild(cn);
			reference.parentElement.insertBefore(cn, reference);
		}
	}
	_renderAfter(reference: Node){
		if(reference.nextSibling){
			this._renderBefore(reference.nextSibling);
		}
		else{
			let temp = reference.ownerDocument.createTextNode("");
			reference.parentElement.appendChild(temp);
			this._renderBefore(temp);
			temp.parentElement.removeChild(temp);
		}
	}
}