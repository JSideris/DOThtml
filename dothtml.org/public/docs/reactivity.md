# Reactivity in DOThtml

DOThtml provides a powerful, low-salt reactivity system based on **Signals**.

## Signals

A `Signal` is a wrapper around a value that tracks its changes. You can create one using `dot.state()`.

```javascript
const count = dot.state(0);

dot.div(count); // Automatically updates when count changes.

count.value++; // Updates the DOM.
```

## Computed State

Computed signals allow you to derive state from other signals. They automatically track which signals they depend on.

```javascript
const firstName = dot.state("John");
const lastName = dot.state("Doe");

const fullName = dot.computed(() => `${firstName.value} ${lastName.value}`);

dot.div(fullName); // Displays "John Doe" and updates if either name changes.
```

### Lazy Evaluation
Computed signals are **lazy**. They only re-calculate their value when it is actually accessed (via `.value`) or when the DOM needs to update. This ensures maximum efficiency for complex derivations.

### Dynamic Dependency Tracking
DOThtml uses dynamic tracking to manage dependencies. If your computed logic contains branches (like `if` statements), the framework will automatically subscribe to and unsubscribe from signals as they enter or leave the execution path.

```javascript
const useA = dot.state(true);
const a = dot.state("A");
const b = dot.state("B");

// Automatically unsubscribes from 'b' when useA is true, 
// and unsubscribes from 'a' when useA is false.
const combined = dot.computed(() => useA.value ? a.value : b.value);
```

### Automatic Resource Management
When a computed signal is created inside a component's `build()` method, it is automatically registered with that component. When the component is unmounted, all its associated computed signals are disposed of to prevent memory leaks.

### Cycle Detection
The framework includes built-in protection against circular dependencies. If a computed signal depends on itself (directly or indirectly), DOThtml will throw a descriptive error instead of entering an infinite loop.

## Bindings

You can transform a signal's value for display using `bindAs`.

```javascript
const count = dot.state(5);
dot.div(count.bindAs(v => `The count is ${v}`));
```

## Reactive lists

For `dot.each`, prefer passing the list itself as a signal or use keyed lists with `dot.state(rows, "id")`:

```javascript
const worlds = dot.state([]);
dot.each(worlds, w => dot.li(w.name));

// For efficient reordering with stable keys
const items = dot.state([{ id: "a", name: "Alice" }], "id");
dot.each(items, item => dot.li(item.name));
```

For derived lists, use a **zero-arg getter** (wrapped in `dot.computed` automatically):

```javascript
dot.each(() => payload.value.worlds, w => dot.li(w.name));
```

**Avoid `bindAs` for lists** — it creates a new binding on each parent change and doesn't support keyed diffing. Reading `payload.items` through the signal proxy is a **raw array**, not a list signal — it will not update when the parent changes. See [Lists & Conditionals](./lists-and-conditionals.md) for full recipes, anti-examples, and `when` / `otherwiseWhen` usage.

## Refs

Refs are specialized reactive signals used to obtain direct access to DOM elements or component instances. See the [Refs Documentation](./refs.md) for more details.

## Reactive Props

When you pass a `Signal` or a `Binding` as a prop to a component, the component automatically subscribes to it. If the value changes, the component's `build()` function is re-called, and the component re-renders.

### Accessing Prop Values

Inside the `build()` method, props passed as signals remain as Signal objects. This allows you to pass them directly to other elements for reactive updates. However, if you need to perform logic or comparisons, you must access the current value using the `.value` property.

```javascript
class MyComponent extends DotComponent {
    build() {
        // Correct: Accessing .value for comparison
        const isVisible = this.props.hidden.value === false;
        
        return dot.div({
            class: {
                "visible": isVisible,
                "hidden": !isVisible
            }
        },
            // Correct: Passing the signal directly for reactive text
            dot.div(this.props.title)
        );
    }
}
```

> **Warning**: Comparing a Signal object directly to a value (e.g., `this.props.hidden === false`) will always return `false` because you are comparing the Signal object itself, not its value.

## Reactive Attributes

Reactivity can also be applied to element attributes. When a `Signal`, `Binding`, or **zero-arg getter** is passed as an attribute value, DOThtml automatically updates that attribute whenever the signal changes. Getters are wrapped in `dot.computed`. The same rule applies to `.attr()` and to element text (`dot.div(() => name.value)`, `.text(() => name.value)`).

```javascript
const isActive = dot.state(true);
dot.div({ class: { "active": isActive } }); // Updates class when isActive changes.
dot.input({ value: () => count.value });
```

You can also use `.bindAs()` to transform a signal's value specifically for an attribute:

```javascript
const count = dot.state(5);
dot.div({ 
    "data-count": count.bindAs(v => v * 10),
    class: { "high-count": count.bindAs(v => v > 10) }
});
```

Event handlers, style builders, and ref callbacks are not getters. `bind: () => x` throws — a getter is not writable. See [Lists & Conditionals](./lists-and-conditionals.md) for the getter recipe and error **15**.

## Reactive Styles

Reactivity in DOThtml extends to styling, allowing for high-performance, granular updates to an element's appearance without re-rendering the entire component. Reactive styling can be applied at three different levels:

### 1. Inline Reactive Styles
Pass a `Signal` or `Binding` directly to an element's fluent style builder. This is ideal for element-specific changes.

```javascript
const opacity = dot.state(1);
dot.div("I can fade")
  .style(s => s.opacity(opacity));
```

### 2. Host Reactive Variables
Use `hostStyle()` to bind a `Signal` to a CSS variable on the component's host element. This is the recommended way to handle component-specific reactive styling with maximum performance.

```javascript
hostStyle(s) {
  s.variable("local-color", this.props.color);
}
```

### 3. Global Reactive Variables
Bind a `Signal` to the global `dot.css` builder. This updates a CSS variable on the document root, making it available to every component in your application.

```javascript
const theme = dot.state("dark");
dot.css.variable("theme-mode", theme);
```

## Two-Way Binding

**Prefer `{ bind: signal }` for two-way form binding.** DOThtml supports explicit two-way binding for form elements using the `bind` attribute. This synchronizes the DOM state with a `Signal` or `Binding` in both directions.

```javascript
const name = dot.state("John");

dot.input({ bind: name }); // ✅ Typing in the input updates the signal.
dot.div("Hello, ", name);  // The div updates as you type.
```

### Supported Elements
- `<input>`: Binds to the `value` property (or `checked` for checkboxes/radios).
- `<textarea>`: Binds to the `value` property.
- `<select>`: Binds to the `value` property.

### One-Way vs. Two-Way

Using the standard `value` or `checked` attributes with a signal provides **one-way binding only** (Signal → DOM). The signal updates the DOM, but user input does **not** update the signal.

To enable **two-way binding** (Signal ↔ DOM), you must use the `bind` attribute.

```javascript
// ❌ WRONG: One-way only. User typing does NOT update mySignal.
// (Common mistake from React-style patterns.)
dot.input({ value: mySignal }); 

// ✅ Correct: Two-way. DOM and signal are kept in sync.
dot.input({ bind: mySignal }); 
```

### ❌ Wrong: Manual Two-Way Binding

**Do not** attempt to implement two-way binding manually using `.attr()` and `.on()`. This is verbose, error-prone, and not the DOThtml way:

```javascript
// WRONG: Manual "two-way" binding - do not do this!
const name = dot.state("");
dot.input({ type: "text" })
	.attr("value", name)
	.on("input", e => name.value = e.target.value); // ❌ Not recommended
```

**Always use `{ bind: signal }` instead:**

```javascript
// ✅ Correct: Use bind for two-way binding
const name = dot.state("");
dot.input({ type: "text", bind: name });
```

> **AI Agents**: When building forms, always use `bind` for inputs that should update signals. Using `value` with a signal creates one-way display-only inputs. See the [AI Agents Guide](./ai-agents.md) for more patterns.

> **Note**: `when` evaluates then-content eagerly, not lazily. `when(cond, () => dot.p("x"))` throws error **13**. See [Lists & Conditionals](./lists-and-conditionals.md) for details.
