export const allTags = [
	"a", "aside", "abbr", "address", "area", "article", "audio", "b", "bdi", "bdo", "blockQuote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colGroup", "content", "data", "dataList", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldSet", "figCaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "i", "iFrame", "img", "input", "ins", "kbd", "keyGen", "label", "legend", "li", "main", "map", "mark", "menu", "menuItem", "meter", "nav", "object", "ol", "optGroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "small", "source", "span", "strong", "svg", "sub", "summary", "sup", 	"table", "tBody", "td", "textArea", "tFoot", "th", "tHead", "time", "tr", "track", "u", "ul", "var", "video", "wbr",
	// SVG
	"path", "circle", "rect", "line", "polyline", "polygon", "ellipse", "g", "defs", "symbol", "use", "linearGradient", "radialGradient", "stop", "clipPath", "mask", "pattern", "filter", "feGaussianBlur", "feOffset", "feMerge", "feMergeNode",
	// MathML
	"math", "mi", "mo", "mn", "ms", "mtext", "mspace", "mglyph", "mrow", "mfrac", "msqrt", "mroot", "mstyle", "merror", "mpadded", "mphantom", "menclose", "msub", "msup", "msubsup", "munder", "mover", "munderover", "mmultiscripts", "mtable", "mtr", "mtd", "maction", "semantics", "annotation", "annotation-xml"
];

export const allTagsSet = new Set(allTags);

export const allCoreWrappers = ["each", "html", "h", "mount", "text", "md", "when", "on"];
