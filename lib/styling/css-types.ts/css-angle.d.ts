import CssDataType from "./css-data-type";
export default class CssAngle extends CssDataType {
    angle: number;
    units: string;
    constructor(value: string | number);
    toString(): string;
}
