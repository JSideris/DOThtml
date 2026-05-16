import dot from "./dot";
import { currentPath, previousPath, navigate } from "./routing";
import { IDotComponent } from "dothtml-interfaces";

export interface RouteDefinition {
	path: string;
	component: any | (() => Promise<any>);
	name?: string;
	title?: string | ((params: any) => string);
	children?: RouteDefinition[];
	beforeEnter?: (to: string, from: string, next: (path?: string | boolean) => void) => void;
}

type NavigationGuard = (to: string, from: string, next: (path?: string | boolean) => void) => void;
type AfterNavigationHook = (to: string, from: string) => void;

const beforeHooks: NavigationGuard[] = [];
const afterHooks: AfterNavigationHook[] = [];
let globalRoutes: RouteDefinition[] = [];

export function setGlobalRoutes(routes: RouteDefinition[]) {
	globalRoutes = routes;
}

export function getGlobalRoutes() {
	return globalRoutes;
}

/**
 * Matches a path against a list of route definitions.
 * Supports:
 * - Literal segments: "about"
 * - Parameter segments: "{id}" or ":id"
 * - Single segment wildcard: "+"
 * - Multi-segment wildcard: "*" (must be at the end)
 */
export function matchRoute(routes: RouteDefinition[], path: string, basePath: string = "") {
	const relativePath = path.startsWith(basePath) ? path.slice(basePath.length) : path;
	const pathSegments = relativePath.split("/").filter(s => s !== "");
	
	for (const route of routes) {
		const routeSegments = route.path.split("/").filter(s => s !== "");
		const params: Record<string, string> = {};
		let match = true;
		
		const hasMultiWildcard = routeSegments.indexOf("*") !== -1;
		const isPrefixMatchAllowed = !!(route.children && route.children.length > 0);

		if (!hasMultiWildcard && !isPrefixMatchAllowed && routeSegments.length !== pathSegments.length) {
			continue;
		}

		if (routeSegments.length > pathSegments.length) {
			continue;
		}
		
		for (let i = 0; i < routeSegments.length; i++) {
			const rSeg = routeSegments[i];
			const pSeg = pathSegments[i];
			
			if (rSeg === "*") {
				match = true;
				break;
			}
			
			if (pSeg === undefined) {
				match = false;
				break;
			}
			
			if (rSeg === "+") {
				continue;
			}
			
			if (rSeg.startsWith("{") && rSeg.endsWith("}")) {
				const paramName = rSeg.slice(1, -1);
				params[paramName] = pSeg;
				continue;
			}
			
			if (rSeg.startsWith(":")) {
				const paramName = rSeg.slice(1);
				params[paramName] = pSeg;
				continue;
			}
			
			if (rSeg !== pSeg) {
				match = false;
				break;
			}
		}
		
		if (match) {
			const matchedSegments = pathSegments.slice(0, routeSegments.length);
			const matchedPath = (basePath.endsWith("/") ? basePath.slice(0, -1) : basePath) + "/" + matchedSegments.join("/");
			return { route, params, matchedPath };
		}
	}
	
	return null;
}

export const Router = dot.component(
	class implements IDotComponent {
		static props = {
			routes: { type: Array, required: true },
			notFound: { type: Object, default: null },
			loading: { type: Object, default: null },
			basePath: { type: String, default: "" }
		};

		props: any;
		private resolvedComponent = dot.watch<any>(null);
		private lastPath = "";

		build(dot: any) {
			setGlobalRoutes(this.props.routes);
			return dot.div(dot.computed(() => {
				const path = currentPath.value;
				if (path === this.lastPath) return this.resolvedComponent.value;
				this.lastPath = path;

				const match = matchRoute(this.props.routes, path, this.props.basePath);
				
				if (!match) {
					this.resolvedComponent.value = this.props.notFound || dot.div("404 - Not Found");
					return this.resolvedComponent.value;
				}

				const proceed = (comp: any) => {
					let title = match.route.title;
					if (typeof title === "function") {
						title = title(match.params);
					}
					if (title) {
						document.title = title;
					}

					if (typeof comp === "function" && !comp.prototype?.build) {
						// Potential lazy loader
						const result = comp();
						if (result instanceof Promise) {
							result.then(m => {
								this.resolvedComponent.value = m.default || m;
								afterHooks.forEach(h => h(path, previousPath.value));
							});
							this.resolvedComponent.value = this.props.loading || dot.div("Loading...");
							return;
						}
					}
					this.resolvedComponent.value = comp;
					afterHooks.forEach(h => h(path, previousPath.value));
				};

				const guards = [...beforeHooks];
				if (match.route.beforeEnter) {
					guards.push(match.route.beforeEnter);
				}

				const runGuards = (index: number) => {
					if (index >= guards.length) {
						proceed(match.route.component);
						return;
					}

					guards[index](path, previousPath.value, (nextVal) => {
						if (nextVal === false) {
							navigate(previousPath.value, true);
						} else if (typeof nextVal === "string") {
							navigate(nextVal, true);
						} else {
							runGuards(index + 1);
						}
					});
				};

				this.resolvedComponent.value = this.props.loading || dot.div("Loading...");
				runGuards(0);

				return this.resolvedComponent.value;
			}).bindAs((C: any) => {
				if (!C) return null;
				
				// Re-match to get params for the current path
				const match = matchRoute(this.props.routes, currentPath.value, this.props.basePath);
				
				if (typeof C === "function" && C.prototype?.build) {
					return dot.mount(new C(), { 
						routeParams: match?.params,
						basePath: match?.matchedPath 
					});
				}
				
				return C;
			}));
		}
	}
);

(Router as any).beforeEach = (guard: NavigationGuard) => {
	beforeHooks.push(guard);
};

(Router as any).afterEach = (hook: AfterNavigationHook) => {
	afterHooks.push(hook);
};