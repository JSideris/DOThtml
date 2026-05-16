# Styling in DOThtml

DOThtml provides a powerful, fluent, and reactive styling system that leverages the browser's native performance while providing a low-friction developer experience.

## Fluent Style Builder

Instead of using string-based styles or plain object literals, DOThtml uses a fluent builder pattern. This provides type safety, IDE autocompletion, and automatic unit formatting.

You can apply styles to any element using the `.style()` method.

```javascript
dot.div("Hello World")
  .style(s => s
    .color("red")
    .fontWeight("bold")
    .fontSizePx(20) // Automatically appends 'px'
  );
```

### Automatic Unit Formatting

DOThtml automatically generates methods for common CSS units, so you don't have to manually concatenate strings.

- **Lengths**: `.widthPx(100)`, `.heightRem(2)`, `.paddingTopP(10)` (P for percent).
- **Time**: `.animationDurationMs(500)`, `.transitionDelayS(1)`.
- **Angles**: `.rotateDeg(45)`, `.skewRad(0.1)`.

## Reactive Styling

The styling system is fully integrated with DOThtml's reactivity system. You can pass `Watcher` or `Binding` objects directly to any style method.

```javascript
const size = dot.watch(20);
const color = dot.watch("blue");

dot.div("I am reactive!")
  .style(s => s
    .fontSizePx(size)
    .color(color)
  );

// Later...
size.value = 40; // The font size updates automatically in the DOM.
```

### Batching and Performance

Style updates are automatically batched by the DOThtml scheduler. If you update multiple watchers that drive styles on the same element (or different elements) in a single task, DOThtml will group those changes and apply them in a single DOM update cycle, minimizing layout thrashing.

## CSS Variables (Custom Properties)

For high-performance theme updates or complex component styling, you can use CSS variables.

```javascript
dot.div("Themed Content")
  .style(s => s.variable("accent-color", "orange"));
```

In your CSS, you can then reference this variable:

```css
.themed-content {
  border: 2px solid var(--accent-color);
}
```

## Component Styling

Within a component's `build()` method, you can use the same fluent styling API to apply instance-specific styles.

```javascript
class MyButton extends IDotComponent {
  build() {
    return dot.button("Click Me")
      .style(s => s
        .backgroundColor(this.props.color)
        .borderRadiusPx(5)
      );
  }
}
```

> **Note**: For global or scoped component-level styles (using Shadow DOM), see the [Components](./components.md) documentation.
