import { IDotComponent, IDotCore, FrameworkItems } from "dothtml-interfaces";

/**
 * Base class for DOThtml components.
 * Provides typed props, refs, and framework-injected properties.
 */
export abstract class DotComponent<P = any, R = any> implements IDotComponent {
	/**
	 * Typed props for the component.
	 */
	public props: P;

	/**
	 * Typed refs for the component.
	 * These are automatically populated by the framework when using the `dot.ref` or `dot.refCollection` features.
	 */
	public refs: R = {} as R;

	/**
	 * Internal framework metadata and utilities.
	 */
	public _: FrameworkItems;

	constructor(props?: P) {
		this.props = props || {} as P;
	}

	/**
	 * Emits a custom event from the component's root element.
	 * This method is automatically injected/overridden by the framework at runtime.
	 * @param name The name of the event to emit.
	 * @param detail Optional data to attach to the event.
	 */
	public emit(name: string, detail?: any): void {
		// Implementation is provided by ComponentVdom at runtime.
	}

	/**
	 * The build method defines the structure of the component.
	 * @param dot The DOThtml core object used to create elements and other components.
	 */
	abstract build(dot: IDotCore): any;

	/**
	 * Called after the component has been mounted to the DOM.
	 */
	mounted?(): void;

	/**
	 * Called when the component is about to be unmounted from the DOM.
	 */
	unmounting?(): void;

	/**
	 * Called after the component has been unmounted from the DOM.
	 */
	unmounted?(): void;

	/**
	 * Called after the component's VDOM has been built for the first time.
	 */
	built?(): void;
}
