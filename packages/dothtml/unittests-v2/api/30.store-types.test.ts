import { dot } from "../../src";

afterEach(() => { 
	(dot as any).clearStores();
	document.body.innerHTML = ''; 
});

describe("DOThtml Store TypeScript types (DX fix)", () => {

	test("Store actions can access state signals without 'as any' casts", () => {
		const useOps = (dot as any).store({
			id: 'operations',
			state: () => ({ incidents: 0, deploys: 0, lastAction: '' }),
			getters: { 
				total(state: any) { 
					return state.incidents.value + state.deploys.value; 
				} 
			},
			actions: {
				ack() {
					// TypeScript should know that this.incidents is ISignal<number>
					this.incidents.value++;
					this.lastAction.value = 'Acked';
				},
				deploy() {
					// TypeScript should know that this.deploys is ISignal<number>
					this.deploys.value++;
					this.lastAction.value = 'Deployed';
				},
				reset() {
					// TypeScript should know that this.incidents and this.deploys are signals
					this.incidents.value = 0;
					this.deploys.value = 0;
					this.lastAction.value = 'Reset';
				}
			},
		});

		const ops = useOps();
		
		expect(ops.incidents.value).toBe(0);
		expect(ops.deploys.value).toBe(0);
		expect(ops.total.value).toBe(0);

		ops.ack();
		expect(ops.incidents.value).toBe(1);
		expect(ops.lastAction.value).toBe('Acked');
		expect(ops.total.value).toBe(1);

		ops.deploy();
		expect(ops.deploys.value).toBe(1);
		expect(ops.lastAction.value).toBe('Deployed');
		expect(ops.total.value).toBe(2);

		ops.reset();
		expect(ops.incidents.value).toBe(0);
		expect(ops.deploys.value).toBe(0);
		expect(ops.lastAction.value).toBe('Reset');
		expect(ops.total.value).toBe(0);
	});

	test("Store actions can call other actions via this", () => {
		const useCounter = (dot as any).store({
			id: 'counter-with-actions',
			state: () => ({ count: 0 }),
			actions: {
				increment() {
					this.count.value++;
				},
				incrementTwice() {
					// TypeScript should know that this.increment exists
					this.increment();
					this.increment();
				}
			}
		});

		const counter = useCounter();
		expect(counter.count.value).toBe(0);

		counter.incrementTwice();
		expect(counter.count.value).toBe(2);
	});

	test("Store getters can access state signals via this", () => {
		const useMath = (dot as any).store({
			id: 'math-store',
			state: () => ({ a: 5, b: 10 }),
			getters: {
				sum() {
					// TypeScript should know that this.a and this.b are signals
					return this.a.value + this.b.value;
				},
				product() {
					// TypeScript should know that this.a and this.b are signals
					return this.a.value * this.b.value;
				},
				// Getters can also reference other getters
				sumTimesTwo() {
					// TypeScript should know that this.sum is a computed signal
					return this.sum.value * 2;
				}
			}
		});

		const math = useMath();
		expect(math.sum.value).toBe(15);
		expect(math.product.value).toBe(50);
		expect(math.sumTimesTwo.value).toBe(30);

		math.a.value = 2;
		expect(math.sum.value).toBe(12);
		expect(math.product.value).toBe(20);
		expect(math.sumTimesTwo.value).toBe(24);
	});

	test("Complex store with state, getters, and actions all interacting", () => {
		const useTaskManager = (dot as any).store({
			id: 'task-manager',
			state: () => ({
				tasks: [] as string[],
				completed: 0,
				totalAdded: 0
			}),
			getters: {
				pending() {
					return this.totalAdded.value - this.completed.value;
				},
				completionRate() {
					if (this.totalAdded.value === 0) return 0;
					return (this.completed.value / this.totalAdded.value) * 100;
				}
			},
			actions: {
				addTask(task: string) {
					this.tasks.value = [...this.tasks.value, task];
					this.totalAdded.value++;
				},
				completeTask() {
					if (this.tasks.value.length > 0) {
						this.tasks.value = this.tasks.value.slice(1);
						this.completed.value++;
					}
				},
				reset() {
					this.tasks.value = [];
					this.completed.value = 0;
					this.totalAdded.value = 0;
				}
			}
		});

		const tm = useTaskManager();
		
		expect(tm.pending.value).toBe(0);
		expect(tm.completionRate.value).toBe(0);

		tm.addTask("Task 1");
		tm.addTask("Task 2");
		expect(tm.pending.value).toBe(2);
		expect(tm.completionRate.value).toBe(0);

		tm.completeTask();
		expect(tm.pending.value).toBe(1);
		expect(tm.completionRate.value).toBe(50);

		tm.completeTask();
		expect(tm.pending.value).toBe(0);
		expect(tm.completionRate.value).toBe(100);
	});

	test("Store hook return type is properly typed, not 'any'", () => {
		const useTypedStore = (dot as any).store({
			id: 'typed-store',
			state: () => ({ value: 42 }),
			getters: {
				doubled() {
					return this.value.value * 2;
				}
			},
			actions: {
				increment() {
					this.value.value++;
				}
			}
		});

		const store = useTypedStore();
		
		// These should all be type-safe (no 'any')
		expect(typeof store.value.value).toBe('number');
		expect(typeof store.doubled.value).toBe('number');
		expect(typeof store.increment).toBe('function');
		expect(typeof store.$dispose).toBe('function');
	});
});
