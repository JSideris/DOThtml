# Error Handling

DOThtml provides a robust, light-weight system for catching and handling errors within your application. This prevents a single failing component from crashing the entire UI (often called "white-screening") and allows you to provide a graceful fallback experience for your users.

## Error Boundaries

An **Error Boundary** is a component that catches JavaScript errors anywhere in its child component tree, logs those errors, and displays a fallback UI instead of the component tree that crashed.

To create an error boundary, simply implement the `errorCaught(error)` lifecycle hook in your component.

### The `errorCaught` Hook

When a child component throws an error during building, mounting, or a reactive update, DOThtml will bubble that error up the component tree until it finds a component with an `errorCaught` hook.

```javascript
import { dot, DotComponent } from "dothtml";

@dot.component
class MyErrorBoundary extends DotComponent {
    private hasError = dot.state(false);

    errorCaught(error) {
        console.error("Caught an error:", error);
        this.hasError.value = true;
        
        // Return a fallback UI to be rendered inside this component's shadow root.
        return dot.div({ class: "error-fallback" },
            dot.h2("Something went wrong."),
            dot.p(error.message),
            dot.button({ onClick: () => this.hasError.value = false }, "Try Again")
        );
    }

    build(dot) {
        return dot.div(
            dot.when(!this.hasError, 
                dot.slot() // Render children normally if no error
            )
        );
    }
}
```

### Key Features of Error Boundaries:
*   **Bubbling**: Errors automatically bubble up the component tree until caught.
*   **Shadow DOM Isolation**: The fallback UI returned by `errorCaught` replaces the entire internal content of the boundary component's shadow root.
*   **Reactive Recovery**: You can use reactive state (like `hasError` in the example above) to allow users to "reset" the boundary and try rendering the children again.

## Global Error Handling

For errors that aren't caught by any component-level error boundary, or for general error logging, you can use the global `dot.onError` handler.

```javascript
import { dot } from "dothtml";

dot.onError = (error) => {
    console.error("Global DOThtml Error:", error);
    // Send error to a service like Sentry or LogRocket
    myAnalyticsService.logError(error);
};
```

## Scheduler Resilience

One of the most powerful aspects of DOThtml's error handling is built directly into the **Update Scheduler**. 

When a reactive signal changes and triggers an automated update, the scheduler wraps the update process in a `try-catch` block. If an update fails:
1.  The error is passed to the nearest `errorCaught` boundary.
2.  If no boundary exists, it is passed to the global `dot.onError` handler.
3.  **Crucially**, the scheduler continues to process other pending updates. 

This ensures that a bug in one part of your dashboard won't stop the rest of your application from remaining interactive and up-to-date.

## Best Practices

1.  **Use Granular Boundaries**: Wrap major UI sections (like a sidebar, a main content area, or individual widgets) in their own error boundaries. This localizes crashes.
2.  **Always Log**: Even if you show a fallback UI, always log the error to the console or an external service so you can fix the underlying issue.
3.  **Provide a Reset**: When possible, give users a way to recover from the error (e.g., a "Reload Widget" button) by resetting the state that triggered the boundary.

## Development Error Overlay

To further enhance the development experience, DOThtml includes an implicit **Development Error Overlay** (often called a "Red Box").

In development mode (`IS_DEV`), if a component's `build()` method or any of its lifecycle hooks throw an error, and that component is not already wrapped in an explicit `errorCaught` boundary, DOThtml will automatically render a beautiful, informative error overlay directly into the component's Shadow DOM.

### Features of the Dev Overlay:

- **Instant Feedback**: See exactly what went wrong without checking the console.
- **Stack Traces**: The overlay includes a full stack trace to help you pinpoint the error in your source code.
- **HMR Recovery**: When you fix the error in your editor and save, the Hot Module Replacement system will automatically clear the overlay and restore the component's UI, preserving its state where possible.

This system ensures that a small syntax error or logic bug during development doesn't break your entire application or force a full page refresh.
