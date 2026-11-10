import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => {
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = "";
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("HTML tag name aliases.", () => {
	test("thead, tbody, tfoot, and textarea aliases render the same tags as camelCase.", () => {
		(dot(document.body) as any)
			.table(
				(dot as any).thead((dot as any).tr((dot as any).th("H"))),
				(dot as any).tbody((dot as any).tr((dot as any).td("B"))),
				(dot as any).tfoot((dot as any).tr((dot as any).td("F"))),
			)
			.textarea("hi");

		const table = document.body.querySelector("table");
		expect(table).toBeTruthy();
		expect(table.querySelector("thead")).toBeTruthy();
		expect(table.querySelector("tbody")).toBeTruthy();
		expect(table.querySelector("tfoot")).toBeTruthy();
		expect((document.body.querySelector("textarea") as HTMLTextAreaElement).textContent).toBe("hi");
	});

	test("camelCase tHead still works.", () => {
		(dot(document.body) as any).table((dot as any).tHead((dot as any).tr((dot as any).th("H"))));
		expect(document.body.querySelector("thead")).toBeTruthy();
	});
});
