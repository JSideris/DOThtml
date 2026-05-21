import Signal from "./signal";
import Computed from "./computed";
import { getCurrentComponent, pushComponent, popComponent } from "../vdom-nodes/component-context";

const storeRegistry = new Map<string, any>();

export interface StoreOptions<TState, TActions, TGetters> {
	id?: string;
	state?: () => TState;
	getters?: TGetters & ThisType<TState & TGetters & { $id: string }>;
	actions?: TActions & ThisType<TState & TGetters & TActions & { $id: string }>;
}

export function createStore<
	TState extends Record<string, any>, 
	TActions extends Record<string, Function>,
	TGetters extends Record<string, (state: any) => any>
>(options: StoreOptions<TState, TActions, TGetters>) {
	const { id, state: stateFn, getters, actions } = options;

	if (id && storeRegistry.has(id)) {
		return () => storeRegistry.get(id);
	}

	const createInstance = () => {
		const store: any = {
			$id: id,
			_state: {} as Record<string, Signal>,
			_getters: {} as Record<string, Computed<any>>,
			_effects: [] as any[]
		};

		const tracker = {
			computedSignals: [],
			effects: [],
			disposables: [],
			registerComputed(w: any) { this.computedSignals.push(w); },
			registerEffect(e: any) { this.effects.push(e); },
			registerDisposable(d: any) { this.disposables.push(d); }
		};

		pushComponent(tracker as any);

		try {
			// Initialize state
			if (stateFn) {
				const rawState = stateFn();
				for (const key in rawState) {
					const val = rawState[key];
					const signal = (val as any) instanceof Signal ? (val as Signal) : new Signal();
					if (signal !== (val as any)) {
						signal.value = val;
					}
					store._state[key] = signal;
					
					Object.defineProperty(store, key, {
						get: () => store._state[key],
						enumerable: true,
						configurable: true
					});
				}
			}

			// Initialize getters - first define them as undefined so they can be accessed
			if (getters) {
				for (const key in getters) {
					Object.defineProperty(store, key, {
						get: () => store._getters[key],
						enumerable: true,
						configurable: true
					});
				}

				for (const key in getters) {
					const computed = new Computed(() => getters[key].call(store, store));
					store._getters[key] = computed;
				}
			}

			// Bind actions
			if (actions) {
				for (const key in actions) {
					store[key] = (...args: any[]) => {
						pushComponent(tracker as any);
						try {
							return actions[key].apply(store, args);
						} finally {
							popComponent();
						}
					};
				}
			}
		} finally {
			popComponent();
		}

		store._getters_list = tracker.computedSignals;
		store._effects = tracker.effects;
		store._disposables = tracker.disposables;

		store.$dispose = () => {
			for (const key in store._getters) {
				store._getters[key].dispose();
			}
			for (const computed of store._getters_list || []) {
				computed.dispose();
			}
			for (const effect of store._effects || []) {
				effect.dispose();
			}
			for (const disposable of store._disposables || []) {
				disposable();
			}
			if (id) {
				storeRegistry.delete(id);
			}
			store._state = {};
			store._getters = {};
			store._effects = [];
		};

		if (id) {
			storeRegistry.set(id, store);
		}

		return store;
	};

	let singletonStore: any;
	if (id) {
		singletonStore = createInstance();
	}

	return () => {
		let currentStore = id ? singletonStore : createInstance();
		
		if (!id) {
			const currentComponent = getCurrentComponent();
			if (currentComponent && (currentComponent as any).registerDisposable) {
				(currentComponent as any).registerDisposable(() => currentStore.$dispose());
			}
		}
		return currentStore;
	};
}

export function getStore(id: string) {
	return storeRegistry.get(id);
}

export function clearStores() {
	storeRegistry.forEach(store => store.$dispose());
	storeRegistry.clear();
}

export function getStores() {
	const stores: Record<string, any> = {};
	storeRegistry.forEach((store, id) => {
		stores[id] = store;
	});
	return stores;
}
