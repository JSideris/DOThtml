
type NormalOrPercentage = "normal" | number | `${string}%`;
type StretchValues = `${number}%`|number|"ultra-condensed"|"extra-condensed"|"condensed"|"semi-condensed"|"normal"|"semi-expanded"|"expanded"|"extra-expanded"|"ultra-expanded";

export default interface IAtFontFamilyBuilder{
	ascentOverride?: string;
	descentOverride?: NormalOrPercentage | [NormalOrPercentage] | [NormalOrPercentage, NormalOrPercentage];
	fontDisplay?: "auto"|"block"|"swap"|"fallback"|"optional";
	fontFamily: string;
	fontStretch?: StretchValues | [StretchValues] | [StretchValues, StretchValues];
	fontStyle?: "normal"|"italic"|"auto"|"oblique"|`oblique ${string}`;
	fontWeight?: "normal"|"bold"|number|`${number}`;
	fontFeatureSettings?: string;
	fontVariationSettings?: string|string[];
	lineGapOverride?: NormalOrPercentage | [NormalOrPercentage] | [NormalOrPercentage, NormalOrPercentage];
	sizeAdjust?: `${number}%`|number;
	src?: string;
	unicodeRange?: string;
}