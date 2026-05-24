import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

describe("Empty and Remove", () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="target"><span>Existing Content</span></div>';
		document.body[DOT_VDOM_PROP_NAME] = null;
	});

	test("Emptying a selected element.", () => {
		const target = document.getElementById("target")!;
		dot("#target").empty();
		expect(target.innerHTML).toBe("");
	});

	test("Empty a container with DOThtml-managed children.", () => {
		dot(document.body).div({ id: "target2" }, dot.p("Hello").span("World"));
		dot("#target2").empty();
		expect(document.getElementById("target2")?.innerHTML).toBe("");
	});

	test("Empty nested elements.", () => {
		dot(document.body).div({ id: "outer" }, 
			dot.div({ id: "inner" }, dot.p("Inside"))
		);
		
		dot("#inner").empty();
		expect(document.getElementById("inner")?.innerHTML).toBe("");
		expect(document.getElementById("outer")?.contains(document.getElementById("inner")!)).toBe(true);
	});

	test("Emptying a created element.", () => {
		const el = dot.div(dot.span("Content"));
		const container = document.createElement("div");
		(el as any)._render(container);
		const div = container.firstChild as HTMLElement;
		expect(div.innerHTML).toBe("<span>Content</span>");
		
		el.empty();
		expect(div.innerHTML).toBe("");
	});

	test("Chaining after empty.", () => {
		const target = document.getElementById("target")!;
		dot("#target").empty().p("New Content");
		expect(target.innerHTML).toBe("<p>New Content</p>");
	});

	test("Removing an element.", () => {
		const container = document.createElement("div");
		const el = dot.div("To be removed");
		(el as any)._render(container);
		expect(container.childNodes.length).toBe(1);
		
		el.remove();
		expect(container.childNodes.length).toBe(0);
	});

	test("Removing a selected element.", () => {
		const target = document.getElementById("target")!;
		dot("#target").remove();
		expect(document.getElementById("target")).toBeNull();
	});

	test("Remove a container with children.", () => {
		dot(document.body).div({ id: "outer" }, 
			dot.div({ id: "to-remove" }, dot.p("Inside"))
		);
		
		dot("#to-remove").remove();
		expect(document.getElementById("to-remove")).toBeNull();
		expect(document.getElementById("outer")?.innerHTML).toBe("");
	});
});
