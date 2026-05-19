import { dot } from "../../src";

describe("Window Orchestration (Phase 3).", () => {
	let mockWindow: any;
	let originalOpen: any;

	beforeEach(() => {
		originalOpen = window.open;
		mockWindow = {
			document: {
				write: jest.fn(),
				body: document.createElement("body"),
				documentElement: document.createElement("html"),
				head: document.createElement("head"),
				createElement: (tag: string) => document.createElement(tag),
				addEventListener: jest.fn(),
				removeEventListener: jest.fn()
			},
			close: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
			focus: jest.fn(),
			screenX: 100,
			screenY: 100,
			outerWidth: 1000,
			outerHeight: 800
		};
		window.open = jest.fn().mockReturnValue(mockWindow);
		
		// Mock parent window dimensions
		Object.defineProperty(window, 'screenX', { value: 100, configurable: true });
		Object.defineProperty(window, 'screenY', { value: 100, configurable: true });
		Object.defineProperty(window, 'outerWidth', { value: 1000, configurable: true });
		Object.defineProperty(window, 'outerHeight', { value: 800, configurable: true });

		// Mock screen dimensions
		Object.defineProperty(window, 'screen', {
			value: { width: 1920, height: 1080 },
			configurable: true
		});
	});

	afterEach(() => {
		window.open = originalOpen;
	});

	describe("Positioning Engine", () => {
		test("position: 'center' calculates correct coordinates.", async () => {
			const myWindow = dot.window({
				content: { build: (d: any) => d.div("Hello") },
				width: 800,
				height: 600,
				position: "center"
			});
			await myWindow.open();

			const expectedLeft = Math.round((1920 - 800) / 2);
			const expectedTop = Math.round((1080 - 600) / 2);
			
			expect(window.open).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				expect.stringContaining(`left=${expectedLeft},top=${expectedTop}`)
			);
		});

		test("position: 'parent-center' calculates correct coordinates.", async () => {
			const myWindow = dot.window({
				content: { build: (d: any) => d.div("Hello") },
				width: 400,
				height: 300,
				position: "parent-center"
			});
			await myWindow.open();

			const expectedLeft = Math.round(100 + (1000 - 400) / 2);
			const expectedTop = Math.round(100 + (800 - 300) / 2);
			
			expect(window.open).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				expect.stringContaining(`left=${expectedLeft},top=${expectedTop}`)
			);
		});

		test("position: 'beside-parent' calculates correct coordinates.", async () => {
			const myWindow = dot.window({
				content: { build: (d: any) => d.div("Hello") },
				width: 400,
				height: 300,
				position: "beside-parent"
			});
			await myWindow.open();

			const expectedLeft = 100 + 1000;
			const expectedTop = 100;
			
			expect(window.open).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				expect.stringContaining(`left=${expectedLeft},top=${expectedTop}`)
			);
		});
	});

	describe("Event Bridge", () => {
		test("WindowWrapper.on() bridges events from child window.", async () => {
			const myWindow = dot.window({
				content: { build: (d: any) => d.div("Hello") }
			});
			const callback = jest.fn();
			myWindow.on("custom-event", callback);
			
			await myWindow.open();

			// Simulate event in child document
			const event = new CustomEvent("custom-event", { detail: { foo: "bar" } });
			
			// Find the listener attached to the child document
			const addListenerCall = (mockWindow.document.addEventListener as jest.Mock).mock.calls.find(call => call[0] === "custom-event");
			expect(addListenerCall).toBeDefined();
			const handler = addListenerCall[1];
			
			handler(event);

			expect(callback).toHaveBeenCalledWith(expect.objectContaining({
				detail: { foo: "bar" }
			}));
		});
	});

	describe("Component Portal", () => {
		test("Component can be moved to a different window/document.", async () => {
			class MyComponent {
				build(d: any) { return d.div("Portaled Content"); }
			}
			const comp = dot.create(MyComponent);
			const mainContainer = document.createElement("div");
			document.body.appendChild(mainContainer);
			
			const container = dot(mainContainer).mount(comp) as any;
			const cvdom = container._children[0];
			expect(cvdom.shadowEl.shadowRoot.innerHTML).toContain("Portaled Content");

			const myWindow = dot.window({
				content: { build: (d: any) => d.div("Placeholder") }
			});
			await myWindow.open();

			// Move the component to the new window
			cvdom._moveTo(mockWindow.document.body);

			expect(mainContainer.innerHTML).not.toContain(cvdom.component._._meta.tagName);
			expect(mockWindow.document.body.innerHTML).toContain(cvdom.component._._meta.tagName);
			expect(cvdom.shadowEl.shadowRoot.innerHTML).toContain("Portaled Content");
			
			// Cleanup
			document.body.removeChild(mainContainer);
		});
	});
});
