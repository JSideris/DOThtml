import { IWatcher, IBinding, IDotComponent } from "dothtml-interfaces";

declare module "dothtml-interfaces" {
	interface IDotCore {
		computed<T>(getter: () => T): IWatcher<T>;
		flushSync(): void;
		mount(component: IDotComponent, props?: Record<string, any>): any;
	}
}
