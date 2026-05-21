type SystemValue = "cyclic"|"numeric"|"alphabetic"|"symbolic"|"additive"|`fixed ${number}`|`extends ${string}`;
export default interface IAtCounterStyleBuilder{

	// TODO: need a testcase on this.
	system?: SystemValue|["fixed", number]|["extends", string];

	symbols?: string;
	additiveSymbols?: string;
	negative?: string;
	prefix?: string;
	suffix?: string;
	range?: string;
	pad?: string;
	speakAs?: string;
}