
import IDotComponent from "./i-dot-component";
import IDotCss from "./styles/i-dot-css";
import IEventBus from "./i-event-bus";
import {IReactive} from "./bindings/i-reactive";
import { IBinding } from "./bindings/i-binding";
import { IWatcher } from "./bindings/i-watcher";
import IDotcssProp from "./styles/i-css-prop";
import { IRef } from "./bindings/i-ref";

type DotContentPrimitive = string | number | boolean | undefined | null;
type DotContentBasic = DotContentPrimitive | Node | Element | NodeList | IDotComponent | IDotDocument//typeof DotDocument;
export type DotContent = DotContentBasic | Array<DotContent> | IReactive;//|(()=>DotContent);

export type ISignal<T = any> = IWatcher<T>;

type AttrVal<T = string | number | boolean> = T | IReactive;

/**
 * Global interface containing elements.
 */
export interface IDotDocument {
	// Creating a blank DotDocument.
	// (document?: Element, classPrefix?: number, targetWindow?: Window): void;

	// Internal use only:
	// Removed in v6.
	// _appendOrCreateDocument(content: DotContent, parentEl?: Element, beforeNode?: Node|number);

	/**
	 * A conditional function, analogous to if. Renders the specified DOT if a condition is met. Dynamic binding is possible when condition and callback are functions.
	*/
	when(condition: IReactive | boolean, DotContent): IDotConditionalDocument;

	// Main functions.
	// TODO: please make this into a test case.
	/**
	 * Cast any document to any other element type. This can be used to access attributes when dotHTML doesn't know the type.
	 * @example
	 * dot("#my-input").as(dot.input).value("Hello, world!")
	 * @example
	 * dot.h("<a>Click me!</a>").as(dot.a).hRef("https://dothtml.com/")
	*/
	as<T extends IDotDocument>(dotElement: (...props: any[]) => T): T;
	/**
	 * Creates a custom element.
	*/
	el(tag: string, content?: DotContent): IDotDocument

	// Special "tags"
	/**
	 * Creates a generic HTML node that can render a string, HTML nodes, or dotHTML content.
	*/
	html(content: string | number | boolean | IReactive): IDotDocument;
	/**
	 * Creates a text node that will render as a string, rather than being parsed as markup.
	*/
	text(content: string | number | boolean | IReactive): IDotDocument;
	/**
	 * Creates a text node that will render as a string, rather than being parsed as markup.
	*/
	md(content: string | number | boolean | IReactive): IDotDocument;
	/**
	 * Mounts a component.
	 */
	mount<T extends IDotComponent>(component: T, ...args: any[]): IDotDocument;
	slot(name?: string | any, fallback?: any): IDotDocument;
	// mount<T extends IComponent>(init: (c: IMountedComponent<T>) => IMountedComponent<T> | void, component: T): IDotDocument;
	// mount(component: IComponent, init: (init=>IMountedComponent): IMountedComponent|void): IDotDocument;
	/**
	 * Iterates n times, appending the result of each iteration to the VDBO.
	 * @param n The number of iterations.
	 * @param callback The markup-generating callback.
	*/
	iterate(n: number, callback: (i: number) => DotContent): IDotDocument;
	each<T>(a: Array<T> | { [key: string | number]: T }, callback: (x: T, i: number, k: string | number) => DotContent): IDotDocument;
	each<T>(a: 
		IWatcher<Array<T>>
		|IWatcher<Record<string|number, T>>
		|IBinding<any, Array<T>>
		|IBinding<any, IWatcher<Record<string|number, T>>>
		, callback: (x: T, i: IBinding<number>, k: string | number) => DotContent): IDotDocument;

	/**
	 * Removes the targeted document and everything in it.
	*/
	remove(): void;

	style(c: string | ISignal<any> | IBinding<any, any> | IDotCss | ((s: any) => void)): this;
	class(name: string, condition?: any): this;
	attr(name: string, value: any): this;
	on(event: string, callback: (e: any) => void): this;
	onEnter(callback: (el: HTMLElement) => void): this;
	onLeave(callback: (el: HTMLElement) => Promise<void> | void): this;

	fade(duration?: number): this;
	slide(duration?: number): this;

	/**
	 * Get the last HTML element added to the targeted document.
	*/
	// getLast(): HTMLElement;
	/**
	 * Deletes each element within the targeted document.
	*/
	empty(): IDotDocument;

	// Redundant in v6.
	// scopeClass(prefix: number|string|null, content: DotContent): IDotDocument;

	// Tags.
	a(...args: (DotContent | IDotA)[]): IDotDocument;

	aside(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	abbr(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	address(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	area(...args: (DotContent | IDotArea)[]): IDotDocument;

	article(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	audio(...args: (DotContent | IDotAudio)[]): IDotDocument;

	b(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	bdi(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	bdo(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	blockQuote(...args: (DotContent | IDotBlockQuote)[]): IDotDocument;

	// This shouldn't really be used - if it is, then it should have the custom behavior of rewriting the existing document body, rather than adding a second one.
	body(...args: (DotContent | IDotBody)[]): IDotDocument;

	br(...args: (DotContent | IDotBr)[]): IDotDocument;
	button(...args: (DotContent | IDotButton)[]): IDotDocument;
	canvas(...args: (DotContent | IDotCanvas)[]): IDotDocument;

	caption(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	cite(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	code(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	col(...args: (DotContent | IDotCol)[]): IDotDocument;
	colGroup(...args: (DotContent | IDotColGroup)[]): IDotDocument;

	content(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	data(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	dataList(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	dd(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	del(...args: (DotContent | IDotDel)[]): IDotDocument;
	details(...args: (DotContent | IDotDetails)[]): IDotDocument;

	dfn(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	dialog(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	div(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	dl(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	dt(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	em(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	embed(...args: (DotContent | IDotEmbed)[]): IDotDocument;
	fieldSet(...args: (DotContent | IDotFieldSet)[]): IDotDocument;

	figCaption(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	figure(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	footer(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	form(...args: (DotContent | IDotForm)[]): IDotDocument;

	h1(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	h2(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	h3(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	h4(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	h5(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	h6(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	header(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	hr(...args: (DotContent | ((attrs: IDotHr) => IDotHr))[]): IDotDocument;

	i(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	iFrame(...args: (DotContent | IDotIFrame)[]): IDotDocument;
	img(...args: (DotContent | IDotImg)[]): IDotDocument;
	input(...args: (DotContent | IDotInput)[]): IDotDocument;
	ins(...args: (DotContent | IDotIns)[]): IDotDocument;

	kbd(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	/** @deprecated Deprecated in HTML5. */
	keyGen(...args: (DotContent | IDotKeyGen)[]): IDotDocument;
	label(...args: (DotContent | IDotLabel)[]): IDotDocument;

	legend(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	li(...args: (DotContent | IDotLi)[]): IDotDocument;

	main(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	map(...args: (DotContent | IDotMap)[]): IDotDocument;

	mark(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	menu(...args: (DotContent | IDotMenu)[]): IDotDocument;
	meter(...args: (DotContent | IDotMeter)[]): IDotDocument;

	nav(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	object(...args: (DotContent | IDotObject)[]): IDotDocument;
	ol(...args: (DotContent | IDotOl)[]): IDotDocument;
	optGroup(...args: (DotContent | IDotOptGroup)[]): IDotDocument;
	option(...args: (DotContent | IDotOption)[]): IDotDocument;
	output(...args: (DotContent | IDotOutput)[]): IDotDocument;

	p(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	param(...args: (DotContent | IDotParam)[]): IDotDocument;

	pre(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	progress(...args: (DotContent | IDotProgress)[]): IDotDocument;
	q(...args: (DotContent | IDotQ)[]): IDotDocument;

	rp(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	rt(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	ruby(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	s(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	samp(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	section(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	select(...args: (DotContent | IDotSelect)[]): IDotDocument;

	small(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	source(...args: (DotContent | IDotSource)[]): IDotDocument;

	span(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	strong(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	svg(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	sub(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	summary(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	sup(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	table(...args: (DotContent | IDotTable)[]): IDotDocument;
	tBody(...args: (DotContent | IDotTBody)[]): IDotDocument;
	td(...args: (DotContent | IDotTd)[]): IDotDocument;
	textArea(...args: (DotContent | IDotTextArea)[]): IDotDocument;
	tFoot(...args: (DotContent | IDotTFoot)[]): IDotDocument;
	th(...args: (DotContent | IDotTh)[]): IDotDocument;
	tHead(...args: (DotContent | IDotTHead)[]): IDotDocument;
	time(...args: (DotContent | IDotTime)[]): IDotDocument;
	tr(...args: (DotContent | IDotTr)[]): IDotDocument;
	track(...args: (DotContent | IDotTrack)[]): IDotDocument;

	u(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	ul(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	var(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;

	video(...args: (DotContent | IDotVideo)[]): IDotDocument;

	wbr(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
}

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

	version: string;
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

export interface IDotConditionalDocument extends IDotDocument {
	/**
	 * A conditional catch, analogous to else if. Can be used after a when function. Evaluates if the previous when's condition was false.
	 * Renders the specified DOT if a condition is met. Dynamic binding is possible when condition and callback are functions.
	*/
	otherwiseWhen(condition: IReactive | boolean, callback: DotContent): IDotConditionalDocument;
	/**
	 * A conditional final catch, analogous to else. Can be used after a when or otherwiseWhen function. Evaluates if the previous when/otherwiseWhen evaluated to false.
	 * Renders the specified DOT if a condition is met. Dynamic binding is possible when callback is a function.
	*/
	otherwise(callback: DotContent): IDotDocument;
}

// Attribute interface (for all elements):
export interface IDotGlobalAttrs<T extends HTMLElement = HTMLElement> {
	/**
	 * Create a custom attribute.
	*/
	// attr(name: string, value: unknown, arg3?: unknown): T;
	custom?: Record<string, AttrVal<unknown>>
	/**
	 * Adds a data-<suffix> attribute to the current element which can contain custom data.
	*/
	customData?: Record<string, AttrVal<unknown>>;
	/**
	 * Create a named reference to the current element so that it can be accessed within the current component.
	*/
	// TODO: this needs to be redone now. 
	// The better way might be using the new reactive system instead of references.
	// For now I'll leave it like this:
	ref?: IRef<T>;

	/** @deprecated Deprecated in HTML5. Use CSS. */
	bgColor?: AttrVal<unknown>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	color?: AttrVal<unknown>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	aLink?: AttrVal<unknown>;
	/** @deprecated Deprecated in HTML5. */
	archive?: AttrVal<unknown>;

	// TODO: we're still missing some additional global attributes. See https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/
	areaHidden?: AttrVal<boolean>;
	areaLabel?: AttrVal<string>;
	areaDescribedBy?: AttrVal<string>;
	areaControls?: AttrVal<string>;
	areaExpanded?: AttrVal<boolean>;
	areaChecked?: AttrVal<string>;
	areaSelected?: AttrVal<boolean>;
	accessKey?: AttrVal<string>; // This could potentially be enumerated. But care should be taken as these types are already quite complex.
	class?: AttrVal<string> | Array<AttrVal<string>> | AttrVal<Array<string>> | Record<string, AttrVal<boolean>>; // Space-separated. TODO: need tests.
	contentEditable?: AttrVal<"true"> | AttrVal<"false"> | AttrVal<"plaintext-only">;
	contextMenu?: AttrVal<string>;
	dir?: AttrVal<string>;
	draggable?: AttrVal<"true"> | AttrVal<"false">;
	dropZone?: AttrVal<"move"> | AttrVal<"copy"> | AttrVal<"link">;
	exportParts?: AttrVal<string>;
	hidden?: AttrVal<boolean>;
	id?: string;
	inert?: AttrVal<boolean>;
	inputMode?: AttrVal<string>;
	is?: AttrVal<string>;
	itemId?: AttrVal<string>;
	itemProp?: AttrVal<string>;
	itemRef?: AttrVal<string>;
	itemScope?: AttrVal<string>;
	itemType?: AttrVal<string>;
	lang?: AttrVal<string>;
	nOnce?: AttrVal<string>;
	part?: AttrVal<string>;
	role?: AttrVal<string>;
	spellCheck?: AttrVal<"true"> | AttrVal<"false">;
	style?: AttrVal<string> | IDotcssProp;
	tabIndex?: AttrVal<number>;
	title?: AttrVal<string>;
	translate?: AttrVal<string>;
	virtualKeyboardPolicy?: AttrVal<"auto"> | AttrVal<"manual">;

	// Events

	onAbort?: (e: Event) => void;
	onCanPlay?: (e: Event) => void;
	onCantPlayThrough?: (e: Event) => void;
	onContextMenu?: (e: MouseEvent) => void; // global
	onCopy?: (e: ClipboardEvent) => void; // global
	onCueChange?: (e: Event) => void;
	onCut?: (e: ClipboardEvent) => void; // global
	onPagePaste?: (e: ClipboardEvent) => void; // global

	onDrag?: (e: DragEvent) => void; // global
	onDragEnd?: (e: DragEvent) => void; // global
	onDragStart?: (e: DragEvent) => void; // global
	onDragEnter?: (e: DragEvent) => void; // global
	onDragOver?: (e: DragEvent) => void; // global
	onDragLeave?: (e: DragEvent) => void; // global
	onDrop?: (e: DragEvent) => void; // global
	onDurationChange?: (e: Event) => void;
	onEmptied?: (e: Event) => void;
	onEnded?: (e: Event) => void;
	onError?: (e: Event) => void; // loading elements.
	onHashChange?: (e: HashChangeEvent) => void;
	onInvalid?: (e: Event) => void; // global
	onLoadedData?: (e: Event) => void;
	onLoadedMetadata?: (e: Event) => void;
	onLoadStart?: (e: Event) => void;
	onMouseWheel?: (e: WheelEvent) => void; // global
	onWheel?: (e: WheelEvent) => void; // global

	// Configured.
	onBlur?: (e: FocusEvent) => void;
	onChange?: (e: Event) => void;
	onClick?: (e: MouseEvent) => void;
	onDblClick?: (e: MouseEvent) => void;
	onFocus?: (e: FocusEvent) => void;
	onInput?: (e: InputEvent) => void;
	onKeyDown?: (e: KeyboardEvent) => void;
	onKeyPress?: (e: KeyboardEvent) => void;
	onKeyUp?: (e: KeyboardEvent) => void;
	onLoad?: (e: Event) => void; // On specific resources only.
	onMouseDown?: (e: MouseEvent) => void;
	onMouseEnter?: (e: MouseEvent) => void;
	onMouseLeave?: (e: MouseEvent) => void;
	onMouseMove?: (e: MouseEvent) => void;
	onMouseOut?: (e: MouseEvent) => void;
	onMouseOver?: (e: MouseEvent) => void;
	onMouseUp?: (e: MouseEvent) => void;
	onOffline?: (e: Event) => void;
	onOnline?: (e: Event) => void;
	onPageHide?: (e: PageTransitionEvent) => void;
	onPageShow?: (e: PageTransitionEvent) => void;
	onPause?: (e: Event) => void;
	onPlay?: (e: Event) => void;
	onPlaying?: (e: Event) => void;
	onPointerCancel?: (e: PointerEvent) => void;
	onPointerDown?: (e: PointerEvent) => void;
	onPointerEnter?: (e: PointerEvent) => void;
	onPointerLeave?: (e: PointerEvent) => void;
	onPointerMove?: (e: PointerEvent) => void;
	onPointerOut?: (e: PointerEvent) => void;
	onPointerOver?: (e: PointerEvent) => void;
	onPointerUp?: (e: PointerEvent) => void;
	onPopState?: (e: PopStateEvent) => void;
	onProgress?: (e: Event) => void;
	onRateChange?: (e: Event) => void;

	onTouchMove?: (e: TouchEvent) => void;
	onTouchCancel?: (e: TouchEvent) => void;
	onTouchEnd?: (e: TouchEvent) => void;
	onTouchStart?: (e: TouchEvent) => void;

	onReset?: (e: Event) => void;
	onResize?: (e: UIEvent) => void;
	onScroll?: (e: UIEvent) => void;
	onSearch?: (e: Event) => void;
	onSeeked?: (e: Event) => void;
	onSeeking?: (e: Event) => void;
	onSelect?: (e: Event) => void;
	onStalled?: (e: Event) => void;
	onStorage?: (e: StorageEvent) => void;
	onSubmit?: (e: Event) => void;
	onSuspend?: (e: Event) => void;
	onTimeUpdate?: (e: Event) => void;
	onToggle?: (e: Event) => void;
	onUnload?: (e: Event) => void;
	onVolumeChange?: (e: Event) => void;
	onWaiting?: (e: Event) => void;
}

// Interface for specific elements:

// interface IMountedComponent<T extends IComponent> {
// 	on(event: string, callback: (...args: Array<any>) => void): IMountedComponent<T>;
// 	prop(name: string, value: any): IMountedComponent<T>;
// }

interface IDotA extends IDotGlobalAttrs<HTMLAnchorElement> {
	download?: AttrVal<boolean>;
	hRef?: AttrVal<string>;
	hRefLang?: AttrVal<string>;
	charset?: AttrVal<string>;
	coords?: AttrVal<string>;
	shape?: AttrVal<string>;
	media?: AttrVal<string>;
	ping?: AttrVal<string> | Array<AttrVal<string>> | AttrVal<Array<string>> | Record<string, AttrVal<string>>; // Space-separated. TODO: need tests.
	rel?: AttrVal<string>;
	/** @deprecated Deprecated in HTML5. */
	rev?: AttrVal<unknown>;
	name?: AttrVal<string>;
	target?: AttrVal<"_blank"> | AttrVal<"_parent"> | AttrVal<"_self"> | AttrVal<"_top">;
	type?: AttrVal<string>;
}
interface IDotArea extends IDotGlobalAttrs<HTMLAreaElement> {
	alt?: AttrVal<string>;
	coords?: AttrVal<string>;
	download?: AttrVal<string>;
	hRef?: AttrVal<string>;
	hRefLang?: AttrVal<string>;
	media?: AttrVal<string>;
	noHRef?: AttrVal<string>; // Deprecated in HTML5.
	rel?: AttrVal<string>;
	shape?: AttrVal<string>;
	target?: AttrVal<string>;
}
interface IDotAudio extends IDotGlobalAttrs<HTMLAudioElement> {
	autoPlay?: AttrVal<boolean>;
	// buffered?: unknown; // Not used?
	controls?: AttrVal<boolean>;
	loop?: AttrVal<boolean>;
	muted?: AttrVal<boolean>;
	preload?: AttrVal<"auto"> | AttrVal<"metadata"> | AttrVal<"none">;
	src?: AttrVal<string>;
	crossOrigin?: AttrVal<"anonymous"> | AttrVal<"use-credentials">;

	// Special functions:
	// TODO: these need to be removed from here.
	// pause(): IDotAudio;
	// play(): IDotAudio;
	// stop(): IDotAudio;

	// Events:
	onAbort?: (e: Event) => void;
	onCantPlayThrough?: (e: Event) => void;
	onDurationChange?: (e: Event) => void;
	onEmptied?: (e: Event) => void;
	onEnded?: (e: Event) => void;
	onLoadedData?: (e: Event) => void;
	onLoadStart?: (e: Event) => void;
	onLoadedMetadata?: (e: Event) => void;
	onPause?: (e: Event) => void;
	onPlay?: (e: Event) => void;
	onPlaying?: (e: Event) => void;
	onProgress?: (e: Event) => void;
	onRateChange?: (e: Event) => void;
	onSeeked?: (e: Event) => void;
	onSeeking?: (e: Event) => void;
	onStalled?: (e: Event) => void;
	onSuspend?: (e: Event) => void;
	onTimeUpdate?: (e: Event) => void;
	onVolumeChange?: (e: Event) => void;
	onWaiting?: (e: Event) => void;
	onCanPlay?: (e: Event) => void;
}
interface IDotBlockQuote extends IDotGlobalAttrs<HTMLQuoteElement> {
	quoteCite?: AttrVal<string>; // alias for cite
}

interface IDotBody extends IDotGlobalAttrs<HTMLBodyElement> {
	align?: unknown; // Deprecated in HTML5. Use CSS.
	background?: unknown; // Deprecated in HTML5. Use CSS.
}

interface IDotBr extends IDotGlobalAttrs<HTMLBRElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	clear?: unknown;
}
interface IDotButton extends IDotGlobalAttrs<HTMLButtonElement> {
	autoFocus?: AttrVal<boolean>;
	formAction?: AttrVal<string>;
	disabled?: AttrVal<boolean>;
	name?: AttrVal<string>;
	type?: AttrVal<"button"> | AttrVal<"submit"> | AttrVal<"reset">;
	whichForm?: AttrVal<string>; // alias for form
	value?: AttrVal<string>;
}
interface IDotCanvas extends IDotGlobalAttrs<HTMLCanvasElement> {
	height?: AttrVal<number>;
	width?: AttrVal<number>;
}

interface IDotCol extends IDotGlobalAttrs<HTMLTableColElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<unknown>;
	colSpan?: AttrVal<number>; // alias for span
	vAlign?: AttrVal<number>;
}

interface IDotColGroup extends IDotGlobalAttrs<HTMLTableColElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<unknown>;
	colSpan?: AttrVal<number>; // alias for span
	/** @deprecated Deprecated in HTML5. Use CSS. */
	vAlign?: AttrVal<unknown>;
}

interface IDotDel extends IDotGlobalAttrs {
	dateTime?: AttrVal<string>; // Would be cool if this could accept dates and just format them internally...
	quoteCite?: AttrVal<string>; // alias for cite
}

interface IDotDetails extends IDotGlobalAttrs<HTMLDetailsElement> {
	open?: AttrVal<boolean>;
	// Events:
	onToggle?: (e: Event) => void;
}
interface IDotEmbed extends IDotGlobalAttrs<HTMLEmbedElement> {
	height?: AttrVal<number>;
	src?: AttrVal<string>;
	type?: AttrVal<string>;
	width?: AttrVal<number>;
}
interface IDotFieldSet extends IDotGlobalAttrs<HTMLFieldSetElement> {
	disabled?: AttrVal<boolean>;
	name?: AttrVal<string>;
	whichForm?: AttrVal<string>; // alias for form
}
interface IDotForm extends IDotGlobalAttrs<HTMLFormElement> {
	acceptCharset?: AttrVal<string>; // accept-charset, apparently the only hyphenated attribute (aside from data-*)...
	action?: AttrVal<string>;
	autoComplete?: AttrVal<"on"> | AttrVal<"off">;
	encType?: AttrVal<"application/x-www-form-urlencoded"> | AttrVal<"multipart/form-data"> | AttrVal<"text/plain">;
	method?: AttrVal<"get"> | AttrVal<"post">;
	name?: AttrVal<string>;
	noValidate?: AttrVal<boolean>;
	target?: AttrVal<"_self"> | AttrVal<"_blank"> | AttrVal<"_parent"> | AttrVal<"_top">;
	// rel?: PrimativeOrObservable<string> IDotForm; // Not used with forms?
}
interface IDotHr extends IDotGlobalAttrs<HTMLHRElement> {
	noShade?: AttrVal<unknown>;
}
interface IDotIFrame extends IDotGlobalAttrs<HTMLIFrameElement> {
	allow?: AttrVal<string>;
	allowFullScreen?: AttrVal<boolean>;
	/** @deprecated Deprecated in HTML5. */
	frameBorder?: AttrVal<0> | AttrVal<1>;
	height?: AttrVal<number>;
	/** @deprecated Deprecated in HTML5. */
	longDesc?: AttrVal<string>;
	marginHeight?: AttrVal<number>;
	marginWidth?: AttrVal<number>;
	name?: AttrVal<string>;
	referrerPolicy?: AttrVal<string>;
	sandbox?: AttrVal<string>;
	/** @deprecated Deprecated in HTML5. */
	scrolling?: AttrVal<string>;
	seamless?: AttrVal<boolean>;
	src?: AttrVal<string>;
	srcDoc?: AttrVal<string>;
	width?: AttrVal<number>;
}
interface IDotImg extends IDotGlobalAttrs<HTMLImageElement> {
	alt?: AttrVal<string>;
	crossOrigin?: AttrVal<"anonymous"> | AttrVal<"use-credentials">;
	decoding?: AttrVal<"async"> | AttrVal<"auto"> | AttrVal<"sync">;
	height?: AttrVal<number>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	hSpace?: AttrVal<unknown>;
	isMap?: AttrVal<boolean>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	loading?: AttrVal<"eager"> | AttrVal<"lazy">;
	longDesc?: AttrVal<string>;
	referrerPolicy?: AttrVal<string>;
	sizes?: AttrVal<string>;
	src?: AttrVal<string>;
	srcSet?: AttrVal<string>; // Comma separated. Consider accepting an array.
	useMap?: AttrVal<number>;
	width?: AttrVal<number>;
}
interface IDotInput extends IDotGlobalAttrs<HTMLInputElement> {
	accept?: AttrVal<string>;
	alt?: AttrVal<string>;
	autoCapitalize?: AttrVal<"none"> | AttrVal<"sentences"> | AttrVal<"words"> | AttrVal<"characters">;
	autoComplete?: AttrVal<"on"> | AttrVal<"off">;
	autoFocus?: AttrVal<boolean>;
	checked?: AttrVal<boolean>;
	enterKeyHint?: AttrVal<"enter"> | AttrVal<"done"> | AttrVal<"go"> | AttrVal<"next"> | AttrVal<"preveous"> | AttrVal<"search"> | AttrVal<"send">;
	dirName?: AttrVal<string>;
	disabled?: AttrVal<boolean>;
	formAction?: AttrVal<string>;
	height?: AttrVal<number>;
	list?: AttrVal<string>;
	max?: AttrVal<number>;
	maxLength?: AttrVal<number>;
	min?: AttrVal<number>;
	multiple?: AttrVal<boolean>;
	name?: AttrVal<string>;
	pattern?: AttrVal<string>;
	placeholder?: AttrVal<string>;
	readOnly?: AttrVal<boolean>;
	required?: AttrVal<boolean>;
	size?: AttrVal<number>;
	src?: AttrVal<string>;
	step?: AttrVal<string> | AttrVal<number>;
	type?: "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";
	value?: AttrVal<string>;
	whichForm?: AttrVal<string>; // form
	width?: AttrVal<number>;

	// Special functions:
	// getVal(): string
	// setVal(value: unknown): IDotInput;

	// Input-specific events:
	onSearch?: (e: Event) => void;
}

interface IDotIns extends IDotGlobalAttrs {
	dateTime?: AttrVal<string>;
	quoteCite?: AttrVal<string>; // Alias for cite.
}

interface IDotKeyGen extends IDotGlobalAttrs {
	challenge?: AttrVal<string>;
	keyType?: AttrVal<string>;
}

interface IDotLabel extends IDotGlobalAttrs<HTMLLabelElement> {
	for?: AttrVal<string>;
}

interface IDotLi extends IDotGlobalAttrs<HTMLLIElement> {
	value?: AttrVal<number>;
}

interface IDotMap extends IDotGlobalAttrs<HTMLMapElement> {
	name?: AttrVal<string>;
}

interface IDotMenu extends IDotGlobalAttrs<HTMLMenuElement> {
	type?: AttrVal<string>;
}

interface IDotMeter extends IDotGlobalAttrs<HTMLMeterElement> {
	high?: AttrVal<number>;
	low?: AttrVal<number>;
	max?: AttrVal<number>;
	min?: AttrVal<number>;
	optimum?: AttrVal<number>;
	value?: AttrVal<number>;
}

interface IDotObject extends IDotGlobalAttrs<HTMLObjectElement> {
	archive?: AttrVal<string>;
	classId?: AttrVal<string>;
	codeBase?: AttrVal<string>;
	codeType?: AttrVal<string>;
	objectData?: AttrVal<string>; // Alias for data.
	declare?: AttrVal<boolean>;
	height?: AttrVal<number>;
	name?: AttrVal<string>;
	standby?: AttrVal<string>;
	type?: AttrVal<string>;
	useMap?: AttrVal<string>;
	width?: AttrVal<number>;
}

interface IDotOl extends IDotGlobalAttrs<HTMLUListElement> {
	/** @deprecated Deprecated in HTML5. */
	reversed?: AttrVal<boolean>;
	start?: AttrVal<number>;
}

interface IDotOptGroup extends IDotGlobalAttrs<HTMLUListElement> {
	disabled?: AttrVal<boolean>;
}

interface IDotOption extends IDotGlobalAttrs<HTMLUListElement> {
	disabled?: AttrVal<boolean>;
	optionLabel?: AttrVal<string>; // Alias for label
	selected?: AttrVal<boolean>;
	value?: AttrVal<string>;
}

interface IDotOutput extends IDotGlobalAttrs<HTMLOutputElement> {
	for?: AttrVal<string>;
	name?: AttrVal<string>;
	whichForm?: AttrVal<string>; // Alias for form
}

interface IDotParam extends IDotGlobalAttrs<HTMLParamElement> {
	name?: AttrVal<string>;
	value?: AttrVal<string>;
	/** @deprecated Deprecated in HTML5. */
	valueType?: AttrVal<unknown>;
}

interface IDotProgress extends IDotGlobalAttrs<HTMLProgressElement> {
	max?: AttrVal<number>;
	value?: AttrVal<number>;
}

interface IDotQ extends IDotGlobalAttrs<HTMLQuoteElement> {
	quoteCite?: AttrVal<string>; // alias for cite
}

interface IDotSelect extends IDotGlobalAttrs<HTMLSelectElement> {
	autoFocus?: AttrVal<boolean>;
	disabled?: AttrVal<boolean>;
	multiple?: AttrVal<boolean>;
	name?: AttrVal<string>;
	required?: AttrVal<boolean>;
	size?: AttrVal<number>;
	whichForm?: AttrVal<string>; // alias for form
	value?: AttrVal<string>; // Pseudo attribute for convenience. 
}

interface IDotSource extends IDotGlobalAttrs<HTMLSourceElement> {
	media?: AttrVal<string>;
	src?: AttrVal<string>;
	type?: AttrVal<string>;
	sizes?: AttrVal<string>;
	srcSet?: AttrVal<string>;
}
interface IDotTable extends IDotGlobalAttrs<HTMLTableElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	border?: AttrVal<string> | AttrVal<number>; 
	/** @deprecated Deprecated in HTML5. Use CSS. */
	cellPadding?: AttrVal<string> | AttrVal<number>; 
	/** @deprecated Deprecated in HTML5. Use CSS. */
	cellSpacing?: AttrVal<string> | AttrVal<number>; 
	/** @deprecated Deprecated in HTML5. Use CSS. */
	frame?: AttrVal<string> | AttrVal<number>; 
	/** @deprecated Deprecated in HTML5. */
	height?: AttrVal<number>; 
	/** @deprecated Deprecated in HTML5. Use CSS. */
	rules?: AttrVal<string>; 
	/** @deprecated Deprecated in HTML5. */
	tableSummary?: AttrVal<string>; 
	/** @deprecated Deprecated in HTML5. */
	width?: AttrVal<number>; 
}

interface IDotTextArea extends IDotGlobalAttrs<HTMLTextAreaElement> {
	autoCapitalize?: AttrVal<"none"> | AttrVal<"sentences"> | AttrVal<"words"> | AttrVal<"characters">;
	autoFocus?: AttrVal<boolean>;
	cols?: AttrVal<number>;
	dirName?: AttrVal<string>;
	disabled?: AttrVal<boolean>;
	enterKeyHint?: AttrVal<"enter"> | AttrVal<"done"> | AttrVal<"go"> | AttrVal<"next"> | AttrVal<"preveous"> | AttrVal<"search"> | AttrVal<"send">;
	maxLength?: AttrVal<number>;
	name?: AttrVal<string>;
	placeholder?: AttrVal<string>;
	readOnly?: AttrVal<boolean>;
	required?: AttrVal<boolean>;
	rows?: AttrVal<number>;
	whichForm?: AttrVal<string>; // alias for form
	wrap?: AttrVal<string>;
	value?: AttrVal<string>; // Pseudo attribute for convenience. 
}

interface IDotTBody extends IDotGlobalAttrs<HTMLTableSectionElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<unknown>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	vAlign?: AttrVal<unknown>;
}

interface IDotTd extends IDotGlobalAttrs<HTMLTableCellElement> {

	/** @deprecated Deprecated in HTML5. Use CSS. */
	axis?: AttrVal<string>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	char?: AttrVal<string>;
	colSpan?: AttrVal<number>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<string>;
	headers?: AttrVal<string>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	noWrap?: AttrVal<boolean>;
	rowSpan?: AttrVal<number>;
	scope?: AttrVal<string>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	vAlign?: AttrVal<string>;
}

interface IDotTFoot extends IDotGlobalAttrs<HTMLTableSectionElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<number>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	vAlign?: AttrVal<string>;
}

interface IDotTime extends IDotGlobalAttrs<HTMLTimeElement> {
	dateTime?: AttrVal<string>;
}

interface IDotTh extends IDotGlobalAttrs<HTMLTableCellElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	axis?: AttrVal<string>;
	colSpan?: AttrVal<number>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<string>;
	headers?: AttrVal<string>;
	rowSpan?: AttrVal<number>;
	scope?: AttrVal<string>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	vAlign?: AttrVal<string>;
}

interface IDotTHead extends IDotGlobalAttrs<HTMLTableSectionElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<string> | AttrVal<number>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	vAlign?: AttrVal<string>;
}

interface IDotTr extends IDotGlobalAttrs<HTMLTableRowElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<string> | AttrVal<number>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	vAlign?: AttrVal<string>;
}

interface IDotTrack extends IDotGlobalAttrs<HTMLTrackElement> {
	default?: AttrVal<boolean>;
	kind?: AttrVal<string>;
	src?: AttrVal<string>;
	srcLang?: AttrVal<string>;
	trackLabel?: AttrVal<string>; // alias for label

	// Events:
	onCueChange?: (e: Event) => void;
}

interface IDotVideo extends IDotGlobalAttrs<HTMLVideoElement> {
	autoPlay?: AttrVal<boolean>;
	buffered?: IReactive; // Managed by browser not user. TODO: we can possibly use events to update observable objects.
	controls?: AttrVal<boolean>;
	crossOrigin?: AttrVal<"anonymous"> | AttrVal<"use-credentials">;
	height?: AttrVal<number>;
	loop?: AttrVal<boolean>;
	muted?: AttrVal<boolean>;
	playsInline?: AttrVal<boolean>;
	poster?: AttrVal<string>;
	preload?: AttrVal<"none"> | AttrVal<"metadata"> | AttrVal<"auto">;
	src?: AttrVal<string>;
	width?: AttrVal<number>;

	// Special functions:
	// TODO:
	// pause(): IDotVideo;
	// play(): IDotVideo;
	// stop(): IDotVideo;

	// Events:
	onAbort?: (e: Event) => void;
	onCantPlayThrough?: (e: Event) => void;
	onDurationChange?: (e: Event) => void;
	onEmptied?: (e: Event) => void;
	onEnded?: (e: Event) => void;
	onLoadedData?: (e: Event) => void;
	onLoadStart?: (e: Event) => void;
	onLoadedMetadata?: (e: Event) => void;
	onPause?: (e: Event) => void;
	onPlay?: (e: Event) => void;
	onPlaying?: (e: Event) => void;
	onProgress?: (e: Event) => void;
	onRateChange?: (e: Event) => void;
	onSeeked?: (e: Event) => void;
	onSeeking?: (e: Event) => void;
	onStalled?: (e: Event) => void;
	onSuspend?: (e: Event) => void;
	onTimeUpdate?: (e: Event) => void;
	onVolumeChange?: (e: Event) => void;
	onWaiting?: (e: Event) => void;
	onCanPlay?: (e: Event) => void;
}
