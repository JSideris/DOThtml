import { IDotCss } from "dothtml-interfaces";
export default function renderCss(styleCallback: string | ((css: any) => (string | IDotCss))): CSSStyleSheet;
