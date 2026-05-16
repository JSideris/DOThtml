import dot from "../dot";

const getRouteInfo = () => {
	if (typeof window === "undefined") return { path: "/", search: "", hash: "" };
	
	let path = window.location.pathname;
	let search = window.location.search;
	let hash = window.location.hash;

	if (hash.startsWith("#/")) {
		const hashContent = hash.substring(1); // e.g., "/docs?id=123#section1"
		
		// Find where the path ends
		const firstMark = hashContent.search(/[?#]/);
		if (firstMark === -1) {
			path = hashContent;
			search = "";
			hash = "";
		} else {
			path = hashContent.substring(0, firstMark);
			const remainder = hashContent.substring(firstMark);
			
			const hashMark = remainder.indexOf("#");
			if (hashMark === -1) {
				search = remainder;
				hash = "";
			} else {
				search = remainder.substring(0, hashMark);
				hash = remainder.substring(hashMark);
			}
		}
	}

	return { path, search, hash };
};

const initialRoute = getRouteInfo();
export const currentPath = dot.state(initialRoute.path);
export const previousPath = dot.state(initialRoute.path);
export const currentSearch = dot.state(initialRoute.search);
export const currentHash = dot.state(initialRoute.hash);

/**
 * Navigates to a new path programmatically.
 * @param path The path to navigate to.
 * @param replace If true, uses replaceState instead of pushState.
 */
export function navigate(path: string, replace: boolean = false) {
	if (typeof window === "undefined") return;
	
	previousPath.value = currentPath.value;
	
	if (replace) {
		window.history.replaceState({}, "", path);
	} else {
		window.history.pushState({}, "", path);
	}
	
	const info = getRouteInfo();
	currentPath.value = info.path;
	currentSearch.value = info.search;
	currentHash.value = info.hash;
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
	const updateState = () => {
		const info = getRouteInfo();
		previousPath.value = currentPath.value;
		currentPath.value = info.path;
		currentSearch.value = info.search;
		currentHash.value = info.hash;
	};

	window.addEventListener("popstate", updateState);
	window.addEventListener("hashchange", updateState);
}
