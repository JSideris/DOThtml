import dot from "../dot";

export const currentPath = dot.watch(typeof window !== "undefined" ? window.location.pathname : "/");
export const previousPath = dot.watch(typeof window !== "undefined" ? window.location.pathname : "/");
export const currentSearch = dot.watch(typeof window !== "undefined" ? window.location.search : "");
export const currentHash = dot.watch(typeof window !== "undefined" ? window.location.hash : "");

/**
 * Navigates to a new path programmatically.
 * @param path The path to navigate to.
 * @param replace If true, uses replaceState instead of pushState.
 */
export function navigate(path: string, replace: boolean = false) {
	if (typeof window === "undefined") return;
	
	previousPath.value = window.location.pathname;
	
	if (replace) {
		window.history.replaceState({}, "", path);
	} else {
		window.history.pushState({}, "", path);
	}
	
	currentPath.value = window.location.pathname;
	currentSearch.value = window.location.search;
	currentHash.value = window.location.hash;
}

/**
 * Returns a reactive object containing the current query parameters.
 */
export function useQueryParams() {
	return dot.computed(() => {
		const search = currentSearch.value;
		const params = new URLSearchParams(search);
		const result: Record<string, string> = {};
		params.forEach((value, key) => {
			result[key] = value;
		});
		return result;
	});
}

/**
 * Returns a reactive string containing the current hash (without the #).
 */
export function useHash() {
	return dot.computed(() => {
		const hash = currentHash.value;
		return hash.startsWith("#") ? hash.substring(1) : hash;
	});
}

// Keep the reactive state in sync with browser back/forward buttons.
if (typeof window !== "undefined") {
	window.addEventListener("popstate", () => {
		previousPath.value = currentPath.value;
		currentPath.value = window.location.pathname;
		currentSearch.value = window.location.search;
		currentHash.value = window.location.hash;
	});
}
