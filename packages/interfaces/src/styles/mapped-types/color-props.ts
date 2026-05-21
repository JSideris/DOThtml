import { IBinding } from "../../bindings/i-binding";
import { IWatcher } from "../../bindings/i-watcher";

type V = IBinding<any, number|string>| IWatcher<number|string> | number | string;

type ColorUnitSuffix = "" 
	| "Rgb" 
	| "Lab" 
	| "Oklab" 
	| "Hsl" | "HslDeg" | "HslGrad" | "HslRad" | "HslTurn" 
	| "Hwb" | "HwbDeg" | "HwbGrad" | "HwbRad" | "HwbTurn" 
	| "Lch" | "LchDeg" | "LchGrad" | "LchRad" | "LchTurn" 
	| "Oklch" | "OklchDeg" | "OklchGrad" | "OklchRad" | "OklchTurn" 
	| "Color"
	| "Srgb"|"SrgbLinear"|"DisplayP3"|"A98Rgb"|"ProphotoRgb"|"Rec2020"
	| "Xyz"|"XyzD50"|"XyzD65";

type NamedColor = "aliceblue"|"antiquewhite"|"aqua"|"aquamarine"|"azure"|"beige"|"bisque"|"black"|"blanchedalmond"|"blue"|"blueviolet"|"brown"|"burlywood"|"cadetblue"|"chartreuse"|"chocolate"|"coral"|"cornflowerblue"|"cornsilk"|"crimson"|"cyan"|"darkblue"|"darkcyan"|"darkgoldenrod"|"darkgray"|"darkgrey"|"darkgreen"|"darkkhaki"|"darkmagenta"|"darkolivegreen"|"darkorange"|"darkorchid"|"darkred"|"darksalmon"|"darkseagreen"|"darkslateblue"|"darkslategray"|"darkslategrey"|"darkturquoise"|"darkviolet"|"deeppink"|"deepskyblue"|"dimgray"|"dimgrey"|"dodgerblue"|"firebrick"|"floralwhite"|"forestgreen"|"fuchsia"|"gainsboro"|"ghostwhite"|"gold"|"goldenrod"|"gray"|"grey"|"green"|"greenyellow"|"honeydew"|"hotpink"|"indianred"|"indigo"|"ivory"|"khaki"|"lavender"|"lavenderblush"|"lawngreen"|"lemonchiffon"|"lightblue"|"lightcoral"|"lightcyan"|"lightgoldenrodyellow"|"lightgray"|"lightgrey"|"lightgreen"|"lightpink"|"lightsalmon"|"lightseagreen"|"lightskyblue"|"lightslategray"|"lightslategrey"|"lightsteelblue"|"lightyellow"|"lime"|"limegreen"|"linen"|"magenta"|"maroon"|"mediumaquamarine"|"mediumblue"|"mediumorchid"|"mediumpurple"|"mediumseagreen"|"mediumslateblue"|"mediumspringgreen"|"mediumturquoise"|"mediumvioletred"|"midnightblue"|"mintcream"|"mistyrose"|"moccasin"|"navajowhite"|"navy"|"oldlace"|"olive"|"olivedrab"|"orange"|"orangered"|"orchid"|"palegoldenrod"|"palegreen"|"paleturquoise"|"palevioletred"|"papayawhip"|"peachpuff"|"peru"|"pink"|"plum"|"powderblue"|"purple"|"rebeccapurple"|"red"|"rosybrown"|"royalblue"|"saddlebrown"|"salmon"|"sandybrown"|"seagreen"|"seashell"|"sienna"|"silver"|"skyblue"|"slateblue"|"slategray"|"slategrey"|"snow"|"springgreen"|"steelblue"|"tan"|"teal"|"thistle"|"tomato"|"turquoise"|"violet"|"wheat"|"white"|"whitesmoke"|"yellow"|"yellowgreen";
type SystemColor = "AccentColor"|"AccentColorText"|"ActiveText"|"ButtonBorder"|"ButtonFace"|"ButtonText"|"Canvas"|"CanvasText"|"Field"|"FieldText"|"GrayText"|"Highlight"|"HighlightText"|"LinkText"|"Mark"|"MarkText"|"SelectedItem"|"SelectedItemText"|"VisitedText";
type SpecialColors = "currentcolor"|"transparent";

type ColorProp<Prefix extends string> = {
	[Key in ColorUnitSuffix as `${Prefix}${Key}`]?: (
		(Key extends "" ? IBinding<any, string> | IWatcher<string> | NamedColor | SystemColor | SpecialColors | `#${string}` | `${"rgb"|"rgba"|"hsl"|"hsla"|"hwb"|"lab"|"lch"|"oklab"|"oklch"|"color"}(${string})` : void) |
		(Key extends "Rgb" | "Hsl" | "HslDeg" | "HslGrad" | "HslRad" | "HslTurn" | "Hwb" | "HwbDeg" | "HwbGrad" | "HwbRad" | "HwbTurn" | "Lab" | "Lch" | "LchDeg" | "LchGrad" | "LchRad" | "LchTurn" | "Oklch" | "OklchDeg" | "OklchGrad" | "OklchRad" | "OklchTurn" ? [V, V, V] | [V, V, V, V] : void) |
		(Key extends "Srgb" | "SrgbLinear" | "DisplayP3" | "A98Rgb" | "ProphotoRgb" | "Rec2020" | "Xyz" | "XyzD50" | "XyzD65" ? [V, V, V] : void)
	);
};

export default ColorProp;




// Color

// export type Hue = number|Angle;
// export type PredefinedRgb = "srgb"|"srgb-linear"|"display-p3"|"a98-rgb"|"prophoto-rgb"|"rec2020";
// export type XyzSpace = "xyz"|"xyz-d50"|"xyz-d65";
// export type XyzParams = `${XyzSpace}                ${number|Percentage|"none"} ${number|Percentage|"none"} ${number|Percentage|"none"}`
// export type PredefinedRgbParams = `${PredefinedRgb} ${number|Percentage|"none"} ${number|Percentage|"none"} ${number|Percentage|"none"}`
// export type ColorspaceParams = PredefinedRgbParams|XyzParams;

// export type LRgba<T extends number|AlphaValue> = `rgb(${T}, ${T}, ${T})` | `rgba(${T}, ${T}, ${T}, ${AlphaValue})`;
// export type MRgba = `rgb(${number|Percentage|"none"} ${number|Percentage|"none"} ${number|Percentage|"none"})` | `rgba(${number|Percentage|"none"} ${number|Percentage|"none"} ${number|Percentage|"none"} / ${AlphaValue})`;
// export type Rgba = LRgba<number|AlphaValue>|MRgba;
// export type LHsla = `hsl(${Hue}, ${Percentage}, ${Percentage})` | `hsla(${Hue}, ${Percentage}, ${Percentage}, ${AlphaValue})`;
// export type MHsla = `hsl(${Hue|"none"} ${Percentage|number|"none"} ${Percentage|number|"none"})` | `hsla(${Hue|"none"} ${Percentage|number|"none"} ${Percentage|number|"none"} / ${AlphaValue|"none"})`;
// export type Hsla = LHsla|MHsla;
// export type Hwb = `hwb(${Hue|"none"} ${Percentage|number|"none"} ${Percentage|number|"none"})` | `hwb(${Hue|"none"} ${Percentage|number|"none"} ${Percentage|number|"none"} / ${AlphaValue|"none"})`;
// export type Lab = `${"lab"|"oklab"}(${number|Percentage|"none"} ${number|Percentage|"none"} ${number|Percentage|"none"})` | `${"lab"|"oklab"}(${number|Percentage|"none"} ${number|Percentage|"none"} ${number|Percentage|"none"} / ${AlphaValue|"none"})`;
// export type Lch = `${"lch"|"oklch"}(${number|Percentage|"none"} ${number|Percentage|"none"} ${Hue|"none"})` | `${"lch"|"oklch"}(${number|Percentage|"none"} ${number|Percentage|"none"} ${Hue|"none"} / ${AlphaValue|"none"})`;
// export type ColorFunc = `color(${ColorspaceParams})`| `color(${ColorspaceParams} / ${AlphaValue|"none"})`;
// export type AbsoluteColorFunction = Rgba|Hsla|Hwb|Lab|Lch|ColorFunc;

// export type AbsoluteColorBase = HexColor|AbsoluteColorFunction|NamedColor|"transparent";
// export type Color = AbsoluteColorBase|SystemColor|"currentcolor";
// export type SimpleColor = 
// 	HexColor
// 	|`${"rgb"|"rgba"|"hsl"|"hsla"|"hwb"|"lab"|"lch"|"oklab"|"oklch"|"color"}(${ComplexType})`
// 	|NamedColor|SystemColor|"currentcolor";