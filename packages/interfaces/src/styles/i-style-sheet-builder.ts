import { IDotStyleBuilder } from "./i-dot-style-builder";
import IAtKeyframesBuilder from "./at-rules/i-at-keyframes-builder";
import { IWatcher } from "../bindings/i-watcher";

export interface IStyleSheetBuilder {
	/** The global theme object provided via dot.setTheme() */
	readonly theme: any;

	/** Defines a CSS class rule. */
	class(name: string, callback: (s: IDotStyleBuilder) => void): this;

	/** Defines a generic CSS rule. */
	rule(selector: string, callback: (s: IDotStyleBuilder) => void): this;

	/** Alias for rule(). */
	selector(selector: string, callback: (s: IDotStyleBuilder) => void): this;

	/** Defines a media query block. */
	media(condition: string, callback: (s: IStyleSheetBuilder) => void): this;

	/** Defines a container query block. */
	container(condition: string, callback: (s: IStyleSheetBuilder) => void): this;

	/** Defines a feature query (@supports) block. */
	supports(condition: string, callback: (s: IStyleSheetBuilder) => void): this;

	/** Defines a keyframes animation. */
	keyframes(name: string, callback: (k: IAtKeyframesBuilder) => void): this;

	/** Injects a raw CSS string (inheritable by children). */
	css(content: string): this;

	/** Returns a CSS variable reference: var(--name). */
	v(name: string): string;

	/** Creates a reactive CSS string template. */
	template(strings: TemplateStringsArray, ...values: any[]): IWatcher<string>;
}
