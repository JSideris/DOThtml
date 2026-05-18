# Components

Components are the building blocks of DOThtml applications. They are defined as classes that encapsulate structure, style, and logic.

## Defining Components

There are two main ways to define components in DOThtml.

### 1. The Primary Pattern (Recommended)

For most applications, especially those using TypeScript, the preferred way to define a component is by using the `@dot.component` decorator and extending the `DotComponent` base class. This provides the best developer experience, including full type safety and automatic reactivity tracking.

```typescript
import { dot, DotComponent } from "dothtml";

interface MyProps {
    name: string;
}

@dot.component
class MyComponent extends DotComponent<MyProps> {
    build(dot) {
        return dot.div(`Hello, ${this.props.name}!`);
    }
}

// Instantiate using the 'new' keyword
dot(document.body).mount(new MyComponent({ name: "World" }));
```

**Why use this pattern?**
*   **Type Safety**: The `DotComponent` base class allows you to type your `props` and `refs`.
*   **Reactivity Tracking**: The decorator ensures that any reactive signals created in the constructor are properly disposed of when the component is unmounted.
*   **Clean Syntax**: It feels like standard class-based development.

### 2. The Niche Pattern (Interface-only)

If you need complete separation between implementation and interfaces (e.g., for complex Dependency Injection scenarios) or prefer to avoid decorators, you can implement the `IDotComponent` interface directly.

```typescript
import { dot, IDotComponent, IDotCore } from "dothtml";

class MyComponent implements IDotComponent {
    constructor(public props: { name: string }) {}

    build(dot: IDotCore) {
        return dot.div(`Hello, ${this.props.name}!`);
    }
}

// Instantiate using dot.create to ensure reactivity tracking
dot(document.body).mount(dot.create(MyComponent, { name: "World" }));
```

**Note**: When using this pattern, you **must** use `dot.create` to instantiate the component if you use any reactive signals in the constructor. Using `new` directly on an undecorated class will result in "orphaned" signals that cause memory leaks.

## Basic Structure (JavaScript)

In plain JavaScript, where decorators might not be available, you can define components as simple classes.

```javascript
class MyComponent {
    build(dot) {
        return dot.div("Hello World");
    }
}
```

## Props and Validation

Components receive data through props. You can define a static `props` schema to enable runtime validation and default values.

```javascript
class UserProfile {
    static props = {
        username: { type: String, required: true },
        age: { type: Number, default: 18 }
    };

    build(dot) {
        return dot.div(
            dot.h2(this.props.username),
            dot.p(`Age: ${this.props.age}`)
        );
    }
}
```

### Validation Rules
- `type`: One of `String`, `Number`, `Boolean`, `Object`, `Array`.
- `required`: Boolean. Throws an error if the prop is missing.
- `default`: The value to use if the prop is not provided. Can be a value or a factory function (e.g., `default: () => []`).
- `validator`: A custom function that returns `true` if the value is valid.

When a parent passes a `Signal` or `Binding` as a prop, DOThtml automatically unwraps the value for validation and re-validates whenever the reactive value changes.

```javascript
static props = {
    score: { 
        type: Number, 
        validator: (v) => v >= 0 && v <= 100 
    },
    tags: { 
        type: Array, 
        default: () => ["new"] 
    }
};
```

> **Note**: Validation errors include the component name (e.g., `[UserProfile] Prop "username" is required`) for easier debugging.

## Lifecycle Hooks

- `mounting()`: Called before the component is added to the DOM.
- `mounted()`: Called after the component is added to the DOM.
- `built()`: Called every time the `build()` function completes (including re-renders).
- `unmounting()`: Called before the component is removed from the DOM.
- `unmounted()`: Called after the component is removed from the DOM.

## Custom Events

Components can emit events that parents can listen to.

```javascript
class MyButton {
    build(dot) {
        return dot.button({ 
            onClick: () => this.emit("customClick", { time: Date.now() }) 
        }, "Click Me");
    }
}
```

## Advanced Event Handling

DOThtml provides a modern event system inspired by leading frameworks, offering both consistency and convenience.

*   **Synthetic Events**: All event handlers receive a `SyntheticEvent` object, ensuring consistent behavior across different browsers.
*   **Event Modifiers**: Use dot-notation to apply common event patterns fluently:
    *   `.stop`: Calls `event.stopPropagation()`.
    *   `.prevent`: Calls `event.preventDefault()`.
    *   `.once`: Ensures the event handler only runs once.
    *   `.self`: Only triggers if the event was dispatched by the element itself, not a child.
*   **Event Delegation**: For maximum performance, DOThtml uses a single event listener at the document root for each event type. This reduces memory overhead and improves performance when rendering large lists of interactive elements.
*   **Custom Component Events**: Components can emit custom events that parents can listen to using declarative attributes or fluent syntax.

## Component Styling

DOThtml components use **Shadow DOM** by default, providing strong encapsulation for both structure and style. This isolation ensures that styles defined inside a component don't leak out, and global styles don't accidentally break your component's internal layout.

> **Note**: While Shadow DOM provides strong encapsulation, DOThtml's routing system is designed to work across these boundaries. Standard features like **anchor links** and **hash navigation** work seamlessly even when the target elements are defined inside components.

### Instance Styles

You can apply styles to elements within your component's `build()` method using the fluent `.style()` API. This is ideal for instance-specific styling driven by props or internal state.

```javascript
class StyledBox {
    static props = {
        color: { type: String, default: "gray" }
    };

    build(dot) {
        return dot.div("I am a styled box")
            .style(s => s
                .backgroundColor(this.props.color)
                .paddingPx(10)
            );
    }
}
```

### Component Templates (`stylize`)

To define styles that are shared across all instances of a component, use the `stylize()` method. These styles are scoped to the component's shadow root.

**Note**: Unlike many other frameworks, `stylize()` in DOThtml is **fully reactive**. You can pass Signals and Bindings directly into the builder, and DOThtml will automatically optimize them into high-performance CSS variables behind the scenes.

```javascript
class MyComponent {
    stylize(s) {
        return s.class("header", c => c
            .fontSizePx(24)
            .color(theme.primary) // Automatically reactive!
        );
    }

    build(dot) {
        return dot.div({ class: "header" }, "Scoped Header");
    }
}
```

### Host Styling (`hostStyle`)

The `hostStyle()` method allows you to apply styles or bind reactive variables directly to the component's host element (the custom element itself). 

While `stylize()` is now reactive, `hostStyle()` remains useful for:
1.  **Layout Control**: Setting `display: block` or `grid` on the custom element itself.
2.  **Manual Variable Control**: When you want to explicitly name a variable for external use.

```javascript
class ThemeableComponent {
    hostStyle(s) {
        // Explicitly bind a variable to the host element.
        s.variable("theme-color", this.props.color);
        s.display("block");
    }

    stylize(s) {
        return s.class("content", c => c
            // Reference the host variable using the .v() helper.
            .border(`2px solid ${s.v("theme-color")}`)
        );
    }
    build(dot) {
        return dot.div({ class: "content" }, "Themed Content");
    }
}
```

By using `hostStyle` to update a CSS variable, you avoid re-calling the `build()` method for purely visual changes, leading to much better performance in complex applications.

## Next Steps

Now that you've learned about components, see how to make them interactive with **[Reactivity](./reactivity.md)**.
