# create-dothtml

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
