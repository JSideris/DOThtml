import CssDataType from "./css-data-type";
export default class CssNumber extends CssDataType {
    value: number;
    constructor(value: any);
    toString(): number;
}
