import { dot } from "../../src";

describe("Window Management.", () => {
	let mockWindow: any;
	let originalOpen: any;

	beforeEach(() => {
		originalOpen = window.open;
		mockWindow = {
			document: {
				open: jest.fn(),
				close: jest.fn(),
				write: jest.fn(),
				body: document.createElement("body"),
				createElement: (tag: string) => document.createElement(tag)
			},
			close: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
			closed: false
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
		jest.useFakeTimers();
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") }
		});
		await myWindow.open();
		
		// Find the unload handler attached to the mock window
		const unloadCall = (mockWindow.addEventListener as jest.Mock).mock.calls.find(call => call[0] === "unload");
		expect(unloadCall).toBeDefined();
		const unloadHandler = unloadCall[1];
		
		// Simulate child window closing
		mockWindow.closed = true;
		unloadHandler();

		jest.advanceTimersByTime(100);

		expect(myWindow.isOpen).toBe(false);
		jest.useRealTimers();
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

	test("tether: true closes child when parent fires pagehide.", async () => {
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") },
			tether: true
		});
		await myWindow.open();

		// Simulate parent window pagehide
		window.dispatchEvent(new Event("pagehide"));

		expect(mockWindow.close).toHaveBeenCalled();
		expect(myWindow.isOpen).toBe(false);
	});

	test("tether: true closes child when parent fires beforeunload.", async () => {
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") },
			tether: true
		});
		await myWindow.open();

		// Simulate parent window beforeunload
		window.dispatchEvent(new Event("beforeunload"));

		expect(mockWindow.close).toHaveBeenCalled();
		expect(myWindow.isOpen).toBe(false);
	});

	test("UI is not duplicated when window is reopened.", async () => {
		const getContent = () => ({ build: (d: any) => d.div("Hello") });
		
		// First open
		const myWindow1 = dot.window({ content: getContent() as any });
		await myWindow1.open();
		expect(mockWindow.document.body.children.length).toBe(1);

		// Simulate refresh - we reuse the same mockWindow but create a new WindowWrapper
		const myWindow2 = dot.window({ content: getContent() as any });
		await myWindow2.open();

		// If the bug exists, the body might have 2 children now
		expect(mockWindow.document.body.children.length).toBe(1);
	});

	test("Popup is rerendered on refresh.", async () => {
		jest.useFakeTimers();
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") }
		});
		await myWindow.open();

		// Find the unload handler
		const unloadCall = (mockWindow.addEventListener as jest.Mock).mock.calls.find(call => call[0] === "unload");
		expect(unloadCall).toBeDefined();
		const unloadHandler = unloadCall[1];

		// Simulate refresh (unload fired, but window not closed)
		mockWindow.closed = false;
		unloadHandler();

		// Fast-forward the timeout
		jest.advanceTimersByTime(100);

		// Verify setupDocument was called again (document.write should be called twice total)
		expect(mockWindow.document.write).toHaveBeenCalledTimes(2);
		expect(myWindow.isOpen).toBe(true);
		
		jest.useRealTimers();
	});

	test("Popup isOpen becomes false when closed.", async () => {
		jest.useFakeTimers();
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") }
		});
		await myWindow.open();

		const unloadCall = (mockWindow.addEventListener as jest.Mock).mock.calls.find(call => call[0] === "unload");
		const unloadHandler = unloadCall[1];

		// Simulate close
		mockWindow.closed = true;
		unloadHandler();

		jest.advanceTimersByTime(100);

		expect(myWindow.isOpen).toBe(false);
		jest.useRealTimers();
	});

	test("Popup is rerendered on multiple refreshes.", async () => {
		jest.useFakeTimers();
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") }
		});
		await myWindow.open();

		for (let i = 0; i < 3; i++) {
			// Find the LATEST unload handler (it should be re-attached every time)
			const unloadCalls = (mockWindow.addEventListener as jest.Mock).mock.calls.filter(call => call[0] === "unload");
			const latestUnloadHandler = unloadCalls[unloadCalls.length - 1][1];

			// Simulate refresh
			mockWindow.closed = false;
			latestUnloadHandler();

			// Fast-forward
			jest.advanceTimersByTime(100);

			// Verify it's still open and document was written to again
			expect(myWindow.isOpen).toBe(true);
			expect(mockWindow.document.write).toHaveBeenCalledTimes(i + 2); // 1 (initial) + (i+1) refreshes
		}
		
		jest.useRealTimers();
	});

	test("'close' event fires on manual closure but not on refresh.", async () => {
		jest.useFakeTimers();
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") }
		});
		const closeHandler = jest.fn();
		myWindow.on("close", closeHandler);
		await myWindow.open();

		// 1. Simulate Refresh
		const unloadCall = (mockWindow.addEventListener as jest.Mock).mock.calls.find(call => call[0] === "unload");
		const unloadHandler = unloadCall[1];
		mockWindow.closed = false;
		unloadHandler();
		jest.advanceTimersByTime(100);

		expect(closeHandler).not.toHaveBeenCalled();
		expect(myWindow.isOpen).toBe(true);

		// 2. Simulate Manual Close
		// Get the LATEST unload handler (it was re-attached)
		const unloadCalls = (mockWindow.addEventListener as jest.Mock).mock.calls.filter(call => call[0] === "unload");
		const latestUnloadHandler = unloadCalls[unloadCalls.length - 1][1];
		mockWindow.closed = true;
		latestUnloadHandler();
		jest.advanceTimersByTime(100);

		expect(closeHandler).toHaveBeenCalledTimes(1);
		expect(myWindow.isOpen).toBe(false);

		jest.useRealTimers();
	});

	test("'close' event fires when close() is called.", async () => {
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") }
		});
		const closeHandler = jest.fn();
		myWindow.on("close", closeHandler);
		await myWindow.open();

		myWindow.close();

		expect(closeHandler).toHaveBeenCalledTimes(1);
		expect(myWindow.isOpen).toBe(false);
	});
});
