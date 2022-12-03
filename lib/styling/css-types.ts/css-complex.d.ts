import CssDataType from "./css-data-type";
export default class CssComplex extends CssDataType {
    parts: string[];
    numbers: string;
    constructor(value: any);
    toString(): string;
}
