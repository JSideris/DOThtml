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

### Advanced Event Handling
DOThtml provides a modern event system inspired by leading frameworks, offering both consistency and convenience.

*   **Synthetic Events**: All event handlers receive a `SyntheticEvent` object, ensuring consistent behavior across different browsers.
*   **Event Modifiers**: Use dot-notation to apply common event patterns fluently:
    *   `.stop`: Calls `event.stopPropagation()`.
    *   `.prevent`: Calls `event.preventDefault()`.
    *   `.once`: Ensures the event handler only runs once.
    *   `.self`: Only triggers if the event was dispatched by the element itself, not a child.
*   **Event Delegation**: For maximum performance, DOThtml uses a single event listener at the document root for each event type. This reduces memory overhead and improves performance when rendering large lists of interactive elements.

Example:
```javascript
dot.button({ 
    "onClick.stop.prevent": (e) => console.log("Clicked!") 
}, "Click Me")
```
