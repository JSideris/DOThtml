import { IDotElement } from "./i-dot";
import IDotCss from "i-dotcss";
declare abstract class Component {
    static initializeComponent<T extends Component>(obj: T): void;
    static build<T extends Component>(obj: T): Element;
    static initializeEventHandlers(obj: any): void;
    static createProp(activePropContainer: Function, name: string): void;
    static configureDependency(cc: Component, name: string): void;
    static updateProp(obj: Component, name: string): void;
    constructor(...args: Array<any>);
    /**
     * A function returning DOThtml (required).
     */
    abstract builder(...args: Array<any>): IDotElement;
    /**
     *
    */
    props: {
        [key: string]: any;
    };
    /**
     * A series of events that can be raised from inside the component.
     */
    events: {
        [key: string]: (...params: Array<any>) => void;
    };
    /**
     * An optional function that gets called before the component is created, scoped to the new component object.
     */
    created(...args: Array<any>): void;
    /**
     * An optional function called after the element has been added. One parameter will be provided containing the added element.
     */
    ready(): void;
    /**
     * An optional function called before the component is deleted.
     */
    deleting(): void;
    /**
     * An optional function called after the component is deleted.
     */
    deleted(): void;
    /**
     * An optional function called after the component is built.
     */
    built(): void;
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    private __$el;
    private __built;
    private __stylesSet;
    private __eventsInitialized;
    private __propContainer;
    private __args;
    /**
     * The main element of this component - automatically set after the builder is called.
    */
    get $el(): HTMLElement;
    $refs: {};
    /**
     * Name of the component (optional). If provided, dot and the VDBO will be extended.
     */
    name: string;
    /**
     * An optional function that is called after builder that stylizes the component using a scoped style builder.
     */
    style?(styleBuilder: IDotCss): void;
    $styleBuilder?: Function;
    $updateStyles(): void;
}
export default Component;
