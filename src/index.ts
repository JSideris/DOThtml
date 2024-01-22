
// TODO: this is failing but it isn't a high priority right now.
// export * from "dothtml-interfaces";

import dot from "./dot";
dot.version = "6.0.0";

// Extend the Window interface to include your dot property
declare global {
	interface Window {
		dot: typeof dot;
	}
}
  
// Attach dot to the window object
window.dot = dot;

export { dot };

