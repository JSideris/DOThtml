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
});
