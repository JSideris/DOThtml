---
"dothtml-interfaces": patch
"dothtml": patch
---

Fix TypeScript types for `dot.each` to accept keyed list signals without casting. Split array and dictionary overloads so `ISignal<T[]>` from `dot.state(items, "id")` type-checks correctly without `as any`.
