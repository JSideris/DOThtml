import { dot, IDotStyleBuilder } from "dothtml";

// Exercises LengthProp (width/height/margin/padding) and a narrowed computed
// on a color setter. This must typecheck with skipLibCheck: false.
const color = dot.computed((): "black" | "white" => "black");

dot.div().style((s: IDotStyleBuilder) => {
	s.width(10);
	s.width("20px");
	s.height("inherit");
	s.margin(4);
	s.padding([1, 2]);
	s.color(color);
	return s;
});
