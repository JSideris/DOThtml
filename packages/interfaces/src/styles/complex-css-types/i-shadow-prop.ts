import ColorProps from "../mapped-types/color-props.js";
import LengthProp from "../mapped-types/length-prop.js";


export default interface IShadowProp extends
	LengthProp<"length", 2>,
	LengthProp<"blur">,
	LengthProp<"spread">,
	ColorProps<"color">
{
	
}