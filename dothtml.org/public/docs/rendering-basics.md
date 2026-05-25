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

### Reserved Attributes

- **`html` / `innerHtml`**: These keys are reserved for raw HTML injection. When used in an attribute object, the value is treated as raw HTML content for the element rather than a literal attribute.
  ```javascript
  // Renders: <div class="container"><span>Raw Content</span></div>
  dot.div({ 
      class: "container", 
      html: "<span>Raw Content</span>" 
  });
  ```

## Function Chaining

Every element method returns a builder object, allowing you to chain multiple elements together. Chained elements are added as **siblings**.

```javascript
dot(document.body)
  .h1("My App")
  .nav(
    dot.a("Home", { href: "/" })
       .a("About", { href: "/about" })
  )
  .main("Content goes here...");
```

## Fluent API and Chaining

DOThtml is designed with a consistent fluent API. Whether you are targeting an existing element or creating a new one, the returned object always supports the full suite of DOThtml methods.

### Targeted vs. Standalone Builders

- **`dot(target)`**: Returns a builder that operates **inside** the target element. Methods called on this builder will append children to the target.
- **`dot.tag()`**: Returns a builder for a **new** element. Methods called on this builder will add siblings to that new element.

```javascript
// Appends <p> inside #app
dot("#app").p("Inside app");

// Creates <div> and <p> as siblings
const fragment = dot.div("A").p("B"); 
```

### Chaining Consistency

All entry points, including `dot.mount()`, `dot.each()`, and `dot.when()`, return a consistent wrapper that supports chaining. This allows for powerful imperative patterns:

```javascript
dot("#app")
  .empty()
  .mount(new MyComponent())
  .p("Appended after the component!");
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

## Fluent Lifecycle Hooks

DOThtml allows you to attach lifecycle hooks directly to elements using fluent chaining. This is particularly useful for triggering animations when elements are added or removed via `.when()` or `.each()`.

- **`.onEnter(callback)`**: Executes when the element is added to the DOM.
- **`.onLeave(callback)`**: Executes when the element is about to be removed. Supports returning a `Promise` to delay removal.

```javascript
dot.div()
  .when(show, 
    dot.p("I'm entering and leaving!")
      .onEnter(el => console.log("Entered:", el))
      .onLeave(el => console.log("Leaving:", el))
  );
```

For common animations, see the **[Transitions & Animations](./styling.md#transitions-and-animations)** section in the styling documentation.

## Appending and Prepending

You can imperatively add content to an existing element or a builder using `.append()` and `.prepend()`.

- **`.append(content)`**: Adds the content to the **end** of the targeted element's children.
- **`.prepend(content)`**: Adds the content to the **beginning** of the targeted element's children.

```javascript
const list = dot.ul().li("Item 2");

list.append(dot.li("Item 3"));
list.prepend(dot.li("Item 1"));

// Result: <ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>
```

These methods are particularly useful when working with **Refs** (see [Refs](./refs.md)).

## Clearing and Removing Elements

You can imperatively clear or remove elements using the `.empty()` and `.remove()` methods.

- **`.empty()`**: Removes all children from the targeted element.
- **`.remove()`**: Removes the targeted element itself from the DOM.

```javascript
// Clear all content inside #app
dot("#app").empty();

// Clear #app and then add new content
dot("#app").empty().p("All gone, here is something new!");

// Remove the #sidebar element entirely
dot("#sidebar").remove();
```

## HTML vs. Text

By default, any string passed to an element is treated as plain text and is automatically escaped for security. If you need to render raw HTML, use the `dot.html()` helper or its shorthand `.h()`.

```javascript
// Renders: <div><b>Hello</b></div>
dot.div(dot.html("<b>Hello</b>"));

// Shorthand version
dot.div(dot.h("<b>Hello</b>"));

// Explicit text (useful if you want to be certain)
dot.div(dot.text("<b>Hello</b>"));
```

## SVG and MathML Support

DOThtml provides full support for SVG and MathML namespaces. When you create an `svg` or `math` element, DOThtml automatically uses the correct namespace (`document.createElementNS`), ensuring that graphics and formulas render correctly in the browser.

### Context-Aware Content

For convenience, `svg` and `math` tags treat string arguments as raw HTML by default, as plain text is rarely the intended content for these elements.

```javascript
// Automatically uses SVG namespace and treats string as HTML
dot.svg({ width: 50, height: 50 }, "<circle cx='25' cy='25' r='20' />");

// Chaining also works with the correct namespace
dot.svg({ width: 50 })
   .circle({ cx: 25, cy: 25, r: 20, fill: "red" });
```

