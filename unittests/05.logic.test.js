import addTest from "./core";
import dot from "../src/index";

addTest("If true else.", function(){ return dot.IF(true, "if").ELSE("else"); }, "if");
addTest("If false else.", function(){ return dot.IF(false, "if").ELSE("else"); }, "else");
addTest("If false else else.", function(){ return dot.IF(false, "if").ELSE("else1").ELSE("else2"); }, "else1else2");
addTest("If true elseif true else.", function(){ return dot.IF(true, "if").ELSEIF(true, "elseif").ELSE("else"); }, "if");
addTest("If true elseif false else.", function(){ return dot.IF(true, "if").ELSEIF(false, "elseif").ELSE("else"); }, "if");
addTest("If false elseif true else.", function(){ return dot.IF(false, "if").ELSEIF(true, "elseif").ELSE("else"); }, "elseif");
addTest("If false elseif false else.", function(){ return dot.IF(false, "if").ELSEIF(false, "elseif").ELSE("else"); }, "else");
addTest("Nested ifs.", function(){
return dot.IF(true,
		dot.IF(false, "if if")
		.ELSEIF(true, "if elseif")
		.ELSE("if else")
	).ELSEIF(true, "elseif")
	.ELSE("else");
}, "if elseif");