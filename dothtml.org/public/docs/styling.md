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

### Nested Style Objects

For complex properties like `filter` and `transform`, you can pass a plain object to the builder. DOThtml will automatically convert it into the correct CSS function syntax.

```javascript
dot.div("Filtered Content")
  .style(s => s.filter({ blur: "5px", brightness: 0.8 }));
  // Renders: filter: blur(5px) brightness(0.8);
```

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

In your CSS, you can then reference this variable using the `.v()` helper:

```javascript
stylize(s) {
  return s.class("themed-content", c => c
    .border(`2px solid ${s.v("accent-color")}`)
  );
}
```

### The `s.v()` Shortcut

The `.v()` method is a convenient shortcut for referencing CSS variables within any style builder. It automatically handles the `--` prefix if it's missing.

*   **Usage**: `s.v("my-var")` returns `"var(--my-var)"`.
*   **Usage**: `s.v("--my-var")` returns `"var(--my-var)"`.

This makes your style definitions cleaner and less error-prone.

## Global Reactive Variables

DOThtml provides a global `dot.css` builder that is automatically bound to the document root (`<html>`). This is the recommended way to handle application-wide theming.

```javascript
// In your app initialization
const themeColor = dot.watch("blue");
dot.css.variable("primary", themeColor);

// Any component can now use this global variable
class MyComponent extends IDotComponent {
  stylize(s) {
    return s.class("title", t => t.color(s.v("primary")));
  }
}
```

When `themeColor.value` changes, the CSS variable on the document root is updated, and every component using `var(--primary)` will instantly reflect the change without any JavaScript re-renders.

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

> **Performance Note**: The `stylize()` method is intended for **static** styles. To prevent performance pitfalls, DOThtml will throw an error if you try to pass a `Watcher` or `Binding` directly into a `stylize()` block. Instead, use `hostStyle()` or `dot.css` to bind reactive data to CSS variables, and reference those variables in `stylize()` using `s.v()`.

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

### Dynamic Global Selectors

While `dot.css` targets the document root, you can create style nodes that target any CSS selector and update them reactively.

```javascript
import StyleVNode from "dothtml/v-meta-nodes/style-v-node";

const color = dot.watch("red");
const globalStyle = new StyleVNode(dot.css.color(color));
globalStyle.render(".my-dynamic-class"); 

// Later...
color.value = "blue"; // Updates the <style> tag targeting .my-dynamic-class
```

## Performance and Caching

DOThtml's styling system is built for performance:

- **Constructable Stylesheets**: Uses `CSSStyleSheet` and `adoptedStyleSheets` where supported for ultra-fast style sharing.
- **Deduplication**: `CSSStyleSheet` instances are cached based on their content. If multiple components or global registrations use the same CSS string, they will share the same underlying stylesheet object.
- **Component Caching**: Component-level styles (from `stylize()`) are cached on the component's constructor, so they are only generated once.
- **Reactive Batching**: Style updates via `Watchers` are batched by the scheduler to prevent layout thrashing.

## Server-Side Rendering (SSR)

DOThtml's styling system is fully compatible with SSR. You can convert any style builder or style node to a CSS string.

```javascript
const styles = dot.css.color("red").paddingPx(10);
console.log(styles.toString()); // "color: red; padding: 10px;"
```

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

## Legacy Compatibility

For users migrating from older versions of DOThtml, the `dot.useStyles()` method is still available as a bridge to the modern system. It allows you to register global styles using the familiar v5 syntax.

```javascript
dot.useStyles(`
  body { background: #eee; }
`);
```

While functional, we recommend moving to `dot.useGlobalStyles()` or the `dot.css` builder for better integration with the v6 reactivity and Shadow DOM systems.

If you want all updates in a test suite to be synchronous by default, you can use `dot.setSync(true)`.

```javascript
beforeEach(() => {
  dot.setSync(true);
});

afterEach(() => {
  dot.setSync(false);
});
```
