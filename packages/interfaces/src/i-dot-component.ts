
import { IDotCore, IDotDocument } from "./i-dot";

// export type EventNames<T> = T extends { allowedEvents: infer E } ? E : never;

// TODO: I think this could be typed so that it forces you to emit events from the list of strings.
export interface FrameworkItems {
	/**
	 * The shadow root element of the component.
	 */
	readonly refs: { [key: string]: HTMLElement };
	emit<T>(event: string, ...args: Array<any>): void;
	restyle(): void;
	readonly props: Record<string, any>;
	readonly cvdom: any;
	readonly _meta: {
		readonly allowedEvents: string[];
		readonly shadowRoot: ShadowRoot;
		readonly isRendered: boolean;
		readonly tagName: string;
		readonly args: Array<any>;
		readonly sharedStyles: CSSStyleSheet[];
	}
}


// TODO: there's a weird problem where if a constructor is not provided, it's not possible have a custom builder.
// It should be the contsructor that depends on the builder, not the other way around. If we can't get this working, 
// it might just be better to rethink how stuff gets passed into components.
export default interface IDotComponent/*<TProps extends Array<string> = [], TEvents extends Array<string> = []>*/ {

	readonly _?: FrameworkItems;
	props?: any;
	slots?: Record<string, any>;

	/**
	 * Registers a side effect that is automatically cleaned up when the component is unmounted.
	 * @param callback The side effect to run. Can return a cleanup function.
	 */
	effect?(callback: () => void | (() => void)): void;

	// Regrettably, TS forces clients to implement the constructor, which is not ideal because we want to internalize that.
	// There's no way to make the constructor optional.
	// new (attrs?: ComponentArgs<TProps, TEvents>): IComponent<TProps, TEvents>;
	// new (): IComponent<TProps, TEvents>;

    // Lifecycle hooks

	/**
	 * A function returning DOThtml (required). The `build` hook is called once per component instance, and constructs the component's virtual DOM.
	 * @param dot - The DOThtml core object passed in for DI purposes. You can also just use the main .
	 * @returns The DOThtml document representing the component's virtual DOM.	 */
    build(dot: IDotCore): IDotDocument;

	/**
	 * An optional function called after the component is built. Is only called once per component instance. 
	 */
    built?(): void;
	
	/**
	 * An optional function that gets called before the component is mounted.
	 */
    mounting?(): void;

	/**
	 * An optional function called after the element has been mounted. May be called mulitple times if the component is rerendered.
	 */
    mounted?(): void;
	
	/**
	 * An optional function that gets called before the component is unmounted. Use it to do custom cleanup or data saving.
	 */
    unmounting?(): void;

	/**
	 * An optional function called after the element has been unmounted. May be called mulitple times if the component is rerendered.
	 */
    unmounted?(): void;

	/**
	 * A function that returns a string containing CSS rules to be applied to all instances of the component.
	 * It will only be called exactly once per component. We use a function so that you can return a potentially 
	 * large string containing CSS without introducing a memory leak. The reason it's not static is so that 
	 * it will work in JavaScript, and because static members are not valid in DI interfaces. All styles are scoped
	 * to the component's shadow DOM.
	 * @returns A string (or array of strings) containing imported CSS rules.
	 */
	stylize?(s?: any): string | string[] | any;

	/**
	 * An optional function that allows you to apply styles directly to the component's host element.
	 */
	hostStyle?(s: any): void;
}
