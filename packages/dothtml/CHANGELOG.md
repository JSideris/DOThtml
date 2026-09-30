# dothtml

## 6.7.3

### Patch Changes

- db4ae65: **DX Fix: Add `this.el` to component instances**

  Components can now access their host custom element via `this.el` in lifecycle hooks like `onEnter()` and `mounted()`. This aligns the runtime with the documentation and enables animations as shown in docs:

  ```typescript
  class MyModal extends DotComponent {
    onEnter() {
      this.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
    }
  }
  ```

  **Documentation improvements:**

  - Added parent listener examples for custom events (via mount options or `.on()`)
  - Added multi-child named slot example using fluent chaining
  - Clarified difference between component lifecycle `onEnter` and element `.onEnter(el => ...)`

- Updated dependencies [db4ae65]
  - dothtml-interfaces@6.7.3

## 6.7.2

### Patch Changes

- 21e4942: Fix TypeScript types for `dot.each` to accept keyed list signals without casting. Split array and dictionary overloads so `ISignal<T[]>` from `dot.state(items, "id")` type-checks correctly without `as any`.
- Updated dependencies [21e4942]
  - dothtml-interfaces@6.7.2

## 6.7.1

### Patch Changes

- Updated dependencies [515c38a]
  - dothtml-interfaces@6.7.1

## 6.7.0

### Minor Changes

- Zero-arg getters work on attributes.
- Promote zero-arg getters on attributes, `.attr()`, and text content (wrapped in `dot.computed`). Throw error 15 on leftover functions and on `bind` getters. Event handlers, style builders, and ref callbacks are unchanged.

### Patch Changes

- Updated dependencies
- Updated dependencies
  - dothtml-interfaces@6.7.0

## 6.6.0

### Minor Changes

- Accept zero-arg getters on `each`, `when`, and `otherwiseWhen` (wrapped in `dot.computed`).
- Throw on invalid collections (error 14) and function then-content (error 13); arity-1 collection or condition (error 12).
- Docs: lists & conditionals page with derived-list recipes and anti-examples.

### Patch Changes

- Updated dependencies
  - dothtml-interfaces@6.6.0

## 6.5.4

### Patch Changes

- Fix `dot.when` ignoring `dot.computed` conditions by unwrapping Computed signals in `reduceReactive`.
- Support nested reactivity during batch rendering by switching from parentElement to parentNode for DOM validation.
- Updated dependencies
  - dothtml-interfaces@6.5.4

## 6.5.3

### Patch Changes

- Linking to error pages md on project website from non-dev browser console.
- Updated dependencies
  - dothtml-interfaces@6.5.3

## 6.5.2

### Patch Changes

- Better error messages.
- Updated dependencies
  - dothtml-interfaces@6.5.2

## 6.5.1

### Patch Changes

- Fix bug with bindings where SyntheticEvent.target was set to the component's host element, the shadow DOM, rather than the actual element that triggered the event.
- Updated dependencies
  - dothtml-interfaces@6.5.1

## 6.5.0

### Minor Changes

- Upgraded theme provider to support stylesheets as a string rather than forcing use of the style builder. Also enhanced typing for many of the style-related callbacks.

### Patch Changes

- Updated dependencies
  - dothtml-interfaces@6.5.0

## 6.4.1

### Patch Changes

- Fix regression in theme provider that caused themes to be lost when lists were modified.
- Updated dependencies
  - dothtml-interfaces@6.4.1

## 6.4.0

### Minor Changes

- Added theme builder pattern.

### Patch Changes

- Updated dependencies
  - dothtml-interfaces@6.4.0

## 6.3.3

### Patch Changes

- Bugfix for another signal fix. Better equity check for NaN values.
- Updated dependencies
  - dothtml-interfaces@6.3.3

## 6.3.2

### Patch Changes

- Bugfix for range input types getting set to NaN by bindings.
- Updated dependencies
  - dothtml-interfaces@6.3.2

## 6.3.1

### Patch Changes

- Fix math and svg syntax to match spec.
- Updated dependencies
  - dothtml-interfaces@6.3.1

## 6.3.0

### Minor Changes

- New SVG builder.

### Patch Changes

- Updated dependencies
  - dothtml-interfaces@6.3.0

## 6.2.0

### Minor Changes

- Make `h` a formal alias to `html` and fix several issues with SVG rendering.

### Patch Changes

- Updated dependencies
  - dothtml-interfaces@6.2.0

## 6.1.0

### Minor Changes

- New feature on Signals, making them proxy-aware, and automatic array reactivity.

### Patch Changes

- Updated dependencies
  - dothtml-interfaces@6.1.0

## 6.0.9

### Patch Changes

- Robost type checking in resolveRoot function and new isVType helper to fix outstanding edge cases in certain helper methods. Comprehensive refactor.
- Updated dependencies
  - dothtml-interfaces@6.0.9

## 6.0.8

### Patch Changes

- Fixes another issue with empty method caused by a failure of the previous instanceof-based solution. Also, adds a `version` field on the root `dot` object.
- Updated dependencies
  - dothtml-interfaces@6.0.8

## 6.0.7

### Patch Changes

- Fix several helper methods from bug preventing targetting elements. E.g. dot("#my-div").empty() would incorrectly empty the last child of the target, rather than the target itself.
- Updated dependencies
  - dothtml-interfaces@6.0.7

## 6.0.6

### Patch Changes

- Fix styling typings + bug fix for empty().
- Updated dependencies
  - dothtml-interfaces@6.0.6

## 6.0.5

### Patch Changes

- Polymorphic mounting.
- Updated dependencies
  - dothtml-interfaces@6.0.5

## 6.0.4

### Patch Changes

- Implement changeset. Fix minor regressions.
- Updated dependencies
  - dothtml-interfaces@6.0.4
