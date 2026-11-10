---
"dothtml": minor
"dothtml-interfaces": minor
"create-dothtml": minor
---

Fix several 6.8.0 issues found while porting a real UI (class maps, events, types, and docs):

- Class-map values now accept zero-arg getters and `dot.computed`. A computed or getter is evaluated instead of being treated as a truthy object, so a class can turn off. `bindAs` still works. Docs that disagreed on this now match the behavior.
- Event handlers still receive a `SyntheticEvent`, but native fields such as `key`, `code`, and `button` are forwarded from the original event. `event.nativeEvent` remains available.
- Event delegation is attached per root. Inside a component, listeners live on the shadow root, so non-composed events like `change` and `submit` fire. Events that do not bubble (`scroll`, `load`, `toggle`, and similar) are bound on the element itself. Checkboxes inside components no longer fail silently.
- `autoComplete` accepts the full HTML autocomplete token set, not just `"on"` and `"off"`.
- Style setters accept a computed whose value is a narrowed string union (for example `"black" | "white"`).
- Multi-word HTML tags stay camelCase (`tHead`, `tBody`, `textArea`). Lowercase aliases (`thead`, `tbody`, `textarea`, and the other camelCase HTML tags) are documented and supported.
- Docs no longer say updates flush on the next microtask. Updates flush asynchronously after the current task and microtasks; use `dot.flushSync()` when you need the DOM immediately.
