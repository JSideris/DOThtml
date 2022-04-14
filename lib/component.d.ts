import { IDotElement, IDotGenericElement } from "./i-dot";
import IDotcss from "i-dotcss";
interface Component {
    props?: {
        [key: string]: any;
    };
    /**
     * An array of names that can be called as functions. The component will be extended by these names.
     */
    events?: {
        [key: string]: (...params: Array<any>) => void;
    };
    /**
     * An optional function that gets called once per component after registering in the dot namespace, with the component class passed in as a parameter.
     */
    registered?(): void;
    /**
     * An optional function that gets called before the component is created, scoped to the new component object.
     */
    created?(...args: Array<any>): void;
    /**
     * An optional function called after the element has been added. One parameter will be provided containing the added element.
     */
    ready?(): void;
    /**
     * An optional function called before the component is deleted.
     */
    deleting?(): void;
    /**
     * An optional function called after the component is deleted.
     */
    deleted?(): void;
    /**
     * An optional function called after the component is built.
     */
    built?(): void;
}
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
    abstract builder(...args: Array<any>): IDotElement<IDotGenericElement>;
    registered?(): void;
    created?(...args: Array<any>): void;
    ready?(): void;
    deleting?(): void;
    deleted?(): void;
    built?(): void;
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
    style?(styleBuilder: IDotcss): void;
    $styleBuilder?: Function;
    $updateStyles(): void;
}
export default Component;
