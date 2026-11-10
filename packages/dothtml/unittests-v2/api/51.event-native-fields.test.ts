import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import SyntheticEvent from "../../src/events/synthetic-event";

afterEach(() => {
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = "";
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Synthetic event native fields.", () => {
	test("keyboard handlers can read key and code on the wrapper.", () => {
		let event: any = null;
		dot(document.body).input({
			id: "kb",
			onKeyDown: (e: any) => { event = e; },
		} as any);

		const input = document.getElementById("kb") as HTMLInputElement;
		input.dispatchEvent(new KeyboardEvent("keydown", {
			key: "Enter",
			code: "Enter",
			bubbles: true,
			cancelable: true,
		}));

		expect(event).toBeInstanceOf(SyntheticEvent);
		expect(event.key).toBe("Enter");
		expect(event.code).toBe("Enter");
		expect(event.nativeEvent).toBeInstanceOf(KeyboardEvent);
		expect(event.nativeEvent.key).toBe("Enter");
	});

	test("mouse handlers can read button and clientX on the wrapper.", () => {
		let event: any = null;
		dot(document.body).button({
			id: "btn",
			onMouseDown: (e: any) => { event = e; },
		} as any);

		const button = document.getElementById("btn") as HTMLButtonElement;
		button.dispatchEvent(new MouseEvent("mousedown", {
			button: 2,
			clientX: 42,
			clientY: 7,
			bubbles: true,
			cancelable: true,
		}));

		expect(event).toBeInstanceOf(SyntheticEvent);
		expect(event.button).toBe(2);
		expect(event.clientX).toBe(42);
		expect(event.clientY).toBe(7);
		expect(event.target).toBe(button);
	});
});
