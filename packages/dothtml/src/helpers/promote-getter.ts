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

function isAttrCollection(value: any): boolean {
	if (!value || typeof value !== "object") return false;
	if (Array.isArray(value)) return true;
	if ((value as any)._isSignal || (value as any)._isBinding || (value as any)._isRef) return false;
	if (isVType(value, ["signal", "computed", "binding", "ref", "attribute-v-node", "style-v-node", "base-v-style"])) return false;
	if (typeof Node !== "undefined" && value instanceof Node) return false;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}

function promoteAttrTree(dot: IDotCore, value: any, kind: "bind" | "attr-or-content"): any {
	if (Array.isArray(value)) {
		for (let i = 0; i < value.length; i++) {
			value[i] = promoteAttrTree(dot, value[i], kind);
		}
		return value;
	}
	if (isAttrCollection(value)) {
		for (const k in value) {
			value[k] = promoteAttrTree(dot, value[k], kind);
		}
		return value;
	}
	value = promoteGetter(dot, value);
	rejectFunctionAttrOrContent(value, kind);
	if ((value instanceof Signal || isVType(value, ["signal", "computed"]) || value?._isSignal) && !value?._isRef) {
		value = (value as any).bind();
	}
	return value;
}

export function promoteOrRejectAttrValue(dot: IDotCore, attrName: string, value: any) {
	const key = (attrName ?? "").toLowerCase();
	if (key === "style" || key === "ref") return value;
	const kind: "bind" | "attr-or-content" = key === "bind" ? "bind" : "attr-or-content";
	if (kind === "bind" && typeof value === "function") {
		rejectFunctionAttrOrContent(value, "bind");
	}
	return promoteAttrTree(dot, value, kind);
}
