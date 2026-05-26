import { IDotStyleBuilder } from "../i-dot-style-builder";

export default interface IAtKeyframesBuilder {
	from(callback: (s: IDotStyleBuilder) => void): this;
	to(callback: (s: IDotStyleBuilder) => void): this;
	at(percent: number | string, callback: (s: IDotStyleBuilder) => void): this;
}
