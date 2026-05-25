# Main Features & Overview

DOThtml is a lightweight, reactive UI engine designed for both simple drop-in widgets and full-scale web applications. This page provides a high-level overview of the framework's core capabilities.

## A Library, Not a Framework
Unlike other tools that demand you build your entire app around them, DOThtml is designed to be dropped into **any** project. 

*   **Zero Core Dependencies**: A ~18kb footprint that won't bloat your project.
*   **Architectural Freedom**: Use it for your entire UI, or just for a single complex widget in a legacy app.
*   **Shadow DOM Native**: Built-in encapsulation ensures your components work perfectly regardless of the host environment.

## The DOThtml Philosophy

DOThtml is built on the idea that web development should be straightforward and, above all, **fun**.

*   **No XML-Based Markup**: Stop wrestling with angle brackets in your logic. DOThtml uses a pure, fluent JavaScript/TypeScript API that feels natural and stays out of your way.
*   **Less Salt**: We've stripped away the boilerplate and "magic" that makes other frameworks frustrating. DOThtml just works the way you expect it to.
*   **Built for Humans**: All the power of a modern component-based framework, but designed to be intuitive and blazingly fast without the complexity of a virtual DOM.

## Core Capabilities

### [Component-Based Architecture](./components.md)
Build complex UIs from small, reusable, and encapsulated pieces. DOThtml components support props, validation, and lifecycle hooks.

### [Reactivity & Signals](./reactivity.md)
DOThtml uses a powerful, low-salt reactivity system based on **Signals**. Data-driven updates happen automatically and efficiently without a virtual DOM.

### [State Management with Stores](./stores.md)
For larger applications, DOThtml provides a built-in state management solution called **Stores**. Stores are centralized containers for state, logic, and mutations.

### [Fluent & Reactive Styling](./styling.md)
A type-safe, batched styling system that integrates directly with reactivity. Apply styles using a fluent API that supports CSS variables, media queries, and **Contextual Subtree Theming**.

### [Popup Window Management](./popups.md)
DOThtml provides a unique "Multi-Window Orchestration Layer," allowing you to manage popup windows as seamless extensions of your main app with shared state and inherited styles.

### [Official CLI](./cli.md)
Start projects in seconds with the official `create-dothtml` CLI, featuring a Vite-powered development environment and built-in component generators.

### [Error Handling & Boundaries](./error-handling.md)
Prevent application-level crashes with built-in error boundaries and a resilient update scheduler that keeps your app running even when individual components fail.

### [Performance & Advanced Features](./detailed-features.md)
DOThtml features an intelligent update scheduler, keyed diffing, and concurrent rendering to ensure maximum responsiveness even in complex applications.
