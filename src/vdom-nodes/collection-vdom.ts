import { deepEqual, removeNodesBetween } from "../helpers/tools";
import Binding from "../reactivity/binding";
import Watcher from "../reactivity/watcher";
import { TextVdom } from "./text-vdom";
import { Vdom } from "./vdom";
import { ObservableCollection } from "./vdom-types";
import { scheduler } from "../reactivity/scheduler";

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

	value: ObservableCollection;
	renderCallback: (x: any, i: number|string|Binding, k: string)=>Vdom;
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
		step: "diff" | "reorder" | "cleanup";
	} | null = null;

	constructor(value: ObservableCollection, renderCallback: (x: any, i: number|string, k: string)=>Vdom){
		super();
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
		this.updateList();
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

	/**
	 * Removes a single item from the DOM, including anchors.
	 */
	private removeItem(item: DatumMap){
		item.vdom._unrender();
		if (item.afterNode.parentElement) {
			item.afterNode.parentElement.removeChild(item.afterNode);
		}
	}

	updateList(): boolean {
		if (!this.updateState) {
			// Initialize update state
			let key: string = null;
			let unmappedCollection = null as Array<any>|Record<string|number, any>;
			if(this.value instanceof Binding){
				unmappedCollection = this.value._get() as any;
				key = this.value._source.key ?? null;
			}
			else{
				unmappedCollection = this.value;
			}

			const newItems: Array<any> = Array.isArray(unmappedCollection) 
				? unmappedCollection 
				: Object.values(unmappedCollection);
			
			const newKeys: Array<any> = Array.isArray(unmappedCollection)
				? newItems.map((v, i) => key ? v[key] : i)
				: Object.keys(unmappedCollection).map((k, i) => key ? unmappedCollection[k][key] : k);

			const oldMap = new Map<any, DatumMap>();
			for (const item of this.mappedItems) {
				oldMap.set(item.keyValue, item);
			}

			this.updateState = {
				newItems,
				newKeys,
				oldMap,
				nextMappedItems: [],
				currentIndex: 0,
				lastNode: this.startNode,
				step: "diff"
			};
		}

		const state = this.updateState;

		// 1. Diffing Step
		if (state.step === "diff") {
			while (state.currentIndex < state.newItems.length) {
				const value = state.newItems[state.currentIndex];
				const keyValue = state.newKeys[state.currentIndex];
				let existing = state.oldMap.get(keyValue);

				if (existing) {
					state.oldMap.delete(keyValue);
					if (!deepEqual(existing.value, value)) {
						existing.vdom._unrender();
						existing.value = value;
						let vdomOrContent = this.renderCallback(value, this.value instanceof Binding ? existing.observableIndex : state.currentIndex, keyValue);
						existing.vdom = vdomOrContent instanceof Vdom ? vdomOrContent : new TextVdom(vdomOrContent as any);
					} else {
						existing.observableIndex._set(state.currentIndex);
					}
					state.nextMappedItems.push(existing);
				} else {
					const reactive = new Watcher();
					const observableIndex = reactive.bind();
					observableIndex._set(state.currentIndex);
					
					const vdomOrContent = this.renderCallback(value, this.value instanceof Binding ? observableIndex : state.currentIndex, keyValue);
					const vdom = vdomOrContent instanceof Vdom ? vdomOrContent : new TextVdom(vdomOrContent as any);
					const afterNode = this.startNode.ownerDocument.createTextNode("");
					
					state.nextMappedItems.push({
						vdom, value, keyValue, afterNode, observableIndex
					});
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
					item.vdom._renderAfter(state.lastNode);
					state.lastNode.parentElement.insertBefore(item.afterNode, item.vdom._getNodes().slice(-1)[0].nextSibling);
				} else {
					item.vdom._moveBefore(state.lastNode.nextSibling);
					state.lastNode.parentElement.insertBefore(item.afterNode, item.vdom._getNodes().slice(-1)[0].nextSibling);
				}

				state.lastNode = item.afterNode;
				this.mappedItems.push(item);
				state.currentIndex++;

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
