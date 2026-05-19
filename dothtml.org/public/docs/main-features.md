# Main Features & Overview

DOThtml is a lightweight, reactive UI engine designed for both simple drop-in widgets and full-scale web applications. This page provides a high-level overview of the framework's core capabilities.

## A Library, Not a Framework
Unlike other tools that demand you build your entire app around them, DOThtml is designed to be dropped into **any** project. 

*   **Zero Core Dependencies**: A ~18kb footprint that won't bloat your project.
*   **Architectural Freedom**: Use it for your entire UI, or just for a single complex widget in a legacy app.
*   **Shadow DOM Native**: Built-in encapsulation ensures your components work perfectly regardless of the host environment.

## Core Capabilities

### [Component-Based Architecture](./components.md)
Build complex UIs from small, reusable, and encapsulated pieces. DOThtml components support props, validation, and lifecycle hooks.

### [Reactivity & Signals](./reactivity.md)
DOThtml uses a powerful, low-salt reactivity system based on **Signals**. Data-driven updates happen automatically and efficiently without a virtual DOM.

### [State Management with Stores](./stores.md)
For larger applications, DOThtml provides a built-in state management solution called **Stores**. Stores are centralized containers for state, logic, and mutations.

### [Fluent & Reactive Styling](./styling.md)
A type-safe, batched styling system that integrates directly with reactivity. Apply styles using a fluent API that supports CSS variables and media queries.

### [Popup Window Management](./popups.md)
DOThtml provides a unique "Multi-Window Orchestration Layer," allowing you to manage popup windows as seamless extensions of your main app with shared state and inherited styles.

### [Performance & Advanced Features](./detailed-features.md)
DOThtml features an intelligent update scheduler, keyed diffing, and concurrent rendering to ensure maximum responsiveness even in complex applications.

## Next Steps

Now that you have an overview of what DOThtml can do, we recommend diving into the **[Components](./components.md)** guide to start building your first UI.
