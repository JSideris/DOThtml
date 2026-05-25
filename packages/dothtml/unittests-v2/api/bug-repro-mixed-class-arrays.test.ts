import { dot } from "../../src";
import formatHTML from "./formatHTML";

afterEach(() => { 
	document.body.innerHTML = ''; 
});

describe("Bug Repro: Mixed Class Arrays", () => {
	test("should correctly flatten mixed class arrays with objects", () => {
		dot(document.body).div({ 
			class: ["a", { b: true, c: false }, "d"] 
		});
		// Current buggy behavior: <div class="a [object Object] d"></div>
		// Expected behavior: <div class="a b d"></div>
		expect(formatHTML(document.body.innerHTML)).toBe('<div class=a b d></div>');
	});

	test("should correctly flatten nested arrays in class attribute", () => {
		dot(document.body).div({ 
			class: ["a", ["b", "c"], "d"] 
		});
		// Current behavior (via join): <div class="a b,c d"></div>
		// Expected behavior: <div class="a b c d"></div>
		expect(formatHTML(document.body.innerHTML)).toBe('<div class=a b c d></div>');
	});

	test("should resolve signals inside mixed class arrays and be reactive", () => {
		const isActive = dot.state(true);
		dot(document.body).div({ 
			class: ["btn", { "active": isActive }] 
		});
		
		expect(formatHTML(document.body.innerHTML)).toBe('<div class=btn active></div>');
		
		isActive.value = false;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe('<div class=btn></div>');
		
		isActive.value = true;
		dot.flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe('<div class=btn active></div>');
	});
});
