# Benchmarks

DOThtml is built for performance. By eliminating the Virtual DOM and using granular reactivity, DOThtml achieves superior rendering speeds, especially in large-scale applications.

## Performance Comparison

The following benchmarks measure the time (in milliseconds) required to perform common DOM operations across 1,000 and 10,000 rows.

| Test | DOThtml | React | Vue | Svelte |
| :--- | :--- | :--- | :--- | :--- |
| **Create 1,000 rows** | 110.80ms | 128.00ms | 100.40ms | 114.20ms |
| **Create 10,000 rows** | **661.40ms** | 1099.80ms | 678.80ms | 901.80ms |
| **Append 1,000 rows** | 101.00ms | 107.60ms | 81.40ms | 110.60ms |
| **Update every 10th row** | 47.00ms | 47.00ms | 46.20ms | 47.20ms |
| **Swap Rows** | 47.20ms | 46.80ms | 47.60ms | 47.40ms |
| **Clear** | 49.60ms | 49.60ms | 49.40ms | 49.60ms |
| **Bulk Style Update** | **52.60ms** | 57.00ms | 67.80ms | 59.20ms |

*Benchmarks run using Playwright on a standardized data set. DOThtml was tested in synchronous mode for a direct comparison with other frameworks' default rendering behavior. Styling benchmarks measure the time to update 3 properties (color, scale, rotation) across 1,000 elements simultaneously.*

## Bundle Size (Minified + Brotli)

DOThtml is designed to be lightweight, ensuring fast load times and minimal resource consumption.

- **DOThtml**: **18.65 kB**
- **React + ReactDOM**: ~42 kB
- **Vue**: ~33 kB
- **Svelte**: ~2 kB (runtime only, grows with component count)

## Why DOThtml is Faster

### No Virtual DOM
Traditional frameworks like React and Vue use a Virtual DOM to determine which parts of the UI need to change. This involves creating a tree of JavaScript objects, comparing it with a previous version, and then calculating the minimum set of changes to apply to the real DOM.

DOThtml skips this entire process. When a `Signal` changes, DOThtml knows exactly which DOM nodes are bound to that signal and updates them directly. This O(1) update mechanism eliminates the overhead of tree diffing.

### Intelligent Scheduling
DOThtml features a built-in scheduler that batches updates and supports concurrent rendering. For large updates, DOThtml can yield control back to the browser every 5ms, ensuring the UI remains responsive even during heavy rendering tasks.

### Reactive Styling
DOThtml's styling system is natively reactive. Visual-only changes (like changing a color or position) are optimized into CSS variables, bypassing the component's `build()` method entirely and leveraging the browser's high-performance styling engine.

## Methodology

The benchmarks were conducted using a custom Playwright-based runner. Each test was repeated 5 times, and the average duration was recorded. The duration measures the time from the initial click event to the completion of the next animation frame (`requestAnimationFrame`), ensuring that the browser has finished rendering the changes.

### Running Benchmarks Locally

You can run these benchmarks yourself to verify the results. The source code is available on our [GitHub repository](https://github.com/JSideris/DOThtml).

To run the benchmarks:

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Run the benchmark script: `npm run benchmarks`.

This will build the latest version of DOThtml and execute the benchmark suite across all supported frameworks.
