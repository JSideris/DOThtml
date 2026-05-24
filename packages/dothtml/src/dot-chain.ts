import { Vdom } from "./vdom-nodes/vdom";
import { FragmentVdom } from "./vdom-nodes/fragment-vdom";
import { IDotCore } from "dothtml-interfaces";
import { ComponentVdom } from "./vdom-nodes/component-vdom";
import { SlotVdom } from "./vdom-nodes/slot-vdom";
import { ContainerVdom } from "./vdom-nodes/container-vdom";
import { isVType } from "./helpers/tools";

export class DotChain extends Vdom {
	_root: Vdom;
	_vtype = "dotchain";

	constructor(dot: IDotCore, initial: Vdom) {
		super(dot);
		this._root = initial;
	}

	_addChild(node: Vdom) {
		if (this._root instanceof ContainerVdom || isVType(this._root, "container")) {
			(this._root as any)._addChild(node);
		} else if (!(this._root instanceof FragmentVdom || isVType(this._root, "fragment"))) {
			const frag = new FragmentVdom(this._dot);
			frag._children.push(this._root);
			frag._children.push(node);
			this._root = frag;
		} else {
			(this._root as any)._children.push(node);
		}
		return this;
	}

	_prependChild(node: Vdom) {
		if (this._root instanceof ContainerVdom || isVType(this._root, "container")) {
			(this._root as any)._prependChild(node);
		} else if (!(this._root instanceof FragmentVdom || isVType(this._root, "fragment"))) {
			const frag = new FragmentVdom(this._dot);
			frag._children.push(node);
			frag._children.push(this._root);
			this._root = frag;
		} else {
			(this._root as any)._children.unshift(node);
		}
		return this;
	}

	_render(target: HTMLElement) {
		this._root._render(target);
	}

	_unrender() {
		this._root._unrender();
	}

	_unrenderAsync(): Promise<void> | void {
		return this._root._unrenderAsync();
	}

	_renderBefore(reference: Node) {
		this._root._renderBefore(reference);
	}

	_renderAfter(reference: Node) {
		this._root._renderAfter(reference);
	}

	_moveBefore(reference: Node, parent?: Node) {
		this._root._moveBefore(reference, parent);
	}

	get _isRendered() {
		return this._root._isRendered;
	}

	set _isRendered(value: boolean) {
		this._root._isRendered = value;
	}

	_getNodes(): Node[] {
		return this._root._getNodes();
	}

	_getLastChild(): Vdom | null {
		return this._root._getLastChild();
	}

	get _children() {
		if (this._root instanceof ContainerVdom || isVType(this._root, "container")) {
			return (this._root as any)._children;
		}
		if (this._root instanceof FragmentVdom || isVType(this._root, "fragment")) {
			return (this._root as any)._children;
		}
		return [];
	}

	slot(name: string | any, content?: any) {
		let lastChild = this._getLastChild();
		while (lastChild instanceof DotChain || isVType(lastChild, "dotchain")) {
			lastChild = (lastChild as any)._root;
		}

		if (lastChild instanceof ComponentVdom || isVType(lastChild, "component")) {
			if (typeof name !== "string") {
				content = name;
				name = "default";
			}
			(lastChild as any).addSlot(name || "default", content);
		} else {
			if (typeof name !== "string") {
				content = name;
				name = undefined;
			}
			this._addChild(new SlotVdom(this._dot, name, content));
		}
		return this;
	}
}
