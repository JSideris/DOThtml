# Reactivity in DOThtml

DOThtml provides a powerful, low-salt reactivity system based on **Watchers**.

## Watchers

A `Watcher` is a wrapper around a value that tracks its changes. You can create one using `dot.watch()`.

```javascript
const count = dot.watch(0);

dot.div(count); // Automatically updates when count changes.

count.value++; // Updates the DOM.
```

## Computed State

Computed watchers allow you to derive state from other watchers. They automatically track which watchers they depend on.

```javascript
const firstName = dot.watch("John");
const lastName = dot.watch("Doe");

const fullName = dot.computed(() => `${firstName.value} ${lastName.value}`);

dot.div(fullName); // Displays "John Doe" and updates if either name changes.
```

### Lazy Evaluation
Computed watchers are **lazy**. They only re-calculate their value when it is actually accessed (via `.value`) or when the DOM needs to update. This ensures maximum efficiency for complex derivations.

### Dynamic Dependency Tracking
DOThtml uses dynamic tracking to manage dependencies. If your computed logic contains branches (like `if` statements), the framework will automatically subscribe to and unsubscribe from watchers as they enter or leave the execution path.

```javascript
const useA = dot.watch(true);
const a = dot.watch("A");
const b = dot.watch("B");

// Automatically unsubscribes from 'b' when useA is true, 
// and unsubscribes from 'a' when useA is false.
const combined = dot.computed(() => useA.value ? a.value : b.value);
```

### Automatic Resource Management
When a computed watcher is created inside a component's `build()` method, it is automatically registered with that component. When the component is unmounted, all its associated computed watchers are disposed of to prevent memory leaks.

### Cycle Detection
The framework includes built-in protection against circular dependencies. If a computed watcher depends on itself (directly or indirectly), DOThtml will throw a descriptive error instead of entering an infinite loop.

## Bindings

You can transform a watcher's value for display using `bindAs`.

```javascript
const count = dot.watch(5);
dot.div(count.bindAs(v => `The count is ${v}`));
```

## Reactive Props

When you pass a `Watcher` or a `Binding` as a prop to a component, the component automatically subscribes to it. If the value changes, the component's `build()` function is re-called, and the component re-renders.

```javascript
class MyComponent extends IDotComponent {
    build() {
        return dot.div(this.props.title);
    }
}

const title = dot.watch("Initial Title");
dot.mount(new MyComponent(), { title: title });

title.value = "New Title"; // MyComponent re-renders automatically.
```
