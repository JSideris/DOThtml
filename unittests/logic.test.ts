import addTest from "./core";
import dot from "../src/dothtml";

addTest("If true else.", function(){ return dot.when(true, ()=>"if").otherwise(()=>"else"); }, "if");
addTest("If false else.", function(){ return dot.when(false, ()=>"if").otherwise(()=>"else"); }, "else");
addTest("If false else else.", function(){ return dot.when(false, ()=>"if").otherwise(()=>"else1").otherwise(()=>"else2"); }, "else1else2");
addTest("If true elseif true else.", function(){ return dot.when(true, ()=>"if").otherwiseWhen(true, ()=>"elseif").otherwise(()=>"else"); }, "if");
addTest("If true elseif false else.", function(){ return dot.when(true, ()=>"if").otherwiseWhen(false, ()=>"elseif").otherwise(()=>"else"); }, "if");
addTest("If false elseif true else.", function(){ return dot.when(false, ()=>"if").otherwiseWhen(true, ()=>"elseif").otherwise(()=>"else"); }, "elseif");
addTest("If false elseif false else.", function(){ return dot.when(false, ()=>"if").otherwiseWhen(false, ()=>"elseif").otherwise(()=>"else"); }, "else");
addTest("Nested ifs.", function(){
return dot.when(true,
		dot.when(false, ()=>"if if")
		.otherwiseWhen(true, ()=>"if elseif")
		.otherwise(()=>"if else")
	).otherwiseWhen(true, ()=>"elseif")
	.otherwise(()=>"else");
}, "if elseif");