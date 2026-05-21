// TODO: I've created a list of shorthands, and we should handle those individually.
// Ideally, everything below should be categorized by CSS data type.
const allProps = {
	color: "color|background-Color|border-Bottom-Color|border-Color|border-Left-Color|border-Right-Color|border-Top-Color|text-Decoration-Color|outline-Color|column-Rule-Color",
	length: "background-Size|block-Size|border-Bottom-Left-Radius|border-Bottom-Right-Radius|border-Bottom-Width|border-Left-Width|border-Radius|border-Right-Width|border-Top-Left-Radius|border-Top-Right-Radius|border-Top-Width|border-Width|bottom|gap|height|left|margin|margin-Bottom|margin-Left|margin-Right|margin-Top|max-Height|max-Width|min-Height|min-Width|padding|padding-Bottom|padding-Left|padding-Right|padding-Top|right|top|width|flex-Basis|font-Size|text-Indent|letter-Spacing|word-Spacing|border-Spacing|outline-Offset|outline-Width|column-Gap|column-Rule-Width|grid-Column-Gap|grid-Gap|grid-Row-Gap|column-Width|perspective|row-Gap",
	hybrid: "line-Height|border-Image-Width|border-Image-Outset|tab-Size|flex",
	url: "background-Image|border-Image|list-Style-Image|content|image-Orientation",
	transformation: "transform",
	filter: "filter|backdrop-Filter",
	time: "animation-Delay|animation-Direction|animation-Duration|transition-Duration|transition-Delay",
	misc: "appearance|aspect-Ratio|opacity|background|background-Attachment|background-Blend-Mode|background-Position|background-Repeat|background-Clip|background-Origin|border|border-Bottom|border-Bottom-Style|border-Image-Repeat|border-Image-Slice|border-Image-Source|border-Left|border-Left-Style|border-Right|border-Right-Style|border-Style|border-Top|border-Top-Style|box-Decoration-Break|box-Shadow|clear|clip|display|float|overflow|box|overflow-X|overflow-Y|position|visibility|vertical-Align|z-Index|align-Content|align-Items|align-Self|flex-Direction|flex-Flow|flex-Grow|flex-Shrink|flex-Wrap|grid|grid-Area|grid-Auto-Columns|grid-auto-Rows|grid-Column|grid-Column-End|grid-Column-Start|grid-Row|grid-Row-End|grid-Row-Start|grid-Template|grid-Template-Areas|grid-Template-Columns|grid-Template-Rows|justify-Content|order|hanging-Punctuation|hyphens|line-Break|overflow-Wrap|text-Align|text-Align-Last|text-Combine-Upright|text-Justify|text-Transform|white-Space|word-Break|word-Wrap|text-Decoration|text-Decoration-Line|text-Decoration-Style|text-Shadow|text-Underline-Position|font|font-Family|font-Feature-Settings|font-Kerning|font-Language-Override|font-Size-Adjust|font-Stretch|font-Style|font-Synthesis|font-Variant|font-Variant-Alternates|font-Variant-Caps|font-Variant-East-Asian|font-Variant-Ligatures|font-Variant-Numeric|font-Variant-Position|font-Weight|direction|text-Orientation|text-Combine-Upright|unicode-Bidi|user-Select|writing-Mode|border-Collapse|caption-Side|empty-Cells|table-Layout|counter-Increment|counter-Reset|list-Style|list-Style-Position|list-Style-Type|animation|animation-Fill-Mode|animation-Iteration-Count|animation-Name|animation-Play-State|animation-Timing-Function|animation-Timeline|container-Type|container-Name|backface-Visibility|perspective2d|perspective-Origin|transform-Origin|transform-Style|transition|transition-Property|transition-Timing-Function|box-Sizing|cursor|ime-Mode|nav-Down|nav-Index|nav-Left|nav-Right|nav-Up|outline|outline-Style|resize|text-Overflow|break-After|break-Before|break-Inside|column-Count|column-Fill|column-Rule|column-Rule-Style|column-Span|columns|widows|orphans|page-Break-After|page-Break-Before|page-Break-Inside|marks|quotes|image-Rendering|image-Resolution|object-Fit|object-Position|mask|mask-Type|mark|mark-After|mark-Before|phonemes|rest|rest-After|rest-Before|voice-Balance|voice-Duration|voice-Pitch|voice-Pitch-Range|voice-Rate|voice-Stress|voice-Volume|marquee-Direction|marquee-Play-Count|marquee-Speed|marquee-Style|pointer-Events"
}

const lengthSuffixes = "Cm|Mm|In|Px|Pt|Pc|Ch|Em|Ex|Lh|Rem|Vh|Vw|Vmin|Vmax|Cqw|Cqh|Cqi|Cqb|Cqmin|Cqmax|P".split("|"); 
// Following esoteric options removed: "Q|Cap|Ic|Rlh|Vb|Vi". Keep this comment here in case there's demand for one or more of them.
const timeSuffixes = "Ms|S".split("|");
const angleSuffixes = "Deg|Grad|Rad|Turn".split("|");
const frequencySuffixes = "Hz|Khz".split("|");

// TODO: add other types suffixes here. For instance: time, frequency, angle.

type CssRule = {
	dotName: string;
	cssName: string;
	type: string;
	unit: string;
};

const cssProps: Record<string, CssRule> = {};

for(let cssType in allProps){
	let props = allProps[cssType].split("|");
	for(let p of props){
		let key = p.split("-").join("");
		switch(cssType){
			case "hybrid":
			case "length": {
				for(let s of lengthSuffixes){
					cssProps[`${key}${s}`] = {
						dotName: key,
						cssName: p.toLowerCase(),
						type: cssType,
						unit: s == "P" ? "%" : s.toLowerCase()
					};
				}
				break;
			}
			case "time": {
				for(let s of timeSuffixes){
					cssProps[`${key}${s}`] = {
						dotName: key,
						cssName: p.toLowerCase(),
						type: cssType,
						unit: s.toLowerCase()
					};
				}
				break;
			}
			case "angle": {
				for(let s of angleSuffixes){
					cssProps[`${key}${s}`] = {
						dotName: key,
						cssName: p.toLowerCase(),
						type: cssType,
						unit: s.toLowerCase()
					};
				}
				break;
			}
			case "frequency": {
				for(let s of frequencySuffixes){
					cssProps[`${key}${s}`] = {
						dotName: key,
						cssName: p.toLowerCase(),
						type: cssType,
						unit: s.toLowerCase()
					};
				}
				break;
			}
			default: {
				break;
			}
		}

		cssProps[key] = {
			dotName: key,
			cssName: p.toLowerCase(),
			type: cssType,
			unit: undefined
		};
	}
}

export default cssProps;