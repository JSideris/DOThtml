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
    el(tag: string, content?: DotContent): IDotElement<IDotGenericElement>;
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
    aside(content?: DotContent): IDotElement<IDotGenericElement>;
    abbr(content?: DotContent): IDotElement<IDotGenericElement>;
    address(content?: DotContent): IDotElement<IDotGenericElement>;
    area(content?: DotContent): IDotArea;
    article(content?: DotContent): IDotElement<IDotGenericElement>;
    audio(content?: DotContent): IDotAudio;
    b(content?: DotContent): IDotElement<IDotGenericElement>;
    bdi(content?: DotContent): IDotElement<IDotGenericElement>;
    bdo(content?: DotContent): IDotElement<IDotGenericElement>;
    blockQuote(content?: DotContent): IDotBlockQuote;
    body(content?: DotContent): IDotBody;
    br(content?: DotContent): IDotBr;
    button(content?: DotContent): IDotButton;
    canvas(content?: DotContent): IDotCanvas;
    caption(content?: DotContent): IDotElement<IDotGenericElement>;
    cite(content?: DotContent): IDotElement<IDotGenericElement>;
    code(content?: DotContent): IDotElement<IDotGenericElement>;
    col(content?: DotContent): IDotCol;
    colGroup(content?: DotContent): IDotColGroup;
    content(content?: DotContent): IDotElement<IDotGenericElement>;
    data(content?: DotContent): IDotElement<IDotGenericElement>;
    dataList(content?: DotContent): IDotElement<IDotGenericElement>;
    dd(content?: DotContent): IDotElement<IDotGenericElement>;
    del(content?: DotContent): IDotDel;
    details(content?: DotContent): IDotDetails;
    dfn(content?: DotContent): IDotElement<IDotGenericElement>;
    dialog(content?: DotContent): IDotElement<IDotGenericElement>;
    div(content?: DotContent): IDotElement<IDotGenericElement>;
    dl(content?: DotContent): IDotElement<IDotGenericElement>;
    dt(content?: DotContent): IDotElement<IDotGenericElement>;
    em(content?: DotContent): IDotElement<IDotGenericElement>;
    embed(content?: DotContent): IDotEmbed;
    fieldSet(content?: DotContent): IDotFieldSet;
    figCaption(content?: DotContent): IDotElement<IDotGenericElement>;
    figure(content?: DotContent): IDotElement<IDotGenericElement>;
    footer(content?: DotContent): IDotElement<IDotGenericElement>;
    form(content?: DotContent): IDotForm;
    h1(content?: DotContent): IDotElement<IDotGenericElement>;
    h2(content?: DotContent): IDotElement<IDotGenericElement>;
    h3(content?: DotContent): IDotElement<IDotGenericElement>;
    h4(content?: DotContent): IDotElement<IDotGenericElement>;
    h5(content?: DotContent): IDotElement<IDotGenericElement>;
    h6(content?: DotContent): IDotElement<IDotGenericElement>;
    header(content?: DotContent): IDotElement<IDotGenericElement>;
    hr(content?: DotContent): IDotHr;
    i(content?: DotContent): IDotElement<IDotGenericElement>;
    iFrame(content?: DotContent): IDotIFrame;
    img(content?: DotContent): IDotImg;
    input(content?: DotContent): IDotInput;
    ins(content?: DotContent): IDotIns;
    kbd(content?: DotContent): IDotElement<IDotGenericElement>;
    keyGen(content?: DotContent): IDotKeyGen;
    label(content?: DotContent): IDotLabel;
    legend(content?: DotContent): IDotElement<IDotGenericElement>;
    li(content?: DotContent): IDotLi;
    main(content?: DotContent): IDotElement<IDotGenericElement>;
    map(content?: DotContent): IDotMap;
    mark(content?: DotContent): IDotElement<IDotGenericElement>;
    menu(content?: DotContent): IDotMenu;
    meter(content?: DotContent): IDotMeter;
    nav(content?: DotContent): IDotElement<IDotGenericElement>;
    object(content?: DotContent): IDotObject;
    ol(content?: DotContent): IDotOl;
    optGroup(content?: DotContent): IDotOptGroup;
    option(content?: DotContent): IDotOption;
    output(content?: DotContent): IDotOutput;
    p(content?: DotContent): IDotElement<IDotGenericElement>;
    param(content?: DotContent): IDotParam;
    pre(content?: DotContent): IDotElement<IDotGenericElement>;
    progress(content?: DotContent): IDotProgress;
    q(content?: DotContent): IDotQ;
    rp(content?: DotContent): IDotElement<IDotGenericElement>;
    rt(content?: DotContent): IDotElement<IDotGenericElement>;
    ruby(content?: DotContent): IDotElement<IDotGenericElement>;
    s(content?: DotContent): IDotElement<IDotGenericElement>;
    samp(content?: DotContent): IDotElement<IDotGenericElement>;
    section(content?: DotContent): IDotElement<IDotGenericElement>;
    select(content?: DotContent): IDotSelect;
    small(content?: DotContent): IDotElement<IDotGenericElement>;
    source(content?: DotContent): IDotSource;
    span(content?: DotContent): IDotElement<IDotGenericElement>;
    strong(content?: DotContent): IDotElement<IDotGenericElement>;
    svg(content?: DotContent): IDotElement<IDotGenericElement>;
    sub(content?: DotContent): IDotElement<IDotGenericElement>;
    summary(content?: DotContent): IDotElement<IDotGenericElement>;
    sup(content?: DotContent): IDotElement<IDotGenericElement>;
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
    u(content?: DotContent): IDotElement<IDotGenericElement>;
    ul(content?: DotContent): IDotElement<IDotGenericElement>;
    var(content?: DotContent): IDotElement<IDotGenericElement>;
    video(content?: DotContent): IDotVideo;
    wbr(content?: DotContent): IDotElement<IDotGenericElement>;
}
export interface IDotCore extends IDotDocument {
    (targetSelector: string | Element | Node | NodeList | Array<Node | Element>): IDotElement<IDotGenericElement>;
    version: string;
    navigate(path: string, noHistory?: boolean, force?: boolean): void;
    css: IDotCss;
    bus: typeof EventBus;
    resetScopeClass(): void;
    Component: typeof Component;
}
export interface IDotElement<T extends IDotDocument> extends IDotDocument {
    /**
     * Create a custom attribute.
    */
    attr(name: string, value: unknown, arg3?: unknown): T;
    customData(suffix: string, value: DotContentPrimitive): T;
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
export interface IDotGenericElement extends IDotElement<IDotGenericElement> {
}
export interface IDotA extends IDotElement<IDotA> {
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
export interface IDotArea extends IDotElement<IDotArea> {
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
export interface IDotAudio extends IDotElement<IDotAudio> {
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
export interface IDotBlockQuote extends IDotElement<IDotBlockQuote> {
    quoteCite(value: unknown): IDotBlockQuote;
}
export interface IDotBody extends IDotElement<IDotBody> {
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
export interface IDotBr extends IDotElement<IDotBr> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    clear(value: unknown): IDotBr;
}
export interface IDotButton extends IDotElement<IDotButton> {
    autoFocus(value: unknown): IDotButton;
    formAction(value: unknown): IDotButton;
    disabled(value?: unknown): IDotButton;
    name(value: unknown): IDotButton;
    type(value: unknown): IDotButton;
    whichForm(value: unknown): IDotButton;
    value(value: unknown): IDotButton;
}
export interface IDotCanvas extends IDotElement<IDotCanvas> {
    height(value: unknown): IDotCanvas;
    width(value: unknown): IDotCanvas;
}
export interface IDotCol extends IDotElement<IDotCol> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotCol;
    colSpan(value: unknown): IDotCol;
    vAlign(value: unknown): IDotCol;
}
export interface IDotColGroup extends IDotElement<IDotColGroup> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotColGroup;
    colSpan(value: unknown): IDotColGroup;
    vAlign(value: unknown): IDotColGroup;
}
export interface IDotDel extends IDotElement<IDotDel> {
    dateTime(value: unknown): IDotDel;
    quoteCite(value: unknown): IDotDel;
}
export interface IDotDetails extends IDotElement<IDotDetails> {
    open(value: unknown): IDotDetails;
    onToggle(callback: (e: Event) => void): IDotDetails;
}
export interface IDotEmbed extends IDotElement<IDotEmbed> {
    height(value: unknown): IDotEmbed;
    src(value: unknown): IDotEmbed;
    type(value: unknown): IDotEmbed;
    width(value: unknown): IDotEmbed;
}
export interface IDotFieldSet extends IDotElement<IDotFieldSet> {
    disabled(value: unknown): IDotFieldSet;
    name(value: unknown): IDotFieldSet;
    whichForm(value: unknown): IDotFieldSet;
}
export interface IDotForm extends IDotElement<IDotForm> {
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
export interface IDotHr extends IDotElement<IDotHr> {
    noShade(value: unknown): IDotHr;
}
export interface IDotIFrame extends IDotElement<IDotIFrame> {
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
export interface IDotImg extends IDotElement<IDotImg> {
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
export interface IDotInput extends IDotElement<IDotInput> {
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
export interface IDotIns extends IDotElement<IDotIns> {
    dateTime(value: unknown): IDotIns;
    quoteCite(value: unknown): IDotIns;
}
export interface IDotKeyGen extends IDotElement<IDotKeyGen> {
    challenge(value: unknown): IDotKeyGen;
    keyType(value: unknown): IDotKeyGen;
}
export interface IDotLabel extends IDotElement<IDotLabel> {
    for(value: unknown): IDotLabel;
    whichForm(value: unknown): IDotLabel;
}
export interface IDotLi extends IDotElement<IDotLi> {
    value(value: unknown): IDotLi;
}
export interface IDotMap extends IDotElement<IDotMap> {
    name(value: unknown): IDotMap;
}
export interface IDotMenu extends IDotElement<IDotMenu> {
    type(value: unknown): IDotMenu;
}
export interface IDotMeter extends IDotElement<IDotMeter> {
    high(value: unknown): IDotMeter;
    low(value: unknown): IDotMeter;
    max(value: unknown): IDotMeter;
    min(value: unknown): IDotMeter;
    optimum(value: unknown): IDotMeter;
    whichForm(value: unknown): IDotMeter;
    value(value: unknown): IDotMeter;
}
export interface IDotObject extends IDotElement<IDotObject> {
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
export interface IDotOl extends IDotElement<IDotOl> {
    reversed(value: unknown): IDotOl;
    start(value: unknown): IDotOl;
}
export interface IDotOptGroup extends IDotElement<IDotOptGroup> {
    disabled(value: unknown): IDotOptGroup;
}
export interface IDotOption extends IDotElement<IDotOption> {
    disabled(value: unknown): IDotOption;
    optionLabel(value: unknown): IDotOption;
    selected(value?: boolean): IDotOption;
    value(value: unknown): IDotOption;
    bindTo(value: unknown): IDotOption;
    getVal(): string;
    setVal(value: unknown): IDotOption;
}
export interface IDotOutput extends IDotElement<IDotOutput> {
    for(value: unknown): IDotOutput;
    name(value: unknown): IDotOutput;
    whichForm(value: unknown): IDotOutput;
}
export interface IDotParam extends IDotElement<IDotParam> {
    name(value: unknown): IDotParam;
    value(value: unknown): IDotParam;
    valueType(value: unknown): IDotParam;
}
export interface IDotProgress extends IDotElement<IDotProgress> {
    max(value: unknown): IDotProgress;
    value(value: unknown): IDotProgress;
}
export interface IDotQ extends IDotElement<IDotQ> {
    quoteCite(value: unknown): IDotQ;
}
export interface IDotSelect extends IDotElement<IDotSelect> {
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
export interface IDotSource extends IDotElement<IDotSource> {
    media(value: unknown): IDotSource;
    src(value: unknown): IDotSource;
    type(value: unknown): IDotSource;
    sizes(value: unknown): IDotSource;
    src(value: unknown): IDotSource;
    srcSet(value: unknown): IDotSource;
    type(value: unknown): IDotSource;
}
export interface IDotTable extends IDotElement<IDotTable> {
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
export interface IDotTextArea extends IDotElement<IDotTextArea> {
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
export interface IDotTBody extends IDotElement<IDotTBody> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotTBody;
    vAlign(value: unknown): IDotTBody;
}
export interface IDotTd extends IDotElement<IDotTd> {
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
export interface IDotTFoot extends IDotElement<IDotTFoot> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotTFoot;
    vAlign(value: unknown): IDotTFoot;
}
export interface IDotTime extends IDotElement<IDotTime> {
    dateTime(value: unknown): IDotTime;
}
export interface IDotTh extends IDotElement<IDotTh> {
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
export interface IDotTHead extends IDotElement<IDotTHead> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotTHead;
    vAlign(value: unknown): IDotTHead;
}
export interface IDotTr extends IDotElement<IDotTr> {
    /** @deprecated Deprecated in HTML5. Use CSS. */
    charOff(value: unknown): IDotTr;
    vAlign(value: unknown): IDotTr;
}
export interface IDotTrack extends IDotElement<IDotTrack> {
    default(value: unknown): IDotTrack;
    kind(value: unknown): IDotTrack;
    src(value: unknown): IDotTrack;
    srcLang(value: unknown): IDotTrack;
    trackLabel(value: unknown): IDotTrack;
    onCueChange(callback: (e: Event) => void): IDotTrack;
}
export interface IDotVideo extends IDotElement<IDotVideo> {
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
