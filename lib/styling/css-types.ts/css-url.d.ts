import CssDataType from "./css-data-type";
export default class CssUrl extends CssDataType {
    url: Array<string>;
    constructor(value: any);
    toString(): string;
}
