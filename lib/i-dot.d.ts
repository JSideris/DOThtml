import EventBus from "./event-bus";
import type Component from "./component";
import IDotCss from "i-dotcss";
export declare type DotContentPrimitive = string | number | boolean;
export declare type DotContentBasic = DotContentPrimitive | Node | Element | NodeList | Component | IDotDocument;
export declare type DotContent = DotContentBasic | Array<DotContent> | (() => DotContent);
export interface IDotDocument {
    (document?: Element, classPrefix?: number): void;
    _appendOrCreateDocument(content: DotContent, parentEl?: Element, beforeNode?: Node | number): any;
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
    el(tag: string, content?: DotContent): IDotElementDocument<IDotGenericElement>;
    /**
     * Creates a generic HTML node that can render a string, HTML nodes, or dotHTML content.
    */
    h(content?: DotContent): IDotDocument;
    /**
     * Creates a text node that will render as a string, rather than being parsed as markup.
    */
    t(content?: any): IDotA;
    /**
     * Iterates n times, appending the result of each iteration to the VDBO.
     * @param n The number of iterations.
     * @param callback The markup-generating callback.
    */
    iterate(n: number, callback: (i: number) => DotContent): IDotDocument;
    each<T>(a: Array<T> | (() => Array<T>) | {
        [key: string]: T;
    }, callback: (x: T, i: number | string) => DotContent): IDotDocument;
    /**
     * Removes the targeted document and everything in it.
    */
    remove(): void;
    /**
     * Get the last HTML element added to the targeted document.
    */
    getLast(): HTMLElement;
    /**
     * Deletes each element within the targeted document.
    */
    empty(): IDotDocument;
    /**
     * Executes a function immediately.
    */
    script(callback: Function): IDotDocument;
    /**
     * A conditional function, analogous to if. Renders the specified DOT if a condition is met. Dynamic binding is possible when condition and callback are functions.
    */
    when(condition: (() => boolean) | boolean, callback: (() => void) | DotContent): IDotDocument;
    /**
     * A conditional catch, analogous to else if. Can be used after a when function. Evaluates if the previous when's condition was false.
     * Renders the specified DOT if a condition is met. Dynamic binding is possible when condition and callback are functions.
    */
    otherwiseWhen(condition: (() => boolean) | boolean, callback: (() => void) | DotContent): IDotDocument;
    /**
     * A conditional final catch, analogous to else. Can be used after a when or otherwiseWhen function. Evaluates if the previous when/otherwiseWhen evaluated to false.
     * Renders the specified DOT if a condition is met. Dynamic binding is possible when callback is a function.
    */
    otherwise(callback: (() => void) | DotContent): IDotDocument;
    scopeClass(prefix: number | string | null, content: DotContent): IDotDocument;
    wait(timeout: any, callback: any): any;
    defer(callback: any): any;
    a(content?: DotContent): IDotA;
    aside(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    abbr(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    address(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    area(content?: DotContent): IDotArea;
    article(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    audio(content?: DotContent): IDotAudio;
    b(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    bdi(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    bdo(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    blockQuote(content?: DotContent): IDotBlockQuote;
    body(content?: DotContent): IDotBody;
    br(content?: DotContent): IDotBr;
    button(content?: DotContent): IDotButton;
    canvas(content?: DotContent): IDotCanvas;
    caption(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    cite(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    code(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    col(content?: DotContent): IDotCol;
    colGroup(content?: DotContent): IDotColGroup;
    content(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    data(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    dataList(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    dd(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    del(content?: DotContent): IDotDel;
    details(content?: DotContent): IDotDetails;
    dfn(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    dialog(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    div(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    dl(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    dt(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    em(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    embed(content?: DotContent): IDotEmbed;
    fieldSet(content?: DotContent): IDotFieldSet;
    figCaption(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    figure(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    footer(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    form(content?: DotContent): IDotForm;
    h1(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    h2(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    h3(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    h4(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    h5(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    h6(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    header(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    hr(content?: DotContent): IDotHr;
    i(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    iFrame(content?: DotContent): IDotIFrame;
    img(content?: DotContent): IDotImg;
    input(content?: DotContent): IDotInput;
    ins(content?: DotContent): IDotIns;
    kbd(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    keyGen(content?: DotContent): IDotKeyGen;
    label(content?: DotContent): IDotLabel;
    legend(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    li(content?: DotContent): IDotLi;
    main(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    map(content?: DotContent): IDotMap;
    mark(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    menu(content?: DotContent): IDotMenu;
    meter(content?: DotContent): IDotMeter;
    nav(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    object(content?: DotContent): IDotObject;
    ol(content?: DotContent): IDotOl;
    optGroup(content?: DotContent): IDotOptGroup;
    option(content?: DotContent): IDotOption;
    output(content?: DotContent): IDotOutput;
    p(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    param(content?: DotContent): IDotParam;
    pre(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    progress(content?: DotContent): IDotProgress;
    q(content?: DotContent): IDotQ;
    rp(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    rt(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    ruby(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    s(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    samp(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    section(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    select(content?: DotContent): IDotSelect;
    small(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    source(content?: DotContent): IDotSource;
    span(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    strong(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    svg(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    sub(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    summary(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    sup(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    table(content?: DotContent): IDotTable;
    tBody(content?: DotContent): IDotTBody;
    td(content?: DotContent): IDotTd;
    textArea(content?: DotContent): IDotTextArea;
    tFoot(content?: DotContent): IDotTFoot;
    th(content?: DotContent): IDotTh;
    tHead(content?: DotContent): IDotTHead;
    time(content?: DotContent): IDotTime;
    tr(content?: DotContent): IDotTr;
    track(content?: DotContent): IDotTrack;
    u(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    ul(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    var(content?: DotContent): IDotElementDocument<IDotGenericElement>;
    video(content?: DotContent): IDotVideo;
    wbr(content?: DotContent): IDotElementDocument<IDotGenericElement>;
}
export interface IDotCore extends IDotDocument {
    (targetSelector: string | Element | Node | NodeList | Array<Node | Element>): IDotElementDocument<IDotGenericElement>;
    version: string;
    navigate(path: string, noHistory?: boolean, force?: boolean): void;
    css: IDotCss;
    bus: typeof EventBus;
    resetScopeClass(): void;
    Component: typeof Component;
}
/**
 * Public interface indicating the return type of the Component builder method. Represents any VDBO containing an element.
 * The VDBO returned by Component builder method must contain exactly one element.
*/
export interface IDotElement extends IDotElementDocument<IDotGenericElement> {
}
export interface IDotElementDocument<T extends IDotDocument> extends IDotDocument {
    /**
     * Create a custom attribute.
    */
    attr(name: string, value: unknown, arg3?: unknown): T;
    /**
     * Adds a data-<suffix> attribute to the current element which can contain custom data.
    */
    customData(suffix: string, value: DotContentPrimitive): T;
    /**
     * Create a named reference to the current element so that it can be accessed within the current component.
    */
    ref(name: string, index?: number): T;
    /** @deprecated Deprecated in HTML5. Use CSS. */
    bgColor(value: unknown): T;
    /** @deprecated Deprecated in HTML5. Use CSS. */
    color(value: unknown): T;
    /** @deprecated Deprecated in HTML5. Use CSS. */
    aLink(value: unknown): T;
    /** @deprecated Deprecated in HTML5. Use CSS. */
    archive(value: unknown): T;
    accessKey(value: unknown): T;
    class(value: unknown): T;
    contentEditable(value: unknown): T;
    dir(value: unknown): T;
    draggable(value: unknown): T;
    dropZone(value: "move" | "copy" | "link"): T;
    hidden(value: unknown): T;
    id(value: unknown): T;
    itemProp(value: unknown): T;
    lang(value: unknown): T;
    spellCheck(value: unknown): T;
    style(value: unknown): T;
    tabIndex(value: unknown): T;
    title(value: unknown): T;
    onContextMenu(callback: (e: Event) => void): T;
    onCopy(callback: (e: Event) => void): T;
    onCut(callback: (e: Event) => void): T;
    onPagePaste(callback: (e: Event) => void): T;
    onDrag(callback: (e: DragEvent) => void): T;
    onDragEnd(callback: (e: DragEvent) => void): T;
    onDragStart(callback: (e: DragEvent) => void): T;
    onDragEnter(callback: (e: DragEvent) => void): T;
    onDragOver(callback: (e: DragEvent) => void): T;
    onDragLeave(callback: (e: DragEvent) => void): T;
    onDrop(callback: (e: DragEvent) => void): T;
    onError(callback: (e: Event) => void): T;
    onInvalid(callback: (e: DragEvent) => void): T;
    onMouseWheel(callback: (e: WheelEvent) => void): T;
    onWheel(callback: (e: WheelEvent) => void): T;
    onBlur(callback: (e: FocusEvent) => void): T;
    onChange(callback: (e: Event) => void): T;
    onClick(callback: (e: MouseEvent) => void): T;
    onDblClick(callback: (e: MouseEvent) => void): T;
    onFocus(callback: (e: FocusEvent) => void): T;
    onInput(callback: (e: InputEvent) => void): T;
    onKeyDown(callback: (e: KeyboardEvent) => void): T;
    onKeyPress(callback: (e: KeyboardEvent) => void): T;
    onKeyUp(callback: (e: KeyboardEvent) => void): T;
    onLoad(callback: (e: Event) => void): T;
    onMouseDown(callback: (e: MouseEvent) => void): T;
    onMouseEnter(callback: (e: MouseEvent) => void): T;
    onMouseMove(callback: (e: MouseEvent) => void): T;
    onMouseOut(callback: (e: MouseEvent) => void): T;
    onMouseOver(callback: (e: MouseEvent) => void): T;
    onMouseUp(callback: (e: MouseEvent) => void): T;
    onReset(callback: (e: Event) => void): T;
    onScroll(callback: (e: MouseEvent) => void): T;
    onSelect(callback: (e: Event) => void): T;
    onSubmit(callback: (e: SubmitEvent) => void): T;
    onUnload(callback: (e: Event) => void): T;
}
export interface IDotGenericElement extends IDotElementDocument<IDotGenericElement> {
}
export interface IDotA extends IDotElementDocument<IDotA> {
    download(value: unknown): IDotA;
    hRef(value: unknown): IDotA;
    hRefLang(value: unknown): IDotA;
    media(value: unknown): IDotA;
    ping(value: unknown): IDotA;
    rel(value: unknown): IDotA;
    rev(value: unknown): IDotA;
    target(value: unknown): IDotA;
    type(value: unknown): IDotA;
}
export interface IDotArea extends IDotElementDocument<IDotArea> {
    alt(value: unknown): IDotArea;
    coords(value: unknown): IDotArea;
    download(value: unknown): IDotArea;
    hRef(value: unknown): IDotArea;
    hRefLang(value: unknown): IDotArea;
    media(value: unknown): IDotArea;
    noHRef(value: unknown): IDotArea;
    rel(value: unknown): IDotArea;
    shape(value: unknown): IDotArea;
    target(value: unknown): IDotArea;
}
export interface IDotAudio extends IDotElementDocument<IDotAudio> {
    autoPlay(value: unknown): IDotAudio;
    buffered(value: unknown): IDotAudio;
    controls(value: unknown): IDotAudio;
    loop(value: unknown): IDotAudio;
    muted(value: unknown): IDotAudio;
    preload(value: unknown): IDotAudio;
    src(value: unknown): IDotAudio;
    pause(): IDotAudio;
    play(): IDotAudio;
    stop(): IDotAudio;
    onAbort(callback: (e: Event) => void): IDotAudio;
    onCantPlayThrough(callback: (e: Event) => void): IDotAudio;
    onDurationChange(callback: (e: Event) => void): IDotAudio;
    onEmptied(callback: (e: Event) => void): IDotAudio;
    onEnded(callback: (e: Event) => void): IDotAudio;
    onLoadedData(callback: (e: Event) => void): IDotAudio;
    onLoadStart(callback: (e: Event) => void): IDotAudio;
    onLoadedMetadata(callback: (e: Event) => void): IDotAudio;
    onPause(callback: (e: Event) => void): IDotAudio;
    onPlay(callback: (e: Event) => void): IDotAudio;
    onPlaying(callback: (e: Event) => void): IDotAudio;
    onProgress(callback: (e: Event) => void): IDotAudio;
    onRateChange(callback: (e: Event) => void): IDotAudio;
    onSeeked(callback: (e: Event) => void): IDotAudio;
    onSeeking(callback: (e: Event) => void): IDotAudio;
    onStalled(callback: (e: Event) => void): IDotAudio;
    onSuspend(callback: (e: Event) => void): IDotAudio;
    onTimeUpdate(callback: (e: Event) => void): IDotAudio;
    onVolumeChange(callback: (e: Event) => void): IDotAudio;
    onWaiting(callback: (e: Event) => void): IDotAudio;
    onCanPlay(callback: (e: Event) => void): IDotAudio;
}
export interface IDotBlockQuote extends IDotElementDocument<IDotBlockQuote> {
    quoteCite(value: unknown): IDotBlockQuote;
}
export interface IDotBody extends IDotElementDocument<IDotBody> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    align(value: unknown): IDotBody;
    /** @deprecated Deprecated in HTML5. Use CSS. */
    background(value: unknown): IDotBody;
    onHashChange(callback: (e: Event) => void): IDotBody;
    onOffline(callback: (e: Event) => void): IDotBody;
    onOnline(callback: (e: Event) => void): IDotBody;
    onPageHide(callback: (e: Event) => void): IDotBody;
    onPageShow(callback: (e: Event) => void): IDotBody;
    onPopState(callback: (e: Event) => void): IDotBody;
    onResize(callback: (e: Event) => void): IDotBody;
    onStorage(callback: (e: Event) => void): IDotBody;
}
export interface IDotBr extends IDotElementDocument<IDotBr> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    clear(value: unknown): IDotBr;
}
export interface IDotButton extends IDotElementDocument<IDotButton> {
    autoFocus(value: unknown): IDotButton;
    formAction(value: unknown): IDotButton;
    disabled(value?: unknown): IDotButton;
    name(value: unknown): IDotButton;
    type(value: unknown): IDotButton;
    whichForm(value: unknown): IDotButton;
    value(value: unknown): IDotButton;
}
export interface IDotCanvas extends IDotElementDocument<IDotCanvas> {
    height(value: unknown): IDotCanvas;
    width(value: unknown): IDotCanvas;
}
export interface IDotCol extends IDotElementDocument<IDotCol> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotCol;
    colSpan(value: unknown): IDotCol;
    vAlign(value: unknown): IDotCol;
}
export interface IDotColGroup extends IDotElementDocument<IDotColGroup> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotColGroup;
    colSpan(value: unknown): IDotColGroup;
    vAlign(value: unknown): IDotColGroup;
}
export interface IDotDel extends IDotElementDocument<IDotDel> {
    dateTime(value: unknown): IDotDel;
    quoteCite(value: unknown): IDotDel;
}
export interface IDotDetails extends IDotElementDocument<IDotDetails> {
    open(value: unknown): IDotDetails;
    onToggle(callback: (e: Event) => void): IDotDetails;
}
export interface IDotEmbed extends IDotElementDocument<IDotEmbed> {
    height(value: unknown): IDotEmbed;
    src(value: unknown): IDotEmbed;
    type(value: unknown): IDotEmbed;
    width(value: unknown): IDotEmbed;
}
export interface IDotFieldSet extends IDotElementDocument<IDotFieldSet> {
    disabled(value: unknown): IDotFieldSet;
    name(value: unknown): IDotFieldSet;
    whichForm(value: unknown): IDotFieldSet;
}
export interface IDotForm extends IDotElementDocument<IDotForm> {
    acceptCharset(value: unknown): IDotForm;
    action(value: unknown): IDotForm;
    autoComplete(value: unknown): IDotForm;
    encType(value: unknown): IDotForm;
    method(value: unknown): IDotForm;
    name(value: unknown): IDotForm;
    noValidate(value: boolean): IDotForm;
    rel(value: unknown): IDotForm;
    target(value: unknown): IDotForm;
}
export interface IDotHr extends IDotElementDocument<IDotHr> {
    noShade(value: unknown): IDotHr;
}
export interface IDotIFrame extends IDotElementDocument<IDotIFrame> {
    height(value: unknown): IDotIFrame;
    longDesc(value: unknown): IDotIFrame;
    marginHeight(value: unknown): IDotIFrame;
    marginWidth(value: unknown): IDotIFrame;
    name(value: unknown): IDotIFrame;
    sandbox(value: unknown): IDotIFrame;
    scrolling(value: unknown): IDotIFrame;
    seamless(value: unknown): IDotIFrame;
    src(value: unknown): IDotIFrame;
    srcDoc(value: unknown): IDotIFrame;
    width(value: unknown): IDotIFrame;
}
export interface IDotImg extends IDotElementDocument<IDotImg> {
    alt(value: unknown): IDotImg;
    height(value: unknown): IDotImg;
    /** @deprecated Deprecated in HTML5. Use CSS. */
    hSpace(value: unknown): IDotImg;
    isMap(value: unknown): IDotImg;
    longDesc(value: unknown): IDotImg;
    sizes(value: unknown): IDotImg;
    src(value: unknown): IDotImg;
    srcSet(value: unknown): IDotImg;
    useMap(value: unknown): IDotImg;
    width(value: unknown): IDotImg;
}
export interface IDotInput extends IDotElementDocument<IDotInput> {
    accept(value: unknown): IDotInput;
    alt(value: unknown): IDotInput;
    autoComplete(value: unknown): IDotInput;
    autoFocus(value: unknown): IDotInput;
    checked(value?: boolean): IDotInput;
    dirName(value: unknown): IDotInput;
    disabled(value: unknown): IDotInput;
    formAction(value: unknown): IDotInput;
    list(value: unknown): IDotInput;
    max(value: unknown): IDotInput;
    maxLength(value: unknown): IDotInput;
    min(value: unknown): IDotInput;
    multiple(value: unknown): IDotInput;
    name(value: unknown): IDotInput;
    pattern(value: unknown): IDotInput;
    placeholder(value: unknown): IDotInput;
    readOnly(value: unknown): IDotInput;
    required(value: unknown): IDotInput;
    size(value: unknown): IDotInput;
    src(value: unknown): IDotInput;
    step(value: unknown): IDotInput;
    type(value: unknown): IDotInput;
    whichForm(value: unknown): IDotInput;
    value(value: unknown): IDotInput;
    width(value: unknown): IDotInput;
    bindTo(value: unknown): IDotInput;
    getVal(): string;
    setVal(value: unknown): IDotInput;
    onSearch(callback: (e: Event) => void): IDotInput;
}
export interface IDotIns extends IDotElementDocument<IDotIns> {
    dateTime(value: unknown): IDotIns;
    quoteCite(value: unknown): IDotIns;
}
export interface IDotKeyGen extends IDotElementDocument<IDotKeyGen> {
    challenge(value: unknown): IDotKeyGen;
    keyType(value: unknown): IDotKeyGen;
}
export interface IDotLabel extends IDotElementDocument<IDotLabel> {
    for(value: unknown): IDotLabel;
    whichForm(value: unknown): IDotLabel;
}
export interface IDotLi extends IDotElementDocument<IDotLi> {
    value(value: unknown): IDotLi;
}
export interface IDotMap extends IDotElementDocument<IDotMap> {
    name(value: unknown): IDotMap;
}
export interface IDotMenu extends IDotElementDocument<IDotMenu> {
    type(value: unknown): IDotMenu;
}
export interface IDotMeter extends IDotElementDocument<IDotMeter> {
    high(value: unknown): IDotMeter;
    low(value: unknown): IDotMeter;
    max(value: unknown): IDotMeter;
    min(value: unknown): IDotMeter;
    optimum(value: unknown): IDotMeter;
    whichForm(value: unknown): IDotMeter;
    value(value: unknown): IDotMeter;
}
export interface IDotObject extends IDotElementDocument<IDotObject> {
    classId(value: unknown): IDotObject;
    codeBase(value: unknown): IDotObject;
    codeType(value: unknown): IDotObject;
    objectData(value: unknown): IDotObject;
    declare(value: unknown): IDotObject;
    height(value: unknown): IDotObject;
    name(value: unknown): IDotObject;
    standby(value: unknown): IDotObject;
    type(value: unknown): IDotObject;
    useMap(value: unknown): IDotObject;
    whichForm(value: unknown): IDotObject;
    width(value: unknown): IDotObject;
}
export interface IDotOl extends IDotElementDocument<IDotOl> {
    reversed(value: unknown): IDotOl;
    start(value: unknown): IDotOl;
}
export interface IDotOptGroup extends IDotElementDocument<IDotOptGroup> {
    disabled(value: unknown): IDotOptGroup;
}
export interface IDotOption extends IDotElementDocument<IDotOption> {
    disabled(value: unknown): IDotOption;
    optionLabel(value: unknown): IDotOption;
    selected(value?: boolean): IDotOption;
    value(value: unknown): IDotOption;
    bindTo(value: unknown): IDotOption;
    getVal(): string;
    setVal(value: unknown): IDotOption;
}
export interface IDotOutput extends IDotElementDocument<IDotOutput> {
    for(value: unknown): IDotOutput;
    name(value: unknown): IDotOutput;
    whichForm(value: unknown): IDotOutput;
}
export interface IDotParam extends IDotElementDocument<IDotParam> {
    name(value: unknown): IDotParam;
    value(value: unknown): IDotParam;
    valueType(value: unknown): IDotParam;
}
export interface IDotProgress extends IDotElementDocument<IDotProgress> {
    max(value: unknown): IDotProgress;
    value(value: unknown): IDotProgress;
}
export interface IDotQ extends IDotElementDocument<IDotQ> {
    quoteCite(value: unknown): IDotQ;
}
export interface IDotSelect extends IDotElementDocument<IDotSelect> {
    autoFocus(value: unknown): IDotSelect;
    disabled(value: unknown): IDotSelect;
    multiple(value: unknown): IDotSelect;
    name(value: unknown): IDotSelect;
    required(value: unknown): IDotSelect;
    size(value: unknown): IDotSelect;
    whichForm(value: unknown): IDotSelect;
    bindTo(value: unknown): IDotSelect;
    getVal(): string;
    setVal(value: unknown): IDotSelect;
}
export interface IDotSource extends IDotElementDocument<IDotSource> {
    media(value: unknown): IDotSource;
    src(value: unknown): IDotSource;
    type(value: unknown): IDotSource;
    sizes(value: unknown): IDotSource;
    src(value: unknown): IDotSource;
    srcSet(value: unknown): IDotSource;
    type(value: unknown): IDotSource;
}
export interface IDotTable extends IDotElementDocument<IDotTable> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    border(value: unknown): IDotTable;
    /** @deprecated Deprecated in HTML5. Use CSS. */
    cellPadding(value: unknown): IDotTable;
    /** @deprecated Deprecated in HTML5. Use CSS. */
    cellSpacing(value: unknown): IDotTable;
    /** @deprecated Deprecated in HTML5. Use CSS. */
    frame(value: unknown): IDotTable;
    rules(value: unknown): IDotTable;
    tableSummary(value: unknown): IDotTable;
}
export interface IDotTextArea extends IDotElementDocument<IDotTextArea> {
    autoFocus(value: unknown): IDotTextArea;
    cols(value: unknown): IDotTextArea;
    dirName(value: unknown): IDotTextArea;
    disabled(value: unknown): IDotTextArea;
    maxLength(value: unknown): IDotTextArea;
    name(value: unknown): IDotTextArea;
    placeholder(value: unknown): IDotTextArea;
    readOnly(value: unknown): IDotTextArea;
    required(value: unknown): IDotTextArea;
    rows(value: unknown): IDotTextArea;
    whichForm(value: unknown): IDotTextArea;
    wrap(value: unknown): IDotTextArea;
    bindTo(value: unknown): IDotTextArea;
    getVal(): string;
    setVal(value: unknown): IDotTextArea;
}
export interface IDotTBody extends IDotElementDocument<IDotTBody> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotTBody;
    vAlign(value: unknown): IDotTBody;
}
export interface IDotTd extends IDotElementDocument<IDotTd> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    axis(value: unknown): IDotTd;
    /** @deprecated Deprecated in HTML5. Use CSS. */
    char(value: unknown): IDotTd;
    colSpan(value: unknown): IDotTd;
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotTd;
    headers(value: unknown): IDotTd;
    /** @deprecated Deprecated in HTML5. Use CSS. */
    nowrap(value: unknown): IDotTd;
    rowSpan(value: unknown): IDotTd;
    vAlign(value: unknown): IDotTd;
}
export interface IDotTFoot extends IDotElementDocument<IDotTFoot> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotTFoot;
    vAlign(value: unknown): IDotTFoot;
}
export interface IDotTime extends IDotElementDocument<IDotTime> {
    dateTime(value: unknown): IDotTime;
}
export interface IDotTh extends IDotElementDocument<IDotTh> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    axis(value: unknown): IDotTh;
    colSpan(value: unknown): IDotTh;
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotTh;
    headers(value: unknown): IDotTh;
    rowSpan(value: unknown): IDotTh;
    scope(value: unknown): IDotTh;
    vAlign(value: unknown): IDotTh;
}
export interface IDotTHead extends IDotElementDocument<IDotTHead> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotTHead;
    vAlign(value: unknown): IDotTHead;
}
export interface IDotTr extends IDotElementDocument<IDotTr> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotTr;
    vAlign(value: unknown): IDotTr;
}
export interface IDotTrack extends IDotElementDocument<IDotTrack> {
    default(value: unknown): IDotTrack;
    kind(value: unknown): IDotTrack;
    src(value: unknown): IDotTrack;
    srcLang(value: unknown): IDotTrack;
    trackLabel(value: unknown): IDotTrack;
    onCueChange(callback: (e: Event) => void): IDotTrack;
}
export interface IDotVideo extends IDotElementDocument<IDotVideo> {
    autoPlay(value: unknown): IDotVideo;
    buffered(value: unknown): IDotVideo;
    controls(value: unknown): IDotVideo;
    height(value: unknown): IDotVideo;
    loop(value: unknown): IDotVideo;
    muted(value: unknown): IDotVideo;
    poster(value: unknown): IDotVideo;
    preload(value: unknown): IDotVideo;
    src(value: unknown): IDotVideo;
    width(value: unknown): IDotVideo;
    pause(): IDotVideo;
    play(): IDotVideo;
    stop(): IDotVideo;
    onAbort(callback: (e: Event) => void): IDotVideo;
    onCantPlayThrough(callback: (e: Event) => void): IDotVideo;
    onDurationChange(callback: (e: Event) => void): IDotVideo;
    onEmptied(callback: (e: Event) => void): IDotVideo;
    onEnded(callback: (e: Event) => void): IDotVideo;
    onLoadedData(callback: (e: Event) => void): IDotVideo;
    onLoadStart(callback: (e: Event) => void): IDotVideo;
    onLoadedMetadata(callback: (e: Event) => void): IDotVideo;
    onPause(callback: (e: Event) => void): IDotVideo;
    onPlay(callback: (e: Event) => void): IDotVideo;
    onPlaying(callback: (e: Event) => void): IDotVideo;
    onProgress(callback: (e: Event) => void): IDotVideo;
    onRateChange(callback: (e: Event) => void): IDotVideo;
    onSeeked(callback: (e: Event) => void): IDotVideo;
    onSeeking(callback: (e: Event) => void): IDotVideo;
    onStalled(callback: (e: Event) => void): IDotVideo;
    onSuspend(callback: (e: Event) => void): IDotVideo;
    onTimeUpdate(callback: (e: Event) => void): IDotVideo;
    onVolumeChange(callback: (e: Event) => void): IDotVideo;
    onWaiting(callback: (e: Event) => void): IDotVideo;
    onCanPlay(callback: (e: Event) => void): IDotVideo;
}
