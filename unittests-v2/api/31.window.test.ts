import { dot } from "../../src";

describe("Window Management.", () => {
	let mockWindow: any;
	let originalOpen: any;

	beforeEach(() => {
		originalOpen = window.open;
		mockWindow = {
			document: {
				write: jest.fn(),
				body: document.createElement("body"),
				createElement: (tag: string) => document.createElement(tag)
			},
			close: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn()
		};
		// JSDOM's window.open is a bit limited, so we mock it.
		window.open = jest.fn().mockReturnValue(mockWindow);
	});

	afterEach(() => {
		window.open = originalOpen;
		// Clean up any global listeners that might have been added
		// (though in a real test environment we'd want a more robust way to do this)
	});

	test("dot.window().open() returns a Promise.", async () => {
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") },
			title: "Test Window"
		});
		const promise = myWindow.open();
		expect(promise).toBeInstanceOf(Promise);
		await promise;
		expect(myWindow.isOpen).toBe(true);
	});

	test("dot.window().open() rejects if popup is blocked.", async () => {
		(window.open as jest.Mock).mockReturnValue(null);
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") }
		});
		await expect(myWindow.open()).rejects.toThrow("Popup window could not be opened.");
		expect(myWindow.isOpen).toBe(false);
	});

	test("Window isOpen updates when child window is closed manually.", async () => {
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") }
		});
		await myWindow.open();
		
		// Find the beforeunload handler attached to the mock window
		const beforeUnloadCall = (mockWindow.addEventListener as jest.Mock).mock.calls.find(call => call[0] === "beforeunload");
		expect(beforeUnloadCall).toBeDefined();
		const beforeUnloadHandler = beforeUnloadCall[1];
		
		// Simulate child window closing
		beforeUnloadHandler();

		expect(myWindow.isOpen).toBe(false);
	});

	test("tether: true closes child when parent unloads.", async () => {
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") },
			tether: true
		});
		await myWindow.open();

		// Simulate parent window unloading
		window.dispatchEvent(new Event("unload"));

		expect(mockWindow.close).toHaveBeenCalled();
		expect(myWindow.isOpen).toBe(false);
	});
});
