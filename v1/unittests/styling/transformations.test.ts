
import addTest from "../core";
import {dot} from "../../src/dothtml";

// Test coverage should include:
// 	perspective: (v: LengthOrDefault)=>ITransformationContext;

addTest("Matrix.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.matrix(1,2,3,4,5,6))
	);
}, `<div style="transform:'matrix(1,2,3,4,5,6)';"></div>`);
addTest("Matrix 3d.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.matrix3d(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16))
	);
}, `<div style="transform:'matrix3d(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16)';"></div>`);

addTest("Translate (x only).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.translate(10))
	);
}, `<div style="transform:'translate(10px)';"></div>`);
addTest("Translate.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.translate(10, 20))
	);
}, `<div style="transform:'translate(10px,20px)';"></div>`);
addTest("Translate (custom units).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.translate("10cm", "20cm"))
	);
}, `<div style="transform:'translate(10cm,20cm)';"></div>`);
addTest("Translate (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.translateCm(10, 20))
	);
}, `<div style="transform:'translate(10cm,20cm)';"></div>`);
addTest("Translate X.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.translateX("10cm"))
	);
}, `<div style="transform:'translateX(10cm)';"></div>`);
addTest("Translate X (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.translateXCm(10))
	);
}, `<div style="transform:'translateX(10cm)';"></div>`);
addTest("Translate Y.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.translateY("10cm"))
	);
}, `<div style="transform:'translateY(10cm)';"></div>`);
addTest("Translate Y (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.translateYCm(10))
	);
}, `<div style="transform:'translateY(10cm)';"></div>`);
addTest("Translate Z.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.translateZ("10cm"))
	);
}, `<div style="transform:'translateZ(10cm)';"></div>`);
addTest("Translate Z (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.translateZCm(10))
	);
}, `<div style="transform:'translateZ(10cm)';"></div>`);
addTest("Translate 3D.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.translate3d(10, 20, 30))
	);
}, `<div style="transform:'translate3d(10px,20px,30px)';"></div>`);
addTest("Translate 3D (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.translate3dCm(10, 20, 30))
	);
}, `<div style="transform:'translate3d(10cm,20cm,30cm)';"></div>`);

addTest("Scale (x only).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.scale(10))
	);
}, `<div style="transform:'scale(10,1)';"></div>`);
addTest("Scale.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.scale(10, 20))
	);
}, `<div style="transform:'scale(10,20)';"></div>`);
addTest("Scale custom units.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.scale(10, 20))
	);
}, `<div style="transform:'scale(10,20)';"></div>`);
addTest("Scale X.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.scaleX(10))
	);
}, `<div style="transform:'scaleX(10)';"></div>`);
addTest("Scale Y.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.scaleY(10))
	);
}, `<div style="transform:'scaleY(10)';"></div>`);
addTest("Scale Z.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.scaleZ(10))
	);
}, `<div style="transform:'scaleZ(10)';"></div>`);
addTest("Scale 3D.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.scale3d(10, 20, 30))
	);
}, `<div style="transform:'scale3d(10,20,30)';"></div>`);

addTest("Rotate.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.rotate(10))
	);
}, `<div style="transform:'rotate(10deg)';"></div>`);
addTest("Rotate custom units.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.rotate("10rad"))
	);
}, `<div style="transform:'rotate(10rad)';"></div>`);
addTest("Rotate (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.rotateGrad(10))
	);
}, `<div style="transform:'rotate(10grad)';"></div>`);
addTest("Rotate X.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.rotateX(10))
	);
}, `<div style="transform:'rotateX(10deg)';"></div>`);
addTest("Rotate X (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.rotateXTurn(10))
	);
}, `<div style="transform:'rotateX(10turn)';"></div>`);
addTest("Rotate Y.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.rotateY(10))
	);
}, `<div style="transform:'rotateY(10deg)';"></div>`);
addTest("Rotate Y (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.rotateYRad(10))
	);
}, `<div style="transform:'rotateY(10rad)';"></div>`);
addTest("Rotate Z.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.rotateZ(10))
	);
}, `<div style="transform:'rotateZ(10deg)';"></div>`);
addTest("Rotate Z (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.rotateZGrad(10))
	);
}, `<div style="transform:'rotateZ(10grad)';"></div>`);
addTest("Rotate 3D.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.rotate3d(10, 20, 30, 40))
	);
}, `<div style="transform:'rotate3d(10,20,30,40deg)';"></div>`);
addTest("Rotate 3D (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.rotate3dRad(10, 20, 30, 40))
	);
}, `<div style="transform:'rotate3d(10,20,30,40rad)';"></div>`);

addTest("Skew (x only).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.skew(1))
	);
}, `<div style="transform:'skew(1deg)';"></div>`);
addTest("Skew.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.skew(1, 2))
	);
}, `<div style="transform:'skew(1deg,2deg)';"></div>`);
addTest("Skew (custom units).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.skew("1grad", "2deg"))
	);
}, `<div style="transform:'skew(1grad,2deg)';"></div>`);
addTest("Skew (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.skewGrad(1, 2))
	);
}, `<div style="transform:'skew(1grad,2grad)';"></div>`);
addTest("Skew X.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.skewX(5))
	);
}, `<div style="transform:'skewX(5deg)';"></div>`);
addTest("Skew X (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.skewXRad(5))
	);
}, `<div style="transform:'skewX(5rad)';"></div>`);
addTest("Skew Y.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.skewY(5))
	);
}, `<div style="transform:'skewY(5deg)';"></div>`);
addTest("Skew Y (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.skewYTurn(0.5))
	);
}, `<div style="transform:'skewY(0.5turn)';"></div>`);

addTest("Perspective.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.perspective(100))
	);
}, `<div style="transform:'perspective(100px)';"></div>`);
addTest("Perspective (units).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.perspective("100cm"))
	);
}, `<div style="transform:'perspective(100cm)';"></div>`);
addTest("Perspective (unit function).", function(){
	return dot.div().style(
		dot.css.transform(t=>t.perspectiveCm(100))
	);
}, `<div style="transform:'perspective(100cm)';"></div>`);

addTest("Combined transformation.", function(){
	return dot.div().style(
		dot.css.transform(t=>t.translate("10cm", "20cm").scale(2,4).rotate("0.5turn"))
	);
}, `<div style="transform:'translate(10cm,20cm) scale(2,4) rotate(0.5turn)';"></div>`);

