import { IDotComponent } from "dothtml-interfaces";
import { pushComponent, popComponent } from "../vdom-nodes/component-context";

export function component<T extends { new(...args: any[]): IDotComponent }>(Ctor: T): T {
	const decorated = class extends (Ctor as any) {
		constructor(...args: any[]) {
			const tracker = {
				computedWatchers: [],
				registerComputed(w: any) { this.computedWatchers.push(w); }
			};
			pushComponent(tracker as any);
			try {
				super(...args);
			} finally {
				popComponent();
			}
			// Store the tracked watchers on the instance so ComponentVdom can pick them up
			(this as any)._trackedComputeds = tracker.computedWatchers;
		}
	};
	
	// Copy static properties (like props schema)
	for (const key of Object.getOwnPropertyNames(Ctor)) {
		if (key !== "prototype" && key !== "name" && key !== "length") {
			(decorated as any)[key] = (Ctor as any)[key];
		}
	}

	return decorated as any;
}
