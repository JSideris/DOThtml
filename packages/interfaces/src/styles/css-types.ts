import { IBinding } from "../bindings/i-binding";
import { IWatcher } from "../bindings/i-watcher";

// Global keyword values.
export type GKV = IWatcher<string>|IBinding<any, string>|"inherit"|"initial"|"unset"|"revert"|"revert-layer";

export type ComplexType = string;

export type ValueOrReactive<T> = T|IBinding<any, T>|IWatcher<T>;

// BASIC TYPES
export type Str = `"${string|""}"`|`'${string|""}'`; // TODO: wherever str is required, we could just inject quotes...
export type Int = number;
export type Percentage = `${number}%`;
export type AlphaValue = number | Percentage; // Number should be interpreted as a decimal (x/1);
export type Ratio = number|`${number}/${number}`;

// export type DigitStr = "0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9";
// export type HexStr = DigitStr|"A"|"B"|"C"|"D"|"E"|"F"|"a"|"b"|"c"|"d"|"e"|"f";
// export type Hex2 = `${HexStr}${HexStr}`;
// export type Hex3 = `${Hex2}${HexStr}`;
// export type Hex4 = `${Hex3}${HexStr}`;
// export type Hex5 = `${Hex4}${HexStr}`;
// export type Hex6 = `${Hex5}${HexStr}`;
// export type HexColor = `#${Hex3|Hex6}`;
export type HexColor = `#${ComplexType}`;

// LENGTH
// export type AbsoluteUnits = "cm"|"mm"|"in"|"px"|"pt"|"pc"; // Esoteric removed: "Q"
// export type RelativeUnits = "ch"|"em"|"ex"|"lh"|"rem"
// 	|"vh"|"vw"|"vmin"|"vmax"
// 	|"cqw"|"cqh"|"cqi"|"cqb"|"cqmin"|"cqmax"
// 	|"%"; // Esoteric removed: "cap"|"ic"|"rlh"|"vb"|"vi"
// export type AllLengthUnits = AbsoluteUnits|RelativeUnits;
// export type NumericLength = number|`${number}${AllLengthUnits}`;
// export type LengthPercentage = NumericLength|Percentage;

// TIME & FREQUENCY
export type Time = `${number}${"s"|"ms"}`;
export type TimePercentage = Time|Percentage;
export type Frequency = `${number}${"Hz"|"kHz"}`;
export type FrequencyPercentage = Frequency|Percentage;

// RESOLUTION
export type Resolution = `${number}${"dpi"|"dpcm"|"dppx"|"x"}`;

// MISC ENUM TYPES
export type AbsoluteSize = "xx-small"|"x-small"|"small"|"medium"|"large"|"x-large"|"xx-large"|"xxx-large";
export type BlendMode = "normal"|"multiply"|"screen"|"overlay"|"darken"|"lighten"|"color-dodge"|"color-burn"|"hard-light"|"soft-light"|"difference"|"exclusion"|"hue"|"saturation"|"color"|"luminosity";
export type LineStyle = "none"|"hidden"|"dotted"|"dashed"|"solid"|"double"|"groove"|"ridge"|"inset"|"outset";
export type DisplayBox = "contents"|"none"
export type DisplayInside = "flow"|"flow-root"|"table"|"flex"|"grid"|"ruby";
export type DisplayInternal = "table-row-group"|"table-header-group"|"table-footer-group"|"table-row"|"table-cell"|"table-column-group"|"table-column"|"table-caption"|"ruby-base"|"ruby-text"|"ruby-base-container"|"ruby-text-container";
export type DisplayLegacy = "inline-block"|"inline-table"|"inline-flex"|"inline-grid";
export type DisplayOutside = "block"|"inline"|"run-in";
export type DisplayFlow = "flow"|"flow-root";
export type Overflow = "visible"|"hidden"|"clip"|"scroll";
export type RelativeSize = "smaller"|"larger";

// BASIC SHAPE 
// TODO need a builder.
// Most of these are too complex to represent as a typescript type.
// Realistically they should just be constructed usign a builder rather than setting the strings.
// https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape
export type InsetFunction = `inset(${ComplexType})`;
export type RectFunction = `rect(${ComplexType})`;
export type XywhFunction = `xywh(${ComplexType})`;
export type CircleFunction = `circle(${ComplexType})`;
export type EllipseFunction = `ellipse(${ComplexType})`;
export type PolygonFunction = `polygon(${ComplexType})`;
export type PathFunction = `path(${ComplexType})`;
export type BasicShape = InsetFunction|RectFunction|XywhFunction|CircleFunction|EllipseFunction|PolygonFunction|PathFunction; 

// ANGLES
export type AngleUnits = "deg"|"turn"|"rad"|"grad";
export type Angle = number | `${number}${AngleUnits}`; // Pure number should be interpreted as degrees.
export type AnglePercentage = number | Angle | Percentage; // Number should be interpreted as a decimal (x/1);

// ADVANCED TYPES
// Box.
export type VisualBox = "content-box" | "padding-box" | "border-box"; // the three <box> values
export type RayoutBox = VisualBox | "margin-box" // the <shape-box> values
export type PaintBox = VisualBox | "fill-box" | "stroke-box"
export type CoordBox = VisualBox | "fill-box" | "stroke-box" | "view-box"
export type GeometryBox = RayoutBox | "fill-box" | "stroke-box" | "view-box"
export type BoxEdge = VisualBox | RayoutBox | PaintBox | CoordBox | GeometryBox;

// DIMENSION
// export type Dimension = Angle|Time|Frequency|NumericLength;

// Calc.
export type Calc = ComplexType; 

// It's difficult to compose calc types because they're too complex. See below.
// May consider adding a builder for this, but not sure what it will look like.

/*
	// Can't get this working because the types get too complex for TS.
	// export type Decrement = [
	//     never, 0, 1, 2, 3, 4, 5, 6, 7
	// ];
	// export type CalcConstant = "e"|"-e"|"E"|"pi"|"-pi"|"infinity"|"-infinity"|"NaN"; // Defined on a different page. Not sure what it's for.
	// export type CalcKeyword = 'e' | 'pi' | 'infinity' | '-infinity' | 'NaN';
	// export type CalcValue = number | Percentage | Dimension | CalcKeyword;// | CalcSum;
	// export type CalcProductSuffix<T extends CalcValue, Depth extends number> = Depth extends 0 ? string : `${"*"|"/"}${T}${CalcProductSuffix<T, Decrement[Depth]>}`;
	// export type CalcSumSuffix<T extends CalcValue, Depth extends number> = Depth extends 0 ? string : `${"+"|"-"}${T}${CalcProductSuffix<T, 8>}`;
	// // TODO: optional space can go here.
	// export type CalcProduct<T extends CalcValue> = T|`${T}${CalcProductSuffix<T, 8>}`;
	// export type CalcSum<T extends CalcValue> = CalcProduct<T>|`${CalcProduct<T>}${"+"|"-"}${CalcProduct<T>}`
	// CalcValue export type definition
	// Helper types for CalcProduct and CalcSum
	// export type CalcOperation = '+' | '-' | '*' | '/';
	// export type CalcProductPart = CalcValue | [CalcOperation, CalcValue];
*/

// Color Interpolation.
export type RectangularColorSpace = "srgb"|"srgb-linear"|"display-p3"|"a98-rgb"|"prophoto-rgb"|"rec2020"|"lab"|"oklab"|"xyz"|"xyz-d50"|"xyz-d65";
export type PolarColorSpace = "hsl"|"hwb"|"lch"|"oklch";
export type HueInterpolationMethod = `${"shorter"|"longer"|"increasing"|"decreasing"} hue`
export type ColorInterpolationMethod = RectangularColorSpace|PolarColorSpace|`${PolarColorSpace} ${HueInterpolationMethod}`;

export type Color = string;

// Display List Item

export type DisplayListItem = 
    | 'list-item'
    | `${DisplayOutside} list-item`
    | `list-item ${DisplayOutside}`
    | `${DisplayFlow} list-item`
    | `list-item ${DisplayFlow}`
    | `${DisplayOutside} ${DisplayFlow} list-item`
    | `${DisplayOutside} list-item ${DisplayFlow}`
    | `${DisplayFlow} ${DisplayOutside} list-item`
    | `${DisplayFlow} list-item ${DisplayOutside}`
    | `list-item ${DisplayOutside} ${DisplayFlow}`
    | `list-item ${DisplayFlow} ${DisplayOutside}`;

// ID
export type Ident = string;
export type CustomIdent = string;
export type DashedIdent = `--${string}`;