import { IDotCore } from "dothtml-interfaces";
import Signal from "../reactivity/signal";
import { throwError } from "./errors";
import { isVType } from "./tools";

export function promoteGetter(dot: IDotCore, value: any) {
	if (typeof value === "function" && value.length === 0 && !value.prototype?.build) {
		return dot.computed(value);
	}
	return value;
}

export function rejectFunctionAttrOrContent(value: any, kind: "bind" | "attr-or-content" = "attr-or-content"): void {
	if (typeof value !== "function") return;
	if (kind === "bind") {
		throwError(15, "bind does not accept a function. Pass a writable signal or binding, not a getter.");
	}
	throwError(15, "Attribute or element content cannot be a function. Pass a value, a signal, a binding, or a zero-arg getter.");
}

export function promoteOrRejectAttrValue(dot: IDotCore, attrName: string, value: any) {
	const key = (attrName ?? "").toLowerCase();
	if (key === "style" || key === "ref") return value;
	if (key === "bind" && typeof value === "function") {
		rejectFunctionAttrOrContent(value, "bind");
	}
	value = promoteGetter(dot, value);
	rejectFunctionAttrOrContent(value);
	if ((value instanceof Signal || isVType(value, "signal") || value?._isSignal) && !value?._isRef) {
		value = (value as any).bind();
	}
	return value;
}
