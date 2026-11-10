# create-dothtml

## 6.9.1

### Patch Changes

- 977167a: Fix consumer `tsc` failure (TS2344) in `LengthProp`. The default type argument `GKV` now includes `ReadableReactive<string>`, which did not satisfy the old `string | IReactive` constraint. The constraint is widened so style setter types typecheck again for packages that import `dothtml`.

## 6.9.0

### Minor Changes

- afd6761: Fix several 6.8.0 issues found while porting a real UI (class maps, events, types, and docs):

  - Class-map values now accept zero-arg getters and `dot.computed`. A computed or getter is evaluated instead of being treated as a truthy object, so a class can turn off. `bindAs` still works. Docs that disagreed on this now match the behavior.
  - Event handlers still receive a `SyntheticEvent`, but native fields such as `key`, `code`, and `button` are forwarded from the original event. `event.nativeEvent` remains available.
  - Event delegation is attached per root. Inside a component, listeners live on the shadow root, so non-composed events like `change` and `submit` fire. Events that do not bubble (`scroll`, `load`, `toggle`, and similar) are bound on the element itself. Checkboxes inside components no longer fail silently.
  - `autoComplete` accepts the full HTML autocomplete token set, not just `"on"` and `"off"`.
  - Style setters accept a computed whose value is a narrowed string union (for example `"black" | "white"`).
  - Multi-word HTML tags stay camelCase (`tHead`, `tBody`, `textArea`). Lowercase aliases (`thead`, `tbody`, `textarea`, and the other camelCase HTML tags) are documented and supported.
  - Docs no longer say updates flush on the next microtask. Updates flush asynchronously after the current task and microtasks; use `dot.flushSync()` when you need the DOM immediately.

## 6.8.0

### Minor Changes

- a64658c: Improved type safety and fail-early error handling for agents (Phase 2.5c):

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

## 6.7.4

## 6.7.3

## 6.7.2

## 6.7.1

## 6.7.0

### Minor Changes

- Zero-arg getters work on attributes.
- Promote zero-arg getters on attributes, `.attr()`, and text content (wrapped in `dot.computed`). Throw error 15 on leftover functions and on `bind` getters. Event handlers, style builders, and ref callbacks are unchanged.

## 6.5.4

### Patch Changes

- Support nested reactivity during batch rendering by switching from parentElement to parentNode for DOM validation.

## 6.5.3

### Patch Changes

- Linking to error pages md on project website from non-dev browser console.

## 6.5.2

### Patch Changes

- Better error messages.

## 6.5.1

### Patch Changes

- Fix bug with bindings where SyntheticEvent.target was set to the component's host element, the shadow DOM, rather than the actual element that triggered the event.

## 6.5.0

### Minor Changes

- Upgraded theme provider to support stylesheets as a string rather than forcing use of the style builder. Also enhanced typing for many of the style-related callbacks.

## 6.4.1

### Patch Changes

- Fix regression in theme provider that caused themes to be lost when lists were modified.

## 6.4.0

### Minor Changes

- Added theme builder pattern.

## 6.3.3

### Patch Changes

- Bugfix for another signal fix. Better equity check for NaN values.

## 6.3.2

### Patch Changes

- Bugfix for range input types getting set to NaN by bindings.

## 6.3.1

### Patch Changes

- Fix math and svg syntax to match spec.

## 6.3.0

### Minor Changes

- New SVG builder.

## 6.2.0

### Minor Changes

- Make `h` a formal alias to `html` and fix several issues with SVG rendering.

## 6.1.0

### Minor Changes

- New feature on Signals, making them proxy-aware, and automatic array reactivity.

## 6.0.9

### Patch Changes

- Robost type checking in resolveRoot function and new isVType helper to fix outstanding edge cases in certain helper methods. Comprehensive refactor.

## 6.0.8

### Patch Changes

- Fixes another issue with empty method caused by a failure of the previous instanceof-based solution. Also, adds a `version` field on the root `dot` object.
