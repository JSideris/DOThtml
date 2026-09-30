# Styling in DOThtml

DOThtml provides a powerful, fluent, and reactive styling system that leverages the browser's native performance while providing a low-friction developer experience.

## Quick Start: Recommended Approaches

For most styling needs, DOThtml recommends these two complementary approaches:

### 1. Component Styles with `stylize()` + CSS Variables

**Use for:** Shared component styles and theming

Define reusable, scoped styles for your components using the `stylize()` method. This creates a stylesheet shared across all instances of your component:

```typescript
@dot.component
class MyComponent extends DotComponent {
	stylize(s) {
		// s is a Stylesheet Builder
		return s.class("card", b => b
			// b is a Property Builder
			.backgroundColor(s.v("card-bg"))  // Reference CSS variables with s.v()
			.paddingPx(16)
			.borderRadiusPx(8)
		);
	}
	
	build(dot) {
		return dot.div({ class: "card" }, "Hello!");
	}
}

// Instantiate with 'new'
dot(document.body).mount(new MyComponent());

// Set global theme variables
dot.css.variable("card-bg", "#f5f5f5");

// Or bind them reactively
const theme = dot.state("light");
dot.css.variable("card-bg", theme.bindAs(t => t === "light" ? "#f5f5f5" : "#1a1a1a"));
```

**Why this approach?**
- **Performance**: CSS variables update instantly without JavaScript re-renders
- **Scoped**: Styles don't leak thanks to Shadow DOM
- **Reactive**: Variables bound to signals update automatically
- **Themeable**: Components reference variables; change once, update everywhere

### 2. Inline Styles with `.style()`

**Use for:** One-off element styles and prop-driven styling

For instance-specific styling or styles driven by component props, use the fluent `.style()` method:

```typescript
@dot.component
class ColoredBox extends DotComponent {
	build(dot) {
		return dot.div("Dynamic styling")
			.style(b => b
				.backgroundColor(this.props.color)  // Prop-driven
				.paddingPx(10)
				.borderRadiusPx(4)
			);
	}
}

// Usage
dot(document.body).mount(new ColoredBox({ color: "lightblue" }));
```

**When to use inline styles:**
- Instance-specific appearance (prop-driven colors, sizes)
- One-off adjustments that don't need sharing
- Quick prototyping

**When to use `stylize()` instead:**
- Styles shared across all instances of a component
- Styles that should be themeable via CSS variables
- Complex responsive rules with media queries

---

## External Stylesheets as an On-Ramp

While `stylize()` + CSS variables is the recommended approach for DOThtml-native component styling, **importing or linking external stylesheets is a valid and supported starting path.**

### When to Use External Stylesheets

External CSS is particularly useful for:

- **Migrating existing applications**: Keep your current stylesheets while gradually adopting DOThtml components
- **Greenfield apps with existing CSS**: When your project starts with a template or CSS framework (Bootstrap, Tailwind, etc.)
- **Working around builder limitations**: For CSS features not yet supported by the style builder, such as:
  - Pseudo-selectors like `:hover`, `:focus`, `:nth-child()`
  - Multi-argument length properties (e.g., `margin: 10px 20px`)
  - `@font-face` declarations for custom fonts
  - Complex selectors and combinators

For a complete list of current builder limitations, see the [CSS limitations section](../readme.md#css) in the root readme.

### How to Use External Stylesheets

#### In an NPM/Vite Project

Import CSS files directly in your app entry point:

```javascript
// main.js or app.js
import "./styles/global.css";
import "./styles/components.css";

import { dot } from "dothtml";

// Your DOThtml app code
dot(document.body).h1("Hello!");
```

#### In an HTML File

Link stylesheets in your `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="/styles/global.css">
	<link rel="stylesheet" href="/styles/components.css">
</head>
<body>
	<script type="module" src="/src/main.js"></script>
</body>
</html>
```

#### Using Global Styles with Shadow DOM

If you need external styles to apply inside DOThtml components (which use Shadow DOM by default), register them with `dot.useGlobalStyles()`:

```javascript
import globalCss from "./styles/global.css?inline";

// Register styles to be adopted by all component shadow roots
dot.useGlobalStyles(globalCss);
```

### Preferred End State: Component Stylize + CSS Variables

As you become comfortable with DOThtml, we recommend transitioning to the component-native approach:

- Use [`stylize(s)` with the stylesheet builder](#scoped-styles-with-stylize) for shared component styles
- Use [CSS variables via `dot.css.variable()`](#using-css-variables-for-theming) for theming
- Use [inline `.style()` method](#inline-styles-with-style) for instance-specific styling

This approach provides:
- **Better scoping**: Styles are isolated within Shadow DOM
- **Performance**: CSS variables update instantly without JavaScript re-renders
- **Type safety**: IDE autocompletion and compile-time checks
- **Reactivity**: Seamless integration with DOThtml's signal system

---

For more styling techniques, see the sections below. For a complete guide on AI-friendly styling patterns, see [AI Agents](./ai-agents.md).

## The Two Types of Style Builders

To use DOThtml's styling system effectively, it's important to understand the distinction between the two types of builders provided by the API:

### 1. Property Builder (`IDotCss`)
The **Property Builder** is used to set individual CSS properties on a specific target. It provides fluent methods for every standard CSS property (e.g., `.color()`, `.paddingPx()`, `.display()`).

*   **Where it's used**:
    *   In the `.style(b => ...)` callback for any element.
    *   As the global `dot.css` object.
    *   In the second argument of a rule definition (e.g., `s.class("my-class", b => ...)`).

### 2. Stylesheet Builder (`StyleSheetBuilder`)
The **Stylesheet Builder** is used to define the structure of a stylesheet, including rules, selectors, and at-rules. It does *not* have methods for individual CSS properties itself. Instead, it provides methods to create rules, which then use a Property Builder in their callbacks.

*   **Where it's used**:
    *   As the argument in a component's `stylize(s)` method.
    *   As the argument in a component's `hostStyle(s)` method.
    *   In the callback for at-rules like `.media(condition, m => ...)`.

*   **Methods**:
    *   `.rule(selector, callback)`: Define a new CSS rule.
    *   `.class(name, callback)`: Shorthand for `.rule(".name", ...)`.
    *   `.css(content)`: Inject a raw CSS string directly into the stylesheet.
    *   `.media(condition, callback)`: Define a media query.
    *   `.keyframes(name, callback)`: Define a keyframe animation.
    *   `.container(condition, callback)`: Define a container query.
    *   `.supports(condition, callback)`: Define a feature query.

## Component Styling

DOThtml components use **Shadow DOM** by default, providing strong encapsulation for both structure and style. This isolation ensures that styles defined inside a component don't leak out, and global styles don't accidentally break your component's internal layout.

### Scoped Styles with `stylize()`

To define shared styles for all instances of a component, implement the `stylize()` method. This method receives a **Stylesheet Builder**. DOThtml will automatically create a `CSSStyleSheet` (or a fallback `<style>` tag) and adopt it into the component's shadow root.

```typescript
@dot.component
class MyComponent extends DotComponent {
	stylize(s) {
		return s.class("container", b => b
			.display("flex")
			.paddingPx(20)
			.backgroundColor("#f0f0f0")
		);
	}

	build(dot) {
		return dot.div({ class: "container" }, "Hello Shadow DOM!");
	}
}
```

> **Note**: Unlike many other frameworks, `stylize()` in DOThtml is **fully reactive**. You can pass Signals and Bindings directly into the builder, and DOThtml will automatically optimize them into high-performance CSS variables behind the scenes.

### Using CSS Variables for Theming

Components should reference CSS variables (custom properties) for themeable values. Use `s.v()` to reference variables with automatic `--` prefix handling:

```typescript
@dot.component
class ThemedCard extends DotComponent {
	stylize(s) {
		return s.class("card", b => b
			.backgroundColor(s.v("card-bg"))       // var(--card-bg)
			.color(s.v("card-text"))                // var(--card-text)
			.border(`1px solid ${s.v("card-border")}`)
			.paddingPx(16)
			.borderRadiusPx(8)
		);
	}

	build(dot) {
		return dot.div({ class: "card" }, "Themed content");
	}
}

// Set global theme variables
dot.css.variable("card-bg", "#ffffff");
dot.css.variable("card-text", "#000000");
dot.css.variable("card-border", "#e0e0e0");
```

When theme variables change, every component using them updates instantly without any JavaScript re-renders.

### Inline Styles with `.style()`

Within a component's `build()` method, you can use the fluent `.style()` API to apply instance-specific styles. This uses a **Property Builder** and is ideal for styles driven by props or internal state.

```typescript
@dot.component
class MyButton extends DotComponent {
	build(dot) {
		return dot.button("Click Me")
			.style(b => b
				.backgroundColor(this.props.color)
				.borderRadiusPx(5)
			);
	}
}
```

### Host Variable Binding with `hostStyle()`

Sometimes you want a component to drive its internal styles via CSS variables on its own host element. This is highly performant as it avoids re-rendering the entire component for visual-only changes.

Use the `hostStyle()` method to bind reactive styles to the component's host element. This method receives a **Stylesheet Builder** (pre-scoped to the `:host` rule).

```typescript
@dot.component
class ThemeableBox extends DotComponent {
	hostStyle(s) {
		// s is a Stylesheet Builder
		// Bind a reactive signal to a CSS variable on the host element.
		s.variable("box-color", this.props.color);
	}

	stylize(s) {
		return s.class("box", b => b
			.backgroundColor("var(--box-color)") // Reference the host variable.
			.paddingPx(10)
		);
	}

	build(dot) {
		return dot.div({ class: "box" }, "I am themed via host variables!");
	}
}
```

## Fluent Style Builder

Instead of using string-based styles or plain object literals, DOThtml uses a fluent **Property Builder** pattern. This provides type safety, IDE autocompletion, and automatic unit formatting.

You can apply styles to any element using the `.style()` method. When passing a raw number to a length-based property (like `width`, `height`, `padding`, etc.), DOThtml defaults the unit to `px`.

```javascript
dot.div("Hello World")
  .style(b => b
    .color("red")
    .fontWeight("bold")
    .fontSize(20) // Defaults to 'px'
  );
```

### Automatic Unit Formatting

DOThtml automatically generates methods for common CSS units, so you don't have to manually concatenate strings. **We recommend using these explicit unit methods** to ensure your code is clear and to avoid ambiguity.

- **Lengths**: `.widthPx(100)`, `.heightRem(2)`, `.paddingTopP(10)` (P for percent).
- **Time**: `.animationDurationMs(500)`, `.transitionDelayS(1)`.
- **Angles**: `.rotateDeg(45)`, `.skewRad(0.1)`.

### Hybrid and Unitless Properties

Some CSS properties are unitless or can behave as hybrids:

- **Unitless**: Properties like `opacity`, `zIndex`, `flexGrow`, and `flexShrink` accept raw numbers as-is.
- **Hybrids**: `lineHeight` is a special case. It can take a physical length (like `px`) or a unitless multiplier (recommended). 

To ensure the correct behavior for `lineHeight`, use an explicit unit method like `.lineHeightPx(24)` or pass a string for a multiplier: `.lineHeight("1.5")`.

### Technical Note on Precision

Unlike some frameworks that round values to the nearest integer, DOThtml preserves full decimal precision in numeric values. If you set a width to `10.5`, it will be rendered as `10.5px`.

### Nested Style Objects

For complex properties like `filter` and `transform`, you can pass a plain object to the builder. DOThtml will automatically convert it into the correct CSS function syntax. **This also works with reactive Signals and Bindings.**

```javascript
dot.div("Filtered Content")
  .style(b => b.filter({ blur: "5px", brightness: 0.8 }));
  // Renders: filter: blur(5px) brightness(0.8);

// Reactive usage
const scale = dot.state(1.5);
dot.div("Zooming Content")
  .style(b => b.transform({ scale: scale }));
```

## Reactive Styling

The styling system is fully integrated with DOThtml's reactivity system. You can pass `Signal` or `Binding` objects directly to any style method.

```javascript
const size = dot.state(20);
const color = dot.state("blue");

dot.div("I am reactive!")
  .style(b => b
    .fontSizePx(size)
    .color(color)
  );

// Later...
size.value = 40; // The font size updates automatically in the DOM.
```

### Ghost Variable Injection (Auto-CSS Variables)

One of DOThtml's most powerful features is **Ghost Variable Injection**. Traditionally, to make a scoped style reactive, you would have to manually define a CSS variable in one place and use it in another. DOThtml now handles this automatically.

When you use a `Signal` or `Binding` inside the `stylize()` builder, DOThtml:
1.  Generates a unique, deterministic CSS variable name (e.g., `--dh-v1`).
2.  Injects that variable into the static CSS rule.
3.  Automatically updates the variable value on every component instance whenever the signal changes.

```typescript
@dot.component
class GlowingBox extends DotComponent {
  stylize(s) {
    // s is a Stylesheet Builder
    return s.class("box", b => b
      // b is a Property Builder
      // DOThtml sees the signal and handles the CSS variable plumbing!
      .backgroundColor(theme.primary.bindAs(p => `${p}33`))
      .border(`1px solid ${theme.primary}`)
    );
  }
}
```

This provides the performance of native CSS variables with the developer experience of a reactive framework.

### Fluent Template Literals (`s.template`)

When you need to combine static CSS strings with reactive values (like in a `linear-gradient` or `rgba` function), use the `s.template` helper.

```javascript
stylize(s) {
  return s.class("overlay", b => b
    .background(s.template`linear-gradient(${theme.primary}1a, transparent)`)
  );
}
```

### Color Alpha Utility (`dot.alpha`)

CSS variables are powerful, but they have a limitation: you cannot easily append an alpha channel to them (e.g., `var(--primary)88` is invalid). DOThtml provides the `dot.alpha()` utility to safely handle this using modern CSS `color-mix`.

```javascript
const opacity = dot.state(0.5);

dot.div("Faded Background")
  .style(b => b
    .backgroundColor(dot.alpha("var(--primary)", opacity))
  );
```

This utility works with static strings, Signals, or Bindings for both the color and the opacity.

### Batching and Performance

Style updates are automatically batched by the DOThtml scheduler. If you update multiple signals that drive styles on the same element (or different elements) in a single task, DOThtml will group those changes and apply them in a single DOM update cycle, minimizing layout thrashing.

## CSS Variables (Custom Properties)

For high-performance theme updates or complex component styling, you can use CSS variables.

```javascript
dot.div("Themed Content")
  .style(b => b.variable("accent-color", "orange"));
```

In your CSS, you can then reference this variable using the `.v()` helper:

```javascript
stylize(s) {
  return s.class("themed-content", b => b
    .border(`2px solid ${s.v("accent-color")}`)
  );
}
```

### The `s.v()` Shortcut

The `.v()` method is a convenient shortcut for referencing CSS variables within any style builder. It automatically handles the `--` prefix if it's missing.

*   **Usage**: `s.v("my-var")` returns `"var(--my-var)"`.
*   **Usage**: `s.v("--my-var")` returns `"var(--my-var)"`.

This makes your style definitions cleaner and less error-prone.

## Media Queries

DOThtml supports native CSS media queries within the `stylize()` method using the `.media()` builder. This allows you to define responsive styles that are scoped to your component.

```typescript
@dot.component
class ResponsiveNavbar extends DotComponent {
  stylize(s) {
    return s.class("navbar", b => b
      .display("flex")
      .heightPx(70)
    ).media("screen and (max-width: 600px)", m => m
      .class("navbar", b => b
        .heightPx(50)
        .padding("0px 20px")
      )
      .class("nav-links", b => b
        .display("none")
      )
    );
  }

  build(dot) {
    return dot.nav({ class: "navbar" },
      dot.div({ class: "nav-links" }, "...")
    );
  }
}
```

Media queries in DOThtml are:
- **Native**: They generate real CSS `@media` rules, so they are handled efficiently by the browser.
- **Scoped**: Just like other styles in `stylize()`, they are scoped to the component's shadow root.
- **Nested**: You can even nest media queries if needed.

## Keyframe Animations

Define reusable animations in `stylize()` with `.keyframes()`. Use `.from()`, `.to()`, and `.at()` for keyframe steps:

```javascript
stylize(s) {
  return s.class("pulse", b => b
    .animationName("pulse")
    .animationDurationS(2)
    .animationIterationCount("infinite")
  ).keyframes("pulse", k => k
    .from(f => f.opacity(0.4))
    .to(t => t.opacity(1))
  );
}
```

For multi-step animations:

```javascript
.keyframes("bounce", k => k
  .at(0, b => b.transform({ translateY: 0 }))
  .at(50, b => b.transform({ translateY: -20 }))
  .at("100%", b => b.transform({ translateY: 0 }))
)
```

## Transitions and Animations

DOThtml provides built-in support for VDOM transitions, allowing elements to animate smoothly when they enter or leave the DOM (e.g., inside `.when()` or `.each()` blocks).

### High-level Helpers

For common use cases, DOThtml provides fluent helpers that automatically handle entry and exit animations using the native Web Animations API.

- **`.fade(durationMs)`**: Fades the element in and out by animating opacity.
- **`.slide(durationMs)`**: Slides the element in and out by animating height and opacity.

```javascript
dot.div()
  .when(show, 
    dot.div("I'm fading!").fade(500)
  );
```

These helpers are hardware-accelerated and do not require any external CSS.

### Custom Transitions

You can define custom transition logic using the `.onEnter()` and `.onLeave()` fluent methods.

```javascript
dot.div()
  .when(show, 
    dot.div("Custom Transition")
      .onEnter(el => {
        el.animate([{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }], { duration: 300 });
      })
      .onLeave(async el => {
        const anim = el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }], { duration: 300 });
        await anim.finished;
      })
  );
```

If `.onLeave()` returns a `Promise`, the VDOM engine will wait for it to resolve before removing the element from the document.

## Container Queries

Container queries let a component respond to its **parent's** size instead of the viewport. Set `container-type` on a host, then use `.container()`:

```javascript
stylize(s) {
  return s.class("card-host", b => b.containerType("inline-size"))
    .container("(min-width: 400px)", c => c
      .class("card", b => b.flexDirection("row"))
    );
}
```

Named containers:

```javascript
.class("sidebar", b => b.containerName("sidebar").containerType("inline-size"))
.container("sidebar (min-width: 300px)", c => c
  .class("nav", b => b.display("flex"))
)
```

## Feature Queries (`@supports`)

Use `.supports()` for progressive enhancement when a CSS feature may be unavailable:

```javascript
stylize(s) {
  return s.supports("(display: grid)", sup => sup
    .class("layout", b => b.display("grid"))
  ).class("layout", b => b.display("flex")); // fallback
}
```

## Global Reactive Variables

DOThtml provides a global `dot.css` builder that is automatically bound to the document root (`<html>`). This is a **Property Builder**. This is the recommended way to handle application-wide theming.

```typescript
// In your app initialization
const themeColor = dot.state("blue");
dot.css.variable("primary", themeColor);

// Any component can now use this global variable
@dot.component
class MyComponent extends DotComponent {
  stylize(s) {
    return s.class("title", b => b.color(s.v("primary")));
  }
}
```

When `themeColor.value` changes, the CSS variable on the document root is updated, and every component using `var(--primary)` will instantly reflect the change without any JavaScript re-renders.

## Advanced Theming Patterns

The following patterns are powerful but typically needed only for complex applications with sophisticated theming requirements. **For most use cases, prefer the simpler approach of `stylize()` with CSS variables (see [Component Styling](#component-styling) above).**

### Signal Stylesheet Swapping

For advanced use cases like switching between "Light" and "Dark" modes or "Compact" and "Comfortable" layouts, the `stylize()` method can return a `Signal` or `Binding` of styles. This causes DOThtml to swap the entire stylesheet when the signal changes.

**⚠️ Use Sparingly:** This pattern swaps the entire component stylesheet on every signal change, which can be expensive for large component trees. For simple theme switches (colors, spacing), prefer CSS variables that update without re-creating stylesheets.

```javascript
const layoutMode = dot.state("comfortable");

class AppContainer extends IDotComponent {
	stylize(s) {
		return layoutMode.bindAs(mode => {
			if (mode === "compact") {
				return s.class("main", b => b.paddingPx(5).fontSizePx(12));
			}
			return s.class("main", b => b.paddingPx(20).fontSizePx(16));
		});
	}
}
```

When the `layoutMode` signal changes, DOThtml efficiently swaps the stylesheet for all instances of the component without re-rendering the component's HTML structure.

**Recommended alternative for simple theme switching:**

```javascript
// ✅ Use CSS variables instead
const layoutMode = dot.state("comfortable");
dot.css.variable("main-padding", layoutMode.bindAs(m => m === "compact" ? 5 : 20));
dot.css.variable("main-font-size", layoutMode.bindAs(m => m === "compact" ? 12 : 16));

class AppContainer extends IDotComponent {
	stylize(s) {
		return s.class("main", b => b
			.paddingPx(s.v("main-padding"))
			.fontSizePx(s.v("main-font-size"))
		);
	}
}
```

### Contextual Theme Inheritance

While global variables are great for application-wide defaults, large-scale "Mega-Apps" may require different styling for different sections (e.g., a "Dashboard" vs. a "Marketing" site).

DOThtml supports **Contextual Theme Inheritance**, allowing a parent component to provide styling rules to its entire subtree. This pattern is useful when you need section-specific theming that cascades to all descendants.

**When to use:**
- Building multi-tenant or white-label applications
- Creating distinct theme sections within a single app
- Migrating legacy CSS that needs to be scoped per-section

**When not to use:**
- Simple app-wide theming (use `dot.css.variable()` instead)
- Per-component customization (use component props or CSS variables)

#### Using a Theme Function

A component's `stylize()` method can return a **theme function** that will be automatically inherited and applied by all descendant components within their own Shadow Roots.

```javascript
class SectionTheme extends IDotComponent {
	stylize() {
		// Return a theme function to be inherited by all descendants
		return (s) => {
			s.class("btn", b => b
				.backgroundColor("blue")
				.color("white")
				.borderRadiusPx(8)
			);
		};
	}
	build(dot) {
		return dot.div(dot.slot());
	}
}
```

#### Using a CSS String

If you provide a CSS string, DOThtml automatically transforms `html` and `body` selectors into `:host` to ensure the styles apply correctly within the child components' Shadow Roots.

```javascript
class LegacyThemeProvider extends IDotComponent {
	stylize() {
		// Return a raw CSS string to be inherited by all descendants
		return `
			html { background-color: #f0f0f0; }
			body { font-family: sans-serif; }
			.btn { border-radius: 20px; }
		`;
	}
	build(dot) {
		return dot.div(dot.slot());
	}
}
```

#### Reactive Theme Propagation

Contextual themes are fully reactive. If you return a `Signal` of a theme function, any change to that Signal will automatically trigger a style re-render for every component in its subtree.

```javascript
const currentTheme = dot.state((s) => s.class("btn", b => b.color("red")));

class App extends IDotComponent {
	stylize() {
		return currentTheme; // Subtree will update when currentTheme changes
	}
	// ...
}
```

#### Benefits of Contextual Theming

1. **Zero Pollution**: Styles are applied *inside* each component's Shadow Root. A theme in Section A cannot leak out to affect Section B.
2. **No Prop-Drilling**: Child components don't need to be "theme-aware" or receive theme props; they just use standard classes, and the styles "show up."
3. **Composition**: Components can apply styles from a global theme, a section theme, and their own local styles in sequence.

### Reactive Theme Context with `dot.setTheme()`

DOThtml provides a first-class `Theme` concept that makes design systems easy to implement. By using `dot.setTheme()`, you can make a global reactive object available to all component style builders via `s.theme`.

**⚠️ Consider CSS Variables First:** This pattern creates a global theme object accessible via `s.theme` in every component. For most applications, using `dot.css.variable()` is simpler and more explicit.

**When to use `setTheme()`:**
- You have a complex design system with many interconnected theme values
- You want components to automatically bind to theme properties without explicitly wiring each one
- You're building a framework or design system library

```javascript
// 1. Define your theme
const myTheme = {
	primary: dot.state("#007bff"),
	spacing: dot.state(10)
};
dot.setTheme(myTheme);

// 2. Use it in any component
class MyComponent extends IDotComponent {
	stylize(s) {
		return s.class("container", b => b
			.color(s.theme.primary) // Automatically creates a reactive binding
			.paddingPx(s.theme.spacing)
		);
	}
}
```

**Simpler alternative using CSS variables:**

```javascript
// ✅ More explicit and easier to trace
const myTheme = {
	primary: dot.state("#007bff"),
	spacing: dot.state(10)
};
dot.css.variable("theme-primary", myTheme.primary);
dot.css.variable("theme-spacing", myTheme.spacing);

class MyComponent extends IDotComponent {
	stylize(s) {
		return s.class("container", b => b
			.color(s.v("theme-primary"))
			.paddingPx(s.v("theme-spacing"))
		);
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

> **⚠️ Warning: Internal API**
> The deep import `dothtml/v-meta-nodes/style-v-node` shown below is **not a valid published package export**. It is an internal implementation detail and may break in any release. This pattern is **not recommended** for production use.
>
> For most use cases, prefer `dot.css.variable()` for global theming or component `stylize()` for scoped styles. This internal API is documented here only for framework contributors and advanced debugging scenarios.

While `dot.css` targets the document root, you can create style nodes that target any CSS selector and update them reactively using an internal API:

```javascript
// ⚠️ INTERNAL API - Not a valid package export
import StyleVNode from "dothtml/v-meta-nodes/style-v-node";

const color = dot.state("red");
const globalStyle = new StyleVNode(dot.css.color(color));
globalStyle.render(".my-dynamic-class"); 

// Later...
color.value = "blue"; // Updates the <style> tag targeting .my-dynamic-class
```

**Recommended alternative:**

```javascript
// ✅ Use CSS variables instead
dot.css.variable("dynamic-color", dot.state("red"));

// Then reference in your components:
stylize(s) {
	return s.class("my-dynamic-class", b => b
		.color(s.v("dynamic-color"))
	);
}
```

## Performance and Caching

DOThtml's styling system is built for performance:

- **Constructable Stylesheets**: Uses `CSSStyleSheet` and `adoptedStyleSheets` where supported for ultra-fast style sharing.
- **Deduplication**: `CSSStyleSheet` instances are cached based on their content. If multiple components or global registrations use the same CSS string, they will share the same underlying stylesheet object.
- **Component Caching**: Component-level styles (from `stylize()`) are cached on the component's constructor, so they are only generated once.
- **Reactive Batching**: Style updates via `Signals` are batched by the scheduler to prevent layout thrashing.

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
  const color = dot.state("red");
  dot(document.body).div().style(b => b.color(color));

  color.value = "blue";
  
  // Force the style update to apply synchronously.
  dot.flushSync();

  expect(document.querySelector("div").style.color).toBe("blue");
});
```
