import renderCss from "../helpers/render-css";
let tagId = 0x10000;
function restyle(c) {
    if (c._._meta.shadowRoot && c._?._meta?.sharedStyles) {
        c._._meta.shadowRoot.adoptedStyleSheets = c._._meta.sharedStyles;
    }
}
export function component(Base, styles) {
    let ts = (Math.floor(performance.now() * 10000000000000)).toString(16);
    let tId = (tagId++).toString(16);
    let tagName = `dothtml-${tId}${component["_addTimestamp"] ? `-${ts}` : ""}`;
    let sharedStyles = null;
    if (styles) {
        sharedStyles = [];
        for (let i = 0; i < styles.length; i++) {
            sharedStyles.push(renderCss(styles[i]));
        }
    }
    return class extends Base {
        constructor(...args) {
            super(...args);
            if (!this._) {
                this._ = {};
            }
            this._.refs = {};
            this._.restyle = () => { restyle(this); };
            this._._meta = this._._meta || {};
            this._._meta.args = args;
            this._._meta.isRendered = false;
            this._._meta.tagName = tagName;
            if (sharedStyles) {
                if (this._._meta.sharedStyles) {
                    this._._meta.sharedStyles = [...this._._meta.sharedStyles, ...sharedStyles];
                }
                else {
                    this._._meta.sharedStyles = sharedStyles;
                }
            }
        }
    };
}
component["_addTimestamp"] = true;
//# sourceMappingURL=component.js.map