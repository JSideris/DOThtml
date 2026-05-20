# Rendering Basics

DOThtml provides a fluent, method-based API for building and manipulating the DOM. Instead of writing XML-like markup, you use JavaScript or TypeScript methods to define your UI structure.

## Targeting Elements

To start rendering, you first need to target an existing DOM element. You can do this by passing a DOM element or a CSS selector to the `dot` function.

```javascript
import { dot } from "dothtml";

// Target by reference
dot(document.body).h1("Hello World");

// Target by CSS selector
dot("#app").p("This is appended to the #app element.");
```

## Creating Elements

Once you have a target, you can create HTML elements by calling their tag names as methods on the `dot` object.

```javascript
dot(document.body)
  .div("This is a div.")
  .span("This is a span.");
```

Most standard HTML5 tags are supported as methods (e.g., `.div()`, `.p()`, `.button()`, `.input()`, `.section()`, etc.).

## Attributes and Properties

Attributes can be passed as an object. DOThtml is flexible: the attribute object can be the **first** or **second** argument.

```javascript
// Attributes as the first argument
dot.div({ id: "header", class: "main-title" }, "Welcome");

// Attributes as the second argument
dot.div("Welcome", { id: "header", class: "main-title" });

// Elements with no content
dot.img({ src: "logo.png", alt: "Logo" });
```

### Special Attribute Handling

- **Classes**: You can pass a string, an array of strings, or an object where keys are class names and values are booleans.
  ```javascript
  dot.div({ class: ["btn", "btn-primary"] });
  dot.div({ class: { "active": true, "disabled": false } });
  ```
- **Styles**: While you can pass a `style` string or object in the attributes, we recommend using the fluent [Styling](./styling.md) API for better performance and reactivity.
- **Events**: Event listeners can be added by prefixing the event name with `on` (e.g., `onClick`, `onInput`).

## Function Chaining

Every element method returns the `dot` object, allowing you to chain multiple elements together. Chained elements are added as **siblings**.

```javascript
dot(document.body)
  .h1("My App")
  .nav(
    dot.a("Home", { href: "/" })
       .a("About", { href: "/about" })
  )
  .main("Content goes here...");
```

## Nesting Elements

To create child elements, pass a `dot` call as an argument to another element method.

```javascript
dot.div(
  dot.h2("Section Title")
     .p("This paragraph is inside the div.")
);
```

You can nest as deeply as needed.

## HTML vs. Text

By default, any string passed to an element is treated as plain text and is automatically escaped for security. If you need to render raw HTML, use the `dot.html()` helper.

```javascript
// Renders: <div>&lt;b&gt;Hello&lt;/b&gt;</div>
dot.div("<b>Hello</b>");

// Renders: <div><b>Hello</b></div>
dot.div(dot.html("<b>Hello</b>"));

// Explicit text (useful if you want to be certain)
dot.div(dot.text("<b>Hello</b>"));
```

## Next Steps

Now that you understand the basics of rendering, explore how to build reusable UI pieces:

[Component-Based Architecture](./components.md)
