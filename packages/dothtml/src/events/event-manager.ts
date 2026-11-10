
import SyntheticEvent from "./synthetic-event";

export type EventHandler = (e: SyntheticEvent) => void;

interface RegisteredListener {
	handler: EventHandler;
	modifiers: string[];
}

export type EventRoot = Document | ShadowRoot;

// These events do not bubble (and often do not compose). Root-level
// delegation never sees them, so they are bound on the element itself.
const DIRECT_EVENTS = new Set([
	"scroll",
	"load",
	"unload",
	"error",
	"abort",
	"toggle",
	"invalid",
	"close",
]);

export function getEventRoot(element: Element): EventRoot {
	const root = element.getRootNode();
	if (typeof ShadowRoot !== "undefined" && root instanceof ShadowRoot) {
		return root;
	}
	if (typeof Document !== "undefined" && root instanceof Document) {
		return root;
	}
	return element.ownerDocument;
}

export class EventManager {
	private static managers = new Map<EventRoot, EventManager>();

	public static getForDocument(document: Document): EventManager {
		return this.getForRoot(document);
	}

	public static getForRoot(root: EventRoot): EventManager {
		let manager = this.managers.get(root);
		if (!manager) {
			manager = new EventManager(root);
			this.managers.set(root, manager);
		}
		return manager;
	}

	public static getForElement(element: Element): EventManager {
		return this.getForRoot(getEventRoot(element));
	}

	private root: EventRoot;
	private listeners = new WeakMap<Element, Map<string, RegisteredListener[]>>();
	private activeEventTypes = new Set<string>();
	private directNativeListeners = new WeakMap<Element, Map<string, EventListener>>();

	constructor(root: EventRoot) {
		this.root = root;
	}

	public addListener(element: Element, eventType: string, handler: EventHandler, modifiers: string[] = []) {
		let elementListeners = this.listeners.get(element);
		if (!elementListeners) {
			elementListeners = new Map();
			this.listeners.set(element, elementListeners);
		}

		let handlers = elementListeners.get(eventType);
		if (!handlers) {
			handlers = [];
			elementListeners.set(eventType, handlers);
		}

		handlers.push({ handler, modifiers });

		if (DIRECT_EVENTS.has(eventType)) {
			this.ensureDirectListener(element, eventType);
		} else {
			this.ensureRootListener(eventType);
		}
	}

	public removeListener(element: Element, eventType: string, handler: EventHandler) {
		const elementListeners = this.listeners.get(element);
		if (!elementListeners) return;

		const handlers = elementListeners.get(eventType);
		if (!handlers) return;

		const index = handlers.findIndex(h => h.handler === handler);
		if (index !== -1) {
			handlers.splice(index, 1);
		}

		if (handlers.length === 0) {
			elementListeners.delete(eventType);
			this.teardownDirectListener(element, eventType);
		}
	}

	private ensureRootListener(eventType: string) {
		if (this.activeEventTypes.has(eventType)) return;

		const useCapture = eventType === "focus" || eventType === "blur";
		this.root.addEventListener(eventType, (nativeEvent: Event) => {
			this.dispatchEvent(eventType, nativeEvent);
		}, useCapture);

		this.activeEventTypes.add(eventType);
	}

	private ensureDirectListener(element: Element, eventType: string) {
		let map = this.directNativeListeners.get(element);
		if (!map) {
			map = new Map();
			this.directNativeListeners.set(element, map);
		}
		if (map.has(eventType)) return;

		const listener: EventListener = (nativeEvent: Event) => {
			this.dispatchEvent(eventType, nativeEvent);
		};
		element.addEventListener(eventType, listener);
		map.set(eventType, listener);
	}

	private teardownDirectListener(element: Element, eventType: string) {
		const map = this.directNativeListeners.get(element);
		if (!map) return;
		const listener = map.get(eventType);
		if (!listener) return;
		element.removeEventListener(eventType, listener);
		map.delete(eventType);
	}

	private dispatchEvent(eventType: string, nativeEvent: Event) {
		let path = nativeEvent.composedPath() as Element[];
		if (!path || path.length === 0) {
			// Fallback for environments where composedPath is not available or empty
			path = [];
			let current = nativeEvent.target as any;
			while (current) {
				path.push(current);
				current = current.parentNode || current.host;
			}
		}
		const syntheticEvent = new SyntheticEvent(nativeEvent);

		for (const element of path) {
			if (element === this.root as any || element === window as any) continue;
			
			const elementListeners = this.listeners.get(element);
			if (!elementListeners) continue;

			const handlers = elementListeners.get(eventType);
			if (!handlers) continue;

			// Set currentTarget to the element that has the listener
			(syntheticEvent as any).currentTarget = element;

			for (const { handler, modifiers } of [...handlers]) {
				if (modifiers.includes("self") && syntheticEvent.target !== element) continue;

				if (modifiers.includes("stop")) syntheticEvent.stopPropagation();
				if (modifiers.includes("prevent")) syntheticEvent.preventDefault();

				handler(syntheticEvent);

				if (modifiers.includes("once")) {
					this.removeListener(element, eventType, handler);
				}

				if (syntheticEvent.isImmediatePropagationStopped()) {
					break;
				}
			}

			if (syntheticEvent.isPropagationStopped()) {
				break;
			}
		}
	}
}
