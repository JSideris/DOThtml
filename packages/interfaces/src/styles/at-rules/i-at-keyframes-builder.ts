import IDotcssProp from "../i-css-prop";

export default interface IAtKeyframesBuilder{
	to: IDotcssProp;
	from: IDotcssProp;

	[key: `${number}%`]: IDotcssProp;
}