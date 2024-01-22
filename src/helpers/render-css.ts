import { IDotCss } from "dothtml-interfaces";

export default function renderCss(styleCallback: string|((css: any)=>(string|IDotCss))) {
	let sharedStyles = new CSSStyleSheet();

	if (typeof styleCallback == "string") {
		sharedStyles.replaceSync(styleCallback);
	}
	else {
		let finalStylesheet = "";
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

		sharedStyles.replaceSync(finalStylesheet);
	}
	return sharedStyles;
}