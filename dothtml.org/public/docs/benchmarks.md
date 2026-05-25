# Benchmarks (v6.3.1)

Performance in web frameworks is rarely about a single number; it is a reflection of architectural priorities and trade-offs. The following benchmarks compare DOThtml's runtime-driven reactivity against the industry's leading frameworks.

## Performance Comparison

The following benchmarks measure the median time (in milliseconds) required to perform common DOM operations across 1,000 and 10,000 rows.

| Test | DOThtml | React | Vue | Svelte |
| :--- | :--- | :--- | :--- | :--- |
| **Create 1,000 rows** | 6.93 ms | 6.69 ms | 6.14 ms | **5.93 ms** |
| **Create 10,000 rows** | 721.85 ms | 624.95 ms | 473.35 ms | **465.85 ms** |
| **Append 1,000 rows** | **7.64 ms** | 70.08 ms | 51.99 ms | 50.07 ms |
| **Update every 10th row** | **0.14 ms** | **0.14 ms** | **0.14 ms** | 0.15 ms |
| **Swap Rows** | **0.14 ms** | **0.14 ms** | **0.14 ms** | **0.14 ms** |
| **Clear** | **1.45 ms** | **1.45 ms** | **1.45 ms** | 1.46 ms |
| **Bulk Style Update** | **0.15 ms** | 0.31 ms | 0.21 ms | 0.21 ms |
| **First Contentful Paint** | **28.00 ms** | **28.00 ms** | **28.00 ms** | **28.00 ms** |
| **DOM Interactive** | 4.75 ms | 4.70 ms | **4.65 ms** | 4.80 ms |
| **Framework Ready** | 14.35 ms | 6.35 ms | 7.85 ms | **5.60 ms** |

*Benchmarks run using Playwright on a standardized data set. DOThtml was tested in synchronous mode for a direct comparison with other frameworks' default rendering behavior. Styling benchmarks measure the time to update 3 properties (color, scale, rotation) across 1,000 elements simultaneously.*

## Bundle Size (Minified + Brotli)

DOThtml is designed to be lightweight, ensuring fast load times and minimal resource consumption.

- **DOThtml**: **23.6 kB**
- **React + ReactDOM**: ~42 kB
- **Vue**: ~33 kB
- **Svelte**: ~2 kB (runtime only, grows with component count)

## Interpreting the Results

Benchmarks reveal that DOThtml's "magic" — its fluent runtime builder and granular reactivity — comes with a performance trade-off. 

### Cold Start and Initialization

In the **Cold Start** metrics, you'll notice that DOThtml has a higher **Framework Ready** time than its competitors. This is because DOThtml is a runtime-heavy framework; it performs significant work during initialization to set up its fluent API, register custom elements, and prepare the granular reactivity system.

However, notice that **First Contentful Paint (FCP)** remains highly competitive. This is because DOThtml's initialization work often fits within the browser's natural idle windows during the loading process. Users see the page at the same time, even if the framework takes a few extra milliseconds to become fully "ready" behind the scenes.

### Runtime Performance

In bulk creation (10,000 rows), DOThtml is slower than compiler-based frameworks like Svelte or Vue. This is because DOThtml constructs a full Virtual DOM tree of objects at runtime before touching the real DOM. 

However, once the DOM is created, DOThtml's granular reactivity excels. In scenarios like appending rows or updating styles, DOThtml often matches or exceeds other frameworks because it bypasses the expensive tree-diffing process entirely, updating only the specific nodes bound to a Signal.

## Framework Philosophy

Every framework is designed with a specific set of values. Understanding these priorities helps in choosing the right tool for the task.

| Category | DOThtml | Svelte | React | Vue |
| :--- | :--- | :--- | :--- | :--- |
| **Philosophy** | **Reactivity Magic**. Values a fluent, code-first API and granular reactivity over raw creation speed. | **Zero-Runtime Compiler**. Shifts work to the build step for minimal overhead. | **Functional UI**. Prioritizes a predictable, functional model (UI as a function of state). | **Balanced & Progressive**. Aims for a middle ground between functional and performance-optimized. |
| **Reactivity** | Granular Signals. Updates only what changes, bypassing tree diffs. | Compiled-in. The compiler knows exactly what to update at build time. | Top-down VDOM. Re-renders components and diffs the tree. | Proxy-based VDOM. Tracks dependencies for component-level re-renders. |
| **Bundle & Runtime** | **23.6 kB Runtime**. A fixed-size engine that manages all components and reactivity. | **~2 kB (Compiled)**. Minimal initial overhead, though code grows with component count. | **~42 kB Runtime**. A robust engine supporting a vast ecosystem and complex state. | **~33 kB Runtime**. A feature-rich engine balancing power and footprint. |
| **Focus** | **Updates & Styling**. Optimized for the lifecycle of an app, not just the first render. | **Initial Render & Size**. Optimized for fast startup and minimal bundle overhead. | **Predictability**. Optimized for developer experience and large-scale state management. | **Ease of Use**. Optimized for a balance of speed and a gentle learning curve. |

### Framework Characteristics

- **DOThtml**: Focuses on a "no-build" friendly, fluent API where the runtime handles reactivity via direct Signal-to-Node bindings, excelling in long-lived sessions with frequent updates.
- **Svelte**: Acts as a build-time tool that disappears in the browser, providing the fastest possible initial load and raw execution speed for smaller to medium-sized applications.
- **React**: Provides a highly predictable functional programming model that scales well for massive teams, relying on a Virtual DOM to manage complex UI states.
- **Vue**: Offers a flexible, approachable architecture that combines the best of template-based optimization with a powerful reactive data model.


## Methodology

The benchmarks were conducted using a custom Playwright-based runner. Each test was repeated 20 times, and the median duration was recorded. The duration measures the time from the initial click event to the completion of the next paint cycle.

To ensure high accuracy and eliminate environmental noise:
- **In-Browser Timing**: Timing is performed entirely within the browser using `performance.mark()` and `performance.measure()`, excluding any overhead from Playwright's automation layer.
- **Batching**: For sub-millisecond operations (like swapping rows or updating styles), the benchmark triggers the operation multiple times (up to 100x) in a single synchronous loop. The total time is then divided by the batch size to provide a high-resolution average that bypasses the browser's frame-rate floor.
- **Paint Detection**: We wait for the browser to actually paint the changes to the screen using a combination of `requestAnimationFrame` and `setTimeout(..., 0)` before stopping the timer.

### Running Benchmarks Locally

You can run these benchmarks yourself to verify the results. The source code is available on our [GitHub repository](https://github.com/JSideris/DOThtml).

To run the benchmarks:

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Run the benchmark script: `npm run benchmarks`.

This will build the latest version of DOThtml and execute the benchmark suite across all supported frameworks.

