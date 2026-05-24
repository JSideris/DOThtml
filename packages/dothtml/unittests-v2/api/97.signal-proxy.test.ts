import dot from "../../src/dot";

describe("Signal Proxy tests", () => {
	test("Array method proxying and auto-refresh", () => {
		const list = dot.state([1, 2, 3]);
		let effectCount = 0;
		let lastValue: number[] = [];

		dot.effect(() => {
			effectCount++;
			lastValue = [...list.value];
		});

		expect(effectCount).toBe(1);
		expect(lastValue).toEqual([1, 2, 3]);

		// Test push (mutating method)
		(list as any).push(4);
		(dot as any).flushSync();

		expect(effectCount).toBe(2);
		expect(list.value).toEqual([1, 2, 3, 4]);
		expect(lastValue).toEqual([1, 2, 3, 4]);

		// Test splice (mutating method)
		(list as any).splice(1, 1);
		(dot as any).flushSync();

		expect(effectCount).toBe(3);
		expect(list.value).toEqual([1, 3, 4]);
	});

	test("Object property and method proxying", () => {
		const obj = dot.state({ 
			foo: "bar",
			greet(name: string) { return `Hello ${name}, I am ${this.foo}`; }
		});
		let effectCount = 0;

		dot.effect(() => {
			effectCount++;
			const val = obj.value.foo;
		});

		expect(effectCount).toBe(1);

		// Test property access
		expect((obj as any).foo).toBe("bar");

		// Test method call
		expect((obj as any).greet("Josh")).toBe("Hello Josh, I am bar");

		// Test property setting
		(obj as any).foo = "baz";
		(dot as any).flushSync();

		expect(effectCount).toBe(2);
		expect(obj.value.foo).toBe("baz");
		expect((obj as any).greet("Josh")).toBe("Hello Josh, I am baz");
	});

	test("Computed signals should be read-only", () => {
		const count = dot.state(1);
		const doubled = dot.computed(() => count.value * 2);

		expect(doubled.value).toBe(2);

		// Attempting to set a property on a computed signal should fail or be ignored
		// In our implementation, we want it to return false in the set trap if not writable.
		try {
			(doubled as any).value = 10;
		} catch (e) {
			// Some environments might throw in strict mode
		}
		
		expect(doubled.value).toBe(2);

		// Attempting to set a sub-property if the value is an object
		const objState = dot.state({ a: 1 });
		const computedObj = dot.computed(() => ({ ...objState.value }));
		
		try {
			(computedObj as any).a = 2;
		} catch (e) {}

		expect(computedObj.value.a).toBe(1);
	});

	test("Ref consistency (inherited proxy)", () => {
		const ref = dot.ref<HTMLDivElement>();
		const el = document.createElement("div");
		ref.value = el;

		expect(ref.element).toBe(el);
		
		// Test method proxying on Ref (should still work)
		(ref as any).setAttribute("data-test", "proxy-test");
		expect(el.getAttribute("data-test")).toBe("proxy-test");

		// Test property proxying on Ref (newly supported via Signal proxy)
		(ref as any).id = "test-id";
		expect(el.id).toBe("test-id");
	});
});
