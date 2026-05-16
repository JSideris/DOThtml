import { RouteDefinition } from "./router";

/**
 * Generates a path from a route name and parameters.
 * @param routes The route definitions to search.
 * @param name The name of the route.
 * @param params The parameters to inject into the path.
 * @param basePath The base path for the search (used for recursion).
 */
export function generatePath(routes: RouteDefinition[], name: string, params: any = {}, basePath: string = ""): string | null {
	for (const route of routes) {
		const fullPath = (basePath.endsWith("/") ? basePath.slice(0, -1) : basePath) + (route.path.startsWith("/") ? "" : "/") + route.path;
		
		if (route.name === name) {
			// Inject params into the path.
			let resolvedPath = fullPath;
			for (const key in params) {
				const value = params[key];
				resolvedPath = resolvedPath.replace(new RegExp(`\\{${key}\\}`, "g"), value);
				resolvedPath = resolvedPath.replace(new RegExp(`:${key}`, "g"), value);
			}
			return resolvedPath;
		}
		
		if (route.children) {
			const result = generatePath(route.children, name, params, fullPath);
			if (result) return result;
		}
	}
	
	return null;
}
