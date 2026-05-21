import { dot, IDotComponent } from "../../src";
import { DOT_VDOM_PROP_NAME, IS_DEV } from "../../src/constants";

afterEach(() => { 
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("HMR Phase 4 Refinement", () => {
	test("generates stable tag names based on __hmrId", () => {
		const hmrId = "src/components/StableTag.ts:StableTag";

		class StableTagV1 implements IDotComponent {
			static __hmrId = hmrId;
			build() { return dot.div("V1"); }
		}

		class StableTagV2 implements IDotComponent {
			static __hmrId = hmrId;
			build() { return dot.div("V2"); }
		}

		// Mount V1
		dot(document.body).mount(new StableTagV1());
		const el1 = document.body.querySelector("[cvdom]") as HTMLElement;
		const tagName1 = el1.tagName.toLowerCase();
		
		// It should be a sanitized version of hmrId, not a random hex
		expect(tagName1).toContain("stabletag");
		expect(tagName1).not.toMatch(/dothtml-1[0-9a-f]{4}/);

		// Swap to V2
		(dot as any).hmr.swap(hmrId, StableTagV2);
		const el2 = document.body.querySelector("[cvdom]") as HTMLElement;
		const tagName2 = el2.tagName.toLowerCase();

		expect(tagName2).toBe(tagName1);
	});

	test("renders Red Box error overlay in dev mode when build() fails", () => {
		const hmrId = "src/components/ErrorProne.ts:ErrorComp";

		class ErrorProneV1 implements IDotComponent {
			static __hmrId = hmrId;
			build() { return dot.div("Working"); }
		}

		class ErrorProneV2 implements IDotComponent {
			static __hmrId = hmrId;
			build(): any {
				throw new Error("Build failed intentionally");
			}
		}

		dot(document.body).mount(new ErrorProneV1());
		const el = document.body.querySelector("[cvdom]") as HTMLElement;
		expect(el.shadowRoot?.innerHTML).toContain("Working");

		// Swap to broken V2
		(dot as any).hmr.swap(hmrId, ErrorProneV2);
		dot.flushSync();

		// Should show error overlay in Shadow DOM
		const shadow = el.shadowRoot;
		expect(shadow?.innerHTML).toContain("Build failed intentionally");
		expect(shadow?.innerHTML).toContain("background-color: rgba(255, 0, 0, 0.9)");
	});

	test("recovers from error state after fixing the component", () => {
		const hmrId = "src/components/Recoverable.ts:RecoverComp";

		class RecoverableV1 implements IDotComponent {
			static __hmrId = hmrId;
			build(): any { throw new Error("Initial failure"); }
		}

		class RecoverableV2 implements IDotComponent {
			static __hmrId = hmrId;
			build() { return dot.div("Recovered!"); }
		}

		// Mount broken V1
		try {
			dot(document.body).mount(new RecoverableV1());
		} catch (e) {
			// This is expected to throw HandledError in dev mode
		}
		const el = document.body.querySelector("[cvdom]") as HTMLElement;
		expect(el.shadowRoot?.innerHTML).toContain("Initial failure");

		// Swap to fixed V2
		(dot as any).hmr.swap(hmrId, RecoverableV2);
		dot.flushSync();

		// Should show fixed content
		expect(el.shadowRoot?.innerHTML).toContain("Recovered!");
		expect(el.shadowRoot?.innerHTML).not.toContain("Initial failure");
	});
});
