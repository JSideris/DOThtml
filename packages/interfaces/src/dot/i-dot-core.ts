import { VERSION } from "../version";
import IDotComponent from "../i-dot-component";
import IDotCss from "../styles/i-dot-css";
import IEventBus from "../i-event-bus";
import { IBinding } from "../bindings/i-binding";
import IDotcssProp from "../styles/i-css-prop";
import { IRef } from "../bindings/i-ref";
import { IReactive } from "../bindings/i-reactive";
import { DotContent, ISignal } from "./content";
import { IDotDocument, IDotConditionalDocument } from "./i-dot-document";

type Styles = string | IDotcssProp;
// interface IComponentFactory {
// 	<TProps extends string[], TEvents extends string[], T extends IComponent<TProps, TEvents>>(
// 		Base: new () => T, styles?: Styles | Styles[]
// 	): new (attrs?: ComponentArgs<TProps, TEvents>) => T & { new (attrs?: ComponentArgs<TProps, TEvents>): IComponent<TProps, TEvents> };
// }

// interface IComponentFactory {
//     <TProps extends string[], TEvents extends string[], T extends IComponent<TProps, TEvents>>(
//         Base: new () => T, styles?: Styles | Styles[]
//     ): new (attrs?: ComponentArgs<TProps, TEvents>) => T & IComponent<TProps, TEvents>;
// }

// useStyles<T extends IComponent>(styles: Styles | Styles[]): (Base: new () => T) => new () => T;
// hasEvents<T extends IComponent>(styles: Styles | Styles[]): (Base: new () => T) => new () => T;
// prop(target: any, propertyKey: string): void;

export type ComponentArgs<TProps extends Array<string> = [], TEvents extends Array<string> = []> = {
	[key in TProps[number]]?: any;
} & Partial<{
	[key in TEvents[number]]?: (...args: any[]) => void;
}>;

/**
 * Interface for the dot object.
 */
export interface IDotCore extends IDotDocument {
	(targetSelector: string | Element | Node | NodeList | Array<Node | Element>, targetWindow?: Window): IDotDocument;

	version: typeof VERSION;
	styleMode: "sync" | "async";

	navigate(path: string, replace?: boolean): void;
	css: IDotCss;
	bus: IEventBus;
	window: IDotWindowBuilder;

	state<Ti = IReactive | Array<any> | { [key: string | number]: any } | string | number | boolean>(initValue?: Ti, key?: (Ti extends Array<any> | { [key: string | number]: any } ? string : never)): ISignal<Ti>;
	computed<T>(getter: () => T): ISignal<T>;

	/**
	 * Registers a side effect that runs automatically when its dependencies change.
	 * If called within a component or store, it is automatically cleaned up when the owner is disposed.
	 * @param callback The function to execute. Can return a cleanup function.
	 * @returns A manual dispose function.
	 */
	effect(callback: () => void | (() => void)): () => void;

	alpha(color: string | ISignal<string> | IBinding<any, string>, opacity: number | ISignal<number> | IBinding<any, number>): ISignal<string>;
	flushSync(): void;
	setSync(sync: boolean): void;
	
	currentPath: ISignal<string>;
	currentSearch: ISignal<string>;
	currentHash: ISignal<string>;
	
	useQueryParams(): ISignal<Record<string, string>>;
	useHash(): ISignal<string>;
	
	create<T extends IDotComponent>(Ctor: { new(...args: any[]): T }, ...args: any[]): T;

	store: <TState extends Record<string, any>, TActions extends Record<string, Function>, TGetters extends Record<string, (state: any) => any>>(options: { id?: string, state?: () => TState, getters?: TGetters, actions?: TActions }) => () => any;
	getStore: (id: string) => any;
	clearStores: () => void;
	stores: Record<string, any>;
	useGlobalStyles: (styles: string | CSSStyleSheet | Array<string | CSSStyleSheet>) => void;
	setTheme: (theme: any) => void;

	Router: any;
	Link: any;

	slot(name?: string | any, fallback?: any): IDotDocument;

	/**
	 * Creates a reactive reference to a DOM element or component instance.
	 * Refs are signals that are automatically populated when the element is mounted.
	 * @template T The type of the element or component.
	 */
	ref<T extends HTMLElement | IDotComponent = HTMLElement>(): IRef<T>;

	// Keep these around for a bit to show how it was done before in case I need to change anything prior to the v6 launch.
	// component<T extends IComponent>(Base: new (...args: Parameters<T['build']>) => T): new (...args: Parameters<T['build']>) => T;
	// useStyles<T extends IComponent>(styles: string|((css: IDotCss)=>IDotcssProp|string)): ((Base: new (...args: Parameters<T['build']>) => T) => new (...args: Parameters<T['build']>) => T);

	// component: IComponentFactory;
	// Works but doesn't infer types from the component.
	// There's room for improvement here but it's not clear to me how to do it.
	// What I'd like to do is have the types tied to the IComponent interface rather than the component factory function.
	component<T extends { new(...args: any[]): IDotComponent }>(Ctor: T): T;
	component<TProps extends string[] = [], TEvents extends string[] = []>(Base: new (...args: any[]) => IDotComponent, styles?: string|IDotcssProp|Array<string|IDotcssProp>)
		: new (attrs?: ComponentArgs<TProps, TEvents>) => IDotComponent;

	useStyles(document: Document, styles: Styles): HTMLStyleElement;

	/**
	 * A global error handler that is called when an error occurs during the rendering or update process.
	 */
	onError?: (error: any) => void;
}

export interface IDotWindowWrapper{
	open(): Promise<void>;
	close(): void;
	window: Window;
	document: Document;
	title: string;
	width: number;
	height: number;
	isOpen: boolean;
	syncStyles: boolean;
	tether: boolean;
	position: "center" | "parent-center" | "beside-parent" | {left: number, top: number} | null;
	on(event: string, callback: (e: any) => void): this;
	focus(): void;
	bringToFront(): void;
	resizeTo(width: number, height: number): void;
	moveTo(left: number, top: number): void;
}

export interface IDotWindowBuilder {
	(options: {content: IDotComponent, width?: number, height?: number, title?: string, tether?: boolean, syncStyles?: boolean, position?: "center" | "parent-center" | "beside-parent" | {left: number, top: number}}): IDotWindowWrapper;
}
