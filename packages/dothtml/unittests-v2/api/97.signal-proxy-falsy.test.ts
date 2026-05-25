import dot from "../../src/dot";

describe("Signal Proxy Falsy Values", () => {
	test("should return the correct value for falsy states", () => {
		const boolSig = dot.state(false);
		expect(boolSig.value).toBe(false);

		const numSig = dot.state(0);
		expect(numSig.value).toBe(0);

		const strSig = dot.state("");
		expect(strSig.value).toBe("");
	});

	test("should allow calling methods on falsy values via proxy", () => {
		const boolSig = dot.state(false);
		expect((boolSig as any).toString()).toBe("false");

		const numSig = dot.state(0);
		expect((numSig as any).toString()).toBe("0");

		const strSig = dot.state("");
		expect((strSig as any).length).toBe(0);
	});
});
