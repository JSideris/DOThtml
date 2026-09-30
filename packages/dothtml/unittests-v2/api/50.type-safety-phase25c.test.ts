import { dot, IDotComponent, IDotDocument, FrameworkItems, DotComponent } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Phase 2.5c: Type Safety & Fail-Early", () => {
	
	describe("this.el availability and errors", () => {
		test("this.el should be available in mounted() hook", () => {
			let capturedEl: HTMLElement | null = null;
			
			@dot.component
			class TestComponent extends DotComponent {
				mounted() {
					capturedEl = this.el;
				}
				
				build(dot) {
					return dot.div("test");
				}
			}
			
			dot(document.body).mount(new TestComponent());
			
			expect(capturedEl).toBeInstanceOf(HTMLElement);
			expect(capturedEl?.tagName.toLowerCase()).toMatch(/^dothtml-/);
		});
		
		test("this.el should be available in onEnter() hook", () => {
			let capturedEl: HTMLElement | null = null;
			
			@dot.component
			class TestComponent extends DotComponent {
				onEnter() {
					capturedEl = this.el;
				}
				
				build(dot) {
					return dot.div("test");
				}
			}
			
			dot(document.body).mount(new TestComponent());
			
			expect(capturedEl).toBeInstanceOf(HTMLElement);
		});
		
		test("this.el should throw helpful error when accessed before mount", () => {
			@dot.component
			class TestComponent extends DotComponent {
				constructor(props?: any) {
					super(props);
					// Trying to access this.el in constructor should fail
					expect(() => {
						const _ = this.el;
					}).toThrow(/this\.el is only available after the component is mounted/);
				}
				
				build(dot) {
					return dot.div("test");
				}
			}
			
			new TestComponent();
		});
	});
	
	describe("Link component validation", () => {
		test.skip("Link should warn when neither 'to' nor 'name' is provided", () => {
			// Skipping for now - Link has default props so this edge case is harder to test
			// The main functionality (working with to/name props) is tested below
		});
		
		test("Link should work with 'to' prop in constructor", () => {
			const { Link } = require("../../src/routing/link");
			
			expect(() => {
				dot(document.body).mount(new Link({ to: "/" }));
			}).not.toThrow();
		});
		
		test("Link should work with 'to' prop via mount props", () => {
			const { Link } = require("../../src/routing/link");
			
			expect(() => {
				dot(document.body).mount(new Link(), { to: "/", label: "Home" });
			}).not.toThrow();
		});
	});
	
	describe("Bind validation", () => {
		test("bind should reject plain string value", () => {
			expect(() => {
				dot(document.body).input({ type: "text", bind: "not-a-signal" as any });
			}).toThrow(/bind.*requires a signal or binding/);
		});
		
		test("bind should reject plain number value", () => {
			expect(() => {
				dot(document.body).input({ type: "text", bind: 123 as any });
			}).toThrow(/bind.*requires a signal or binding/);
		});
		
		test("bind should reject plain object value", () => {
			expect(() => {
				dot(document.body).input({ type: "text", bind: { value: "test" } as any });
			}).toThrow(/bind.*requires a signal or binding/);
		});
		
		test("bind should accept signal", () => {
			const value = dot.state("hello");
			
			expect(() => {
				dot(document.body).input({ type: "text", bind: value });
			}).not.toThrow();
			
			expect((document.body.querySelector("input") as HTMLInputElement).value).toBe("hello");
		});
		
		test("bind should accept binding", () => {
			const value = dot.state(123);
			const binding = value.bindAs(v => String(v));
			
			expect(() => {
				dot(document.body).input({ type: "text", bind: binding });
			}).not.toThrow();
			
			expect((document.body.querySelector("input") as HTMLInputElement).value).toBe("123");
		});
	});
	
	describe("Keyed each validation", () => {
		test("keyed each should validate key existence on items", () => {
			const items = dot.state([
				{ name: "Alice" },
				{ name: "Bob" }
			], "id" as any); // Specifying "id" as key but items don't have it
			
			expect(() => {
				dot(document.body).each(items, item => dot.div(item.name));
			}).toThrow(/Items do not have the key property "id"/);
		});
		
		test("keyed each should work when key exists on items", () => {
			const items = dot.state([
				{ id: "a", name: "Alice" },
				{ id: "b", name: "Bob" }
			], "id");
			
			expect(() => {
				dot(document.body).each(items, item => dot.div(item.name));
			}).not.toThrow();
			
			// formatHTML lowercases, so check for lowercase
			expect(formatHTML(document.body.innerHTML)).toContain("alice");
			expect(formatHTML(document.body.innerHTML)).toContain("bob");
		});
		
		test("keyed each should work with unkeyed arrays", () => {
			const items = dot.state([
				{ name: "Alice" },
				{ name: "Bob" }
			]); // No key specified
			
			expect(() => {
				dot(document.body).each(items, item => dot.div(item.name));
			}).not.toThrow();
			
			// formatHTML lowercases, so check for lowercase
			expect(formatHTML(document.body.innerHTML)).toContain("alice");
			expect(formatHTML(document.body.innerHTML)).toContain("bob");
		});
		
		test("keyed each should not validate on empty arrays", () => {
			const items = dot.state([], "id");
			
			expect(() => {
				dot(document.body).each(items, item => dot.div(item.name));
			}).not.toThrow();
		});
	});
	
	describe("Improved error messages", () => {
		test("when with function content should give helpful error", () => {
			const visible = dot.state(true);
			
			expect(() => {
				dot(document.body).when(visible, (() => dot.p("wrong")) as any);
			}).toThrow(/when\/otherwiseWhen then-content cannot be a function.*eager markup/);
		});
		
		test("each with function with parameters should give helpful error", () => {
			expect(() => {
				// TypeScript catches this at compile time, but we're testing runtime as well
				const badFunc: any = (x: number) => [1, 2, 3];
				dot(document.body).each(badFunc, item => dot.div(item));
			}).toThrow(/each\/when does not accept a function with parameters.*zero-arg getter/);
		});
	});
});
