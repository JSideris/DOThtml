# Lists & Conditionals

DOThtml renders lists with `dot.each` and branches with `dot.when`, `dot.otherwiseWhen`, and `dot.otherwise`. This page covers the inputs that stay reactive, the derived-list recipes agents reach for, and the mistakes that silently fail or throw.

## Conditionals

`when` / `otherwiseWhen` / `otherwise` are analogous to `if` / `else if` / `else`.

The **condition** may be:

- a boolean literal
- a signal or binding of a boolean
- a **zero-arg getter** — wrapped in `dot.computed` automatically

The **then-content** is eager `DotContent` (markup, text, or a component instance). It is **not** a factory function. `when(cond, () => dot.p("x"))` throws error **13**.

`otherwise` is not a getter target. It always runs when the previous branch was false.

```javascript
// when
dot.when(visible, dot.p("shown"));
dot.when(() => this.payload.value.ready, dot.p("ready"))
	.otherwise(dot.p("loading"));
```

Chain `otherwiseWhen` for additional branches:

```javascript
dot.when(() => mode === 1, dot.p("a"))
	.otherwiseWhen(() => mode === 2, dot.p("b"))
	.otherwise(dot.p("c"));
```

## Lists (`each`)

The **first argument** to `dot.each` may be:

- a static array or plain object dictionary
- a signal or binding of an array or dictionary
- a **zero-arg getter** that returns an array or dictionary — wrapped in `dot.computed`
- a binding from `bindAs` that resolves to an array or dictionary

The **row callback** `(item, index, key) => DotContent` builds each row. It is a normal function callback, not a reactive getter.

## Recipes

```javascript
// 1. The list is the signal
const worlds = dot.state([]);
dot.each(worlds, w => dot.li(w.name));

// 2. Derived list via computed / getter (equivalent)
dot.each(dot.computed(() => this.payload.value.worlds), w => dot.li(w.name));
dot.each(() => this.payload.value.worlds, w => dot.li(w.name));

// 3. Derived list via bindAs
dot.each(this.payload.bindAs(p => p.worlds), w => dot.li(w.name));

// Anti-examples — render once or never; not reactive
dot.each(this.payload.value.worlds, w => dot.li(w.name));
dot.each(this.payload.worlds, w => dot.li(w.name));
```

## Keyed lists

For efficient reuse and reordering, create the list with `dot.state(items, "id")` where `"id"` is the **item property name** used as the stable key. Each item must have that property.

```javascript
const items = dot.state([{ id: "a", name: "Alice" }, { id: "b", name: "Bob" }], "id");
dot.each(items, item => dot.li(item.name));
```

See [Detailed Features](./detailed-features.md) for keyed diffing internals.

## What not to pass

| Input | Outcome |
| :--- | :--- |
| `each(payload.value.items)` / `each(payload.items)` | Snapshot; not reactive (see anti-examples above) |
| `each(new Set(…))` / `Map` / `null` / `undefined` / `Promise` | Error **14** |
| `when(true, () => dot.p("x"))` | Error **13** (not lazy factories) |
| `each((x) => …, row)` or arity-1 condition | Error **12** |

Reading nested properties through the signal proxy (for example `payload.items`) returns a **raw array**, not a list signal. Use a signal, `bindAs`, `computed`, or a zero-arg getter on `each`.

See [Error Codes](./errors.md) for full messages.

## See also

- [Reactivity](./reactivity.md) — signals, computed, bindings
- [Refs](./refs.md) — `refCollection` for keyed element refs in lists
- [Styling](./styling.md#transitions-and-animations) — transitions on `each` / `when` content
- [Detailed Features](./detailed-features.md) — keyed diffing and performance internals
