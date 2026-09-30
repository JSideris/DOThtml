---
"dothtml": patch
"dothtml-interfaces": patch
---

Improve TypeScript types for store actions and getters. Actions and getters now have proper `ThisType` that includes signal-mapped state, eliminating the need for `as any` casts. Store hook return type is also properly typed instead of `any`.
