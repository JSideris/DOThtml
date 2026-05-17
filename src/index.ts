
export type * from "dothtml-interfaces";

import dot from "./dot";
import { Priority } from "./reactivity/priority";
import { 
	currentPath, 
	currentSearch, 
	currentHash, 
	navigate, 
	useQueryParams, 
	useHash, 
	Router, 
	Link 
} from "./routing";
import { initScrollManager } from "./routing/scroll-manager";

dot.version = "6.0.0";

// Initialize scroll manager
initScrollManager();

// Attach routing features to dot.
(dot as any).currentPath = currentPath;
(dot as any).currentSearch = currentSearch;
(dot as any).currentHash = currentHash;
(dot as any).navigate = navigate;
(dot as any).useQueryParams = useQueryParams;
(dot as any).useHash = useHash;
(dot as any).Router = Router;
(dot as any).Link = Link;


// Extend the Window interface to include your dot property
declare global {
	interface Window {
		dot: typeof dot;
	}
}

// Attach dot to the window object
window.dot = dot;
document["_dotId"] = "default";

export { dot, Priority };
export * from "./routing";
export * from "./base-component";


