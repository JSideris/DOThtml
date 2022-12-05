import { NumericAngle, NumericLength } from "../i-dotcss";
import CssDataType from "./css-data-type";
export default class CssTransform extends CssDataType {
    transformations: Array<{
        transformation: string;
        args: Array<any>;
    }>;
    finalMatrix: number[];
    simpleValue: string;
    constructor(value: any);
    toString(): string;
    private appendTransformString;
    matrix3d(a1: number, b1: number, c1: number, d1: number, a2: number, b2: number, c2: number, d2: number, a3: number, b3: number, c3: number, d3: number, a4: number, b4: number, c4: number, d4: number): this;
    matrix(a: number, b: number, c: number, d: number, tx: number, ty: number): this;
    translate(x: NumericLength, y?: NumericLength): this;
    translate3d(x: NumericLength, y: NumericLength, z: NumericLength): this;
    translateX(x: NumericLength): this;
    translateY(y: NumericLength): this;
    translateZ(z: NumericLength): this;
    scale(x: number, y?: number): this;
    scale3d(x: number, y: number, z: number): this;
    scaleX(x: number): this;
    scaleY(y: number): this;
    scaleZ(z: number): this;
    rotate(x: NumericAngle): this;
    rotate3d(x: number, y: number, z: number, a: NumericAngle): this;
    rotate3dDeg(x: number, y: number, z: number, a: number): this;
    rotate3dRad(x: number, y: number, z: number, a: number): this;
    rotate3dGrad(x: number, y: number, z: number, a: number): this;
    rotate3dTurn(x: number, y: number, z: number, a: number): this;
    rotateX(x: NumericAngle): this;
    rotateY(y: NumericAngle): this;
    rotateZ(z: NumericAngle): this;
    skew(x: NumericAngle, y?: NumericAngle): this;
    skewX(x: NumericAngle): this;
    skewY(y: NumericAngle): this;
    perspective(d: NumericLength): this;
}
