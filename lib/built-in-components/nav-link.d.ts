import Component from "component";
import { DotContent } from "i-dot";
export declare class NavLink extends Component {
    content: DotContent;
    hRef: string;
    constructor(content: DotContent, href: string);
    builder(): import("i-dot").IDotA;
}
