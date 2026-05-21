
import { GKV, ValueOrReactive } from "./css-types";
import IFilterProp from "./complex-css-types/i-filter-prop";
import IShadowProp from "./complex-css-types/i-shadow-prop";
import ITransformationProp from "./complex-css-types/i-transformation-prop";
import ColorProp from "./mapped-types/color-props";
import LengthProp from "./mapped-types/length-prop";
import { IBinding } from "../bindings/i-binding";
import { IWatcher } from "../bindings/i-watcher";

type BackgroundPositionShorthand2D = string;
type BackgroundRepeatValues2d = "no-repeat"|"repeat"|"space"|"round";
type BorderShorthand = string;
type BorderStyles = "dotted"|"dashed"|"solid"|"double"|"groove"|"ridge"|"inset"|"outset"|"none"|"hidden";
type FlexShorthand = string;
type FlexFlowShorthand = string;

// This needs to be built in pieces. There's only so much I can do at once.
// Some of this was generated using AI. Each item needs to be manually checked.
// Once it's checked, we can add a ✔️ to the end of the line.
export default interface IDotcssProp extends 
	LengthProp<"blockSize"> ,
	LengthProp<"borderBottomLeftRadius">,
	LengthProp<"borderBottomRightRadius">,
	LengthProp<"borderBottomWidth">,
	LengthProp<"borderLeftWidth">,
	LengthProp<"borderRightWidth">,
	LengthProp<"borderTopLeftRadius">,
	LengthProp<"borderTopRightRadius">,
	LengthProp<"borderTopWidth">,
	LengthProp<"bottom">,
	LengthProp<"height">,
	LengthProp<"left">,
	LengthProp<"marginBottom">,
	LengthProp<"marginLeft">,
	LengthProp<"marginRight">,
	LengthProp<"marginTop">,
	LengthProp<"maxHeight">,
	LengthProp<"maxWidth">,
	LengthProp<"minHeight">,
	LengthProp<"minWidth">,
	LengthProp<"outlineOffset">,
	LengthProp<"outlineWidth", 1, "medium"|"thin"|"thick">,
	LengthProp<"paddingBottom">,
	LengthProp<"paddingLeft">,
	LengthProp<"paddingRight">,
	LengthProp<"paddingTop">,
	LengthProp<"right">,
	LengthProp<"textIndent">,
	LengthProp<"top">,
	LengthProp<"width">,
	LengthProp<"lineHeight">,
	LengthProp<"fontSize">,
	LengthProp<"flexBasis">,
	LengthProp<"wordSpacing", 1, "normal">,
	LengthProp<"borderImageWidth", 1|2|3|4>,
	LengthProp<"borderRadius", 1|2|3|4>,
	LengthProp<"borderWidth", 1|2|3|4>,
	LengthProp<"margin", 1|2|3|4>,
	LengthProp<"padding", 1|2|3|4>,
	LengthProp<"backgroundSize", 1|2, "contain"|"cover"|"auto">,
	LengthProp<"gap", 1|2>,

	ColorProp<"color">,
	ColorProp<"backgroundColor">,
	ColorProp<"borderBottomColor">,
	ColorProp<"borderColor">,
	ColorProp<"borderLeftColor">,
	ColorProp<"borderRightColor">,
	ColorProp<"borderTopColor">,
	ColorProp<"textDecorationColor">,
	ColorProp<"outlineColor">,
	ColorProp<"columnRuleColor">
{
	
	//url: 
	backgroundImage?: ValueOrReactive<string>;
	borderImage?: ValueOrReactive<string>;
	listStyleImage?: ValueOrReactive<string>;
	content?: ValueOrReactive<string>;

	//complex: 
	transform?: ValueOrReactive<string>|ITransformationProp|Array<ITransformationProp>;
	filter?: ValueOrReactive<string>|IFilterProp;
	backdropFilter?: ValueOrReactive<string>|IFilterProp;
	
	//misc numeric: 
	opacity?: ValueOrReactive<number|string>;

	//misc: 
	all?: GKV;
	appearance?: GKV|"none"|"menulist-button"|"textfield"|"button"|"searchfield"|"textarea"|"push-button"|"slider-horizontal"|"checkbox"|"radio"|"square-button"|"menulist"|"listbox"|"meter"|"progress-bar"|"scrollbarbutton-up"|"button-bevel"|"media-mute-button"|"caret"; // ✔️
	aspectRatio?: ValueOrReactive<string>|{auto?:ValueOrReactive<boolean>, ratio: [ValueOrReactive<number>, ValueOrReactive<number>]|ValueOrReactive<number>}; // TODO: test case.

	background?: GKV|string; // TODO: shorthand. Requires advanced typing.
	backgroundAttachment?: GKV|"scroll"|"fixed"|"local"; // ✔️
	backgroundBlendMode?: GKV|Array<IBinding<any, string>|IWatcher<string>|"darken"|"luminocity"|"normal">; // ✔️
	backgroundPosition?: GKV|BackgroundPositionShorthand2D;
	backgroundRepeat?: GKV|BackgroundRepeatValues2d;
	backgroundClip?: GKV|string;
	backgroundOrigin?: GKV|"padding-box"|"border-box"|"content-box";

	borderImageOutset?: GKV|string;
	borderImageRepeat?: GKV|BackgroundRepeatValues2d;
	borderImageSlice?: GKV|string;
	borderImageSource?: GKV|string;
	
	// TODO: probably should break this down better.
	border?: GKV|BorderShorthand;
	borderBottom?: GKV|BorderShorthand;
	borderLeft?: GKV|BorderShorthand;
	borderRight?: GKV|BorderShorthand;
	borderTop?: GKV|BorderShorthand;

	borderBottomStyle?: GKV|BorderStyles;
	borderLeftStyle?: GKV|BorderStyles;
	borderRightStyle?: GKV|BorderStyles;
	borderStyle?: GKV|BorderStyles;
	borderTopStyle?: GKV|BorderStyles;

	boxDecorationBreak?: GKV|string;
	boxShadow?: GKV|Array<IShadowProp>; // TODO tests.
	clear?: GKV|string;
	clip?: GKV|string;
	display?: GKV|"inline"|"block"|"contents"|"flex"|"grid"|"inline-block"|"inline-flex"|"inline-grid"|"inline-table"|"list-item"|"run-in"|"table"|"table-caption"|"table-column-group"|"table-header-group"|"table-footer-group"|"table-row-group"|"table-cell"|"table-column"|"table-row"|"none"; // ✔️
	float?: GKV|"left"|"right"|"none"|"inline-start"|"inline-end"; // ✔️
	box?: GKV|string; // Can't find docs on this on MSDN.
	overflow?: GKV|"visible"|"hidden"|"clip"|"scroll"|"auto"; // ✔️
	overflowX?: GKV|"visible"|"hidden"|"clip"|"scroll"|"auto"; // ✔️
	overflowY?: GKV|"visible"|"hidden"|"clip"|"scroll"|"auto"; // ✔️
	position?: GKV|"static"|"relative"|"fixed"|"absolute"|"sticky"; // ✔️
	visibility?: GKV|string;
	verticalAlign?: GKV|string;
	zIndex?: ValueOrReactive<number>;
	alignContent?: GKV|string;
	alignItems?: GKV|string;
	alignSelf?: GKV|string;
	flex?: GKV|FlexShorthand;
	//flexBasis?: BasicCommonValues|FlexBasisNames;
	flexDirection?: GKV|"row"|"row-reverse"|"column"|"column-reverse"; // ✔️
	flexFlow?: GKV|FlexFlowShorthand;
	flexGrow?: GKV|ValueOrReactive<number>; // ✔️
	flexShrink?: GKV|ValueOrReactive<number>; // ✔️
	flexWrap?: GKV|"nowrap"|"wrap"|"wrap-reverse"; // ✔️
	grid?: GKV|string;
	gridArea?: GKV|string;
	gridAutoColumns?: GKV|string;
	gridautoRows?: GKV|string;
	gridColumn?: GKV|string;
	gridColumnEnd?: GKV|string;
	gridColumnGap?: GKV|string;
	gridColumnStart?: GKV|string;
	gridGap?: GKV|string;
	gridRow?: GKV|string;
	gridRowEnd?: GKV|string;
	gridRowGap?: GKV|string;
	gridRowStart?: GKV|string;
	gridTemplate?: GKV|string;
	gridTemplateAreas?: GKV|string;
	gridTemplateColumns?: GKV|string;
	gridTemplateRows?: GKV|string;
	imageOrientation?: GKV|"from-image"|"none"|"flip"|string; // Note: flip may optionally be accompanied with an angle. This is a complex type.
	justifyContent?: GKV|"flex-start"|"flex-end"|"center"|"space-between"|"space-around"|"space-evenly"|"start"|"end"|"left"|"right"|"safe flex-start"|"safe flex-end"|"safe center"|"safe space-between"|"safe space-around"|"safe space-evenly"|"unsafe flex-start"|"unsafe flex-end"|"unsafe center"|"unsafe space-between"|"unsafe space-around"|"unsafe space-evenly";
	order?: GKV|number; // ✔️
	hangingPunctuation?: GKV|"none"|"first"|"last"|"allow-end"|"force-end";
	hyphens?: GKV|"none"|"manual"|"auto";
	letterSpacing?: GKV|"normal"|"initial";
	lineBreak?: GKV|"auto"|"loose"|"normal"|"strict"|"anywhere";
	overflowWrap?: GKV|"normal"|"break-word"|"anywhere";
	tabSize?: GKV|"auto";
	textAlign?: GKV|"left"|"right"|"center"|"justify"|"start"|"end"|"match-parent";
	textAlignLast?: GKV|"auto"|"left"|"right"|"center"|"justify"|"start"|"end"|"match-parent";
	textCombineUpright?: GKV|"none"|"all"|"digits"|"upright";
	textJustify?: GKV|"auto"|"inter-word"|"inter-character"|"none";
	textTransform?: GKV|"none"|"capitalize"|"uppercase"|"lowercase"|"full-width"|"full-size-kana";
	whiteSpace?: GKV|"normal"|"nowrap"|"pre"|"pre-wrap"|"pre-line"|"break-spaces";
	wordBreak?: GKV|"normal"|"break-all"|"keep-all"|"break-word";
	wordWrap?: GKV|"normal"|"break-word"|"anywhere";
	textDecoration?: GKV|"none"|"underline"|"overline"|"line-through"|"blink";
	textDecorationLine?: GKV|"none"|"underline"|"overline"|"line-through"|"blink";
	textDecorationStyle?: GKV|"solid"|"double"|"dotted"|"dashed"|"wavy";
	textShadow?: GKV|string; // Complex.
	textUnderlinePosition?: GKV|"auto"|"under"|"left"|"right";
	font?: GKV|string;
	fontFamily?: GKV|string;
	fontFeatureSettings?: GKV|"normal";
	fontKerning?: GKV|"auto"|"normal"|"none";
	fontLanguageOverride?: GKV|"normal";
	fontSizeAdjust?: GKV|"none"|"auto";
	fontStretch?: GKV|ValueOrReactive<number>|`${string}%`|"normal"|"ultra-condensed"|"extra-condensed"|"condensed"|"semi-condensed"|"semi-expanded"|"expanded"|"extra-expanded"|"ultra-expanded";
	fontStyle?: GKV|"normal"|"italic"|"oblique";
	fontSynthesis?: GKV|string;
	fontVariant?: GKV|"normal"|"small-caps";
	fontVariantAlternates?: GKV|string;
	fontVariantCaps?: GKV|"all-small-caps"|"petite-caps"|"all-petite-caps"|"unicase"|"titling-caps";
	fontVariantEastAsian?: GKV|string;
	fontVariantLigatures?: GKV|string;
	fontVariantNumeric?: GKV|string;
	fontVariantPosition?: GKV|string;
	fontWeight?: GKV|ValueOrReactive<number>|"normal"|"bold"|"bolder"|"lighter";
	direction?: GKV|"ltr"|"rtl";
	textOrientation?: GKV|string;
	unicodeBidi?: GKV|string;
	userSelect?: GKV|string;
	writingMode?: GKV|string;
	borderCollapse?: GKV|string;
	borderSpacing?: GKV|string;
	captionSide?: GKV|string;
	emptyCells?: GKV|string;
	tableLayout?: GKV|string;
	counterIncrement?: GKV|string;
	counterReset?: GKV|string;
	listStyle?: GKV|string;
	listStylePosition?: GKV|string;
	listStyleType?: GKV|string;
	animation?: GKV|string;
	animationDelay?: GKV|string;
	animationDirection?: GKV|string;
	animationDuration?: GKV|string;
	animationFillMode?: GKV|string;
	animationIterationCount?: GKV|string;
	animationName?: GKV|string;
	animationPlayState?: GKV|string;
	animationTimingFunction?: GKV|string;
	backfaceVisibility?: GKV|"visible"|"hidden";
	perspective2d?: GKV|string;
	perspectiveOrigin?: GKV|string;
	transformOrigin?: GKV|string;
	transformStyle?: GKV|string;
	transition?: GKV|string;
	transitionProperty?: GKV|string;
	transitionDuration?: GKV|string;
	transitionTimingFunction?: GKV|string;
	transitionDelay?: GKV|string;
	boxSizing?: GKV|string;
	cursor?: GKV|string;
	imeMode?: GKV|string;
	navDown?: GKV|string;
	navIndex?: GKV|string;
	navLeft?: GKV|string;
	navRight?: GKV|string;
	navUp?: GKV|string;
	outline?: GKV|BorderShorthand;
	//outlineOffset?: BasicCommonValues|string; // Now animated.
	outlineStyle?: GKV|BorderStyles;
	resize?: GKV|string;
	textOverflow?: GKV|"clip"|"ellipsis";
	breakAfter?: GKV|"auto"|"avoid"|"always"|"all"|"avoid-page"|"page"|"left"|"right"|"recto"|"verso";
	breakBefore?: GKV|"auto"|"avoid"|"always"|"all"|"avoid-page"|"page"|"left"|"right"|"recto"|"verso";
	breakInside?: GKV|"auto"|"avoid"|"avoid-page"|"avoid-column"|"avoid-region";
	columnCount?: GKV|"auto"|"initial"|"inherit"|"unset"|"balance"|"auto-fill"|"auto-fit";
	columnFill?: GKV|"auto"|"balance"|"balance-all"|"balance-none";
	columnGap?: GKV|string;
	columnRule?: GKV|string;
	columnRuleStyle?: GKV|string;
	columnRuleWidth?: GKV|string;
	columnSpan?: GKV|string;
	columnWidth?: GKV|string;
	columns?: GKV|string;
	widows?: GKV|string;
	orphans?: GKV|string;
	pageBreakAfter?: GKV|string;
	pageBreakBefore?: GKV|string;
	pageBreakInside?: GKV|string;
	marks?: GKV|string;
	quotes?: GKV|string;
	imageRendering?: GKV|string;
	imageResolution?: GKV|string;
	objectFit?: GKV|string;
	objectPosition?: GKV|string;
	mask?: GKV|string;
	maskType?: GKV|string;
	mark?: GKV|string;
	markAfter?: GKV|string;
	markBefore?: GKV|string;
	phonemes?: GKV|string;
	rest?: GKV|string;
	restAfter?: GKV|string;
	restBefore?: GKV|string;
	voiceBalance?: GKV|string;
	voiceDuration?: GKV|string;
	voicePitch?: GKV|string;
	voicePitchRange?: GKV|string;
	voiceRate?: GKV|string;
	voiceStress?: GKV|string;
	voiceVolume?: GKV|string;
	pointerEvents?: GKV|"auto"|"none";

	// Deprecated.
	// marqueeDirection?: "up"|"down"|"left"|"right"|BasicCommonValues;
	// marqueePlayCount?: ValueOrReactive<number>|BasicCommonValues;
	// marqueeSpeed?: "slow"|"normal"|"fast"|BasicCommonValues;
	// marqueeStyle?: BasicCommonValues|string;
}

// export default IDotcssProp;