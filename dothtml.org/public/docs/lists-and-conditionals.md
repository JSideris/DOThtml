# Lists & Conditionals

DOThtml renders lists with `dot.each` and branches with `dot.when`, `dot.otherwiseWhen`, and `dot.otherwise`. This page covers the inputs that stay reactive, the derived-list recipes agents reach for, and the mistakes that silently fail or throw.

## Conditionals

`when` / `otherwiseWhen` / `otherwise` are analogous to `if` / `else if` / `else`.

The **condition** may be:

- a boolean literal
- a signal or binding of a boolean
- a **zero-arg getter** — wrapped in `dot.computed` automatically

The **then-content** is eager `DotContent` (markup, text, or a component instance). It is **not** a factory function. `when(cond, () => dot.p("x"))` throws error **13**. For agent-specific guidance on when zero-arg getters close over component state and cause subtle bugs, see [AI Agents](./ai-agents.md).

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

- a static array or plain object dictionary — **one-shot, non-reactive** (renders once at mount)
- a **signal or binding** of an array or dictionary — **reactive** (preferred)
- a **zero-arg getter** that returns an array or dictionary — **reactive** (wrapped in `dot.computed` automatically)

The **row callback** `(item, index, key) => DotContent` builds each row. It is a normal function callback, not a reactive getter.

## Recipes

### Preferred: the list is the signal

Create the list as a signal, optionally keyed when items have stable IDs. This is the canonical reactive-list pattern.

```javascript
// Unkeyed
const worlds = dot.state([]);
dot.each(worlds, w => dot.li(w.name));

// Keyed (recommended when items have stable IDs)
const items = dot.state([{ id: "a", name: "Alice" }, { id: "b", name: "Bob" }], "id");
dot.each(items, item => dot.li(item.name));
```

When the array itself is the signal, updates (`.push()`, `.splice()`, reassignment) trigger re-renders automatically. Use the second argument to `dot.state` for keying — see [Keyed lists](#keyed-lists) below.

### Acceptable: derived list via zero-arg getter

When the array lives **inside** another signal (for example, a `payload` object), use a zero-arg getter. DOThtml wraps it in `dot.computed` automatically.

```javascript
// Zero-arg getter (recommended)
dot.each(() => this.payload.value.worlds, w => dot.li(w.name));

// Explicit dot.computed (equivalent, verbose)
dot.each(dot.computed(() => this.payload.value.worlds), w => dot.li(w.name));
```

Both forms are reactive. The getter is called whenever `payload` (or any signal read inside the getter) changes.

### Advanced: `bindAs` for lists (niche cases)

`bindAs` creates a derived binding that follows a lens into a parent signal. It is rarely needed for lists — prefer the patterns above.

```javascript
// Niche: derived binding via bindAs
dot.each(this.payload.bindAs(p => p.worlds), w => dot.li(w.name));
```

Use `bindAs` only when you need a **writable binding** for nested state or when building reusable lens abstractions. For read-only derived lists, a zero-arg getter is simpler and equivalent.

---

### ⚠️ Silent non-reactive traps

The following patterns compile but **do not react** to changes. They capture a snapshot at render time and never update.

```javascript
// WRONG: reads .value — snapshot, not reactive
dot.each(this.payload.value.worlds, w => dot.li(w.name));

// WRONG: reads nested property — raw array, not a signal
dot.each(this.payload.worlds, w => dot.li(w.name));

// WRONG: plain array variable — not a signal
const items = [{ id: 1, name: "Alice" }];
dot.each(items, item => dot.li(item.name));
```

Reading nested properties through the signal proxy (for example, `payload.worlds`) returns a **raw array**, not a list signal. Always use a signal, a zero-arg getter, or `dot.computed` for reactive lists.

## Attributes and text content

The same zero-arg getter recipe works on attributes, `.attr()`, and element text. The getter is wrapped in `dot.computed`.

```javascript
dot.input({ type: "range", min: 0, max: 4, value: () => n.value });
dot.div(() => name.value);
dot.div("label").attr("data-n", () => n.value);
dot.text(() => name.value);
```

`dot.div(() => name.value)` is **derived text**, not a lazy factory. `when` then-content stays eager — `when(cond, () => dot.p("x"))` still throws error **13**.

Event handlers (`onClick: () => …`), style builders, and ref callbacks are not getters. `bind` must be a writable signal or binding — `bind: () => x` throws error **15**.

Class-map values (`class: { active: () => … }`) are still treated as truthy / not executed.

## Keyed lists

Pass a second argument to `dot.state(items, "id")` to enable keyed diffing. The string `"id"` is the **item property name** used as the stable key. Each item must have that property.

```javascript
const items = dot.state([{ id: "a", name: "Alice" }, { id: "b", name: "Bob" }], "id");
dot.each(items, item => dot.li(item.name));

// Efficient reordering, insertion, and removal
items.value = [{ id: "b", name: "Bob" }, { id: "a", name: "Alice" }]; // reorder
items.push({ id: "c", name: "Charlie" }); // append
```

Keyed lists reuse existing DOM nodes by identity, preserving component state and avoiding unnecessary re-renders during reordering. See [Detailed Features](./detailed-features.md) for keyed diffing internals.

## What not to pass

| Input | Outcome |
| :--- | :--- |
| `each(payload.value.items)` / `each(payload.items)` | **Silent non-reactive trap** — snapshot at render time; not reactive |
| `each(plainArray)` where `plainArray` is not a signal | **One-shot** — renders once; not reactive |
| `each(new Set(…))` / `Map` / `null` / `undefined` / `Promise` | Error **14** |
| `when(true, () => dot.p("x"))` | Error **13** (not lazy factories) |
| `each((x) => …, row)` or arity-1 condition | Error **12** |
| `value: (x) => …` / `dot.div((x) => …)` | Error **15** |
| `bind: () => x` | Error **15** (not writable) |

Reading nested properties through the signal proxy (for example `payload.items`) returns a **raw array**, not a list signal. Use a signal, `bindAs`, `computed`, or a zero-arg getter on `each`.

See [Error Codes](./errors.md) for full messages.

## See also

- [Reactivity](./reactivity.md) — signals, computed, bindings
- [Refs](./refs.md) — `refCollection` for keyed element refs in lists
- [Styling](./styling.md#transitions-and-animations) — transitions on `each` / `when` content
- [Detailed Features](./detailed-features.md) — keyed diffing and performance internals
- [AI Agents](./ai-agents.md) — common agent pitfalls with getters and list reactivity
