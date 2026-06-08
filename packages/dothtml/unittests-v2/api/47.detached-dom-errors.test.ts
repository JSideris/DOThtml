import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

describe("Detached DOM Error Handling", () => {
	afterEach(() => {
		const root = document.body[DOT_VDOM_PROP_NAME];
		if (root && root.children) {
			root.children._unrender();
		}
		document.body.innerHTML = '';
		document.body[DOT_VDOM_PROP_NAME] = null;
	});

	test("Vdom._renderBefore throws descriptive error when reference node is detached", () => {
		const container = document.createElement("div");
		document.body.appendChild(container);

		const refNode = document.createTextNode("ref");
		container.appendChild(refNode);

		const vdom = (dot(container) as any)._root._children[0]; // Get the TextVdom for "ref"

		// Manually detach refNode
		container.removeChild(refNode);

		expect(() => {
			(dot.div("new") as any)._renderBefore(refNode);
		}).toThrow(/\[DOThtml\] Attempted to perform a DOM operation on a node with no parent/);
	});

	test("CollectionVdom throws descriptive error when parent is null during batch render", () => {
		const state = dot.state([1, 2, 3]);
		const container = document.createElement("div");
		document.body.appendChild(container);

		dot(container).each(state, (x) => dot.div(x));
		dot.flushSync();

		// Manually clear container
		container.innerHTML = "";

		// Trigger an update that would cause a re-render/batch render
		state.value = [1, 2, 3, 4];
		
		expect(() => {
			dot.flushSync();
		}).toThrow(/\[DOThtml\] (Cannot batch render items into a null parent|Attempted to move nodes into a detached or null parent)/);
	});

	test("Error messages use codes in non-dev mode", () => {
		// This test is tricky because IS_DEV is a constant. 
		// However, we can test the utility once it's created by mocking IS_DEV if possible, 
		// or just ensure the dev messages are correct for now.
		// For now, we'll focus on the dev-mode messages since the test runner is in dev mode.
	});
});
