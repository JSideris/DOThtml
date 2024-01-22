export default function renderCss(styleCallback) {
    let sharedStyles = new CSSStyleSheet();
    if (typeof styleCallback == "string") {
        sharedStyles.replaceSync(styleCallback);
    }
    else {
        let finalStylesheet = "";
        let css = null;
        let styles = styleCallback(css);
        if (typeof styles == "string") {
            finalStylesheet = styles;
        }
        else {
        }
        sharedStyles.replaceSync(finalStylesheet);
    }
    return sharedStyles;
}
//# sourceMappingURL=render-css.js.map