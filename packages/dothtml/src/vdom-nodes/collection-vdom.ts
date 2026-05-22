import { deepEqual } from "../helpers/tools";
import Binding from "../reactivity/binding";
import Signal from "../reactivity/signal";
import { TextVdom } from "./text-vdom";
import { Vdom } from "./vdom";
import { FragmentVdom } from "./fragment-vdom";
import { ObservableCollection } from "./vdom-types";
import { scheduler } from "../reactivity/scheduler";
import { IDotCore } from "dothtml-interfaces";

type DatumMap = {
	vdom: Vdom; 
	value: any;
	keyValue: any;
	afterNode: Node;
	observableIndex: Binding<number>
};

/**
 * This is a VDOM for storing a collection, such as an array or dictionary.
 */
export default class CollectionVdom extends Vdom{

	private static readonly MAX_BATCH_SIZE = 128;

	value: ObservableCollection;
	renderCallback: (x: any, i: number|string|Binding, k: string)=>any;
	startNode: Node;
	endNode: Node;
	observerId = 0;

	mappedItems: Array<DatumMap> = [];

	// State for incremental updates
	private updateState: {
		newItems: Array<any>;
		newKeys: Array<any>;
		oldMap: Map<any, DatumMap>;
		nextMappedItems: Array<DatumMap>;
		currentIndex: number;
		lastNode: Node;
		tailAppendPrefix: number;
		step: "diff" | "reorder" | "cleanup";
	} | null = null;

	constructor(dot: IDotCore, value: ObservableCollection, renderCallback: (x: any, i: number|string, k: string)=>any){
		super(dot);
		this.value = value;
		this.renderCallback = renderCallback;
	}

	_render(target: HTMLElement) {

		if(this.value instanceof Binding){
			this.observerId = this.value._subscribe(this);
		}

		this.startNode = target.ownerDocument.createTextNode("");
		this.endNode = target.ownerDocument.createTextNode("");
		target.appendChild(this.startNode);
		target.appendChild(this.endNode);
		
		const originalShouldYield = scheduler.shouldYield;
		scheduler.shouldYield = () => false;
		try {
			this.updateList();
		} finally {
			scheduler.shouldYield = originalShouldYield;
		}
	}

	_unrender() {
		if(this.observerId && this.value instanceof Binding){
			this.value._unsubscribe(this.observerId);
			this.observerId = null;
		}

		for(let i = 0; i < this.mappedItems.length; i++){
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

	_getNodes(): Node[] {
		if(!this.startNode) return [];
		let nodes = [this.startNode];
		for(let i = 0; i < this.mappedItems.length; i++){
			nodes.push(...this.mappedItems[i].vdom._getNodes());
			nodes.push(this.mappedItems[i].afterNode);
		}
		nodes.push(this.endNode);
		return nodes;
	}

	_getLastChild(): Vdom | null {
		return this;
	}

	private getTailAppendPrefixLength(newKeys: Array<any>): number {
		const old = this.mappedItems;
		if (old.length === 0 || newKeys.length <= old.length) return 0;
		for (let i = 0; i < old.length; i++) {
			if (newKeys[i] !== old[i].keyValue) return 0;
		}
		return old.length;
	}

	private isItemPositionedAfter(item: DatumMap, anchor: Node): boolean {
		const nodes = item.vdom._getNodes();
		if (!nodes.length || !anchor.parentElement) return false;
		if (nodes[0] !== anchor.nextSibling) return false;
		const lastNode = nodes[nodes.length - 1];
		return item.afterNode === lastNode.nextSibling;
	}

	private reuseExistingItem(existing: DatumMap, value: any, index: number) {
		if (existing.value !== value && !deepEqual(existing.value, value)) {
			existing.vdom._unrender();
			existing.value = value;
			let vdomOrContent = this.renderCallback(value, this.value instanceof Binding ? existing.observableIndex : index, existing.keyValue);
			let vdom: Vdom;
			if (vdomOrContent instanceof Vdom) {
				vdom = vdomOrContent;
			} else if (typeof vdomOrContent === "object" && vdomOrContent?.build) {
				vdom = new FragmentVdom(this._dot);
				(vdom as any).mount(vdomOrContent);
			} else {
				vdom = new TextVdom(vdomOrContent as any);
			}
			if ((vdom as any)._root) vdom = (vdom as any)._root;
			existing.vdom = vdom;
		} else {
			existing.observableIndex._set(index);
		}
	}

	private getInsertBeforeAnchor(fromIndex: number, items: DatumMap[]): Node {
		for (let i = fromIndex; i < items.length; i++) {
			if (items[i].vdom._isRendered) {
				const nodes = items[i].vdom._getNodes();
				if (nodes.length) return nodes[0];
			}
		}
		return this.endNode;
	}

	private countConsecutiveUnrendered(fromIndex: number, items: DatumMap[]): number {
		let count = 0;
		while (
			fromIndex + count < items.length &&
			!items[fromIndex + count].vdom._isRendered &&
			count < CollectionVdom.MAX_BATCH_SIZE
		) {
			count++;
		}
		return count;
	}

	private batchRenderNewItems(items: DatumMap[], parent: Node, insertBefore: Node): void {
		const fragment = parent.ownerDocument.createDocumentFragment();
		for (const item of items) {
			item.vdom._render(fragment as unknown as HTMLElement);
			fragment.appendChild(item.afterNode);
		}
		parent.insertBefore(fragment, insertBefore);
	}

	/**
	 * Removes a single item from the DOM, including anchors.
	 */
	private removeItem(item: DatumMap): Promise<void> | void {
		const result = item.vdom._unrenderAsync();
		if (result instanceof Promise) {
			return result.then(() => {
				if (item.afterNode.parentElement) {
					item.afterNode.parentElement.removeChild(item.afterNode);
				}
			});
		}
		if (item.afterNode.parentElement) {
			item.afterNode.parentElement.removeChild(item.afterNode);
		}
	}

	updateList(): boolean {
		let unmappedCollection = null as Array<any>|Record<string|number, any>;
		if(this.value instanceof Binding){
			unmappedCollection = this.value._get() as any;
		}
		else{
			unmappedCollection = this.value;
		}

		const currentItems: Array<any> = Array.isArray(unmappedCollection) 
			? unmappedCollection 
			: Object.values(unmappedCollection);

		if (this.updateState) {
			// If we are already updating, check if the data has changed since we started.
			if (!deepEqual(this.updateState.newItems, currentItems)) {
				// The data changed while we were yielded! 
				// Discard the old state and start fresh.
				this.updateState = null;
			}
		}

		if (!this.updateState) {
			// Initialize update state
			let key: string = null;
			if(this.value instanceof Binding){
				key = this.value._source.key ?? null;
			}

			const newItems = currentItems;
			
			const newKeys: Array<any> = Array.isArray(unmappedCollection)
				? newItems.map((v, i) => key ? v[key] : i)
				: Object.keys(unmappedCollection).map((k, i) => key ? unmappedCollection[k][key] : k);

			const tailAppendPrefix = this.getTailAppendPrefixLength(newKeys);

			const oldMap = new Map<any, DatumMap>();
			for (let i = 0; i < this.mappedItems.length; i++) {
				const item = this.mappedItems[i];
				if (i >= tailAppendPrefix) {
					oldMap.set(item.keyValue, item);
				}
			}

			this.updateState = {
				newItems,
				newKeys,
				oldMap,
				nextMappedItems: [],
				currentIndex: 0,
				lastNode: this.startNode,
				tailAppendPrefix,
				step: "diff"
			};
		}

		const state = this.updateState;

		// 1. Diffing Step
		if (state.step === "diff") {
			while (state.currentIndex < state.newItems.length) {
				const value = state.newItems[state.currentIndex];
				const keyValue = state.newKeys[state.currentIndex];

				if (state.currentIndex < state.tailAppendPrefix) {
					const existing = this.mappedItems[state.currentIndex];
					this.reuseExistingItem(existing, value, state.currentIndex);
					state.nextMappedItems.push(existing);
				} else {
					let existing = state.oldMap.get(keyValue);

					if (existing) {
						state.oldMap.delete(keyValue);
						this.reuseExistingItem(existing, value, state.currentIndex);
						state.nextMappedItems.push(existing);
					} else {
						const reactive = new Signal();
						const observableIndex = reactive.bind();
						observableIndex._set(state.currentIndex);
						
						const vdomOrContent = this.renderCallback(value, this.value instanceof Binding ? observableIndex : state.currentIndex, keyValue);
						let vdom: Vdom;
						if (vdomOrContent instanceof Vdom) {
							vdom = vdomOrContent;
						} else if (typeof vdomOrContent === "object" && vdomOrContent?.build) {
							vdom = new FragmentVdom(this._dot);
							(vdom as any).mount(vdomOrContent);
						} else {
							vdom = new TextVdom(vdomOrContent as any);
						}
						if ((vdom as any)._root) vdom = (vdom as any)._root;
						const afterNode = this.startNode.ownerDocument.createTextNode("");
						
						state.nextMappedItems.push({
							vdom, value, keyValue, afterNode, observableIndex
						});
					}
				}

				state.currentIndex++;

				if (scheduler.shouldYield()) {
					return true; // Yielding
				}
			}
			state.step = "cleanup";
		}

		// 2. Cleanup Step (Remove items no longer present)
		if (state.step === "cleanup") {
			const oldItems = Array.from(state.oldMap.values());
			for (const item of oldItems) {
				this.removeItem(item);
			}
			state.step = "reorder";
			state.currentIndex = 0;
			this.mappedItems = [];
		}

		// 3. Reordering Step
		if (state.step === "reorder") {
			while (state.currentIndex < state.nextMappedItems.length) {
				const item = state.nextMappedItems[state.currentIndex];

				if (!item.vdom._isRendered) {
					const runLength = this.countConsecutiveUnrendered(state.currentIndex, state.nextMappedItems);

					if (runLength >= 2) {
						const batch = state.nextMappedItems.slice(state.currentIndex, state.currentIndex + runLength);
						const parent = state.lastNode.parentElement;
						const insertBefore = this.getInsertBeforeAnchor(state.currentIndex + runLength, state.nextMappedItems);
						this.batchRenderNewItems(batch, parent, insertBefore);

						for (const batchItem of batch) {
							state.lastNode = batchItem.afterNode;
							this.mappedItems.push(batchItem);
						}
						state.currentIndex += runLength;
					} else {
						item.vdom._renderAfter(state.lastNode);
						state.lastNode.parentElement.insertBefore(item.afterNode, item.vdom._getNodes().slice(-1)[0].nextSibling);
						state.lastNode = item.afterNode;
						this.mappedItems.push(item);
						state.currentIndex++;
					}
				} else if (!this.isItemPositionedAfter(item, state.lastNode)) {
					item.vdom._moveBefore(state.lastNode.nextSibling, state.lastNode.parentElement);
					state.lastNode.parentElement.insertBefore(item.afterNode, item.vdom._getNodes().slice(-1)[0].nextSibling);
					state.lastNode = item.afterNode;
					this.mappedItems.push(item);
					state.currentIndex++;
				} else {
					state.lastNode = item.afterNode;
					this.mappedItems.push(item);
					state.currentIndex++;
				}

				if (scheduler.shouldYield()) {
					return true; // Yielding
				}
			}
		}

		// Finalize
		this.updateState = null;
		return false; // Finished
	}
}
