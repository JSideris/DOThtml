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
- `default`: The value to use if the prop is not provided.

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
