import { deepEqual, removeNodesBetween } from "../helpers/tools";
import Binding from "../reactivity/binding";
import Watcher from "../reactivity/watcher";
import { TextVdom } from "./text-vdom";
import { Vdom } from "./vdom";
import { ObservableCollection } from "./vdom-types";

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
		item.afterNode.parentElement.removeChild(item.afterNode);
	}

	updateList(){
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

		// 1. Map old items by key
		const oldMap = new Map<any, DatumMap>();
		for (const item of this.mappedItems) {
			oldMap.set(item.keyValue, item);
		}

		const nextMappedItems: Array<DatumMap> = [];
		
		// 2. Iterate through new items
		for (let i = 0; i < newItems.length; i++) {
			const value = newItems[i];
			const keyValue = newKeys[i];
			let existing = oldMap.get(keyValue);

			if (existing) {
				// Reuse existing
				oldMap.delete(keyValue);
				
				// Check if value changed
				if (!deepEqual(existing.value, value)) {
					existing.vdom._unrender();
					existing.value = value;
					let vdomOrContent = this.renderCallback(value, this.value instanceof Binding ? existing.observableIndex : i, keyValue);
					existing.vdom = vdomOrContent instanceof Vdom ? vdomOrContent : new TextVdom(vdomOrContent as any);
					
					// We don't render it yet, we'll do it in the re-order step.
				} else {
					existing.observableIndex._set(i);
				}
				nextMappedItems.push(existing);
			} else {
				// Create new
				const reactive = new Watcher();
				const observableIndex = reactive.bind();
				observableIndex._set(i);
				
				const vdomOrContent = this.renderCallback(value, this.value instanceof Binding ? observableIndex : i, keyValue);
				const vdom = vdomOrContent instanceof Vdom ? vdomOrContent : new TextVdom(vdomOrContent as any);
				
				const afterNode = this.startNode.ownerDocument.createTextNode("");
				
				const item: DatumMap = {
					vdom,
					value,
					keyValue,
					afterNode,
					observableIndex
				};
				nextMappedItems.push(item);
			}
		}

		// 3. Remove items that are no longer present
		for (const item of oldMap.values()) {
			this.removeItem(item);
		}

		// 4. Re-order DOM nodes
		let lastNode: Node = this.startNode;
		for (let i = 0; i < nextMappedItems.length; i++) {
			const item = nextMappedItems[i];
			
			if (!item.vdom._isRendered) {
				item.vdom._renderAfter(lastNode);
				lastNode.parentElement.insertBefore(item.afterNode, item.vdom._getNodes().slice(-1)[0].nextSibling);
			} else {
				// Move it to the correct position
				item.vdom._moveBefore(lastNode.nextSibling);
				lastNode.parentElement.insertBefore(item.afterNode, item.vdom._getNodes().slice(-1)[0].nextSibling);
			}

			lastNode = item.afterNode;
		}

		this.mappedItems = nextMappedItems;
	}
}