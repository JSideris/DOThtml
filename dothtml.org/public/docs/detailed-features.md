# Detailed Features & Performance

DOThtml is designed for high-performance applications. This document covers the advanced features and internal mechanisms that keep your UI responsive and your codebase maintainable.

## Performance Internals

DOThtml features an intelligent update scheduler, a sophisticated keyed diffing algorithm, and concurrent rendering capabilities to ensure maximum performance and responsiveness.

### Update Batching
Multiple state changes are grouped into a single DOM update cycle. When you update multiple `Signal` values in a single function or task, DOThtml enqueues the updates and flushes them all at once in the next microtask. This significantly reduces layout thrashing and improves responsiveness.

### Keyed Diffing
When rendering lists using `dot.each`, DOThtml uses keyed diffing to track items. By providing a `key` property in your data, DOThtml can:
*   **Reuse DOM Nodes**: Instead of re-rendering an entire item, DOThtml reuses the existing DOM nodes and only updates the content that changed.
*   **Efficient Reordering**: If items in your list move, DOThtml moves the corresponding DOM nodes using `insertBefore` instead of unrendering and re-rendering them.
*   **Minimal DOM Operations**: The reconciliation algorithm ensures that the minimum number of DOM operations are performed to reach the desired state.

### Concurrent Rendering
For large updates (like rendering long lists), DOThtml uses concurrent rendering to keep the UI responsive. It breaks down large rendering tasks into small chunks and yields control back to the browser every 5ms. This allows the browser to process high-priority events like typing or clicks even while a large update is in progress.

## Advanced APIs

### Priority API
You can specify the priority of an update using the `setValue` method. This is useful for background tasks that shouldn't block user interaction.

```javascript
import { Priority } from "dothtml";

const list = dot.state([]);
// This update will be treated as low priority and will yield to user input.
list.setValue(largeDataSet, Priority.Background);
```

### Manual Flushing (`dot.flushSync`)
If you need to force an immediate update (for example, to measure an element's size after a state change), you can use `dot.flushSync()`:

```javascript
const name = dot.state("Josh");
dot.div(name);

name.value = "Joshua";
// DOM is not updated yet.
dot.flushSync();
// DOM is now updated.
```

## Other Advanced Features

- **Fluent Style Builder**: A type-safe API for building inline styles with native reactivity and automatic unit formatting.
- **CSS Variables**: Built-in support for custom properties to enable high-performance theme updates.
- **Style Batching**: Automatic grouping of style updates via the scheduler to minimize layout thrashing.
- **DI (Dependency Injection)**: Decouple your application logic from the UI for better testability and modularity.
- **[Popup Management](./popups.md)**: Manage popup windows and modals directly from your application state.
- **Polymorphic Components**: Support for components that can render as different HTML elements while preserving logic.
- **Enhanced Ref System**: Reactive references to elements and components with method proxying and keyed collections.

## Next Steps

Now that you've seen the technical details, see what makes DOThtml a hero:

[Hero Features](./hero-features.md)
