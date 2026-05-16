### A Library, Not a Framework
Unlike other tools that demand you build your entire app around them, DOThtml is designed to be dropped into **any** project. 

*   **Zero Core Dependencies**: A ~20kb footprint that won't bloat your project.
*   **Architectural Freedom**: Use it for your entire UI, or just for a single complex widget in a legacy app.
*   **Shadow DOM Native**: Built-in encapsulation ensures your components work perfectly regardless of the host environment.

### A Full-Scale Framework
While it excels as a drop-in library, DOThtml is also a powerful, full-featured framework for building entire web applications from scratch.

*   **Component-Based**: Build complex UIs from small, reusable pieces.
*   **Reactive State**: Data-driven updates that just work.
*   **Strongly Typed**: Built with TypeScript for maximum developer productivity.
*   **Built-in Routing**: Everything you need for a modern SPA.
*   **Update Batching**: High-performance rendering that groups multiple state changes into a single DOM update cycle.
*   **Computed State**: Automatically derive values from other reactive sources.
*   **Reactive Props**: Components that automatically re-render when their inputs change.

### Advanced Reactivity: Computed State & Reactive Props
DOThtml's reactivity system goes beyond simple value tracking, offering powerful tools for managing complex state dependencies.

*   **Computed Watchers**: Create watchers that automatically derive their value from other watchers. They track their own dependencies and only re-evaluate when necessary.
*   **Automatic Resource Management**: Derived state created within components is automatically disposed of when the component is unmounted, ensuring zero memory leaks.
*   **Reactive Prop Flow**: Components automatically re-render when a parent passes a reactive prop (Watcher or Binding) that changes. This ensures that your UI always stays in sync with your data model without manual event listeners.
*   **Runtime Prop Validation**: Define clear contracts for your components using static prop schemas. DOThtml validates types, required fields, and applies default values at runtime, helping you catch bugs early.

### Component Prop Validation
DOThtml allows you to define a contract for your components using a static `props` schema. This provides runtime safety and automatic default values.

```javascript
class MyComponent implements IDotComponent {
    static props = {
        title: { type: String, required: true },
        count: { type: Number, default: 0 },
        tags: { type: Array, default: () => ["new"] },
        onAction: { type: Function }
    };

    build() {
        return dot.h1(this.props.title)
                  .p(`Count: ${this.props.count}`);
    }
}
```

When a parent passes a `Watcher` or `Binding` as a prop, DOThtml automatically unwraps the value for validation and re-validates whenever the reactive value changes.

### Advanced Event Handling
DOThtml provides a modern event system inspired by leading frameworks, offering both consistency and convenience.

*   **Synthetic Events**: All event handlers receive a `SyntheticEvent` object, ensuring consistent behavior across different browsers.
*   **Event Modifiers**: Use dot-notation to apply common event patterns fluently:
    *   `.stop`: Calls `event.stopPropagation()`.
    *   `.prevent`: Calls `event.preventDefault()`.
    *   `.once`: Ensures the event handler only runs once.
    *   `.self`: Only triggers if the event was dispatched by the element itself, not a child.
*   **Event Delegation**: For maximum performance, DOThtml uses a single event listener at the document root for each event type. This reduces memory overhead and improves performance when rendering large lists of interactive elements.
*   **Custom Component Events**: Components can emit custom events that parents can listen to using declarative attributes or fluent syntax.

Example:
```javascript
// Inside a component
this.emit("myEvent", { data: 123 });

// Parent listening via mount
dot.mount(new MyComponent(), { 
    onMyEvent: (e) => console.log(e.detail.data) 
});

// Parent listening via fluent API
dot.mount(new MyComponent()).on("myEvent", (e) => ...);
```

Example of modifiers:
```javascript
dot.button({ 
    "onClick.stop.prevent": (e) => console.log("Clicked!") 
}, "Click Me")
```

### Performance: Update Batching, Keyed Diffing & Concurrent Rendering
DOThtml features an intelligent update scheduler, a sophisticated keyed diffing algorithm, and concurrent rendering capabilities to ensure maximum performance and responsiveness.

#### Update Batching
Multiple state changes are grouped into a single DOM update cycle. When you update multiple `Watcher` values in a single function or task, DOThtml enqueues the updates and flushes them all at once in the next microtask. This significantly reduces layout thrashing and improves responsiveness.

#### Keyed Diffing
When rendering lists using `dot.each`, DOThtml uses keyed diffing to track items. By providing a `key` property in your data, DOThtml can:
*   **Reuse DOM Nodes**: Instead of re-rendering an entire item, DOThtml reuses the existing DOM nodes and only updates the content that changed.
*   **Efficient Reordering**: If items in your list move, DOThtml moves the corresponding DOM nodes using `insertBefore` instead of unrendering and re-rendering them.
*   **Minimal DOM Operations**: The reconciliation algorithm ensures that the minimum number of DOM operations are performed to reach the desired state.

#### Concurrent Rendering
For large updates (like rendering long lists), DOThtml uses concurrent rendering to keep the UI responsive. It breaks down large rendering tasks into small chunks and yields control back to the browser every 5ms. This allows the browser to process high-priority events like typing or clicks even while a large update is in progress.

You can also specify the priority of an update using the `setValue` method:

```javascript
import { Priority } from "dothtml";

const list = dot.watch([]);
// This update will be treated as low priority and will yield to user input.
list.setValue(largeDataSet, Priority.Background);
```

If you need to force an immediate update (for example, to measure an element's size after a state change), you can use `dot.flushSync()`:

```javascript
const name = dot.watch("Josh");
dot.div(name);

name.value = "Joshua";
// DOM is not updated yet.
dot.flushSync();
// DOM is now updated.
```
