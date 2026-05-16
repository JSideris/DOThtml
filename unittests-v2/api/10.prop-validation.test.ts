import { dot } from "../../src";
import { IDotComponent, IDotDocument } from "dothtml-interfaces";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Prop Validation", () => {
	class ValidatedComponent implements IDotComponent {
		static props = {
			name: { type: String, required: true },
			age: { type: Number, default: 18 },
			isAdmin: { type: Boolean, default: false }
		};
		props: any;
		build(): IDotDocument {
			return dot.div(`Name: ${this.props.name}, Age: ${this.props.age}, Admin: ${this.props.isAdmin}`);
		}
	}

	test("Passing valid props.", () => {
		(dot as any)(document.body).mount(new ValidatedComponent(), { name: "Josh", age: 30, isAdmin: true });
		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>Name: Josh, Age: 30, Admin: true</div>");
	});

	test("Using default values.", () => {
		(dot as any)(document.body).mount(new ValidatedComponent(), { name: "Josh" });
		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>Name: Josh, Age: 18, Admin: false</div>");
	});

	test("Missing required prop throws error.", () => {
		expect(() => {
			(dot as any)(document.body).mount(new ValidatedComponent(), { age: 30 });
		}).toThrow('Prop "name" is required for component ValidatedComponent.');
	});

	test("Invalid prop type throws error (String expected).", () => {
		expect(() => {
			(dot as any)(document.body).mount(new ValidatedComponent(), { name: 123 });
		}).toThrow('Prop "name" expected string, but got number.');
	});

	test("Invalid prop type throws error (Number expected).", () => {
		expect(() => {
			(dot as any)(document.body).mount(new ValidatedComponent(), { name: "Josh", age: "30" });
		}).toThrow('Prop "age" expected number, but got string.');
	});

	test("Array type validation.", () => {
		class ArrayComponent implements IDotComponent {
			static props = {
				tags: { type: Array, required: true }
			};
			props: any;
			build(): IDotDocument {
				return dot.div(this.props.tags.join(", "));
			}
		}

		(dot as any)(document.body).mount(new ArrayComponent(), { tags: ["a", "b"] });
		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>a, b</div>");

		expect(() => {
			(dot as any)(document.body).mount(new ArrayComponent(), { tags: "not-an-array" });
		}).toThrow('Prop "tags" expected Array, but got string.');
	});

	test("Component without schema works normally.", () => {
		class SimpleComponent implements IDotComponent {
			props: any;
			build(): IDotDocument {
				return dot.div("Simple");
			}
		}
		dot(document.body).mount(new SimpleComponent());
		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>Simple</div>");
	});
});
