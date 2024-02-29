export default abstract class VStyle{

	// One (and only one) of these is valid:

	abstract _render(target: HTMLElement);
	abstract _unrender();
	abstract updateProp(prop: string, value: string);
	toString(): string {
		return "";
	}
}