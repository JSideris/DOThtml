import { deepEqual } from "../../src/helpers";

describe('deepEqual', () => {
    test('should return true for equal numbers', () => {
        expect(deepEqual(1, 1)).toBe(true);
    });

    test('should return false for different numbers', () => {
        expect(deepEqual(1, 2)).toBe(false);
    });

    test('should return true for equal strings', () => {
        expect(deepEqual('hello', 'hello')).toBe(true);
    });

    test('should return false for different strings', () => {
        expect(deepEqual('hello', 'world')).toBe(false);
    });

    test('should return true for equal arrays', () => {
        expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    test('should return false for arrays of different length', () => {
        expect(deepEqual([1, 2, 3], [1, 2])).toBe(false);
    });

    test('should return false for arrays with different elements', () => {
        expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    });

    test('should return true for equal objects', () => {
        expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    });

    test('should return false for objects with different values', () => {
        expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    });

    test('should return false for objects with different keys', () => {
        expect(deepEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
    });

    test('should handle nested objects', () => {
        const obj1 = { a: { b: { c: 1 } } };
        const obj2 = { a: { b: { c: 1 } } };
        expect(deepEqual(obj1, obj2)).toBe(true);
    });

    test('should return false for different nested objects', () => {
        const obj1 = { a: { b: { c: 1 } } };
        const obj2 = { a: { b: { c: 2 } } };
        expect(deepEqual(obj1, obj2)).toBe(false);
    });

    test('should handle null values', () => {
        expect(deepEqual(null, null)).toBe(true);
        expect(deepEqual(null, undefined)).toBe(false);
        expect(deepEqual({ a: 1, b: null }, { a: 1, b: null })).toBe(true);
    });

    test('should handle cyclic references', () => {
        const obj1 = { a: 1 };
        obj1["self"] = obj1;
        const obj2 = { a: 1 };
        obj2["self"] = obj2;
        expect(deepEqual(obj1, obj2)).toBe(true);
    });

    test('should return false for different cyclic references', () => {
        const obj1 = { a: 1 };
        obj1["self"] = obj1;
        const obj2 = { a: 2 };
        obj2["self"] = obj2;
        expect(deepEqual(obj1, obj2)).toBe(false);
    });

    // Add more tests for any edge cases or specific types you expect to handle
});