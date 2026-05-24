import IDotcssProp from "./i-css-prop";

/**
 * A fluent builder for CSS properties.
 * Transforms all properties from IDotcssProp into methods that return the builder.
 */
export type IDotStyleBuilder = {
	[K in keyof IDotcssProp]-?: (value: Exclude<IDotcssProp[K], undefined>) => IDotStyleBuilder;
} & {
	variable(name: string, value: any): IDotStyleBuilder;
	v(name: string): string;
	[prop: string]: any;
};
