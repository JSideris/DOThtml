import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Computed State", () => {
	test("Basic derivation from one watcher.", () => {
		const count = dot.watch(1);
		const doubled = dot.computed(() => count.value * 2);
		
		dot(document.body).div(doubled);
		expect(formatHTML(document.body.innerHTML)).toBe("<div>2</div>");
		
		count.value = 5;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div>10</div>");
	});

	test("Multiple dependencies.", () => {
		const firstName = dot.watch("John");
		const lastName = dot.watch("Doe");
		const fullName = dot.computed(() => `${firstName.value} ${lastName.value}`);
		
		dot(document.body).div(fullName);
		expect(formatHTML(document.body.innerHTML)).toBe("<div>john doe</div>");
		
		firstName.value = "Jane";
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div>jane doe</div>");
		
		lastName.value = "Smith";
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div>jane smith</div>");
	});

	test("Nested computeds.", () => {
		const a = dot.watch(1);
		const b = dot.computed(() => a.value + 1);
		const c = dot.computed(() => b.value * 2);
		
		dot(document.body).div(c);
		expect(formatHTML(document.body.innerHTML)).toBe("<div>4</div>"); // (1 + 1) * 2
		
		a.value = 3;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div>8</div>"); // (3 + 1) * 2
	});

	test("Conditional dependencies.", () => {
		const useA = dot.watch(true);
		const a = dot.watch(1);
		const b = dot.watch(10);
		
		let evaluations = 0;
		const dynamic = dot.computed(() => {
			evaluations++;
			return useA.value ? a.value : b.value;
		});
		
		dot(document.body).div(dynamic);
		expect(formatHTML(document.body.innerHTML)).toBe("<div>1</div>");
		expect(evaluations).toBe(1);
		
		// Update b while useA is true - should NOT trigger re-evaluation
		b.value = 20;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div>1</div>");
		
		// Update a - should trigger re-evaluation
		a.value = 2;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div>2</div>");
		
		// Switch to B
		useA.value = false;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div>20</div>");
		
		// Now update a - should NOT trigger re-evaluation
		a.value = 3;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div>20</div>");
	});

	test("Batching multiple dependency changes.", () => {
		const a = dot.watch(1);
		const b = dot.watch(2);
		
		let evaluations = 0;
		const sum = dot.computed(() => {
			evaluations++;
			return a.value + b.value;
		});
		
		dot(document.body).div(sum);
		expect(evaluations).toBe(1);
		
		// Update both in the same tick
		a.value = 10;
		b.value = 20;
		
		// Should only re-evaluate once due to scheduler
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe("<div>30</div>");
		expect(evaluations).toBe(2);
	});
});
