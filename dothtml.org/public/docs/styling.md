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

DOThtml provides several ways to style components, ranging from instance-specific inline styles to shared, scoped templates.

### Inline Styles

Within a component's `build()` method, you can use the fluent `.style()` API to apply instance-specific styles. This is ideal for styles driven by props or internal state.

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

### Scoped Styles and Shadow DOM

By default, DOThtml components use **Shadow DOM** for style encapsulation. This means styles defined within a component won't leak out, and global styles won't leak in (unless explicitly allowed).

To define shared styles for all instances of a component, implement the `stylize()` method. DOThtml will automatically create a `CSSStyleSheet` (or a fallback `<style>` tag) and adopt it into the component's shadow root.

```javascript
class MyComponent extends IDotComponent {
  stylize(s) {
    return s.class("container", c => c
      .display("flex")
      .paddingPx(20)
      .backgroundColor("#f0f0f0")
    );
  }

  build() {
    return dot.div({ class: "container" }, "Hello Shadow DOM!");
  }
}
```

DOThtml automatically caches these stylesheets on the component's constructor, ensuring that the CSS is parsed only once per component type.

### Host Variable Binding

Sometimes you want a component to drive its internal styles via CSS variables on its own host element. This is highly performant as it avoids re-rendering the entire component for visual-only changes.

Use the `hostStyle()` method to bind reactive styles to the component's host element.

```javascript
class ThemeableBox extends IDotComponent {
  hostStyle(s) {
    // Bind a reactive watcher to a CSS variable on the host element.
    s.variable("box-color", this.props.color);
  }

  stylize(s) {
    return s.class("box", c => c
      .backgroundColor("var(--box-color)") // Reference the host variable.
      .paddingPx(10)
    );
  }

  build() {
    return dot.div({ class: "box" }, "I am themed via host variables!");
  }
}
```

## Global Styles

While Shadow DOM provides isolation, you often need global styles (like resets or utility frameworks) to be available inside your components.

Use `dot.useGlobalStyles()` to register styles that should be adopted by every component's shadow root.

```javascript
// Register a CSS string or a CSSStyleSheet object.
dot.useGlobalStyles(`
  :host { font-family: sans-serif; }
  * { box-sizing: border-box; }
`);
```

These global styles are automatically added to the `adoptedStyleSheets` of every component created after the registration.

## Performance and Caching

DOThtml's styling system is built for performance:

- **Constructable Stylesheets**: Uses `CSSStyleSheet` and `adoptedStyleSheets` where supported for ultra-fast style sharing.
- **Deduplication**: `CSSStyleSheet` instances are cached based on their content. If multiple components or global registrations use the same CSS string, they will share the same underlying stylesheet object.
- **Component Caching**: Component-level styles (from `stylize()`) are cached on the component's constructor, so they are only generated once.
- **Reactive Batching**: Style updates via `Watchers` are batched by the scheduler to prevent layout thrashing.

## Testing Styling

When testing styling in environments like JSDOM, you may need to ensure that reactive updates are processed before making assertions.

By default, DOThtml batches updates asynchronously. In your tests, you can use `dot.flushSync()` to force all pending updates to be applied immediately.

```javascript
test("reactive style update", () => {
  const color = dot.watch("red");
  dot(document.body).div().style(s => s.color(color));

  color.value = "blue";
  
  // Force the style update to apply synchronously.
  dot.flushSync();

  expect(document.querySelector("div").style.color).toBe("blue");
});
```

If you want all updates in a test suite to be synchronous by default, you can use `dot.setSync(true)`.

```javascript
beforeEach(() => {
  dot.setSync(true);
});

afterEach(() => {
  dot.setSync(false);
});
```
