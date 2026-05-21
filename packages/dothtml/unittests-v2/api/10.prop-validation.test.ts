import { dot, IDotComponent, IDotDocument } from "../../src";
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

describe("Prop validation.", () => {
	class TestComponent implements IDotComponent {
		static props = {
			name: { type: String, required: true },
			age: { type: Number, default: 18 },
			tags: { type: Array, default: () => ["new"] },
			score: { 
				type: Number, 
				validator: (v: number) => v >= 0 && v <= 100 
			}
		};
		props: any;
		build() {
			return dot.div(`${this.props.name} (${this.props.age}) - ${this.props.tags.join(",")} - Score: ${this.props.score ?? "N/A"}`);
		}
	}

	test("Valid props.", () => {
		(dot(document.body) as any).mount(new TestComponent(), { name: "Alice", age: 25, score: 90 });
		const customEl = document.body.children[0];
		expect(formatHTML(customEl.shadowRoot?.innerHTML)).toBe(formatHTML("<div>Alice (25) - new - Score: 90</div>"));
	});

	test("Missing required prop.", () => {
		expect(() => {
			(dot(document.body) as any).mount(new TestComponent(), { age: 25 });
		}).toThrow("[TestComponent] Prop \"name\" is required.");
	});

	test("Default values.", () => {
		(dot(document.body) as any).mount(new TestComponent(), { name: "Bob" });
		const customEl = document.body.children[0];
		expect(formatHTML(customEl.shadowRoot?.innerHTML)).toBe(formatHTML("<div>Bob (18) - new - Score: N/A</div>"));
	});

	test("Invalid type.", () => {
		expect(() => {
			(dot(document.body) as any).mount(new TestComponent(), { name: 123 });
		}).toThrow(/expected string, but got number/i);
	});

	test("Custom validator failure.", () => {
		expect(() => {
			(dot(document.body) as any).mount(new TestComponent(), { name: "Alice", score: 150 });
		}).toThrow("[TestComponent] Prop \"score\" failed custom validation.");
	});
});
