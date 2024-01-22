export declare abstract class Vdom {
    abstract _render(target: HTMLElement): any;
    abstract _unrender(): any;
    toString(): string;
    _renderBefore(reference: Node): void;
    _renderAfter(reference: Node): void;
}
