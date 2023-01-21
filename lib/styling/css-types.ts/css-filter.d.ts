import { AngleUnits, ColorFormat, NumericLength, Percentage } from "../i-dotcss";
import CssDataType from "./css-data-type";
export default class CssFilter extends CssDataType {
    simpleValue: string;
    filters: Array<{
        filter: string;
        args: Array<any>;
    }>;
    constructor(value: any);
    toString(): string;
    private appendFilterString;
    blur(v: NumericLength): this;
    brightness(v: Percentage): this;
    contrast(v: Percentage): this;
    dropShadow(x: NumericLength, y: NumericLength, blur: NumericLength, color: ColorFormat): this;
    grayscale(v: Percentage): this;
    hueRotate(v: AngleUnits): this;
    invert(v: Percentage): this;
    opacity(v: Percentage): this;
    sepia(v: Percentage): this;
    saturate(v: Percentage): this;
}
