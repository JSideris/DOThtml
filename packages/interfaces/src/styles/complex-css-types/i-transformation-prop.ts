import AngleProp from "../mapped-types/angle-prop";
import { ValueOrReactive } from "../css-types";
import LengthProp from "../mapped-types/length-prop";

// Transforms are special because the order matters and functions can be called mulitple times.
// To support this functionality, we use an array of transform JSON specs.
export default interface ITransformationProp extends
	LengthProp<"translate", 1|2>, 
	LengthProp<"translate3d", 3>,
	LengthProp<"translateX">,
	LengthProp<"translateY">,
	LengthProp<"translateZ">,
	LengthProp<"perspective">,
	AngleProp<["rotate3d"], 4>,
	AngleProp<["skew"], 1|2>,
	AngleProp<["rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY"]>
{
	// a, b, c, d, tx, ty
	matrix?: [ValueOrReactive<number>, ValueOrReactive<number>, ValueOrReactive<number>, ValueOrReactive<number>, ValueOrReactive<number>, ValueOrReactive<number>];
	// a1, b1, c1, d1,  a2, b2, c2, d2,  a3, b3, c3, d3,  a4, b4, c4, d4
	matrix3d?: [
		ValueOrReactive<number>, ValueOrReactive<number>, ValueOrReactive<number>, ValueOrReactive<number>, 
		ValueOrReactive<number>, ValueOrReactive<number>, ValueOrReactive<number>, ValueOrReactive<number>, 
		ValueOrReactive<number>, ValueOrReactive<number>, ValueOrReactive<number>, ValueOrReactive<number>, 
		ValueOrReactive<number>, ValueOrReactive<number>, ValueOrReactive<number>, ValueOrReactive<number>
	];
	
	scale?: ValueOrReactive<number> | [ValueOrReactive<number>, ValueOrReactive<number>];
	scale3d?: [ValueOrReactive<number>, ValueOrReactive<number>, ValueOrReactive<number>];
	scaleX?: ValueOrReactive<number>;
	scaleY?: ValueOrReactive<number>;
	scaleZ?: ValueOrReactive<number>;
}