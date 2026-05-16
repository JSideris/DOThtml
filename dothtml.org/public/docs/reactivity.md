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
