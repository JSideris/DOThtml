export abstract class Vdom{

	// One (and only one) of these is valid:

	abstract _render(target: HTMLElement);
	abstract _unrender();
	abstract _getNodes(): Node[];

	_moveBefore(reference: Node, parent?: Node){
		let nodes = this._getNodes();
		if (nodes.length === 0) return;
		let p = reference?.parentElement || parent;
		if (!p) throw new Error("Internal Error: Cannot move nodes without a parent.");
		
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i] === reference) return;
		}

		let fragment = (reference?.ownerDocument || p.ownerDocument || document).createDocumentFragment();
		for(let i = 0; i < nodes.length; i++){
			fragment.appendChild(nodes[i]);
		}
		p.insertBefore(fragment, reference);
	}

	__isRendered = false;
	get _isRendered(){
		return this.__isRendered
	}
	set _isRendered(value: boolean){
		if(value && this.__isRendered) throw new Error("Internal Error: Node is already rendered.");
		if(!value && !this.__isRendered) throw new Error("Internal Error: Node is not rendered.");
		this.__isRendered = value;
	}
	
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