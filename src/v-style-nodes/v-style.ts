export abstract class VStyle{

	// One (and only one) of these is valid:

	abstract _render(target: HTMLElement);
	abstract _unrender();
	toString(): string {
		return "";
	}
}