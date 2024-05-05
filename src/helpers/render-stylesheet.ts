import { IDotCss } from "dothtml-interfaces";

export default function renderStylesheet(styleCallback: string|((css: any)=>(string|IDotCss)), document: Document): CSSStyleSheet|HTMLStyleElement {

	let DocumentCSSStyleSheet = document.defaultView.CSSStyleSheet;

	let sharedStyles = new DocumentCSSStyleSheet();
	let finalStylesheet = "";

	if (typeof styleCallback == "string") {
		finalStylesheet = styleCallback;
	}
	else {
		let css = null;
		let styles = styleCallback(css);

		if (typeof styles == "string") {
			// Pure CSS. Add to the component's stylesheet.
			finalStylesheet = styles;
		}
		else {
			// It's required to be dot syntax. We can double check though.
			// TODO - do this later when the style builder is set up.
		}

	}
	
	if(sharedStyles.replaceSync){
		sharedStyles.replaceSync(finalStylesheet);
		
		return sharedStyles;
	}
	else{
		// Not supported. Fallback on a style tag.
		let style = document.createElement("style");
		style.innerHTML = finalStylesheet;
		return style;
	}
}