import { IRef } from "../bindings/i-ref";
import IDotcssProp from "../styles/i-css-prop";
import { IDotStyleBuilder } from "../styles/i-dot-style-builder";
import { IReactive } from "../bindings/i-reactive";
import { AttrVal, DotContent } from "./content";

// Attribute interface (for all elements):
export interface IDotGlobalAttrs<T extends HTMLElement = HTMLElement> {
	[key: string]: any;
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
	class?: AttrVal<string> | Array<AttrVal<string>> | AttrVal<Array<string>> | Record<string, AttrVal<boolean>> | (string | Record<string, any>)[]; // Space-separated. TODO: need tests.
	contentEditable?: AttrVal<"true"> | AttrVal<"false"> | AttrVal<"plaintext-only">;
	contextMenu?: AttrVal<string>;
	dir?: AttrVal<string>;
	draggable?: AttrVal<"true"> | AttrVal<"false">;
	dropZone?: AttrVal<"move"> | AttrVal<"copy"> | AttrVal<"link">;
	exportParts?: AttrVal<string>;
	hidden?: AttrVal<boolean>;
	id?: string;
	html?: AttrVal<DotContent>;
	innerHtml?: AttrVal<DotContent>;
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
	style?: AttrVal<string> | IDotcssProp | IDotStyleBuilder | ((s: IDotStyleBuilder) => void);
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

export interface IDotA extends IDotGlobalAttrs<HTMLAnchorElement> {
	download?: AttrVal<boolean>;
	hRef?: AttrVal<string>;
	href?: AttrVal<string>;
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
export interface IDotArea extends IDotGlobalAttrs<HTMLAreaElement> {
	alt?: AttrVal<string>;
	coords?: AttrVal<string>;
	download?: AttrVal<string>;
	hRef?: AttrVal<string>;
	href?: AttrVal<string>;
	hRefLang?: AttrVal<string>;
	media?: AttrVal<string>;
	noHRef?: AttrVal<string>; // Deprecated in HTML5.
	rel?: AttrVal<string>;
	shape?: AttrVal<string>;
	target?: AttrVal<string>;
}
export interface IDotAudio extends IDotGlobalAttrs<HTMLAudioElement> {
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
export interface IDotBlockQuote extends IDotGlobalAttrs<HTMLQuoteElement> {
	quoteCite?: AttrVal<string>; // alias for cite
}

export interface IDotBody extends IDotGlobalAttrs<HTMLBodyElement> {
	align?: unknown; // Deprecated in HTML5. Use CSS.
	background?: unknown; // Deprecated in HTML5. Use CSS.
}

export interface IDotBr extends IDotGlobalAttrs<HTMLBRElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	clear?: unknown;
}
export interface IDotButton extends IDotGlobalAttrs<HTMLButtonElement> {
	autoFocus?: AttrVal<boolean>;
	formAction?: AttrVal<string>;
	disabled?: AttrVal<boolean>;
	name?: AttrVal<string>;
	type?: AttrVal<"button"> | AttrVal<"submit"> | AttrVal<"reset">;
	whichForm?: AttrVal<string>; // alias for form
	value?: AttrVal<string>;
}
export interface IDotCanvas extends IDotGlobalAttrs<HTMLCanvasElement> {
	height?: AttrVal<number>;
	width?: AttrVal<number>;
}

export interface IDotCol extends IDotGlobalAttrs<HTMLTableColElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<unknown>;
	colSpan?: AttrVal<number>; // alias for span
	vAlign?: AttrVal<number>;
}

export interface IDotColGroup extends IDotGlobalAttrs<HTMLTableColElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<unknown>;
	colSpan?: AttrVal<number>; // alias for span
	/** @deprecated Deprecated in HTML5. Use CSS. */
	vAlign?: AttrVal<unknown>;
}

export interface IDotDel extends IDotGlobalAttrs {
	dateTime?: AttrVal<string>; // Would be cool if this could accept dates and just format them internally...
	quoteCite?: AttrVal<string>; // alias for cite
}

export interface IDotDetails extends IDotGlobalAttrs<HTMLDetailsElement> {
	open?: AttrVal<boolean>;
	// Events:
	onToggle?: (e: Event) => void;
}
export interface IDotEmbed extends IDotGlobalAttrs<HTMLEmbedElement> {
	height?: AttrVal<number>;
	src?: AttrVal<string>;
	type?: AttrVal<string>;
	width?: AttrVal<number>;
}
export interface IDotFieldSet extends IDotGlobalAttrs<HTMLFieldSetElement> {
	disabled?: AttrVal<boolean>;
	name?: AttrVal<string>;
	whichForm?: AttrVal<string>; // alias for form
}
export interface IDotForm extends IDotGlobalAttrs<HTMLFormElement> {
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
export interface IDotHr extends IDotGlobalAttrs<HTMLHRElement> {
	noShade?: AttrVal<unknown>;
}
export interface IDotIFrame extends IDotGlobalAttrs<HTMLIFrameElement> {
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
export interface IDotImg extends IDotGlobalAttrs<HTMLImageElement> {
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
export interface IDotInput extends IDotGlobalAttrs<HTMLInputElement> {
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

export interface IDotIns extends IDotGlobalAttrs {
	dateTime?: AttrVal<string>;
	quoteCite?: AttrVal<string>; // Alias for cite.
}

export interface IDotKeyGen extends IDotGlobalAttrs {
	challenge?: AttrVal<string>;
	keyType?: AttrVal<string>;
}

export interface IDotLabel extends IDotGlobalAttrs<HTMLLabelElement> {
	for?: AttrVal<string>;
}

export interface IDotLi extends IDotGlobalAttrs<HTMLLIElement> {
	value?: AttrVal<number>;
}

export interface IDotMap extends IDotGlobalAttrs<HTMLMapElement> {
	name?: AttrVal<string>;
}

export interface IDotMenu extends IDotGlobalAttrs<HTMLMenuElement> {
	type?: AttrVal<string>;
}

export interface IDotMeter extends IDotGlobalAttrs<HTMLMeterElement> {
	high?: AttrVal<number>;
	low?: AttrVal<number>;
	max?: AttrVal<number>;
	min?: AttrVal<number>;
	optimum?: AttrVal<number>;
	value?: AttrVal<number>;
}

export interface IDotObject extends IDotGlobalAttrs<HTMLObjectElement> {
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

export interface IDotOl extends IDotGlobalAttrs<HTMLUListElement> {
	/** @deprecated Deprecated in HTML5. */
	reversed?: AttrVal<boolean>;
	start?: AttrVal<number>;
}

export interface IDotOptGroup extends IDotGlobalAttrs<HTMLUListElement> {
	disabled?: AttrVal<boolean>;
}

export interface IDotOption extends IDotGlobalAttrs<HTMLUListElement> {
	disabled?: AttrVal<boolean>;
	optionLabel?: AttrVal<string>; // Alias for label
	selected?: AttrVal<boolean>;
	value?: AttrVal<string>;
}

export interface IDotOutput extends IDotGlobalAttrs<HTMLOutputElement> {
	for?: AttrVal<string>;
	name?: AttrVal<string>;
	whichForm?: AttrVal<string>; // Alias for form
}

export interface IDotParam extends IDotGlobalAttrs<HTMLParamElement> {
	name?: AttrVal<string>;
	value?: AttrVal<string>;
	/** @deprecated Deprecated in HTML5. */
	valueType?: AttrVal<unknown>;
}

export interface IDotProgress extends IDotGlobalAttrs<HTMLProgressElement> {
	max?: AttrVal<number>;
	value?: AttrVal<number>;
}

export interface IDotQ extends IDotGlobalAttrs<HTMLQuoteElement> {
	quoteCite?: AttrVal<string>; // alias for cite
}

export interface IDotSelect extends IDotGlobalAttrs<HTMLSelectElement> {
	autoFocus?: AttrVal<boolean>;
	disabled?: AttrVal<boolean>;
	multiple?: AttrVal<boolean>;
	name?: AttrVal<string>;
	required?: AttrVal<boolean>;
	size?: AttrVal<number>;
	whichForm?: AttrVal<string>; // alias for form
	value?: AttrVal<string>; // Pseudo attribute for convenience. 
}

export interface IDotSource extends IDotGlobalAttrs<HTMLSourceElement> {
	media?: AttrVal<string>;
	src?: AttrVal<string>;
	type?: AttrVal<string>;
	sizes?: AttrVal<string>;
	srcSet?: AttrVal<string>;
}
export interface IDotTable extends IDotGlobalAttrs<HTMLTableElement> {
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

export interface IDotTextArea extends IDotGlobalAttrs<HTMLTextAreaElement> {
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

export interface IDotTBody extends IDotGlobalAttrs<HTMLTableSectionElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<unknown>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	vAlign?: AttrVal<unknown>;
}

export interface IDotTd extends IDotGlobalAttrs<HTMLTableCellElement> {

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

export interface IDotTFoot extends IDotGlobalAttrs<HTMLTableSectionElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<number>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	vAlign?: AttrVal<string>;
}

export interface IDotTime extends IDotGlobalAttrs<HTMLTimeElement> {
	dateTime?: AttrVal<string>;
}

export interface IDotTh extends IDotGlobalAttrs<HTMLTableCellElement> {
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

export interface IDotTHead extends IDotGlobalAttrs<HTMLTableSectionElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<string> | AttrVal<number>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	vAlign?: AttrVal<string>;
}

export interface IDotTr extends IDotGlobalAttrs<HTMLTableRowElement> {
	/** @deprecated Deprecated in HTML5. Use CSS. */
	charOff?: AttrVal<string> | AttrVal<number>;
	/** @deprecated Deprecated in HTML5. Use CSS. */
	vAlign?: AttrVal<string>;
}

export interface IDotTrack extends IDotGlobalAttrs<HTMLTrackElement> {
	default?: AttrVal<boolean>;
	kind?: AttrVal<string>;
	src?: AttrVal<string>;
	srcLang?: AttrVal<string>;
	trackLabel?: AttrVal<string>; // alias for label

	// Events:
	onCueChange?: (e: Event) => void;
}

export interface IDotVideo extends IDotGlobalAttrs<HTMLVideoElement> {
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
