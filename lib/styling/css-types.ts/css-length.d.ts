import CssDataType from "./css-data-type";
export default class CssLength extends CssDataType {
    length: number;
    units: string;
    constructor(value: string | number);
    toString(): string;
}
