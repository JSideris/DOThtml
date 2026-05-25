import { dot } from "../../src";
import formatHTML from "./formatHTML";

describe("Ergonomic HTML Injection & SVG Support", () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	describe("Reserved html Attribute Key", () => {
		test("html attribute injects raw HTML", () => {
			dot(document.body).div({ html: "<span>Raw</span>" });
			expect(formatHTML(document.body.innerHTML)).toBe("<div><span>raw</span></div>");
		});

		test("innerHtml attribute injects raw HTML", () => {
			dot(document.body).div({ innerHtml: "<span>Raw</span>" });
			expect(formatHTML(document.body.innerHTML)).toBe("<div><span>raw</span></div>");
		});

		test("html attribute works with reactive signal", () => {
			const content = dot.state("<b>Initial</b>");
			dot(document.body).div({ html: content });
			expect(formatHTML(document.body.innerHTML)).toBe("<div><b>initial</b></div>");

			content.value = "<i>Updated</i>";
			dot.flushSync();
			expect(formatHTML(document.body.innerHTML)).toBe("<div><i>updated</i></div>");
		});
	});

	describe("Formalize the .h() Alias", () => {
		test("dot.h() creates an HTML VNode", () => {
			dot(document.body).append(dot.h("<span>Direct</span>"));
			expect(formatHTML(document.body.innerHTML)).toBe("<span>direct</span>");
		});

		test(".h() can be used in a chain", () => {
			dot(document.body).svg().h("<span>Chained</span>");
			expect(formatHTML(document.body.innerHTML)).toBe("<svg><span>chained</span></svg>");
		});
	});

	describe("SVG & MathML Support", () => {
		test("svg tag uses SVG namespace", () => {
			dot(document.body).svg({ id: "my-svg" });
			const svg = document.getElementById("my-svg");
			expect(svg?.namespaceURI).toBe("http://www.w3.org/2000/svg");
		});

		test("svg children use SVG namespace", () => {
			dot(document.body).svg().path({ id: "my-path" });
			const path = document.getElementById("my-path");
			expect(path?.namespaceURI).toBe("http://www.w3.org/2000/svg");
		});

		test("math tag uses MathML namespace", () => {
			dot(document.body).math({ id: "my-math" });
			const math = document.getElementById("my-math");
			expect(math?.namespaceURI).toBe("http://www.w3.org/1998/Math/MathML");
		});
	});

	describe("Context-Aware Content", () => {
		test("svg tag treats string argument as HTML by default", () => {
			dot(document.body).svg("<path d='M10 10' />");
			expect(formatHTML(document.body.innerHTML)).toBe("<svg><path d=m10 10></path></svg>");
		});

		test("math tag treats string argument as HTML by default", () => {
			dot(document.body).math("<mi>x</mi>");
			expect(formatHTML(document.body.innerHTML)).toBe("<math><mi>x</mi></math>");
		});
	});
});
