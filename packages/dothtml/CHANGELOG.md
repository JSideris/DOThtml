# dothtml

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
