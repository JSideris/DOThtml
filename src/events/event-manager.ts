
import SyntheticEvent from "./synthetic-event";

export type EventHandler = (e: SyntheticEvent) => void;

interface RegisteredListener {
	handler: EventHandler;
	modifiers: string[];
}

export class EventManager {
	private static managers = new Map<Document, EventManager>();

	public static getForDocument(document: Document): EventManager {
		let manager = this.managers.get(document);
		if (!manager) {
			manager = new EventManager(document);
			this.managers.set(document, manager);
		}
		return manager;
	}

	private document: Document;
	private listeners = new WeakMap<Element, Map<string, RegisteredListener[]>>();
	private activeEventTypes = new Set<string>();

	constructor(document: Document) {
		this.document = document;
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

		this.ensureGlobalListener(eventType);
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
		}
	}

	private ensureGlobalListener(eventType: string) {
		if (this.activeEventTypes.has(eventType)) return;

		const useCapture = eventType === "focus" || eventType === "blur";
		this.document.addEventListener(eventType, (nativeEvent: Event) => {
			this.dispatchEvent(eventType, nativeEvent);
		}, useCapture);

		this.activeEventTypes.add(eventType);
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
			if (element === this.document as any || element === window as any) continue;
			
			const elementListeners = this.listeners.get(element);
			if (!elementListeners) continue;

			const handlers = elementListeners.get(eventType);
			if (!handlers) continue;

			// Set currentTarget to the element that has the listener
			(syntheticEvent as any).currentTarget = element;

			for (const { handler, modifiers } of [...handlers]) {
				if (modifiers.includes("self") && nativeEvent.target !== element) continue;

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
