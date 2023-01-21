
import addTest from "../core";
import dot from "../../src/dothtml";

// TODO: Need much more test coverage. Do later.

addTest("Blur filter.", function(){
	return dot.div().style(
		dot.css.filter(f=>f.blur(2))
	);
}, `<div style="filter:blur(2px);"></div>`);

addTest("Multi filter param.", function(){
	return dot.div().style(
		dot.css.filter(f=>f.dropShadow(4,4,10,"blue"))
	);
}, `<div style="filter:drop-shadow(4px 4px 10px rgb(0, 0, 255));"></div>`);

addTest("Multi filter.", function(){
	return dot.div().style(
		dot.css.filter(f=>f.blur(2).opacity(20))
	);
}, `<div style="filter:blur(2px) opacity(20%);"></div>`);