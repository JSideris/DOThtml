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

## Refs

Refs are specialized reactive signals used to obtain direct access to DOM elements or component instances. See the [Refs Documentation](./refs.md) for more details.

## Reactive Props

When you pass a `Signal` or a `Binding` as a prop to a component, the component automatically subscribes to it. If the value changes, the component's `build()` function is re-called, and the component re-renders.

```javascript
class MyComponent extends IDotComponent {
    build() {
        return dot.div(this.props.title);
    }
}

const title = dot.state("Initial Title");
dot.mount(new MyComponent(), { title: title });

title.value = "New Title"; // MyComponent re-renders automatically.
```

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

## Next Steps

Now that you understand reactivity, see some real-world **[Use Cases](./use-cases.md)** for DOThtml.
