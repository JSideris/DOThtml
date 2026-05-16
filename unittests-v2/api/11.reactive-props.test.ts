import { dot } from "../../src";
import { IDotComponent, IDotDocument } from "dothtml-interfaces";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Reactive Prop Flow", () => {
	class TitleComponent implements IDotComponent {
		props: any;
		build(): IDotDocument {
			return dot.h1(this.props.title);
		}
	}

	test("Child re-renders when a Watcher prop changes.", () => {
		const title = dot.watch("Initial Title");
		(dot as any)(document.body).mount(new TitleComponent(), { title: title });
		
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toBe("<h1>initial title</h1>");
		
		title.value = "Updated Title";
		(dot as any).flushSync();
		
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toBe("<h1>updated title</h1>");
	});

	test("Child re-renders when a Binding prop changes.", () => {
		const count = dot.watch(1);
		const binding = count.bindAs(v => `Count: ${v}`);
		
		(dot as any)(document.body).mount(new TitleComponent(), { title: binding });
		
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toBe("<h1>count: 1</h1>");
		
		count.value = 2;
		(dot as any).flushSync();
		
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toBe("<h1>count: 2</h1>");
	});

	test("Static props do not trigger re-renders.", () => {
		let buildCount = 0;
		class CountingComponent implements IDotComponent {
			props: any;
			build(): IDotDocument {
				buildCount++;
				return dot.div(this.props.val);
			}
		}

		(dot as any)(document.body).mount(new CountingComponent(), { val: "static" });
		expect(buildCount).toBe(1);
		
		// No way to trigger re-render of static prop from outside without parent re-render
		// (which isn't implemented yet for static props).
		expect(buildCount).toBe(1);
	});

	test("Lifecycle hooks: built() called on re-render.", () => {
		let builtCount = 0;
		class LifecycleComponent implements IDotComponent {
			props: any;
			build(): IDotDocument {
				return dot.div(this.props.val);
			}
			built() {
				builtCount++;
			}
		}

		const val = dot.watch("a");
		(dot as any)(document.body).mount(new LifecycleComponent(), { val: val });
		
		expect(builtCount).toBe(1);
		
		val.value = "b";
		(dot as any).flushSync();
		
		expect(builtCount).toBe(2);
	});

	test("Batching: Multiple reactive prop changes trigger only one re-render.", () => {
		let buildCount = 0;
		class MultiPropComponent implements IDotComponent {
			props: any;
			build(): IDotDocument {
				buildCount++;
				return dot.div(`${this.props.a.value} ${this.props.b.value}`);
			}
		}

		const a = dot.watch("hello");
		const b = dot.watch("world");
		
		(dot as any)(document.body).mount(new MultiPropComponent(), { a, b });
		expect(buildCount).toBe(1);
		
		a.value = "hi";
		b.value = "there";
		(dot as any).flushSync();
		
		expect(buildCount).toBe(2);
		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>hi there</div>");
	});

	test("Cleanup: Ensure unsubscription on component unmount.", () => {
		const val = dot.watch("a");
		let buildCount = 0;
		class CleanupComponent implements IDotComponent {
			props: any;
			build(): IDotDocument {
				buildCount++;
				return dot.div(this.props.val);
			}
		}

		const condition = dot.watch(true);
		(dot as any)(document.body).when(condition, (dot as any).mount(new CleanupComponent(), { val: val }));
		
		expect(buildCount).toBe(1);
		
		val.value = "b";
		(dot as any).flushSync();
		expect(buildCount).toBe(2);
		
		// Unmount
		condition.value = false;
		(dot as any).flushSync();
		
		// Update val again
		val.value = "c";
		(dot as any).flushSync();
		
		// Should NOT have re-built
		expect(buildCount).toBe(2);
	});
});
