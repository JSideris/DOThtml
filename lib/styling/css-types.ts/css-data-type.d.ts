export declare type CssDataTypeToken = "url" | "number" | "length" | "angle" | "color" | "transformation" | "complex" | "unknown";
export default abstract class CssDataType {
    type: CssDataTypeToken;
    constructor(type: CssDataTypeToken);
}
