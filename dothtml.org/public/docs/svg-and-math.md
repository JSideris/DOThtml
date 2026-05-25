# SVG and MathML Support

DOThtml provides first-class support for SVG and MathML, including automatic namespace management and a specialized builder pattern.

## Namespace Awareness

When you create an `svg` or `math` element, DOThtml automatically uses the correct namespace (`document.createElementNS`), ensuring that graphics and formulas render correctly in the browser. This namespace is also inherited by all children created within these elements.

## SVG/MathML Builder Pattern

While standard nesting (`dot.svg(dot.circle())`) works, DOThtml also provides a specialized builder pattern for `svg` and `math` tags. If you pass a function as an argument, it will be called with a builder scoped to that element's children.

### SVG Example
```javascript
// Use a builder function for ergonomic child creation
dot.svg({ width: 100, height: 100 }, s => s
   .circle({ cx: 50, cy: 50, r: 40, fill: "red" })
   .rect({ x: 30, y: 30, width: 40, height: 40, fill: "blue" })
);
```

### MathML Example
```javascript
// Use a builder function for ergonomic MathML creation
dot.math(m => m
   .mrow(r => r
      .mi("a")
      .msup(s => s
         .mi("x")
         .mn(2)
      )
      .mo("+")
      .mi("b")
   )
);
```

## Context-Aware Content

For convenience, `svg` and `math` tags treat string arguments as raw HTML by default, as plain text is rarely the intended content for these elements.

```javascript
// Automatically uses SVG namespace and treats string as HTML
dot.svg({ width: 50, height: 50 }, "<circle cx='25' cy='25' r='20' />");
```

## Smart SVG/MathML Adoption

DOThtml features "Smart Adoption" for `svg` and `math` tags. If you pass a string that contains a full `<svg>` or `<math>` tag (e.g., loaded from a file), DOThtml will automatically "adopt" the attributes and inner content of that tag, rather than nesting it.

```javascript
// myIcon.svg: <svg width="24" viewBox="0 0 24 24"><path ... /></svg>

dot.svg({ class: "large-icon", id: "main-logo" }, myIconContents);

// Resulting DOM:
// <svg width="24" viewBox="0 0 24 24" class="large-icon" id="main-logo">
//    <path ... />
// </svg>
```

This allows you to load existing SVG assets and still use DOThtml's fluent API to modify them dynamically. Explicitly set attributes via the attribute object or `.attr()` will take precedence over adopted ones.

## Sibling Convention

Consistent with all other tags in DOThtml, chained calls on `svg` or `math` create **siblings**, not children.

```javascript
// Creates an SVG and a PATH as siblings
dot.svg().path(); 
```
