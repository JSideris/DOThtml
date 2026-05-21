import { IReactive } from "../../bindings/i-reactive";

type V = IReactive | number | string;

type AngleUnitSuffix = "" | "Deg" | "Grad" | "Rad" | "Turn";

type AngleProp<Prefixes extends Array<string>, Qty extends 1|2|3|4 = 1> = {
	[Key in AngleUnitSuffix as `${Prefixes[number]}${Key}`]?: (
		(Qty extends 1 ? V|[V] : void) |
		(Qty extends 2 ? [V, V] : void) |
		(Qty extends 3 ? [V, V, V] : void) |
		(Qty extends 4 ? [V, V, V, V] : void) 
	);
};

export default AngleProp;