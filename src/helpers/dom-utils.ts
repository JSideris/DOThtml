/**
 * A deep-searching alternative to getElementById that traverses Shadow Roots.
 * Optimized to only recurse when a shadowRoot is present.
 */
export function getElementByIdDeep(id: string, root: Document | ShadowRoot = document): HTMLElement | null {
	// 1. Check the current root (Light DOM)
	let element = root.getElementById(id);
	if (element) return element as HTMLElement;

	// 2. Only search descendants that might have their own Shadow Roots
	const descendants = root.querySelectorAll('*');
	for (let i = 0; i < descendants.length; i++) {
		const shadowRoot = descendants[i].shadowRoot;
		if (shadowRoot) {
			element = getElementByIdDeep(id, shadowRoot);
			if (element) return element as HTMLElement;
		}
	}

	return null;
}
