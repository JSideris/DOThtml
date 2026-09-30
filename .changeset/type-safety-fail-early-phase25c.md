---
"dothtml": minor
"dothtml-interfaces": minor
"create-dothtml": minor
---

Improved type safety and fail-early error handling for agents (Phase 2.5c):

### Type Safety Improvements

- **`this.el` in components**: Now throws a helpful error if accessed before the component is mounted (e.g., in constructor or build()). The error message directs developers to use lifecycle hooks like `mounted()` or `onEnter()` where `this.el` is guaranteed to be available.

- **Bind validation**: The `{ bind: ... }` property now validates that you pass a signal or binding, not a plain value. If you accidentally write `{ bind: "text" }` instead of `{ bind: dot.state("text") }`, you'll get a clear error message explaining how to create a writable signal.

### Improved Error Messages

- **`when` with function content**: Previously cryptic error 13 now includes helpful guidance: "Pass eager markup or a component instance: `dot.when(signal, dot.p('text'))` not `dot.when(signal, () => dot.p('text'))`. Use a zero-arg getter or computed for the condition, not the content."

- **`each` with parameterized function**: Error 12 now clarifies: "Pass an array, a plain object, a signal, a binding, or a zero-arg getter: `() => items`"

- **Keyed `each` validation**: When you use `dot.state(items, "id")` to create a keyed list, DOThtml now validates that items actually have the specified key property. If items don't have an "id" property, you'll get an error: "Items do not have the key property 'id'. The array was created with dot.state(items, 'id'), but the items don't have a 'id' property. Check your data or use a different key."

### Link Component

- **Link mount props**: `Link` component now validates props and warns if neither `to` nor `name` is provided, helping catch common configuration mistakes.

### Documentation

- Enhanced interface documentation to clarify when `this.el` is available
- Updated error messages to align with documented preferred patterns
- All changes maintain backward compatibility (minor release)

These improvements make the preferred patterns easier to follow and catch common mistakes earlier with clearer error messages, especially helpful for AI coding agents.
