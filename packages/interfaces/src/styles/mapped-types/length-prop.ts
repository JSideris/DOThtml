import { IReactive } from "../../bindings/i-reactive";
import { IBinding } from "../../bindings/i-binding";
import { GKV } from "../css-types";
// import { NumericLength } from "./css-types";

type LengthUnitSuffix = "" | "Cm" | "Mm" | "In" | "Px" | "Pt" | "Pc" | "Ch" | "Em" | "Ex" | "Lh" | "Rem" | "Vh" | "Vw" | "Vmin" | "Vmax" | "Cqw" | "Cqh" | "Cqi" | "Cqb" | "Cqmin" | "Cqmax" | "P";
// Following esoteric options removed (but technically correct): 
// "Q" | "Cap" | "Ic" | "Rlh" | "Vb" | "Vi"

type V<S> = IBinding<any> | number | S;

type LengthProp<Prefix extends string, Qty extends 1|2|3|4 = 1, S extends string|IReactive = GKV> = {
	[Key in LengthUnitSuffix as `${Prefix}${Key}`]?: (
		(Key extends "" ? string : never) |
		(Qty extends 1 ? V<S>|[V<S>] : void) |
		(Qty extends 2 ? [V<S>, V<S>] : void) |
		(Qty extends 3 ? [V<S>, V<S>, V<S>] : void) |
		(Qty extends 4 ? [V<S>, V<S>, V<S>, V<S>] : void)
	);
};

export default LengthProp;
