---
"dothtml": patch
"dothtml-interfaces": patch
"create-dothtml": patch
---

Fix consumer `tsc` failure (TS2344) in `LengthProp`. The default type argument `GKV` now includes `ReadableReactive<string>`, which did not satisfy the old `string | IReactive` constraint. The constraint is widened so style setter types typecheck again for packages that import `dothtml`.
