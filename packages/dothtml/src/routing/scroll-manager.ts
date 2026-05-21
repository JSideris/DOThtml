import { currentPath, currentHash } from "./state";
import { getElementByIdDeep } from "../helpers/dom-utils";
import dot from "../dot";

const scrollPositions = new Map<string, { x: number, y: number }>();
let scrollTimeout: any = null;

/**
 * Performs scrolling based on the current hash or saved position.
 */
function performScroll(path: string, smooth: boolean = false) {
	const hash = currentHash.value;
	if (hash && hash.startsWith("#")) {
		const id = hash.substring(1);
		const element = getElementByIdDeep(id);
		if (element) {
			const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			element.scrollIntoView({ 
				behavior: smooth && !prefersReducedMotion ? "smooth" : "auto" 
			});
			return;
		}
	}

	const savedPosition = scrollPositions.get(path);
	if (savedPosition) {
		window.scrollTo(savedPosition.x, savedPosition.y);
	} else {
		window.scrollTo(0, 0);
	}
}

/**
 * Schedules a scroll operation, cancelling any previously scheduled one.
 */
function scheduleScroll(path: string, smooth: boolean) {
	if (scrollTimeout) clearTimeout(scrollTimeout);
	scrollTimeout = setTimeout(() => {
		performScroll(path, smooth);
		scrollTimeout = null;
	}, 0);
}

/**
 * Initializes the scroll manager.
 * Listens for path changes and manages scroll behavior.
 */
export function initScrollManager() {
	if (typeof window === "undefined") return;

	// Save scroll position before navigation (if possible)
	// Note: popstate happens after the URL has changed, so we need to save the position
	// of the *previous* page.
	
	window.addEventListener("scroll", () => {
		scrollPositions.set(currentPath.value, {
			x: window.pageXOffset,
			y: window.pageYOffset
		});
	}, { passive: true });

	const routeState = dot.computed(() => ({
		path: currentPath.value,
		hash: currentHash.value
	}));

	routeState.subscribe((state) => {
		// Wait for the DOM to update
		scheduleScroll(state.path, true);
	});

	// Handle initial scroll
	scheduleScroll(currentPath.value, false);
}
