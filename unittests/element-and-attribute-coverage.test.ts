import dot from "../src/dot";
import addTest from "./core";
var dotDocuments = [...new Set([
	"as",
	"el",
	"h",
	"t",
	"iterate",
	"each",
	"remove",
	"getLast",
	"empty",
	"script",
	"when",
	"otherwiseWhen",
	"otherwise",
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
])];

var dotElements = [...new Set([
	"attr",
	"scopeClass",
	"bgColor",
	"color",
	"aLink",
	"archive",
	"accessKey",
	"class",
	"contentEditable",
	"dir",
	"draggable",
	"dropZone",
	"hidden",
	"id",
	"itemProp",
	"lang",
	"spellCheck",
	"style",
	"tabIndex",
	"title",
	"onHashChange",
	"onOffline",
	"onOnline",
	"onPageHide",
	"onPageShow",
	"onPopState",
	"onResize",
	"onStorage",
	"onSearch",
	"onToggle",
	"onAbort",
	"onCantPlayThrough",
	"onDurationChange",
	"onEmptied",
	"onEnded",
	"onLoadedData",
	"onLoadStart",
	"onLoadedMetadata",
	"onPause",
	"onPlay",
	"onPlaying",
	"onProgress",
	"onRateChange",
	"onSeeked",
	"onSeeking",
	"onStalled",
	"onSuspend",
	"onTimeUpdate",
	"onVolumeChange",
	"onWaiting",
	"onCanPlay",
	"onContextMenu",
	"onCopy",
	"onCut",
	"onPagePaste",
	"onCueChange",
	"onDrag",
	"onDragEnd",
	"onDragStart",
	"onDragEnter",
	"onDragOver",
	"onDragLeave",
	"onDrop",
	"onError",
	"onInvalid",
	"onMouseWheel",
	"onWheel",
	"onBlur",
	"onChange",
	"onClick",
	"onDblClick",
	"onFocus",
	"onInput",
	"onKeyDown",
	"onKeyPress",
	"onKeyUp",
	"onLoad",
	"onMouseDown",
	"onMouseEnter",
	"onMouseMove",
	"onMouseOut",
	"onMouseOver",
	"onMouseUp",
	"onReset",
	"onScroll",
	"onSelect",
	"onSubmit",
	"onUnload",
	"download",
	"hRef",
	"hRefLang",
	"media",
	"ping",
	"rel",
	"rev",
	"target",
	"type",
	"alt",
	"coords",
	"download",
	"media",
	"noHRef",
	"rel",
	"shape",
	"target",
	"autoPlay",
	"buffered",
	"controls",
	"loop",
	"muted",
	"preload",
	"src",
	"pause",
	"play",
	"stop",
	"quoteCite",
	"align",
	"background",
	"clear",
	"autoFocus",
	"formAction",
	"disabled",
	"name",
	"type",
	"whichForm",
	"value",
	"height",
	"width",
	"charOff",
	"colSpan",
	"vAlign",
	"charOff",
	"colSpan",
	"vAlign",
	"dateTime",
	"quoteCite",
	"open",
	"height",
	"src",
	"type",
	"width",
	"disabled",
	"name",
	"whichForm",
	"acceptCharset",
	"action",
	"autoComplete",
	"encType",
	"method",
	"name",
	"noValidate",
	"rel",
	"target",
	"noShade",
	"height",
	"longDesc",
	"marginHeight",
	"marginWidth",
	"name",
	"sandbox",
	"scrolling",
	"seamless",
	"src",
	"srcDoc",
	"width",
	"alt",
	"height",
	"hSpace",
	"isMap",
	"longDesc",
	"sizes",
	"src",
	"srcSet",
	"useMap",
	"width",
	"accept",
	"alt",
	"autoComplete",
	"autoFocus",
	"checked",
	"dirName",
	"disabled",
	"formAction",
	"list",
	"max",
	"maxLength",
	"min",
	"multiple",
	"name",
	"pattern",
	"placeholder",
	"readOnly",
	"required",
	"size",
	"src",
	"step",
	"type",
	"whichForm",
	"value",
	"width",
	"bindTo",
	"getVal",
	"setVal",
	"dateTime",
	"quoteCite",
	"challenge",
	"keyType",
	"for",
	"whichForm",
	"value",
	"name",
	"type",
	"high",
	"low",
	"max",
	"min",
	"optimum",
	"whichForm",
	"value",
	"classId",
	"codeBase",
	"codeType",
	"objectData",
	"declare",
	"height",
	"name",
	"standby",
	"type",
	"useMap",
	"whichForm",
	"width",
	"reversed",
	"start",
	"disabled",
	"disabled",
	"optionLabel",
	"selected",
	"value",
	"bindTo",
	"getVal",
	"setVal",
	"for",
	"name",
	"whichForm",
	"name",
	"value",
	"valueType",
	"max",
	"value",
	"quoteCite",
	"autoFocus",
	"disabled",
	"multiple",
	"name",
	"required",
	"size",
	"whichForm",
	"bindTo",
	"getVal",
	"setVal",
	"media",
	"src",
	"type",
	"sizes",
	"src",
	"srcSet",
	"type",
	"border",
	"cellPadding",
	"cellSpacing",
	"frame",
	"rules",
	"tableSummary",
	"autoFocus",
	"cols",
	"dirName",
	"disabled",
	"maxLength",
	"name",
	"placeholder",
	"readOnly",
	"required",
	"rows",
	"whichForm",
	"wrap",
	"bindTo",
	"getVal",
	"setVal",
	"charOff",
	"vAlign",
	"axis",
	"char",
	"colSpan",
	"charOff",
	"headers",
	"nowrap",
	"rowSpan",
	"vAlign",
	"charOff",
	"vAlign",
	"dateTime",
	"axis",
	"colSpan",
	"charOff",
	"headers",
	"rowSpan",
	"scope",
	"vAlign",
	"charOff",
	"vAlign",
	"charOff",
	"vAlign",
	"default",
	"kind",
	"src",
	"srcLang",
	"trackLabel",
	"autoPlay",
	"buffered",
	"controls",
	"height",
	"loop",
	"muted",
	"poster",
	"preload",
	"src",
	"width",
	"pause",
	"play",
	"stop",
])];

for(let s of dotDocuments){
	addTest(`${s} - core`, ()=>{
		return dot.t(typeof dot[s])
	}, "function");
	addTest(`${s} - query`, ()=>{
		return dot.t(typeof dot("body")[s])
	}, "function");
	addTest(`${s} - next`, ()=>{
		return dot.t(typeof dot.div()[s])
	}, "function");
}
for(let s of dotElements){
	addTest(`${s} - query`, ()=>{
		return dot.t(typeof dot("body")[s])
	}, "function");
	addTest(`${s} - next`, ()=>{
		return dot.t(typeof dot.div()[s])
	}, "function");
}