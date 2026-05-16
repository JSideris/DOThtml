import { currentPath, currentHash } from "./state";

const scrollPositions = new Map<string, { x: number, y: number }>();

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
		scrollPositions.set(window.location.pathname, {
			x: window.pageXOffset,
			y: window.pageYOffset
		});
	}, { passive: true });

	currentPath.watch((newPath) => {
		// Wait for the DOM to update
		setTimeout(() => {
			const hash = currentHash.value;
			if (hash && hash.startsWith("#")) {
				const id = hash.substring(1);
				const element = document.getElementById(id);
				if (element) {
					element.scrollIntoView();
					return;
				}
			}

			const savedPosition = scrollPositions.get(newPath);
			if (savedPosition) {
				window.scrollTo(savedPosition.x, savedPosition.y);
			} else {
				window.scrollTo(0, 0);
			}
		}, 0);
	});
}
