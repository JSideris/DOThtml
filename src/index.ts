
// TODO: this is failing but it isn't a high priority right now.
// export * from "dothtml-interfaces";

import dot from "./dot";
import * as routing from "./routing";
import { Router } from "./router";
import { Link } from "./link";
import { initScrollManager } from "./scroll-manager";

dot.version = "6.0.0";

// Initialize scroll manager
initScrollManager();

// Attach routing features to dot.
(dot as any).currentPath = routing.currentPath;
(dot as any).currentSearch = routing.currentSearch;
(dot as any).currentHash = routing.currentHash;
(dot as any).navigate = routing.navigate;
(dot as any).useQueryParams = routing.useQueryParams;
(dot as any).useHash = routing.useHash;
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

export { dot, Router, Link };

