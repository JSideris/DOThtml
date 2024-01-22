import addTest from "../core";
import {dot} from "../../src/dothtml";

addTest("Dotcss returns stringable value.", function(){
	return dot.div(dot.css.color(0x102030).border("1px solid black").toString());
}, `<div>color:"rgb(16, 32, 48);"border:" 1px solid black ";</div>`);

addTest("Styling an element.", function(){
	return dot.div().style(dot.css.color(0x102030).border("1px solid black"));
}, `<div style="color:'rgb(16, 32, 48);'border:' 1px solid black ';"></div>`);

addTest("Restyling an element.", function(){
	let div = dot.div().style(dot.css.position("absolute").position("fixed"));
	// dot.css(div.getLast()).position("absolute");
	// dot.css(div.getLast()).position("fixed");
	return div;
}, `<div style="position: 'fixed';"></div>`);

