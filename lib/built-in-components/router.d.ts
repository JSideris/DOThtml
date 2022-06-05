import Component from "../component";
interface RouterParams {
    autoNavigate: boolean;
    onNavigateInit: Function;
    onError: Function;
    onResponse: Function;
    onComplete: Function;
    routes: Array<{
        path: string;
    }>;
}
export default class DotRouter extends Component {
    static allRouters: {
        [key: string]: DotRouter;
    };
    static routerId: number;
    static mayRedirect: boolean;
    static _get(url: any, success: any, fail: any): void;
    static routerEventSet: boolean;
    static setupPopupFunction(): void;
    id: number;
    outlet: Element;
    navId: number;
    currentRoute: string;
    currentParams: RouterParams;
    params: RouterParams;
    routesAndSegments: Array<{
        path: string;
        segments: string[];
    }>;
    constructor(params: RouterParams);
    /**
     * TODO: convert to interface.
     * @param {Object} params - Parameters.
     * @param {Array.<{path: string, title: string, component: Object}>} params.routes - Array of routes.
     * @param {boolean} params.autoNavigate - Router will automatically navigate when outlet is created.
     * @param {Function} params.onNavigateInit - Occurs before any request is sent, and before the router outlet is emptied.
     * @param {Function} params.onError - Occurs in the event of an HTTP error.
     * @param {Function} params.onResponse - Occurs after a successful HTTP response, but before rendering.
     * @param {Function} params.onComplete - Occurs after an uncancelled route completes without an error.
     */
    builder(): import("../i-dot").IDotElementDocument<import("../i-dot").IDotGenericElement>;
    registered(): void;
    ready(): void;
    deleting(): void;
    navigate(path: string, noHistory?: boolean, force?: boolean): {
        cancel: () => void;
        element: Element;
        httpResponse: any;
        isNew: boolean;
        params: any;
        path: string;
        title: any;
        wasCancelled: boolean;
    };
}
export {};
