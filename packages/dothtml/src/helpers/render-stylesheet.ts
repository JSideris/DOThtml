import { IDotCss } from "dothtml-interfaces";

const stylesheetCache = new WeakMap<Document, Map<string, CSSStyleSheet>>();

export default function renderStylesheet(styleCallback: string|CSSStyleSheet|((css: any)=>(string|IDotCss)), document: Document): CSSStyleSheet|HTMLStyleElement {

	let finalStylesheet = "";

	if (styleCallback instanceof (document.defaultView as any)?.CSSStyleSheet) {
		return styleCallback as CSSStyleSheet;
	}

	if (typeof styleCallback == "string") {
		finalStylesheet = styleCallback;
	}
	else if (typeof styleCallback == "function") {
		let css = null;
		let styles = styleCallback(css);

		if (typeof styles == "string") {
			finalStylesheet = styles;
		}
		else {
			// TODO: handle dot syntax if needed.
		}
	}

	let docCache = stylesheetCache.get(document);
	if (!docCache) {
		docCache = new Map();
		stylesheetCache.set(document, docCache);
	}

	if (docCache.has(finalStylesheet)) {
		return docCache.get(finalStylesheet);
	}

	let DocumentCSSStyleSheet = (document.defaultView as any)?.CSSStyleSheet;

	if (DocumentCSSStyleSheet) {
		try {
			let sharedStyles = new DocumentCSSStyleSheet();
			if (sharedStyles.replaceSync) {
				sharedStyles.replaceSync(finalStylesheet);
				docCache.set(finalStylesheet, sharedStyles);
				return sharedStyles;
			}
		} catch (e) {
			// Constructor might fail in some environments.
		}
	}

	// Fallback on a style tag.
	let style = document.createElement("style");
	style.innerHTML = finalStylesheet;
	return style;
}
