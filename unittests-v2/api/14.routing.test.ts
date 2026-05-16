import { dot, Router, navigate, currentPath, Link } from "../../src";
import formatHTML from "./formatHTML";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import { ContainerVdom } from "../../src/vdom-nodes/container-vdom";

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
	(Router as any).clearHooks();
});



describe("Routing - Basic Matching & Rendering", () => {
	test("Matches literal paths.", () => {
		const routes = [
			{ path: "/", component: dot.div("Home") },
			{ path: "/about", component: dot.div("About") }
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>home</div>");

		navigate("/about");
		(dot as any).flushSync();
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>about</div>");
	});

	test("Matches parameter segments {id}.", () => {
		const routes = [
			{ 
				path: "/user/{id}", 
				component: class {
					props: any;
					build() { return dot.div(`user: ${this.props.routeParams.id}`); }
				}
			}
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		navigate("/user/123");
		(dot as any).flushSync();
		
		// Router content is in its shadow root
		const routerShadow = document.body.children[0].shadowRoot;
		const componentHost = routerShadow?.children[0];
		expect(componentHost?.shadowRoot?.innerHTML).toContain("<div>user: 123</div>");
	});

	test("Matches parameter segments :id.", () => {
		const routes = [
			{ 
				path: "/post/:slug", 
				component: class {
					props: any;
					build() { return dot.div(`post: ${this.props.routeParams.slug}`); }
				}
			}
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		navigate("/post/hello-world");
		(dot as any).flushSync();
		
		const routerShadow = document.body.children[0].shadowRoot;
		const componentHost = routerShadow?.children[0];
		expect(componentHost?.shadowRoot?.innerHTML).toContain("<div>post: hello-world</div>");
	});


	test("Matches wildcard +.", () => {
		const routes = [
			{ path: "/any/+/thing", component: dot.div("Wildcard") }
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		navigate("/any/foo/thing");
		(dot as any).flushSync();
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>wildcard</div>");

		navigate("/any/bar/thing");
		(dot as any).flushSync();
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>wildcard</div>");
	});

	test("Matches multi-segment wildcard *.", () => {
		const routes = [
			{ path: "/files/*", component: dot.div("Files") }
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		navigate("/files/path/to/file.txt");
		(dot as any).flushSync();
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>files</div>");
	});

	test("Renders notFound component when no match.", () => {
		const routes = [
			{ path: "/", component: dot.div("Home") }
		];

		(dot(document.body) as any).mount(new Router(), { 
			routes, 
			notFound: dot.div("Custom 404") 
		});

		navigate("/nowhere");
		(dot as any).flushSync();
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>custom 404</div>");
	});
});

describe("Routing - Navigation Guards", () => {
	test("Global beforeEach guard can allow navigation.", () => {
		const routes = [{ path: "/target", component: dot.div("Target") }];
		let guardCalled = false;
		
		(Router as any).beforeEach((to: string, from: string, next: any) => {
			guardCalled = true;
			next();
		});

		(dot(document.body) as any).mount(new Router(), { routes });
		navigate("/target");
		(dot as any).flushSync();

		expect(guardCalled).toBe(true);
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>target</div>");
	});

	test("Global beforeEach guard can redirect navigation.", () => {
		const routes = [
			{ path: "/target", component: dot.div("Target") },
			{ path: "/redirected", component: dot.div("Redirected") }
		];
		
		(Router as any).beforeEach((to: string, from: string, next: any) => {
			if (to === "/target") next("/redirected");
			else next();
		});

		(dot(document.body) as any).mount(new Router(), { routes });
		navigate("/target");
		(dot as any).flushSync();

		expect(currentPath.value).toBe("/redirected");
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>redirected</div>");
	});

	test("Global beforeEach guard can cancel navigation.", () => {
		const routes = [
			{ path: "/", component: dot.div("Home") },
			{ path: "/secret", component: dot.div("Secret") }
		];
		
		(Router as any).beforeEach((to: string, from: string, next: any) => {
			if (to === "/secret") next(false);
			else next();
		});

		(dot(document.body) as any).mount(new Router(), { routes });
		navigate("/"); // Start at home
		(dot as any).flushSync();
		
		navigate("/secret");
		(dot as any).flushSync();

		expect(currentPath.value).toBe("/");
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>home</div>");
	});

	test("Route-specific beforeEnter guard.", () => {
		let guardCalled = false;
		const routes = [
			{ 
				path: "/guarded", 
				component: dot.div("Guarded"),
				beforeEnter: (to: string, from: string, next: any) => {
					guardCalled = true;
					next();
				}
			}
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		navigate("/guarded");
		(dot as any).flushSync();

		expect(guardCalled).toBe(true);
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>guarded</div>");
	});

	test("Global afterEach hook.", () => {
		const routes = [{ path: "/target", component: dot.div("Target") }];
		let hookCalledWith = null;
		
		(Router as any).afterEach((to: string, from: string) => {
			hookCalledWith = { to, from };
		});

		(dot(document.body) as any).mount(new Router(), { routes });
		navigate("/target");
		(dot as any).flushSync();

		expect(hookCalledWith).toEqual({ to: "/target", from: "/" });
	});
});


describe("Routing - Link & Named Routes", () => {
	test("Link component navigates on click.", () => {
		const routes = [
			{ path: "/", component: dot.div("Home") },
			{ path: "/about", component: dot.div("About") }
		];

		(dot(document.body) as any)
			.mount(new Router(), { routes })
			.mount(new Link(), { to: "/about", label: "Go to About" });
		
		(dot as any).flushSync();
		
		const linkHost = document.body.children[1];
		const link = linkHost.shadowRoot?.querySelector("a");
		expect(link?.getAttribute("href")).toBe("/about");

		link?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, button: 0 }));
		(dot as any).flushSync();


		expect(currentPath.value).toBe("/about");
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>about</div>");
	});

	test("Link component applies active class.", () => {
		(dot(document.body) as any).mount(new Link(), { to: "/active", label: "Link", activeClass: "is-active" });
		
		navigate("/active");
		(dot as any).flushSync();
		
		const linkHost = document.body.children[0];
		const link = linkHost.shadowRoot?.querySelector("a");
		expect(link?.classList.contains("is-active")).toBe(true);
	});

	test("Named routes and generatePath.", () => {
		const routes = [
			{ name: "user-profile", path: "/user/:id", component: dot.div("User") }
		];

		(dot(document.body) as any).mount(new Router(), { routes });
		(dot as any).flushSync();
		
		(dot(document.body) as any).mount(new Link(), { name: "user-profile", params: { id: "456" }, label: "User 456" });
		(dot as any).flushSync();
		
		const linkHost = document.body.children[1];
		const link = linkHost.shadowRoot?.querySelector("a");
		expect(link?.getAttribute("href")).toBe("/user/456");

		link?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, button: 0 }));
		(dot as any).flushSync();


		expect(currentPath.value).toBe("/user/456");
	});
});



describe("Routing - Advanced Features", () => {
	test("Lazy loading components.", async () => {
		const LazyComponent = dot.div("I am lazy");
		const routes = [
			{ 
				path: "/lazy", 
				component: () => Promise.resolve({ default: LazyComponent })
			}
		];

		(dot(document.body) as any).mount(new Router(), { 
			routes,
			loading: dot.div("Loading...")
		});

		navigate("/lazy");
		(dot as any).flushSync();

		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>loading...</div>");

		// Wait for the promise to resolve
		await new Promise(resolve => setTimeout(resolve, 100));
		(dot as any).flushSync();

		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toContain("<div>i am lazy</div>");
	});




	test("Scroll restoration on navigation.", (done) => {
		const routes = [
			{ path: "/page1", component: dot.div("Page 1").style((s: any) => s.heightPx(2000)) },
			{ path: "/page2", component: dot.div("Page 2").style((s: any) => s.heightPx(2000)) }
		];

		const scrollToSpy = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
		
		(dot(document.body) as any).mount(new Router(), { routes });

		
		navigate("/page1");
		(dot as any).flushSync();

		// Simulate scrolling down
		window.pageXOffset = 0;
		window.pageYOffset = 500;
		window.dispatchEvent(new Event("scroll"));

		navigate("/page2");
		(dot as any).flushSync();

		// Should scroll to top on new page
		setTimeout(() => {
			try {
				expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
				
				// Navigate back
				window.history.back();
				// JSDOM doesn't trigger popstate on back() automatically sometimes, 
				// but our navigate/popstate listeners should handle it.
				window.dispatchEvent(new PopStateEvent("popstate"));
				(dot as any).flushSync();

				setTimeout(() => {
					try {
						expect(scrollToSpy).toHaveBeenCalledWith(0, 500);
						scrollToSpy.mockRestore();
						done();
					} catch (e) { done(e); }
				}, 50);
			} catch (e) { done(e); }
		}, 50);
	});

	test("useQueryParams reactivity.", () => {
		const { useQueryParams } = require("../../src");
		const query = useQueryParams();
		
		dot(document.body).div(dot.computed(() => `Search: ${query.value.q || "none"}`));
		
		expect(formatHTML(document.body.innerHTML)).toContain("<div>search: none</div>");

		navigate("/?q=dothtml");
		(dot as any).flushSync();

		expect(formatHTML(document.body.innerHTML)).toContain("<div>search: dothtml</div>");
	});

	test("useHash reactivity.", () => {
		const { useHash } = require("../../src");
		const hash = useHash();
		
		dot(document.body).div(dot.computed(() => `Section: ${hash.value || "none"}`));
		
		expect(formatHTML(document.body.innerHTML)).toContain("<div>section: none</div>");

		navigate("/#features");
		(dot as any).flushSync();

		expect(formatHTML(document.body.innerHTML)).toContain("<div>section: features</div>");
	});
});



