# State Management with Stores

DOThtml Stores provide a centralized, reactive state management system designed for enterprise-scale applications. They allow you to define shared state, derived logic, and mutations in a structured way that feels like a natural extension of the DOThtml fluent API.

## Why Stores?

While `dot.state` and `dot.computed` are powerful for local component state, managing state that needs to be shared across many components can lead to "prop drilling" or manual synchronization issues. Stores solve this by providing:

- **Centralized Source of Truth**: A single place to manage related state.
- **Implicit Reactivity**: State properties are automatically converted to `Signal`s.
- **Derived Logic**: Getters are automatically converted to `Computed` signals.
- **Structured Mutations**: Actions provide a clear way to update state.
- **Singleton Management**: Easily share state globally using unique IDs.

## Basic Usage

You create a store using `dot.store()`. This function returns a "useStore" hook that you can call to access the store instance.

```javascript
const useCounterStore = dot.store({
    id: "counter", // Unique ID makes this a global singleton
    state: () => ({
        count: 0,
        name: "Main Counter"
    }),
    getters: {
        // 'state' is passed as the first argument
        doubleCount: (state) => state.count.value * 2,
        // 'this' also refers to the store instance
        status() {
            return `${this.name.value} is at ${this.count.value}`;
        }
    },
    actions: {
        increment() {
            this.count.value++;
        },
        reset() {
            this.count.value = 0;
        }
    }
});

// Usage in a component
class CounterComponent extends IDotComponent {
    counter = useCounterStore();

    build() {
        return dot.div(
            dot.h2(this.counter.name),
            dot.p(this.counter.count.bindAs(v => `Count: ${v}`)),
            dot.p(this.counter.doubleCount.bindAs(v => `Double: ${v}`)),
            dot.button("Increment").onClick(() => this.counter.increment()),
            dot.button("Reset").onClick(() => this.counter.reset())
        );
    }
}
```

## Reactivity Model

DOThtml Stores are built directly on top of the framework's core reactivity primitives:

1. **State as Signals**: Every property returned by the `state()` function is automatically wrapped in a `Signal`. You access and update them using `.value`.
2. **Getters as Computeds**: Every function in the `getters` object is converted into a `dot.computed` signal. They are lazy-evaluated and automatically track their dependencies.
3. **Bound Actions**: Actions are bound to the store instance, so `this` always points to the reactive state and other actions/getters.

## Singleton vs. Local Stores

### Global Singletons
By providing an `id` in the store options, DOThtml ensures that only one instance of that store exists. Every time you call the "useStore" hook (e.g., `useCounterStore()`), you get back the exact same instance. This is perfect for auth state, user preferences, or shared application data.

### Local Stores
If you omit the `id`, a new store instance is created every time the "useStore" hook is called. If called within a component's lifecycle, the store is automatically disposed of when the component is unmounted.

## Advanced Features

### Persistence
While not built-in by default, you can easily add persistence to your stores by subscribing to changes:

```javascript
const useSettingsStore = dot.store({
    id: "settings",
    state: () => ({
        theme: localStorage.getItem("theme") || "light"
    }),
    actions: {
        setTheme(newTheme) {
            this.theme.value = newTheme;
            localStorage.setItem("theme", newTheme);
        }
    }
});
```

### Debugging
You can access all active global stores via `dot.stores`. This is useful for debugging in the console:

```javascript
// In the browser console
console.log(dot.stores.counter.count.value);
dot.stores.counter.increment();
```

## Best Practices

1. **Keep State Flat**: Avoid deeply nested objects in `state()` if possible, as it makes reactivity easier to manage.
2. **Use Getters for Derivations**: Don't manually calculate values in your components; move that logic into store getters.
3. **Actions for Logic**: Keep your components focused on UI and move business logic into store actions.