import { ContainerVdom } from "./vdom-nodes/container-vdom";
import { TextVdom } from "./vdom-nodes/text-vdom";
import ElementVdom from "./vdom-nodes/element-vdom";
import { Vdom } from "./vdom-nodes/vdom";
import { DOT_VDOM_PROP_NAME } from "./constants";
import Reactive from "./reactive";
import { component } from "./decoration/component";
import { ComponentVdom } from "./vdom-nodes/component-vdom";
import { useStyles } from "./decoration/use-styles";
const allTags = [
    "a",
    "aside",
    "abbr",
    "address",
    "area",
    "article",
    "audio",
    "b",
    "bdi",
    "bdo",
    "blockQuote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colGroup",
    "content",
    "data",
    "dataList",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldSet",
    "figCaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hr",
    "i",
    "iFrame",
    "img",
    "input",
    "ins",
    "kbd",
    "keyGen",
    "label",
    "legend",
    "li",
    "main",
    "map",
    "mark",
    "menu",
    "menuItem",
    "meter",
    "nav",
    "object",
    "ol",
    "optGroup",
    "option",
    "output",
    "p",
    "param",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "svg",
    "sub",
    "summary",
    "sup",
    "table",
    "tBody",
    "td",
    "textArea",
    "tFoot",
    "th",
    "tHead",
    "time",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr"
];
const allAttributes = [
    "accept",
    "accessKey",
    "action",
    "align",
    "allow",
    "allowFullScreen",
    "aLink",
    "alt",
    "archive",
    "autoCapitalize",
    "autoComplete",
    "autoFocus",
    "autoPlay",
    "autoSave",
    "axis",
    "background",
    "bgColor",
    "border",
    "buffered",
    "cellPadding",
    "cellSpacing",
    "challenge",
    "char",
    "charset",
    "charOff",
    "checked",
    "class",
    "classId",
    "clear",
    "codeBase",
    "codeType",
    "color",
    "cols",
    "colSpan",
    "compact",
    "contentEditable",
    "contextMenu",
    "controls",
    "coords",
    "crossOrigin",
    "dateTime",
    "declare",
    "decoding",
    "default",
    "dir",
    "dirName",
    "disabled",
    "download",
    "draggable",
    "dropZone",
    "encType",
    "enterKeyHint",
    "exportParts",
    "face",
    "font",
    "fontFace",
    "fontFaceFormat",
    "fontFaceName",
    "fontFaceSrc",
    "fontFaceUri",
    "fontSpecification",
    "for",
    "foreignObject",
    "formAction",
    "frame",
    "frameBorder",
    "headers",
    "height",
    "hidden",
    "high",
    "hRef",
    "hRefLang",
    "hSpace",
    "icon",
    "id",
    "inert",
    "inputMode",
    "images",
    "is",
    "isMap",
    "itemId",
    "itemProp",
    "itemRef",
    "itemScope",
    "itemType",
    "keyType",
    "kind",
    "lang",
    "list",
    "loading",
    "longDesc",
    "loop",
    "low",
    "manifest",
    "marginHeight",
    "marginWidth",
    "max",
    "maxLength",
    "media",
    "metadata",
    "method",
    "min",
    "missingGlyph",
    "multiple",
    "muted",
    "name",
    "noHRef",
    "nOnce",
    "noResize",
    "noShade",
    "noValidate",
    "noWrap",
    "open",
    "optimum",
    "part",
    "pattern",
    "ping",
    "placeholder",
    "playsInline",
    "poster",
    "preload",
    "prompt",
    "radioGroup",
    "readOnly",
    "referrerPolicy",
    "rel",
    "required",
    "rev",
    "reversed",
    "role",
    "rows",
    "rowSpan",
    "rules",
    "sandbox",
    "scope",
    "scrolling",
    "seamless",
    "selected",
    "shape",
    "size",
    "sizes",
    "spellCheck",
    "src",
    "srcDoc",
    "srcLang",
    "srcSet",
    "standby",
    "start",
    "step",
    "style",
    "tabIndex",
    "target",
    "title",
    "translate",
    "type",
    "useMap",
    "vAlign",
    "valueType",
    "virtualKeyboardPolicy",
    "width",
    "wrap"
];
const specialAttributes = [
    ["quoteCite", "cite"],
    ["objectData", "data"],
    ["whichForm", "form"],
    ["trackLabel", "label"],
    ["colSpan", "span"],
    ["tableSummary", "summary"],
    ["optionLabel", "label"],
    ["acceptCharset", "accept-charset"],
    ["areaHidden", "area-hidden"],
    ["areaLabel", "area-label"],
    ["areaDescribedBy", "area-describedby"],
    ["areaControls", "area-controls"],
    ["areaExpanded", "area-expanded"],
    ["areaChecked", "area-checked"],
    ["areaSelected", "area-selected"],
];
const allCoreWrappers = ["each", "html", "mount", "text", "when"];
const allEventAttr = [
    "onAbort",
    "onBlur",
    "onChange",
    "onInput",
    "onCanPlay",
    "onCantPlayThrough",
    "onClick",
    "onCopy",
    "onContextMenu",
    "onCueChange",
    "onCut",
    "onDblClick",
    "onDrag",
    "onDragEnd",
    "onDragEnter",
    "onDragLeave",
    "onDragOver",
    "onDragStart",
    "onDrop",
    "onDurationChange",
    "onEmptied",
    "onEnded",
    "onError",
    "onFocus",
    "onHashChange",
    "onInvalid",
    "onKeyDown",
    "onKeyPress",
    "onKeyUp",
    "onLoad",
    "onLoadedData",
    "onLoadedMetadata",
    "onLoadStart",
    "onMouseDown",
    "onMouseEnter",
    "onMouseLeave",
    "onMouseMove",
    "onMouseOut",
    "onMouseOver",
    "onMouseUp",
    "onPointerCancel",
    "onPointerDown",
    "onPointerEnter",
    "onPointerLeave",
    "onPointerMove",
    "onPointerOut",
    "onPointerOver",
    "onPointerUp",
    "onTouchStart",
    "onTouchEnd",
    "onTouchCancel",
    "onTouchMove",
    "onMouseWheel",
    "onOffline",
    "onOnline",
    "onPageHide",
    "onPagePaste",
    "onPageShow",
    "onPause",
    "onPlay",
    "onPlaying",
    "onPopState",
    "onProgress",
    "onRateChange",
    "onReset",
    "onResize",
    "onScroll",
    "onSearch",
    "onSeeked",
    "onSeeking",
    "onSelect",
    "onStalled",
    "onStorage",
    "onSubmit",
    "onSuspend",
    "onTimeUpdate",
    "onToggle",
    "onUnload",
    "onVolumeChange",
    "onWaiting",
    "onWheel",
];
const makeCoreWrapper = (d, fn) => {
    d[fn] = function () {
        let n = new ContainerVdom();
        n[fn](...arguments);
        return n;
    };
};
const makeDot = () => {
    const _dot = function (targetSelector, targetWindow = window) {
        if (targetSelector?.ownerDocument?.defaultView) {
            let el = targetSelector;
            let node = el[DOT_VDOM_PROP_NAME];
            if (node) {
                return node.children;
            }
            else {
                node = new ElementVdom(el.tagName.toLocaleLowerCase());
                node.element = el;
                node.children._parent = node;
                el[DOT_VDOM_PROP_NAME] = node;
                return node.children;
            }
        }
        else if (typeof targetSelector == "string") {
            return _dot(targetWindow.document.querySelectorAll(targetSelector)[0]);
        }
        else {
            throw new Error("Invalid render target.");
        }
    };
    _dot.watch = function (props) {
        let o = new Reactive();
        o.key = props?.key;
        o.transformer = props?.transformer;
        o.setValue(props?.value);
        return o;
    };
    _dot.css = () => {
    };
    _dot.component = component;
    _dot.component["useStyles"] = useStyles;
    _dot.useStyles = (document, styles) => {
        let cssStringContent = "";
        if (typeof styles == "string") {
            cssStringContent = styles;
        }
        else {
            let content = styles(dot.css);
            if (typeof content == "string") {
                cssStringContent = content;
            }
            else {
            }
        }
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.textContent = cssStringContent;
        document.head.appendChild(styleSheet);
    };
    {
        for (let i = 0; i < allTags.length; i++) {
            let E = allTags[i];
            ContainerVdom.prototype[E] = function (c) {
                let n = new ElementVdom(E);
                if (c instanceof ContainerVdom) {
                    n.children = c;
                }
                else if (c instanceof Vdom) {
                    n.children._addChild(c);
                }
                else if (c?._?._meta && c?.build) {
                    n.children._addChild(new ComponentVdom(c));
                }
                else {
                    if (c !== null && c !== undefined) {
                        n.children._addChild(new TextVdom(c));
                    }
                }
                return this._addChild(n);
            };
            makeCoreWrapper(_dot, E);
        }
    }
    {
        for (let i = 0; i < allAttributes.length; i++) {
            let A = allAttributes[i];
            ContainerVdom.prototype[A] = function (c) {
                let C = this._children[this._children.length - 1];
                if (C && C instanceof ElementVdom) {
                    C.setAttr(A, c);
                }
                else {
                    throw new Error(`Invalid node to set ${A} attribute.`);
                }
                return this;
            };
        }
    }
    {
        for (let i = 0; i < specialAttributes.length; i++) {
            let A = specialAttributes[i];
            ContainerVdom.prototype[A[0]] = function (c) {
                let C = this._children[this._children.length - 1];
                if (C && C instanceof ElementVdom) {
                    C.setAttr(A[1], c);
                }
                else {
                    throw new Error(`Invalid node to set ${A[0]} attribute.`);
                }
                return this;
            };
        }
        ContainerVdom.prototype["value"] = function (c) {
            let C = this._children[this._children.length - 1];
            if (C && C instanceof ElementVdom) {
                switch (C.tag) {
                    case "input": {
                        C.setAttr("value", c);
                        break;
                    }
                    default: {
                    }
                }
            }
            else {
                throw new Error(`Invalid node to set value attribute.`);
            }
            return this;
        };
    }
    {
        for (let i = 0; i < allEventAttr.length; i++) {
            let E = allEventAttr[i];
            ContainerVdom.prototype[E] = function (c) {
                let C = this._children[this._children.length - 1];
                if (C && C instanceof ElementVdom) {
                    C.addEventListener(E.substring(2), c);
                }
                else {
                    throw new Error(`Invalid node to set ${E} attribute.`);
                }
                return this;
            };
        }
    }
    {
        for (let i = 0; i < allCoreWrappers.length; i++) {
            let W = allCoreWrappers[i];
            makeCoreWrapper(_dot, W);
        }
    }
    return _dot;
};
const dot = makeDot();
export default dot;
//# sourceMappingURL=dot.js.map