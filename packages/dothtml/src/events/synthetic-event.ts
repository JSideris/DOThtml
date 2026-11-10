
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
		const path = e.composedPath();
		this.target = path.length > 0 ? path[0] : e.target;
		this.currentTarget = e.currentTarget;
		this.type = e.type;
		this.timeStamp = e.timeStamp;
		this.defaultPrevented = e.defaultPrevented;
		this.detail = (e as any).detail;

		// Forward typed native fields (key, code, button, clientX, etc.)
		// so handlers typed as KeyboardEvent or MouseEvent can read them
		// directly. Framework fields on this wrapper win.
		return new Proxy(this, {
			get(target, prop, receiver) {
				if (prop in target) {
					const val = Reflect.get(target, prop, receiver);
					return typeof val === "function" ? val.bind(target) : val;
				}
				const nativeVal = (target.nativeEvent as any)[prop];
				return typeof nativeVal === "function" ? nativeVal.bind(target.nativeEvent) : nativeVal;
			},
			has(target, prop) {
				return prop in target || prop in target.nativeEvent;
			}
		});
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
