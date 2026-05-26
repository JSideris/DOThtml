# dothtml

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
