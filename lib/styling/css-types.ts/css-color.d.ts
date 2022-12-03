import CssDataType from "./css-data-type";
export default class CssColor extends CssDataType {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(value: any);
    toString(): string;
}
