import { IRef } from "dothtml-interfaces/src/bindings/i-ref";

export default class Ref implements IRef{
	_element: HTMLElement;

	get element(): HTMLElement {
		return this._element;
	}
}