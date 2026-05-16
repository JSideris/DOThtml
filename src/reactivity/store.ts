import Watcher from "./watcher";
import Computed from "./computed";
import { getCurrentComponent } from "../vdom-nodes/component-context";

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
			_state: {} as Record<string, Watcher>,
			_getters: {} as Record<string, Computed<any>>
		};

		// Initialize state
		if (stateFn) {
			const rawState = stateFn();
			for (const key in rawState) {
				const watcher = new Watcher();
				watcher.value = rawState[key];
				store._state[key] = watcher;
				
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
				store[key] = actions[key].bind(store);
			}
		}

		store.$dispose = () => {
			for (const key in store._getters) {
				store._getters[key].dispose();
			}
			if (id) {
				storeRegistry.delete(id);
			}
			store._state = {};
			store._getters = {};
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
