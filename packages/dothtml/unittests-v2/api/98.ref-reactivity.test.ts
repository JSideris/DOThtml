import dot from "../../src/dot";
import Signal from "../../src/reactivity/signal";

describe("Ref reactivity and Proxy tests", () => {
	test("Ref.value assignment should trigger effects", () => {
		const ref = dot.ref<HTMLElement>();
		let effectCount = 0;
		let lastValue: HTMLElement | null = null;

		dot.effect(() => {
			effectCount++;
			lastValue = ref.value;
		});

		expect(effectCount).toBe(1);
		expect(lastValue).toBe(null);

		const el = document.createElement("div");
		// This assignment should trigger the effect
		ref.value = el;
		
		// Flush sync to ensure effect runs
		(dot as any).flushSync();

		expect(ref.value).toBe(el);
		expect(effectCount).toBe(2);
		expect(lastValue).toBe(el);
	});

	test("Ref.value should be tracked as a dependency even if initially null", () => {
		const ref = dot.ref<HTMLElement>();
		let effectCount = 0;

		dot.effect(() => {
			effectCount++;
			const val = ref.value;
			if (!val) return;
			// Side effect here
		});

		expect(effectCount).toBe(1);

		const el = document.createElement("div");
		ref.value = el;
		(dot as any).flushSync();

		expect(effectCount).toBe(2);
	});

	test("Ref Proxy should correctly report _isRef and _isSignal", () => {
		const ref = dot.ref();
		expect((ref as any)._isRef).toBe(true);
		expect((ref as any)._isSignal).toBe(true);
		expect(ref instanceof Signal).toBe(true);
	});
});
