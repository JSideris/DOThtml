import { IDotComponent } from "dothtml-interfaces";
import { pushComponent, popComponent } from "../vdom-nodes/component-context";

export function component<T extends { new(...args: any[]): IDotComponent }>(Ctor: T): T {
	const decorated = class extends (Ctor as any) {
		constructor(...args: any[]) {
			const tracker = {
				computedSignals: [],
				effects: [],
				disposables: [],
				registerComputed(w: any) { this.computedSignals.push(w); },
				registerEffect(e: any) { this.effects.push(e); },
				registerDisposable(d: any) { this.disposables.push(d); }
			};
			pushComponent(tracker as any);
			try {
				super(...args);
			} finally {
				popComponent();
			}

			// Support passing props via constructor: new MyComponent({ prop1: 'val' })
			if (args[0] && typeof args[0] === "object" && !args[0].build && (Ctor as any).props) {
				if (!this.props) this.props = {};
				Object.assign(this.props, args[0]);
			}

			// Store the tracked items on the instance so ComponentVdom can pick them up
			(this as any)._trackedComputeds = tracker.computedSignals;
			(this as any)._trackedEffects = tracker.effects;
			(this as any)._trackedDisposables = tracker.disposables;
		}
	};

	// Preserve the original class name for better debugging and error messages
	Object.defineProperty(decorated, 'name', { value: Ctor.name });
	
	// Copy static properties (like props schema)
	for (const key of Object.getOwnPropertyNames(Ctor)) {
		if (key !== "prototype" && key !== "name" && key !== "length") {
			(decorated as any)[key] = (Ctor as any)[key];
		}
	}

	return decorated as any;
}
