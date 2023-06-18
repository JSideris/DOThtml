
import dot from "./dot";
import Component from "./component";

dot.version = "5.2.10";
dot.Component = Component;

/*! DOThtml (c) Joshua Sideris | dothtml.org/license */

/**
 * Changes:
 * - Converted to typescript.
 * - Removed if, IF, elseif, ELSEIF, else, and ELSE functions, replacing them with when, otherwiseWhen, and otherwise. Improves compatibility for IE 8.
 * - Also took some shortcuts that may not have polyfill with older browsers. Will get back to adding reverse compatibility in a future update.
 * - Created several type interfaces.
 * - Changed the names to HTML tags and attributes to pascal case. 
 * - Removed most E and A suffixes from tag and attribute names.
 * - Removed special selection behavior for overlapping HTML names. Instead, all conflicts were renamed.
 * - Added attribute-element associations.
 * - Added `as` function for casting (mostly useful when adding attributes via the dot selector).
 * - Started the long process of adding comment documentation for custom built-in functions.
 * - Re-imagined components from the ground up. Components are now classes that inherit from `Component`. Plays very nicely with TS and ES6.
 * - Added interfaces for new methods that can be invoked on various elements. For instance, play, pause, and stop on audio and video elements.
 * - Updated scopeClass method to put the optional parameter last.
 * - Fixed some color bugs.
 * - Added a filter builder.
 * - Added flex gap.
 * - Added "auto" as an accepted value to many length types.
 * - Made textIndent a numeric prop.
 * - Removed webpack. Build is now done with tsc.
 * - Remove default export on dothtml.ts, replace with an export for {dot}.
 */



export {dot};
export {default as DotComponent} from "./component";
export {IDotElement} from "./i-dot";
export {default as IDotCss} from "./styling/i-dotcss";

// https://www.youtube.com/JoshSideris
