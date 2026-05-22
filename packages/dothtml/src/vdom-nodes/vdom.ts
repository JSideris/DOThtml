import { IDotCore } from "dothtml-interfaces";

export abstract class Vdom{

	_dot: IDotCore;
	_onEnterHook?: (el: HTMLElement) => void;
	_onLeaveHook?: (el: HTMLElement) => Promise<void> | void;

	constructor(dot?: IDotCore){
		this._dot = dot;
	}

	// One (and only one) of these is valid:

	abstract _render(target: HTMLElement);
	abstract _unrender();

	_unrenderAsync(): Promise<void> | void {
		const nodes = this._getNodes();
		const el = nodes.find(n => n instanceof HTMLElement) as HTMLElement;
		if (this._onLeaveHook && el) {
			const result = this._onLeaveHook(el);
			if (result instanceof Promise) {
				return result.then(() => this._unrender());
			}
		}
		this._unrender();
	}

	abstract _getNodes(): Node[];
	abstract _getLastChild(): Vdom | null;

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

	_moveTo(target: HTMLElement){
		let nodes = this._getNodes();
		for(let i = 0; i < nodes.length; i++){
			target.appendChild(nodes[i]);
		}
	}

	// Chaining methods (implemented in dot-chain.ts)
	text(c: any): this { return null as any; }
	html(c: any): this { return null as any; }
	md(c: any): this { return null as any; }
	mount(c: any, attrs?: any): this { return null as any; }
	when(condition: any, then: any): this { return null as any; }
	each(collection: any, callback: any): this { return null as any; }
	otherwiseWhen(condition: any, then: any, seal?: boolean): this { return null as any; }
	otherwise(then: any): this { return null as any; }
	attr(A: string, c: any): this { return null as any; }
	style(c: any): this { return null as any; }
	on(event: string, callback: (e: any)=>void): this { return null as any; }
	onEnter(callback: (el: HTMLElement)=>void): this { return null as any; }
	onLeave(callback: (el: HTMLElement)=>Promise<void>|void): this { return null as any; }
	empty(): this { return null as any; }
	remove(): void { }
	[key: string]: any;
}
