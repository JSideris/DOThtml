# Components

Components are the building blocks of DOThtml applications. They are defined as classes that implement the `IDotComponent` interface.

## Basic Structure

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

## Component Styling

DOThtml components use **Shadow DOM** by default, providing strong encapsulation for both structure and style.

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

```javascript
class MyComponent {
    stylize(s) {
        return s.class("header", c => c
            .fontSizePx(24)
            .color("blue")
        );
    }

    build(dot) {
        return dot.div({ class: "header" }, "Scoped Header");
    }
}
```

### Host Styling (`hostStyle`)

The `hostStyle()` method allows you to apply styles or bind reactive variables directly to the component's host element (the custom element itself).

```javascript
class ThemeableComponent {
    hostStyle(s) {
        s.variable("theme-color", this.props.color);
        s.display("block");
    }

    stylize(s) {
        return s.class("content", c => c
            .border(`2px solid var(--theme-color)`)
        );
    }

    build(dot) {
        return dot.div({ class: "content" }, "Themed Content");
    }
}
```

For more advanced styling options, including global styles and performance optimizations, see the [Styling](./styling.md) documentation.
