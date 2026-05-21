import { dot, IDotComponent } from "../../src";
import formatHTML from "./formatHTML";

afterEach(() => { 
	(dot as any).clearStores();
	document.body.innerHTML = ''; 
});

describe("DOThtml Store", () => {

	test("dot.store exists", () => {
		expect(typeof (dot as any).store).toBe("function");
	});

	test("Basic store creation and state reactivity", () => {
		const useCounterStore = (dot as any).store({
			id: "counter",
			state: () => ({
				count: 0
			}),
			actions: {
				increment() {
					this.count.value++;
				}
			}
		});

		const counter = useCounterStore();
		
		dot(document.body).div(counter.count);
		expect(formatHTML(document.body.innerHTML)).toBe("<div>0</div>");

		counter.increment();
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div>1</div>");
	});

	test("Store singleton behavior", () => {
		const useUserStore = (dot as any).store({
			id: "user",
			state: () => ({
				name: "Guest"
			})
		});

		const user1 = useUserStore();
		const user2 = useUserStore();

		expect(user1).toBe(user2);
		expect(user1.name.value).toBe("Guest");

		user1.name.value = "John";
		expect(user2.name.value).toBe("John");
	});

	test("Multiple stores work independently", () => {
		const useStoreA = (dot as any).store({
			id: "storeA",
			state: () => ({ val: "A" })
		});
		const useStoreB = (dot as any).store({
			id: "storeB",
			state: () => ({ val: "B" })
		});

		const a = useStoreA();
		const b = useStoreB();

		expect(a.val.value).toBe("A");
		expect(b.val.value).toBe("B");

		a.val.value = "A2";
		expect(a.val.value).toBe("A2");
		expect(b.val.value).toBe("B");
	});

	test("Actions can access state via this", () => {
		const useTodoStore = (dot as any).store({
			id: "todo",
			state: () => ({
				items: ["Task 1"]
			}),
			actions: {
				add(item: string) {
					this.items.value = [...this.items.value, item];
				}
			}
		});

		const todo = useTodoStore();
		todo.add("Task 2");
		expect(todo.items.value).toEqual(["Task 1", "Task 2"]);
	});

	test("Getters correctly derive state and are reactive", () => {
		const useMathStore = (dot as any).store({
			id: "math",
			state: () => ({
				count: 5
			}),
			getters: {
				doubleCount: (state: any) => state.count.value * 2,
				tripleCount() {
					return this.count.value * 3;
				}
			}
		});

		const math = useMathStore();
		expect(math.doubleCount.value).toBe(10);
		expect(math.tripleCount.value).toBe(15);

		math.count.value = 10;
		expect(math.doubleCount.value).toBe(20);
		expect(math.tripleCount.value).toBe(30);
	});

	test("Helper functions getStore, getStores, and clearStores", () => {
		(dot as any).store({ id: "s1", state: () => ({ v: 1 }) });
		(dot as any).store({ id: "s2", state: () => ({ v: 2 }) });

		expect((dot as any).getStore("s1").v.value).toBe(1);
		expect((dot as any).getStore("s2").v.value).toBe(2);

		const allStores = (dot as any).stores;
		expect(Object.keys(allStores)).toContain("s1");
		expect(Object.keys(allStores)).toContain("s2");

		(dot as any).clearStores();
		expect(Object.keys((dot as any).stores).length).toBe(0);
		expect((dot as any).getStore("s1")).toBeUndefined();
	});

	test("Anonymous stores return unique instances and are not registered", () => {
		const useAnonStore = (dot as any).store({
			state: () => ({ v: 1 })
		});

		const s1 = useAnonStore();
		const s2 = useAnonStore();

		expect(s1).not.toBe(s2);
		expect(Object.keys((dot as any).stores).length).toBe(0);
	});

	test("Manual $dispose clears state and removes from registry", () => {
		const useStore = (dot as any).store({
			id: "disposable",
			state: () => ({ v: 1 }),
			getters: { g: (s: any) => s.v.value + 1 }
		});

		const store = useStore();
		expect((dot as any).getStore("disposable")).toBe(store);

		store.$dispose();
		expect((dot as any).getStore("disposable")).toBeUndefined();
		expect(Object.keys(store._state).length).toBe(0);
		expect(Object.keys(store._getters).length).toBe(0);
	});

	test("Automatic cleanup of anonymous stores on component unmount", () => {
		const useLocalStore = (dot as any).store({
			state: () => ({ v: 1 }),
			getters: { g: (s: any) => s.v.value + 1 }
		});

		let storeInstance: any;

		@(dot.component as any)
		class MyComponent implements IDotComponent {
			store = useLocalStore();
			constructor() {
				storeInstance = this.store;
			}
			build() {
				return dot.div(this.store.v);
			}
		}

		const vdom = (dot(document.body) as any).mount(new MyComponent());
		dot.flushSync();

		expect(Object.keys(storeInstance._state).length).toBe(1);
		
		(vdom as any)._unrender();
		dot.flushSync();

		expect(Object.keys(storeInstance._state).length).toBe(0);
		expect(Object.keys(storeInstance._getters).length).toBe(0);
	});

	test("Complex inter-dependencies: actions calling actions and getters depending on getters", () => {
		const useComplexStore = (dot as any).store({
			id: "complex",
			state: () => ({
				count: 1
			}),
			getters: {
				double: (s: any) => s.count.value * 2,
				quadruple() {
					return this.double.value * 2;
				}
			},
			actions: {
				increment() {
					this.count.value++;
				},
				incrementTwice() {
					this.increment();
					this.increment();
				}
			}
		});

		const complex = useComplexStore();
		
		expect(complex.double.value).toBe(2);
		expect(complex.quadruple.value).toBe(4);

		complex.incrementTwice();
		expect(complex.count.value).toBe(3);
		expect(complex.double.value).toBe(6);
		expect(complex.quadruple.value).toBe(12);
	});
});
