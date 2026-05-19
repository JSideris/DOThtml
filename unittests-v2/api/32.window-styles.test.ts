import { dot } from "../../src";

describe("Window Style Syncing.", () => {
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
				adoptedStyleSheets: []
			},
			close: jest.fn(),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn()
		};
		window.open = jest.fn().mockReturnValue(mockWindow);
	});

	afterEach(() => {
		window.open = originalOpen;
	});

	test("syncStyles: true copies body class name.", async () => {
		document.body.className = "dark-theme custom-class";
		
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") },
			syncStyles: true
		});
		await myWindow.open();

		expect(mockWindow.document.body.className).toBe("dark-theme custom-class");
		
		// Cleanup
		document.body.className = "";
	});

	test("syncStyles: true copies CSS variables from :root.", async () => {
		document.documentElement.style.setProperty("--main-color", "red");
		
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") },
			syncStyles: true
		});
		await myWindow.open();

		expect(mockWindow.document.documentElement.style.getPropertyValue("--main-color")).toBe("red");
		
		// Cleanup
		document.documentElement.style.removeProperty("--main-color");
	});

	test("syncStyles: true copies adoptedStyleSheets.", async () => {
		// JSDOM might not support CSSStyleSheet fully, but we can mock it or check if it exists.
		if (typeof CSSStyleSheet !== "undefined") {
			const sheet = new CSSStyleSheet();
			if(!sheet.replaceSync) sheet.replaceSync = jest.fn();
			sheet.replaceSync("body { color: red; }");
			// Mock cssRules if needed
			(sheet as any).cssRules = [{ cssText: "body { color: red; }" }];
			
			document.adoptedStyleSheets = [sheet];
			
			const myWindow = dot.window({
				content: { build: (d: any) => d.div("Hello") },
				syncStyles: true
			});
			await myWindow.open();

			expect(mockWindow.document.adoptedStyleSheets.length).toBe(1);
			
			// Cleanup
			document.adoptedStyleSheets = [];
		}
	});

	test("syncStyles: true copies <style> tags.", async () => {
		const style = document.createElement("style");
		style.textContent = ".test { display: block; }";
		document.head.appendChild(style);
		
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") },
			syncStyles: true
		});
		await myWindow.open();

		const copiedStyle = mockWindow.document.head.querySelector("style");
		expect(copiedStyle).toBeDefined();
		expect(copiedStyle.textContent).toBe(".test { display: block; }");
		
		// Cleanup
		document.head.removeChild(style);
	});

	test("syncStyles: true copies <link> tags.", async () => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "test.css";
		document.head.appendChild(link);
		
		const myWindow = dot.window({
			content: { build: (d: any) => d.div("Hello") },
			syncStyles: true
		});
		await myWindow.open();

		const copiedLink = mockWindow.document.head.querySelector("link");
		expect(copiedLink).toBeDefined();
		expect(copiedLink.getAttribute("rel")).toBe("stylesheet");
		expect(copiedLink.getAttribute("href")).toBe("test.css");
		
		// Cleanup
		document.head.removeChild(link);
	});
});
