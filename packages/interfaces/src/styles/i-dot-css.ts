

import IAtColorProfileBuilder from "./at-rules/i-at-color-profile-builder";
import IAtCounterStyleBuilder from "./at-rules/i-at-counter-style-builder";
import IAtFontPaletteValues from "./at-rules/i-at-font-palette-values";
import IAtKeyframesBuilder from "./at-rules/i-at-keyframes-builder";
import IAtPageBuilder from "./at-rules/i-at-page-builder";
import IDotcssProp from "./i-css-prop";
import { IDotStyleBuilder } from "./i-dot-style-builder";




// EASING FUNCTION

// type StepPosition = "jump-start"|"jump-end"|"jump-none"|"jump-both"|"start"|"end";
// type LinearStopLength = Percentage|`${Percentage} ${Percentage}`;
// type LinearStop = number|`${number} ${LinearStopLength}`|`${LinearStopLength} ${number}`;
// type LinearStopList = `${LinearStop}${`, ${LinearStop}${`, ${LinearStop}${`, ${LinearStop}${`, ${LinearStop}${ComplexType}`|""}`|""}`|""}`|""}`;

// type StepEasingFunction = "step-start"|"step-end"|`steps(${Int}${`, ${StepPosition}`|""})`;
// type CubicBezierEasingFunction = "ease"|"ease-in"|"ease-out"|"ease-in-out"|`cubic-bezier(${number}, ${number}, ${number}, ${number})`;
// type LinearEasingFunction = `linear(${LinearStopList})`;
// type EasingFunction = "linear"|LinearEasingFunction|CubicBezierEasingFunction|StepEasingFunction;

// FILTER FUNCTION
// TODO: don't forget to provide builders for these. Already put work into some.
// type SaturateFunction = `saturate(${number|Percentage|""})`;
// type SepiaFunction = `sepia(${number|Percentage|""})`;
// type OpacityFunction = `opacity(${number|Percentage|""})`;
// type InvertFunction = `invert(${number|Percentage|""})`;
// type GrayscaleFunction = `grayscale(${number|Percentage|""})`;
// type ContrastFunction = `contrast(${number|Percentage|""})`;
// type BrightnessFunction = `brightness(${number|Percentage|""})`;
// type BlurFunction = `blur(${NumericLength|""})`;
// Regrettably, strong typing for color isn't possible due to the type complexity.
// Even SimpleColor doesn't work. We use string in place of Color.
// type DropShadowFunction = `drop-shadow(${`${ComplexType} ${NumericLength} ${NumericLength}`
// 	|`${NumericLength} ${NumericLength} ${ComplexType}`
// 	|`${NumericLength} ${NumericLength}`
// 	|`${ComplexType} ${NumericLength} ${NumericLength} ${NumericLength}`
// 	|`${NumericLength} ${NumericLength} ${NumericLength} ${ComplexType}`
// 	|`${NumericLength} ${NumericLength} ${NumericLength}`
// })`;
// type HueRotateFunction = `hue-rotate(${Angle|""})`;
// type FilterFunction = SaturateFunction|SepiaFunction|OpacityFunction|InvertFunction|GrayscaleFunction|ContrastFunction|BrightnessFunction|BlurFunction|DropShadowFunction|HueRotateFunction;

// FLEX
type Flex = `${number}fr`;

// FONT

// type GenericFamily = "serif" | "sans-serif" | "monospace" | "cursive" | "fantasy" | "system-ui" | "ui-serif" | "ui-sans-serif" | "ui-monospace" | "ui-rounded" | "emoji" | "math" | "fangsong";

// POSITION
// type HorizontalPosition = "left" | "center" | "right" | LengthPercentage;
// type VerticalPosition = "top" | "center" | "bottom" | LengthPercentage;

// type Position = 
//     | HorizontalPosition
//     | VerticalPosition
//     | `${HorizontalPosition} ${VerticalPosition}`
//     | `${VerticalPosition} ${HorizontalPosition}`
//     | `${"left" | "right"} ${LengthPercentage}`
//     | `${"top" | "bottom"} ${LengthPercentage}`
//     | `${"left" | "right"} ${LengthPercentage} ${"top" | "bottom"} ${LengthPercentage}`
//     | `${"top" | "bottom"} ${LengthPercentage} ${"left" | "right"} ${LengthPercentage}`;

// GRADIENT
// https://developer.mozilla.org/en-US/docs/Web/CSS/gradient
// TODO: absolutely need a builder for this.

// type RadialShape = "circle"|"ellipse";
// type RadialExtent = "closest-corner"|"closest-side"|"farthest-corner"|"farthest-side";
// type SideOrCorner = "left"|"right"|"top"|"bottom"|`${"left" | "right"} ${"top" | "bottom"}`|`${"top" | "bottom"} ${"left" | "right"}`;
// type RadialSize = `${RadialExtent} ${NumericLength} ${LengthPercentage} ${LengthPercentage}`;
// type LinearColorStop = Color|`${Color} ${LengthPercentage}`;
// type LinearColorHint = LengthPercentage;
// // type LinearColorStopListItem = LinearColorStop|`${LinearColorHint}, ${LinearColorStop}`; // TOO COMPLEX :(
// type LinearColorStopListItem = LinearColorStop|`${ComplexType}, ${LinearColorStop}`; // TODO: this type got botched due to complexity.
// type ColorStopList = `${LinearColorStop}${`, ${ComplexType}`}`|`${LinearColorStop}`; 

// type AngleOrSideOrCorner = Angle | `to ${SideOrCorner}, `;
// type LinearGradientSyntax = ComplexType; //`${`${AngleOrSideOrCorner} `|""}${ColorStopList}`;
// // type RadiatShapeOrSize = RadialShape | RadialSize | `${RadialShape} ${RadialSize}` | `${RadialSize} ${RadialShape}`;
// type RadiatShapeOrSize = RadialShape | RadialSize | ComplexType;//`${RadialShape} ${RadialSize}` | `${RadialSize} ${RadialShape}`;
// type RadialGradientSyntax = `${`${RadiatShapeOrSize} ` | ""} [ at <position> ]? , <color-stop-list>`;
// type LinearGradientFunction = `linear-gradient(${LinearGradientSyntax})`;
// type RepeatingLinearGradientFunction = `linear-gradient(${LinearGradientSyntax})`;
// type RadialGradientFunction = `radial-gradient(${RadialGradientSyntax})`;
// type RepeatingRadialGradientFunction = `radial-gradient(${RadialGradientSyntax})`;
// type Gradient = LinearGradientFunction | RepeatingLinearGradientFunction | RadialGradientFunction | RepeatingRadialGradientFunction;

// URL
// type Url = `${"src"|"url"}(${string})`;

// IMAGE
// type Image = Url|Gradient;

// TODO:
// https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function
// type TransformFunction = ComplexType;

// Building blocks.

// type OptionalWhitespace = ""|" ";
// export type Percentage = number|`${number}%`; // Used for filters.

// ts starts complaining about the complexity of the type :(


// Types
// TODO: look up types online and correct this.
// https://developer.mozilla.org/en-US/docs/Web/CSS/absolute-size

// MORE COMPLEX TYPES?

// type NumericLengthOrAuto = NumericLength|"auto";
// type NumericAngle = number|`${number}${AngleUnits}`;

// type AppearanceValues = BasicCommonValues|"none"|"menulist-button"|"textfield"|"button"|"searchfield"|"textarea"|"push-button"|"slider-horizontal"|"checkbox"|"radio"|"square-button"|"menulist"|"listbox"|"meter"|"progress-bar"|"scrollbarbutton-up"|"button-bevel"|"media-mute-button"|"caret";
// type BackgroundAttachmentValues = BasicCommonValues|"scroll"|"fixed"|"local";
// type BackgroundRepeatValues = GKV|"no-repeat"|"repeat"|"space"|"round";
// type BackgroundOriginValues = GKV|"padding-box"|"border-box"|"content-box";
// type BackgroundSizeValues = BasicCommonValues|"auto"|NumericLength|"cover"|"contain";
// type BackfaceVisibilityValues = BasicCommonValues|"visible"|"hidden";
// type BorderStyles = GKV|"dotted"|"dashed"|"solid"|"double"|"groove"|"ridge"|"inset"|"outset"|"none"|"hidden";

// type DisplayValues = BasicCommonValues|"inline"|"block"|"contents"|"flex"|"grid"|"inline-block"|"inline-flex"|"inline-grid"|"inline-table"|"list-item"|"run-in"|"table"|"table-caption"|"table-column-group"|"table-header-group"|"table-footer-group"|"table-row-group"|"table-cell"|"table-column"|"table-row"|"none";
// type DirectionValues = BasicCommonValues|"ltr"|"rtl";
// type FontStyleValues = BasicCommonValues|"normal"|"italic"|"oblique";
// type FontVariantValues = BasicCommonValues|"normal"|"small-caps";
// type FontVariantCapsValues = FontVariantValues|"all-small-caps"|"petite-caps"|"all-petite-caps"|"unicase"|"titling-caps";
// type FontWeightValues = GKV|ValueOrReactive<number>|"normal"|"bold"|"bolder"|"lighter";
// type OutlineWidthValues = GKV|"medium"|"thin"|"thick"|NumericLength;
// type PositionNames = BasicCommonValues|"static"|"relative"|"fixed"|"absolute"|"sticky";

// type FlexDirectionNames = BasicCommonValues|"row"|"row-reverse"|"column"|"column-reverse";
// type FlexWrapNames = BasicCommonValues|"nowrap"|"wrap"|"wrap-reverse";


// Advanced formatted types.

// type BackgroundRepeatValues2d = BackgroundRepeatValues|"repeat-x"|"repeat-y"|`${BackgroundRepeatValues} ${BackgroundRepeatValues}`;
// type BorderShorthand = BasicCommonValues|`${BorderStyles}`|`${BorderStyles} ${Color}`|ComplexType;//`${number}${AllLengthUnits} ${BorderStyles} ${Color}`;
// type BackgroundImageFormat = BasicCommonValues|Url|`${Url}, ${Url}`;
// type BackgroundPositionShorthand2D = BasicCommonValues|`${BasicCommonValues|number} ${BasicCommonValues|number}`|`${number}% ${number}%`|`${"left"|"right"|"center"} ${"top"|"center"|"bottom"}`;
// type BackgroundShorthand = BasicCommonValues|ComplexType;//`${Color} ${Url} ${BackgroundRepeatValues} ${BackgroundPositionShorthand2D}`;
// type FlexFlowShorthand = BasicCommonValues|`${FlexDirectionNames} ${FlexWrapNames}`;
// type FlexShorthand = BasicCommonValues|`${BasicCommonValues|number} ${BasicCommonValues|number} ${BasicCommonValues|`${number}${AllLengthUnits}`}`;

export default interface IDotCss extends IDotStyleBuilder{
	// TODO: ensure each of these has test cases.
	// Right now, most of these don't actually work. But they're typed so that they can progressively be added to the librrary.
	(selector: "@charset", charset: string): void;
	(selector: "@color-profile", name: string, styles: IAtColorProfileBuilder): void;
	(selector: "@container", condition: string, styles: IDotcssProp): void;
	(selector: "@counter-style", name: string, styles: IAtCounterStyleBuilder): void;
	// (selector: "@document"): void; // Deprecated. Will not support it. https://developer.mozilla.org/en-US/docs/Web/CSS/@document
	(selector: "@font-face"): void;
	// (selector: "@font-feature-values"): void; // Need more info on declaration rule lists. https://developer.mozilla.org/en-US/docs/Web/CSS/@font-feature-values
	(selector: "@font-palette-values", identifier: string, rules: IAtFontPaletteValues): void;
	(selector: "@import", value: string): void;
	(selector: "@keyframes", name: string, rules: IAtKeyframesBuilder): void;
	(selector: "@layer", layerNames: string|string[]): void;
	(selector: "@layer", rules: Record<string, IDotcssProp>): void;
	(selector: "@layer", layerName: string, rules: Record<string, IDotcssProp>): void;
	(selector: "@media", rules: Record<string, IDotcssProp>): void;
	(selector: "@namespace", value: string): void;
	(selector: "@page", styles: IAtPageBuilder): void;
	(selector: "@page", pseudo: string, styles: IAtPageBuilder): void;
	// (selector: "@property"): void; // This would be great if we could extend dothtml. Until then, there's no point of adding this because it only applies within CSS. Note that this can also be called using javascript. https://developer.mozilla.org/en-US/docs/Web/CSS/@property
	(selector: "@scope", rules: Record<string, IDotcssProp>): void;
	(selector: "@scope", scope: string, rules: Record<string, IDotcssProp>): void;
	// (selector: "@starting-style"): void; // This one can be used as a standalone block or as a nested block. It needs more thought. Not supported yet. https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
	// (selector: "@supports", condition: string): void; // This needs more thought. Normally the selectors are accepted as params, but here they go inside. Not supported yet. https://developer.mozilla.org/en-US/docs/Web/CSS/@supports

	(selector: Array<HTMLElement>|HTMLElement|string, styles: IDotcssProp): void;
	(styles: IDotcssProp): void;

	version: string;
}

// export interface IDotcssAnimatable<T> extends IDotcssProp{
// 	(value: T): IDotcssProp;

// 	animate(value: number|string, duration: number, style: "ease", complete: Function): IDotcssProp;
// }

// export interface IDotcssAnimatableColor extends IDotcssProp{
// 	(value: Color|Array<number>): IDotcssProp;
// 	(r: number, g: number, b: number, a?: number): IDotcssProp;

// 	animate(value: Color|Array<number>, duration: number, style: "ease", complete: Function): IDotcssProp;
// }

// export interface HideParams{
// 	duration?: number,
// 	complete?: Function,
// 	hideStyle?: "normal"|"fade"|"shrink",
// 	animationStyle?: "ease",
// }

// export interface ShowParams{
// 	duration?: number,
// 	display?: DisplayValues, // TODO: potential to expand this.
// 	complete?: Function,
// 	opacity?: number,
// 	width?: number,
// 	height?: number,
// 	showStyle?: "normal"|"fade"|"grow",
// 	animationStyle?: "ease",
// }

// TODO: add tests for these. Especially the 2-parameter ones.
