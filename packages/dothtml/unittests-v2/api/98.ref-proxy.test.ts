import dot from "../../src/dot";

describe("Ref Proxy set trap tests", () => {
	test("Setting ref.value should update the underlying signal and trigger effects", () => {
		const ref = dot.ref<HTMLElement>();
		let effectCalled = 0;
		let lastValue: HTMLElement | null = null;

		dot.effect(() => {
			effectCalled++;
			lastValue = ref.value;
		});

		expect(effectCalled).toBe(1);
		expect(lastValue).toBe(null);

		const el = document.createElement("div");
		// This should trigger the set trap
		ref.value = el;
		(dot as any).flushSync();

		expect(ref.value).toBe(el);
		expect(effectCalled).toBe(2);
		expect(lastValue).toBe(el);
	});

	test("Setting other properties on ref should still work", () => {
		const ref = dot.ref<any>();
		(ref as any).someProp = "test";
		expect((ref as any).someProp).toBe("test");
	});
});
