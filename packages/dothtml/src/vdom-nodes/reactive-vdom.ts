import { removeNodesBetween } from "../helpers/tools";
import Binding from "../reactivity/binding";
import { ContainerVdom } from "./container-vdom";
import { TextVdom } from "./text-vdom";
import { Vdom } from "./vdom";
import { IDotCore } from "dothtml-interfaces";
import { ComponentVdom } from "./component-vdom";

export class ReactiveVdom extends Vdom {
	private binding: Binding;
	private beforeNode: Node = null;
	private afterNode: Node = null;
	private currentVdom: Vdom = null;
	private observerId: number = 0;
	_isReactiveVdom = true;

	constructor(dot: IDotCore, binding: Binding) {
		super(dot);
		this.binding = binding;
	}

	private _toVdom(value: any): Vdom {
		if (value === null || value === undefined) {
			return new TextVdom("");
		}
		if (value instanceof Vdom) {
			return value;
		}
		if (typeof value === "object" && value.build) {
			const cv = new ComponentVdom(this._dot, value);
			cv.init();
			return cv;
		}
		if (Array.isArray(value)) {
			const container = new ContainerVdom(this._dot);
			for (const item of value) {
				container._addChild(this._toVdom(item));
			}
			return container;
		}
		return new TextVdom(value);
	}

	_render(target: HTMLElement) {
		this._isRendered = true;
		this.beforeNode = target.ownerDocument.createTextNode("");
		this.afterNode = target.ownerDocument.createTextNode("");
		target.appendChild(this.beforeNode);
		target.appendChild(this.afterNode);

		const value = this.binding._get();
		this.update(value);

		this.observerId = this.binding._subscribe(this);
	}

	update(value: any) {
		if (!this._isRendered) return;

		if (this.currentVdom) {
			this.currentVdom._unrender();
		}

		removeNodesBetween(this.beforeNode, this.afterNode);

		this.currentVdom = this._toVdom(value);
		this.currentVdom._renderBefore(this.afterNode);
	}

	_unrender() {
		if (!this._isRendered) return;
		this._isRendered = false;

		if (this.currentVdom) {
			this.currentVdom._unrender();
			this.currentVdom = null;
		}

		if (this.observerId) {
			this.binding._unsubscribe(this.observerId);
			this.observerId = 0;
		}

		removeNodesBetween(this.beforeNode, this.afterNode);
		if (this.beforeNode.parentElement) this.beforeNode.parentElement.removeChild(this.beforeNode);
		if (this.afterNode.parentElement) this.afterNode.parentElement.removeChild(this.afterNode);
		this.beforeNode = null;
		this.afterNode = null;
	}

	_getNodes(): Node[] {
		if (!this._isRendered) return [];
		const nodes = [this.beforeNode];
		if (this.currentVdom) {
			nodes.push(...this.currentVdom._getNodes());
		}
		nodes.push(this.afterNode);
		return nodes;
	}

	_getLastChild(): Vdom | null {
		return this;
	}

	toString() {
		return this.currentVdom ? this.currentVdom.toString() : "";
	}
}
