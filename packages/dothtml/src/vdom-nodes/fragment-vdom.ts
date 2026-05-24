import { Vdom } from "./vdom";
import { IDotCore } from "dothtml-interfaces";

export class FragmentVdom extends Vdom {
	_children: Vdom[] = [];
	_vtype = "fragment";

	constructor(dot?: IDotCore) {
		super(dot);
	}

	_render(target: HTMLElement) {
		this._isRendered = true;
		for (let i = 0; i < this._children.length; i++) {
			this._children[i]._render(target);
		}
	}

	_unrender() {
		if (!this._isRendered) return;
		this._isRendered = false;
		for (let i = 0; i < this._children.length; i++) {
			this._children[i]._unrender();
		}
	}

	_getNodes(): Node[] {
		let nodes: Node[] = [];
		for (let i = 0; i < this._children.length; i++) {
			nodes.push(...this._children[i]._getNodes());
		}
		return nodes;
	}

	_getLastChild(): Vdom | null {
		return this._children[this._children.length - 1] || null;
	}
}
