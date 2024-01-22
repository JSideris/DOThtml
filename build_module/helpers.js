import { DOT_VDOM_PROP_NAME } from "./constants";
export function removeNodesBetween(start, end) {
    if (start.parentNode !== end.parentNode) {
        throw new Error("Start and end nodes must have the same parent.");
    }
    let current = start.nextSibling;
    while (current && current !== end) {
        const next = current.nextSibling;
        if (current[DOT_VDOM_PROP_NAME]) {
            current[DOT_VDOM_PROP_NAME]._unrender();
        }
        else {
            current.parentNode?.removeChild(current);
        }
        current = next;
    }
}
export function deepEqual(obj1, obj2, visited = new Map()) {
    if (obj1 === obj2) {
        return true;
    }
    if (obj1 == null || obj2 == null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }
    if (visited.has(obj1)) {
        return visited.get(obj1) === obj2;
    }
    visited.set(obj1, obj2);
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
            return false;
        }
    }
    for (const prop in obj1) {
        if (!obj2.hasOwnProperty(prop)) {
            return false;
        }
        if (!deepEqual(obj1[prop], obj2[prop], visited)) {
            return false;
        }
    }
    for (const prop in obj2) {
        if (!obj1.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=helpers.js.map