import AngleProp from "../mapped-types/angle-prop";
import { Percentage, ValueOrReactive } from "../css-types";
import LengthProp from "../mapped-types/length-prop";
import IShadowProp from "./i-shadow-prop";

export default interface IFilterProp extends
	AngleProp<["hueRotate"]>,
	LengthProp<"blur", 1>
{
	// url(commonfilters.svg#filter); // Don't know how this works yet.
	brightness?: ValueOrReactive<number> | Percentage;
	contrast?: ValueOrReactive<number> | Percentage;
	dropShadow?: IShadowProp | IShadowProp[];
	grayscale?: ValueOrReactive<number> | Percentage;
	invert?: ValueOrReactive<number> | Percentage;
	opacity?: ValueOrReactive<number> | Percentage;
	sepia?: ValueOrReactive<number> | Percentage;
	saturate?: ValueOrReactive<number> | Percentage;
	// url(filters.svg#filter) blur(4px) saturate(150%); // example.
}