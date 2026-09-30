import { IBinding } from "../bindings/i-binding";
import IDotcssProp from "../styles/i-css-prop";
import { IDotStyleBuilder } from "../styles/i-dot-style-builder";
import { IReactive } from "../bindings/i-reactive";
import { DotContent, DotDictionary, ISignal } from "./content";
import type {
	IDotA,
	IDotArea,
	IDotAudio,
	IDotBlockQuote,
	IDotBody,
	IDotBr,
	IDotButton,
	IDotCanvas,
	IDotCol,
	IDotColGroup,
	IDotDel,
	IDotDetails,
	IDotEmbed,
	IDotFieldSet,
	IDotForm,
	IDotGlobalAttrs,
	IDotHr,
	IDotIFrame,
	IDotImg,
	IDotInput,
	IDotIns,
	IDotKeyGen,
	IDotLabel,
	IDotLi,
	IDotMap,
	IDotMenu,
	IDotMeter,
	IDotObject,
	IDotOl,
	IDotOptGroup,
	IDotOption,
	IDotOutput,
	IDotParam,
	IDotProgress,
	IDotQ,
	IDotSelect,
	IDotSource,
	IDotTable,
	IDotTextArea,
	IDotTBody,
	IDotTd,
	IDotTFoot,
	IDotTime,
	IDotTh,
	IDotTHead,
	IDotTr,
	IDotTrack,
	IDotVideo,
} from "./i-dot-attrs";

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
	 * Conditional, analogous to `if`. `condition` is a boolean, a signal/binding of a boolean, or a zero-arg getter (wrapped in `dot.computed`). `callback` is eager `DotContent` — not a factory function.
	*/
	when(condition: IReactive<boolean> | boolean | (() => boolean), callback: DotContent): IDotConditionalDocument;

	// Main functions.
	// TODO: please make this into a test case.
	/**
	 * Cast any document to any other element type. This can be used to access attributes when dotHTML doesn't know the type.
	 * @example
	 * dot("#my-input").as(dot.input).attr("value", "Hello, world!")
	 * @example
	 * dot.h("<a>Click me!</a>").as(dot.a).attr("href", "https://dothtml.com/")
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
	html(content: DotContent): IDotDocument;
	/**
	 * Creates a generic HTML node that can render a string, HTML nodes, or dotHTML content.
	*/
	h(content: DotContent): IDotDocument;
	/**
	 * Creates a text node that will render as a string, rather than being parsed as markup.
	*/
	text(content: DotContent): IDotDocument;
	/**
	 * Creates a text node that will render as a string, rather than being parsed as markup.
	*/
	md(content: DotContent): IDotDocument;
	/**
	 * Mounts a component or appends content.
	 */
	mount(content: DotContent, ...args: any[]): IDotDocument;
	/**
	 * Appends content to the current document.
	 */
	append(content: DotContent): this;
	/**
	 * Prepends content to the current document.
	 */
	prepend(content: DotContent): this;
	slot(name?: string | any, fallback?: any): IDotDocument;
	// mount<T extends IComponent>(init: (c: IMountedComponent<T>) => IMountedComponent<T> | void, component: T): IDotDocument;
	// mount(component: IComponent, init: (init=>IMountedComponent): IMountedComponent|void): IDotDocument;
	/**
	 * Renders a list. `a` is a static array or dictionary, a signal/binding of either, or a zero-arg getter that returns either. The getter is wrapped in `dot.computed`. For keyed reuse, create the list with `dot.state(items, "id")` where `"id"` is the item property name. The callback builds each row `(item, index, key)`.
	 */
	each<T>(
		a: readonly T[] | DotDictionary<T>,
		callback: (x: T, i: number, k: string | number) => DotContent
	): IDotDocument;
	each<T>(
		a:
			| IReactive<T[]>
			| IReactive<readonly T[]>
			| (() => T[] | readonly T[]),
		callback: (x: T, i: IBinding<number>, k: string | number) => DotContent
	): IDotDocument;
	each<T>(
		a:
			| IReactive<DotDictionary<T>>
			| (() => DotDictionary<T>),
		callback: (x: T, i: IBinding<number>, k: string | number) => DotContent
	): IDotDocument;

	/**
	 * Removes the targeted document and everything in it.
	*/
	remove(): void;

	style(c: string | ISignal<any> | IBinding<any, any> | IDotcssProp | IDotStyleBuilder | ((s: IDotStyleBuilder) => void)): this;
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
	svg(...args: (DotContent | IDotGlobalAttrs | ((s: IDotDocument) => void))[]): IDotDocument;
	path(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	circle(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	rect(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	line(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	polyline(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	polygon(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	ellipse(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	g(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	defs(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	symbol(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	use(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	linearGradient(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	radialGradient(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	stop(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	clipPath(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mask(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	pattern(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	filter(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	feGaussianBlur(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	feOffset(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	feMerge(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	feMergeNode(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	math(...args: (DotContent | IDotGlobalAttrs | ((m: IDotDocument) => void))[]): IDotDocument;
	mi(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mo(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mn(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	ms(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mtext(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mspace(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mglyph(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mrow(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mfrac(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	msqrt(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mroot(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mstyle(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	merror(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mpadded(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mphantom(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	menclose(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	msub(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	msup(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	msubsup(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	munder(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mover(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	munderover(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mmultiscripts(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mtable(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mtr(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	mtd(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	maction(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	semantics(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	annotation(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
	"annotation-xml"(...args: (DotContent | IDotGlobalAttrs)[]): IDotDocument;
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

export interface IDotConditionalDocument extends IDotDocument {
	/**
	 * A conditional catch, analogous to else if. Can be used after a when function. Evaluates if the previous when's condition was false.
	 * `condition` is a boolean, a signal/binding of a boolean, or a zero-arg getter (wrapped in `dot.computed`). `callback` is eager `DotContent` — not a factory function.
	*/
	otherwiseWhen(condition: IReactive<boolean> | boolean | (() => boolean), callback: DotContent): IDotConditionalDocument;
	/**
	 * A conditional final catch, analogous to else. Can be used after a when or otherwiseWhen function. Evaluates if the previous when/otherwiseWhen evaluated to false.
	 * Renders the specified DOT if a condition is met.
	*/
	otherwise(callback: DotContent): IDotDocument;
}
