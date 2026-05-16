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
                .border("1px solid black")
            );
    }
}
```

For more advanced styling options, including reactive styles and CSS variables, see the [Styling](./styling.md) documentation.
