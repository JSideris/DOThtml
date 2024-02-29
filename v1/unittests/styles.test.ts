import addTest from "./core";
import {dot} from "../src/dothtml";

addTest("Styles as a string.", function(){ return dot.t(dot.css.width(400).height(300)); }, "width:400px;height:300px;");
addTest("String styles a div.", function(){ return dot.div().style(dot.css.width(400).height(300)); }, "<div style=\"width:400px;height:300px;\"></div>");

// addTest("Builder styles a div.", function(){ return dot.div().style(css => {
// 	css.width(400).height(300);
// }); }, "<div style=\"width:400px;height:300px;\"></div>");