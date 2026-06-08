import { IS_DEV } from "../constants";

/**
 * Throws a framework-level error.
 * In development mode, provides a descriptive message.
 * In production mode, provides a short error code and a link to documentation.
 * 
 * @param code The unique error code.
 * @param message The descriptive error message (only shown in development).
 */
export function throwError(code: number, message: string): never {
	if (IS_DEV) {
		throw new Error(`[DOThtml] ${message}`);
	} else {
		throw new Error(`[DOThtml] Error ${code}. See https://dothtml.org/docs/errors.md#${code}`);
	}
}
