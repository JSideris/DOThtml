import { IDotCore } from "dothtml-interfaces";
import { Vdom } from "./vdom";
import { ContainerVdom } from "./container-vdom";
import { applyContent } from "../dot-helpers";
import { getCurrentComponent } from "./component-context";

export class SlotVdom extends Vdom {
	name: string;
	fallbackOrScope: any;
	fallback: ContainerVdom | null = null;
	scopedContent: ContainerVdom | null = null;
	element: HTMLElement | null = null;
	component: any;

	constructor(dot: IDotCore, name?: string, fallbackOrScope?: any) {
		super(dot);
		this.name = name || "default";
		this.fallbackOrScope = fallbackOrScope;
		this.component = getCurrentComponent();
	}

	_render(node: HTMLElement) {
		this._isRendered = true;
		const document = node.ownerDocument;

		const currentComp = this.component || getCurrentComponent();
		const slotContent = currentComp?.slots?.[this.name];

		if (typeof slotContent === "function") {
			this.scopedContent = new ContainerVdom(this._dot);
			applyContent(this._dot, this.scopedContent as any, slotContent(this.fallbackOrScope));
		} else if (this.fallbackOrScope !== undefined) {
			this.fallback = new ContainerVdom(this._dot);
			applyContent(this._dot, this.fallback as any, this.fallbackOrScope);
		}

		if (this.scopedContent) {
			this.scopedContent._render(node);
		} else {
			this.element = document.createElement("slot");
			if (this.name !== "default") {
				(this.element as HTMLSlotElement).name = this.name;
			}

			if (this.fallback) {
				this.fallback._render(this.element as any);
			}

			node.appendChild(this.element);
		}
	}

	_unrender() {
		if (this.scopedContent) {
			this.scopedContent._unrender();
		} else if (this.element) {
			if (this.fallback) {
				this.fallback._unrender();
			}
			this.element.remove();
			this.element = null;
		}
		this._isRendered = false;
	}

	_getNodes(): Node[] {
		if (this.scopedContent) {
			return this.scopedContent._getNodes();
		}
		return this.element ? [this.element] : [];
	}

	_getLastChild(): Vdom | null {
		return this;
	}
}
