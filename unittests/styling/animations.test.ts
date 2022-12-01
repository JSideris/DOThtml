
import addTest from "../core";
import dot from "../../src/dothtml";

// For testing the passing of data into and out of components via properties and events, respectively.

addTest("Dotcss returns stringable value.", function(){
	return dot.div(dot.css.color(0x102030).border("1px solid black").toString());
}, "<div>color:\"rgb(16, 32, 48);\"border:\" 1px solid black \";</div>");

addTest("Styling an element.", function(){
	return dot.div().style(dot.css.color(0x102030).border("1px solid black").toString());
}, "<div style=\"color:'rgb(16, 32, 48);'border:' 1px solid black ';\"></div>");

