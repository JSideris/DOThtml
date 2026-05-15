
export default class SyntheticEvent {
	public nativeEvent: Event;
	public target: EventTarget;
	public currentTarget: EventTarget;
	public type: string;
	public timeStamp: number;
	public defaultPrevented: boolean;
	public detail: any;
	private _propagationStopped = false;
	private _immediatePropagationStopped = false;

	constructor(e: Event) {
		this.nativeEvent = e;
		this.target = e.target;
		this.currentTarget = e.currentTarget;
		this.type = e.type;
		this.timeStamp = e.timeStamp;
		this.defaultPrevented = e.defaultPrevented;
		this.detail = (e as any).detail;
	}

	preventDefault() {
		this.defaultPrevented = true;
		this.nativeEvent.preventDefault();
	}

	stopPropagation() {
		this._propagationStopped = true;
		this.nativeEvent.stopPropagation();
	}

	stopImmediatePropagation() {
		this._immediatePropagationStopped = true;
		this._propagationStopped = true;
		this.nativeEvent.stopImmediatePropagation();
	}

	isPropagationStopped() {
		return this._propagationStopped;
	}

	isImmediatePropagationStopped() {
		return this._immediatePropagationStopped;
	}
}
