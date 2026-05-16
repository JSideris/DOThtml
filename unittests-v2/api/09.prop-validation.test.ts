import { FrameworkItems, IDotComponent, IDotDocument } from "dothtml-interfaces";
import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

class ValidatedComponent implements IDotComponent {
	static props = {
		name: { type: String, required: true },
		age: { type: Number, default: 18 },
		tags: { type: Array, default: () => ["new"] },
		metadata: { type: Object, default: () => ({}) },
		onAction: { type: Function },
		score: { 
			type: Number, 
			validator: (v: number) => v >= 0 && v <= 100 
		}
	};

	props: any;
	_: FrameworkItems;

	build(): IDotDocument {
		return dot.div(
			dot.p(this.props.name)
			   .p(this.props.age)
			   .p(this.props.tags.join(","))
		);
	}
}

describe("Prop Validation", () => {
	test("Required prop missing throws error.", () => {
		expect(() => {
			dot(document.body).mount(new ValidatedComponent());
		}).toThrow("[ValidatedComponent] Prop \"name\" is required.");
	});

	test("Default values are applied.", () => {
		(dot(document.body) as any).mount(new ValidatedComponent(), { name: "John" });
		const shadow = document.body.children[0].shadowRoot!;
		expect(shadow.querySelectorAll("p")[0].textContent).toBe("John");
		expect(shadow.querySelectorAll("p")[1].textContent).toBe("18");
		expect(shadow.querySelectorAll("p")[2].textContent).toBe("new");
	});

	test("Type validation: String.", () => {
		expect(() => {
			(dot(document.body) as any).mount(new ValidatedComponent(), { name: 123 });
		}).toThrow("[ValidatedComponent] Prop \"name\" expected String, but got number.");
	});

	test("Type validation: Number.", () => {
		expect(() => {
			(dot(document.body) as any).mount(new ValidatedComponent(), { name: "John", age: "18" });
		}).toThrow("[ValidatedComponent] Prop \"age\" expected Number, but got string.");
	});

	test("Type validation: Array.", () => {
		expect(() => {
			(dot(document.body) as any).mount(new ValidatedComponent(), { name: "John", tags: {} });
		}).toThrow("[ValidatedComponent] Prop \"tags\" expected Array, but got object.");
	});

	test("Type validation: Object.", () => {
		expect(() => {
			(dot(document.body) as any).mount(new ValidatedComponent(), { name: "John", metadata: [] });
		}).toThrow("[ValidatedComponent] Prop \"metadata\" expected Object, but got Array.");
	});

	test("Custom validator.", () => {
		expect(() => {
			(dot(document.body) as any).mount(new ValidatedComponent(), { name: "John", score: 150 });
		}).toThrow("[ValidatedComponent] Prop \"score\" failed custom validation.");
	});

	test("Reactive validation.", () => {
		const score = dot.watch(50);
		(dot(document.body) as any).mount(new ValidatedComponent(), { name: "John", score: score });
		
		expect(() => {
			score.value = 150;
			dot.flushSync();
		}).toThrow("[ValidatedComponent] Prop \"score\" failed custom validation.");
	});
});
