import dot from "../../src/dot";

describe("NaN Binding Tests", () => {
	test("should recover from NaN state in text input", () => {
		const score = dot.state(NaN);
		const input = document.createElement("input");
		document.body.appendChild(input);
		dot(input).attr("bind", score.bind());
		
		// Initial state: input should be empty or at least not "NaN"
		expect(input.value).not.toBe("NaN");
		
		// Simulate user typing "100"
		input.value = "100";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		
		// The signal should have updated to "100"
		expect(score.value).toBe("100");
	});

	test("should not render 'NaN' string in attributes", () => {
		const score = dot.state(NaN);
		const div = document.createElement("div");
		dot(div).attr("data-score", score.bind());
		
		expect(div.getAttribute("data-score")).not.toBe("NaN");
		expect(div.getAttribute("data-score")).toBeNull();
	});

	test("should not render 'NaN' string in value attribute", () => {
		const score = dot.state(NaN);
		const input = document.createElement("input");
		dot(input).attr("value", score.bind());
		
		expect(input.getAttribute("value")).not.toBe("NaN");
		expect(input.value).toBe("");
	});
});
