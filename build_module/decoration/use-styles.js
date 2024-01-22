import renderCss from "../helpers/render-css";
export function useStyles(styleCallback) {
    let sharedStyles = renderCss(styleCallback);
    return function (Base) {
        return class extends Base {
            constructor(...args) {
                super(...args);
                if (!this._) {
                    this._ = { _meta: {} };
                }
                if (!this._._meta.sharedStyles) {
                    this._._meta.sharedStyles = [];
                }
                this._._meta.sharedStyles.push(sharedStyles);
            }
        };
    };
}
//# sourceMappingURL=use-styles.js.map