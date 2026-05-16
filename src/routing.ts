import dot from "./dot";

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

// Keep the reactive state in sync with browser back/forward buttons.
if (typeof window !== "undefined") {
	window.addEventListener("popstate", () => {
		previousPath.value = currentPath.value;
		currentPath.value = window.location.pathname;
		currentSearch.value = window.location.search;
		currentHash.value = window.location.hash;
	});
}
