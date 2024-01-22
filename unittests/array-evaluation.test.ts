import addTest from "./core";
import {dot} from "../src/dothtml";

addTest("Evaluate array.", function(){ return dot.div([1, 2, 3, 4]); }, "<div>1234</div>");
addTest("Evaluate array of functions..", function(){ return dot.div([function(){return 1}, function(){return 2}]); }, "<div>12</div>");
addTest("Evaluate array of dot.", function(){ return dot.div([dot.div(1), dot.div(2), dot.div(3), dot.div(4)]); }, "<div><div>1</div><div>2</div><div>3</div><div>4</div></div>");
addTest("Evaluate array of dot into h.", function(){ return dot.h([dot.div(1), dot.div(2), dot.div(3), dot.div(4)]); }, "<div>1</div><div>2</div><div>3</div><div>4</div>");