import { dot, Router, navigate, currentPath, currentSearch, currentHash, Link } from "../../src";
import formatHTML from "./formatHTML";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

beforeAll(() => {
	// Mock scrollTo which is not implemented in JSDOM
	window.scrollTo = jest.fn();
});

afterEach(() => { 
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
	// Reset history and path
	window.history.replaceState({}, "", "/");
	currentPath.value = "/";
	currentSearch.value = "";
	currentHash.value = "";
	(Router as any).clearHooks();
});

describe("Routing - Hash-Based Navigation", () => {
	test("Navigating to a hash-based path updates currentPath.", () => {
		const routes = [
			{ path: "/", component: dot.div("Home") },
			{ path: "/about", component: dot.div("About") }
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		
		// Simulate hash navigation
		window.location.hash = "#/about";
		window.dispatchEvent(new HashChangeEvent("hashchange"));
		(dot as any).flushSync();

		expect(currentPath.value).toBe("/about");
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>about</div>");
	});

	test("Hash-based paths with query parameters.", () => {
		const routes = [
			{ path: "/docs", component: dot.div("Docs") }
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		
		window.location.hash = "#/docs?id=123";
		window.dispatchEvent(new HashChangeEvent("hashchange"));
		(dot as any).flushSync();

		expect(currentPath.value).toBe("/docs");
		expect(currentSearch.value).toBe("?id=123");
	});

	test("Hash-based paths with anchors.", () => {
		const routes = [
			{ path: "/docs", component: dot.div("Docs") }
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		
		window.location.hash = "#/docs#section1";
		window.dispatchEvent(new HashChangeEvent("hashchange"));
		(dot as any).flushSync();

		expect(currentPath.value).toBe("/docs");
		expect(currentHash.value).toBe("#section1");
	});

	test("Hash-based paths with both query parameters and anchors.", () => {
		const routes = [
			{ path: "/docs", component: dot.div("Docs") }
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		
		window.location.hash = "#/docs?id=123#section1";
		window.dispatchEvent(new HashChangeEvent("hashchange"));
		(dot as any).flushSync();

		expect(currentPath.value).toBe("/docs");
		expect(currentSearch.value).toBe("?id=123");
		expect(currentHash.value).toBe("#section1");
	});

	test("Link component applies active class for hash paths.", () => {
		(dot(document.body) as any).mount(new Link(), { to: "#/active", label: "Link", activeClass: "is-active" });
		
		window.location.hash = "#/active";
		window.dispatchEvent(new HashChangeEvent("hashchange"));
		(dot as any).flushSync();
		
		const linkHost = document.body.children[0];
		const link = linkHost.shadowRoot?.querySelector("a");
		expect(link?.classList.contains("is-active")).toBe(true);
	});

	test("navigate() supports hash-based navigation.", () => {
		const routes = [
			{ path: "/target", component: dot.div("Target") }
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		
		navigate("#/target");
		(dot as any).flushSync();

		expect(currentPath.value).toBe("/target");
		expect(window.location.hash).toBe("#/target");
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>target</div>");
	});
});
