"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotComponent = void 0;
const dot_1 = __importDefault(require("./dot"));
const component_1 = __importDefault(require("./component"));
dot_1.default.version = "5.2.8";
dot_1.default.Component = component_1.default;
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
 */
exports.default = dot_1.default;
var component_2 = require("./component");
Object.defineProperty(exports, "DotComponent", { enumerable: true, get: function () { return __importDefault(component_2).default; } });
// https://www.youtube.com/JoshSideris
//# sourceMappingURL=dothtml.js.map