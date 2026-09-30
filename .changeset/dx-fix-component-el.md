---
"dothtml": patch
"dothtml-interfaces": patch
---

**DX Fix: Add `this.el` to component instances**

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
