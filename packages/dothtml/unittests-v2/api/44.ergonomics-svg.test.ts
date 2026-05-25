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
			dot(document.body).div().h("<span>Chained</span>");
			expect(formatHTML(document.body.innerHTML)).toBe("<div></div><span>chained</span>");
		});
	});

	describe("SVG & MathML Support", () => {
		test("svg tag uses SVG namespace", () => {
			dot(document.body).svg({ id: "my-svg" });
			const svg = document.getElementById("my-svg");
			expect(svg?.namespaceURI).toBe("http://www.w3.org/2000/svg");
		});

		test("svg children use SVG namespace (nested)", () => {
			dot(document.body).svg(dot.path({ id: "my-path" }));
			const path = document.getElementById("my-path");
			expect(path?.namespaceURI).toBe("http://www.w3.org/2000/svg");
		});

		test("svg children use SVG namespace (builder)", () => {
			dot(document.body).svg(s => s.path({ id: "my-path" }));
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

	describe("Sibling Convention", () => {
		test("calling svg().path() creates siblings", () => {
			dot(document.body).svg().path();
			expect(formatHTML(document.body.innerHTML)).toBe("<svg></svg><path></path>");
		});
	});

	describe("Builder Pattern", () => {
		test("svg builder creates children", () => {
			dot(document.body).svg(s => s.circle({ r: 5 }).rect({ width: 10 }));
			expect(formatHTML(document.body.innerHTML)).toBe("<svg><circle r=5></circle><rect width=10></rect></svg>");
		});

		test("math builder creates children", () => {
			dot(document.body).math(m => m.mi("x").mo("+").mi("y"));
			expect(formatHTML(document.body.innerHTML)).toBe("<math><mi>x</mi><mo>+</mo><mi>y</mi></math>");
		});
	});

	describe("Smart SVG Adoption", () => {
		test("adopts attributes and children from full svg string", () => {
			dot(document.body).svg('<svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" /></svg>');
			expect(formatHTML(document.body.innerHTML)).toBe('<svg width=100 height=100 viewbox=0 0 100 100><circle cx=50 cy=50 r=40></circle></svg>');
		});

		test("explicit attributes take precedence over adopted ones", () => {
			dot(document.body).svg({ width: 200 }, '<svg width="100"><circle /></svg>');
			expect(formatHTML(document.body.innerHTML)).toBe('<svg width=200><circle></circle></svg>');
		});

		test("chained attributes take precedence over adopted ones", () => {
			dot(document.body).svg('<svg width="100"><circle /></svg>').attr("width", 300);
			expect(formatHTML(document.body.innerHTML)).toBe('<svg width=300><circle></circle></svg>');
		});

		test("falls back to nesting if root tag doesn't match", () => {
			// This will be nested because the root tag is 'div', not 'svg'
			dot(document.body).svg('<div><circle /></div>');
			expect(formatHTML(document.body.innerHTML)).toBe('<svg><div><circle></circle></div></svg>');
		});

		test("falls back to nesting if string is not a full tag", () => {
			dot(document.body).svg('<circle /><rect />');
			expect(formatHTML(document.body.innerHTML)).toBe('<svg><circle></circle><rect></rect></svg>');
		});
	});
});
