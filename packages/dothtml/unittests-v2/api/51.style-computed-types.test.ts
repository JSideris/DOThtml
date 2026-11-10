import { dot, IDotInput, IDotStyleBuilder } from "../../src";

describe("Style and attribute type widenings.", () => {
	test("narrowed computed is accepted by style setters.", () => {
		const color = dot.computed((): "black" | "white" => "black");
		const apply = (s: IDotStyleBuilder) => s.color(color);
		expect(typeof apply).toBe("function");
		expect(color.value).toBe("black");
	});

	test("autoComplete accepts standard HTML tokens and combinations.", () => {
		const email: IDotInput = { autoComplete: "email" };
		const combined: IDotInput = { autoComplete: "shipping given-name" };
		expect(email.autoComplete).toBe("email");
		expect(combined.autoComplete).toBe("shipping given-name");
	});
});
