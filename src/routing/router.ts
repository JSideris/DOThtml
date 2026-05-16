import dot from "../dot";
import { currentPath, previousPath, navigate } from "./state";
import { IDotComponent } from "dothtml-interfaces";
import { Vdom } from "../vdom-nodes/vdom";
import { ContainerVdom } from "../vdom-nodes/container-vdom";

export type DotComponentSource = any | { new (...args: any[]): IDotComponent } | Vdom;

export interface RouteDefinition {
	path: string;
	component?: DotComponentSource | (() => Promise<any>);
	redirect?: string | ((params: Record<string, string>) => string);
	name?: string;
	title?: string | ((params: Record<string, string>) => string);
	children?: RouteDefinition[];
	beforeEnter?: NavigationGuard;
}

export type NavigationGuard = (
	to: string, 
	from: string, 
	next: (path?: string | boolean) => void
) => void | string | boolean | Promise<void | string | boolean>;
type AfterNavigationHook = (to: string, from: string) => void;

const beforeHooks: NavigationGuard[] = [];
const afterHooks: AfterNavigationHook[] = [];
const globalRoutes = dot.watch<RouteDefinition[]>([]);

export function setGlobalRoutes(routes: RouteDefinition[]) {
	globalRoutes.value = routes;
}

export function getGlobalRoutes() {
	return globalRoutes.value;
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
		private currentMatch: { route: RouteDefinition, params: Record<string, string>, matchedPath: string } | null = null;
		private lastPath = "";
		private subId: number = -1;
		private loaderCache = new Map<any, any>();

		mounting() {
			this.subId = currentPath.subscribe(() => {
				(this as any)._?.cvdom.requestUpdate();
			});
		}

		unmounting() {
			currentPath._detachBinding(this.subId);
		}

		build(dot: any) {
			setGlobalRoutes(this.props.routes);
			const path = currentPath.value;
			
			const match = matchRoute(this.props.routes, path, this.props.basePath);
			this.currentMatch = match;

			const proceed = (comp: any) => {
				if (!match) return;

				let title = match.route.title;
				if (typeof title === "function") {
					title = title(match.params);
				}
				if (title) {
					document.title = title;
				}

				if (typeof comp === "function" && !comp.prototype?.build) {
					// Potential lazy loader
					if (this.loaderCache.has(comp)) {
						this.resolvedComponent.value = this.loaderCache.get(comp);
						afterHooks.forEach(h => h(path, previousPath.value));
						return;
					}

					const result = comp();
					if (result instanceof Promise) {
						result.then(m => {
							const resolved = m.default || m;
							this.loaderCache.set(comp, resolved);
							this.resolvedComponent.value = resolved;
							(this as any)._?.cvdom.requestUpdate();
							afterHooks.forEach(h => h(path, previousPath.value));
						});

						this.resolvedComponent.value = this.props.loading || dot.div("Loading...");
						return;
					}
				}
				this.resolvedComponent.value = comp;
				afterHooks.forEach(h => h(path, previousPath.value));
			};

			if (!match) {
				this.resolvedComponent.value = this.props.notFound || dot.div("404 - Not Found");
			} else if (match.route.redirect) {
				const target = typeof match.route.redirect === "function" 
					? match.route.redirect(match.params) 
					: match.route.redirect;
				navigate(target, true);
				return dot.div();
			} else {
				const guards = [...beforeHooks];
				if (match.route.beforeEnter) {
					guards.push(match.route.beforeEnter);
				}

				const runGuards = async (index: number) => {
					if (index >= guards.length) {
						proceed(match.route.component);
						return;
					}

					const guard = guards[index];
					let nextCalled = false;

					const handleNext = (nextVal?: string | boolean) => {
						if (nextCalled) return;
						nextCalled = true;

						if (nextVal === false) {
							navigate(previousPath.value, true);
						} else if (typeof nextVal === "string") {
							navigate(nextVal, true);
						} else {
							runGuards(index + 1);
						}
					};

					const result = guard(path, previousPath.value, handleNext);
					
					if (result instanceof Promise) {
						const asyncResult = await result;
						if (!nextCalled) {
							if (asyncResult === false || typeof asyncResult === "string") {
								handleNext(asyncResult);
							} else {
								handleNext();
							}
						}
					} else if (result !== undefined && !nextCalled) {
						handleNext(result as string | boolean);
					}
				};

				runGuards(0);
			}

			const C = this.resolvedComponent.value;
			if (!C) return dot.div();
			
			const currentMatch = this.currentMatch;
			
			if (typeof C === "function" && C.prototype?.build) {
				return dot.mount(new C(), { 
					routeParams: currentMatch?.params,
					basePath: currentMatch?.matchedPath 
				});
			}

			if (typeof C === "object" && C.build) {
				return dot.mount(C, {
					routeParams: currentMatch?.params,
					basePath: currentMatch?.matchedPath 
				});
			}
			
			if (C instanceof Vdom) return C;
			return dot.div(C);
		}
	}
);

(Router as any).beforeEach = (guard: NavigationGuard) => {
	beforeHooks.push(guard);
};

(Router as any).afterEach = (hook: AfterNavigationHook) => {
	afterHooks.push(hook);
};

(Router as any).clearHooks = () => {
	beforeHooks.length = 0;
	afterHooks.length = 0;
};
