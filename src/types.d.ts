import { IWatcher, IBinding, IDotComponent, IReactive } from "dothtml-interfaces";

declare module "dothtml-interfaces" {
	interface IWatcher<T = any> {
		unsubscribe(id: number): void;
		refresh(priority?: any): void;
	}

	type ISignal<T = any> = IWatcher<T>;

	interface IDotCore {
		state<Ti = IReactive | Array<any> | { [key: string | number]: any } | string | number | boolean>(initValue?: Ti, key?: (Ti extends Array<any> | { [key: string | number]: any } ? string : never)): ISignal<Ti>;
		computed<T>(getter: () => T): ISignal<T>;
		flushSync(): void;
		mount(component: IDotComponent, props?: Record<string, any>): any;
		currentPath: ISignal<string>;
		currentSearch: ISignal<string>;
		currentHash: ISignal<string>;
		navigate(path: string, replace?: boolean): void;
		Router: any;
		Link: any;
	}

	interface IDotDocument {
		style(c: string | ISignal<any> | IBinding<any, any> | IDotCss | ((s: any) => void)): this;
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
