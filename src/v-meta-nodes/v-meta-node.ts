

export default abstract class VMetaNode{
	abstract render(target: HTMLElement): void;
	abstract unrender(): void;
	abstract update(): void;
}