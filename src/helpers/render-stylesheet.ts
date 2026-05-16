import { IDotCss } from "dothtml-interfaces";

const stylesheetCache = new Map<string, CSSStyleSheet>();

export default function renderStylesheet(styleCallback: string|((css: any)=>(string|IDotCss)), document: Document): CSSStyleSheet|HTMLStyleElement {

	let finalStylesheet = "";

	if (typeof styleCallback == "string") {
		finalStylesheet = styleCallback;
	}
	else {
		let css = null;
		let styles = styleCallback(css);

		if (typeof styles == "string") {
			finalStylesheet = styles;
		}
		else {
			// TODO: handle dot syntax if needed.
		}
	}

	if (stylesheetCache.has(finalStylesheet)) {
		return stylesheetCache.get(finalStylesheet);
	}

	let DocumentCSSStyleSheet = (document.defaultView as any)?.CSSStyleSheet;

	if (DocumentCSSStyleSheet) {
		try {
			let sharedStyles = new DocumentCSSStyleSheet();
			if (sharedStyles.replaceSync) {
				sharedStyles.replaceSync(finalStylesheet);
				stylesheetCache.set(finalStylesheet, sharedStyles);
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
