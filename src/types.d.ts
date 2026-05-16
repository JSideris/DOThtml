import { IWatcher, IBinding, IDotComponent } from "dothtml-interfaces";

declare module "dothtml-interfaces" {
	interface IDotCore {
		computed<T>(getter: () => T): IWatcher<T>;
		flushSync(): void;
		mount(component: IDotComponent, props?: Record<string, any>): any;
	}

	interface IDotDocument {
		style(c: string | IWatcher<any> | IBinding<any, any> | IDotCss | ((s: any) => void)): this;
		class(name: string, condition?: any): this;
		attr(name: string, value: any): this;
		on(event: string, callback: (e: any) => void): this;
	}

	interface IDotComponent {
		stylize?(s?: any): string | string[] | any;
		hostStyle?(s: any): void;
	}

	interface IDotCss {
		variable(name: string, value: any): this;
		v(name: string): string;
		[prop: string]: any;
	}
}
