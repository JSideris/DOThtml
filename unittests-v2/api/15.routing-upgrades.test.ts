import { dot, Router, navigate, currentPath } from "../../src";
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
	window.history.replaceState({}, "", "/");
	currentPath.value = "/";
	(Router as any).clearHooks();
});

describe("Routing - Upgrades", () => {
	test("Declarative redirects (string).", () => {
		const routes = [
			{ path: "/", component: dot.div("Home") },
			{ path: "/old", redirect: "/new" },
			{ path: "/new", component: dot.div("New") }
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		navigate("/old");
		(dot as any).flushSync();

		expect(currentPath.value).toBe("/new");
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>new</div>");
	});

	test("Declarative redirects (function).", () => {
		const routes = [
			{ path: "/user/:id", redirect: (params: any) => `/profile/${params.id}` },
			{ 
				path: "/profile/:id", 
				component: class {
					props: any;
					build() { return dot.div(`profile: ${this.props.routeParams.id}`); }
				}
			}
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		navigate("/user/123");
		(dot as any).flushSync();

		expect(currentPath.value).toBe("/profile/123");
		const routerShadow = document.body.children[0].shadowRoot;
		const componentHost = routerShadow?.children[0];
		expect(componentHost?.shadowRoot?.innerHTML).toContain("<div>profile: 123</div>");
	});

	test("Async navigation guards (return boolean).", async () => {
		const routes = [
			{ path: "/", component: dot.div("Home") },
			{ path: "/secret", component: dot.div("Secret") }
		];

		let allowed = false;
		(Router as any).beforeEach(async (to: string) => {
			await new Promise(resolve => setTimeout(resolve, 10));
			return to === "/secret" ? allowed : true;
		});

		(dot(document.body) as any).mount(new Router(), { routes });
		
		navigate("/secret");
		(dot as any).flushSync();
		await new Promise(resolve => setTimeout(resolve, 50));
		(dot as any).flushSync();

		// Should still be at home because allowed is false
		expect(currentPath.value).toBe("/");

		allowed = true;
		navigate("/secret");
		(dot as any).flushSync();
		await new Promise(resolve => setTimeout(resolve, 50));
		(dot as any).flushSync();

		expect(currentPath.value).toBe("/secret");
	});

	test("Async navigation guards (return string redirect).", async () => {
		const routes = [
			{ path: "/login", component: dot.div("Login") },
			{ path: "/dashboard", component: dot.div("Dashboard") }
		];

		(Router as any).beforeEach(async (to: string) => {
			if (to === "/dashboard") {
				return "/login";
			}
		});

		(dot(document.body) as any).mount(new Router(), { routes });
		
		navigate("/dashboard");
		(dot as any).flushSync();
		await new Promise(resolve => setTimeout(resolve, 50));
		(dot as any).flushSync();

		expect(currentPath.value).toBe("/login");
	});

	test("Sync navigation guards (return value).", () => {
		const routes = [
			{ path: "/a", component: dot.div("A") },
			{ path: "/b", component: dot.div("B") }
		];

		(Router as any).beforeEach((to: string) => {
			if (to === "/a") return "/b";
		});

		(dot(document.body) as any).mount(new Router(), { routes });
		
		navigate("/a");
		(dot as any).flushSync();

		expect(currentPath.value).toBe("/b");
	});

	test("Performance: Match result is cached during build.", () => {
		const routes = [
			{ path: "/test", component: dot.div("Test") }
		];

		const router = new Router();
		(dot(document.body) as any).mount(router, { routes });
		navigate("/test");
		(dot as any).flushSync();
		
		// Accessing private currentMatch to verify it's set
		expect((router as any).currentMatch).not.toBeNull();
		expect((router as any).currentMatch.route.path).toBe("/test");
	});
});
