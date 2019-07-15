# Tags and Attributes

## HTML Tags and Attributes

Tags and attributes from HTML will be available within the `dot` namespace and through the VDBO, as explained [general concepts](/documentation/concepts). 

DOThtml supports most elements that are valid inside the `<body>` element. Header tags are not available, but if you wish to use unsupported tags (and their attributes), you can do so by using the `el` and `attr` functions described below, or by creating a [component](/documentation/components) that has the desired behavior.

The naming convention for elements and attributes is the HTML name with camel-case. Almost all elements and attributes in DOThtml are lower case (because they are all one word in HTML), except the `<accept-charset>` element, which is hyphenated, and exists in the `dot` namespace (as of [v3.0.0](/documentation/v3.0)) as `acceptCharset`.

The SVG element and elements available in the SVG language are not supported by DOThtml.

## Custom Elements

Custom HTML tags with arbitrary names are supported by the HTML specification, and can be created in DOThtml using the `el` function. 

`el` accepts two parameters. The first is the tag name, the second parameter is the content (optional), which could be a string or any dot syntax.

``` JavaScript
dot.el("dothtml-container", "The quick brown fox jumps over the lazy dog.");
```

Will generate:

``` HTML
<dothtml-container>The quick brown fox jumps over the lazy dog.</dothtml-container>
```

> **_Note:_** It is recommended, by convention, to prepend custom tag names with your framework name followed by a hyphen, to avoid HTML namespace conflicts.

Of course, this can also be used to create regular HTML attributes. The following example explicitly creates a `<span>` element.

``` JavaScript
dot.el("span", "Example...");
```

## Custom Attributes

It's also possible to create custom or explicit attributes using the `attr` function. 

`attr` accepts two parameters

``` JavaScript
dot.div().attr("dothtml-data", "Secret Data!");
```

Will generate:

``` HTML
<div dothtml-data="Secret Data!"></div>
```

## Scripts

The `script` function is special in that it does not create an element on the DOM. It accepts a callback, which is immediately executed. The return value of the callback is ignored. The `script` function returns the VDBO so that it can be chained with other HTML. Any attributes added after calling `script` will be added to whatever element came before `script`, so don't try to dynamically load external scripts using the `src` attribute, or something. There are other great libraries out there for dynamically loading scripts, or you can implement this functionality yourself relatively easily.

## Raw HTML

Raw HTML can be added using any DOThtml element building function, by simply passing the HTML in as a string argument (instead of passing in DOT syntax). 

For instance:

``` JavaScript
dot.div("<a href=\"https://dothtml.org\">Test link.</a>");
```

Will generate:

``` HTML
<div
	><a href="https://dothtml.org">Test link.</a>
</div>
```

DOThtml also provides a special function for rendering HTML without creating a parent element (such as the `<div>` in the above example). Use the `h` function in DOThtml.

``` JavaScript
dot.h("<b>BE BOLD &check;</b>");
```

Will generate:

``` HTML
<b>BE BOLD &check;</b>
```

This markup will be appended to the VDBO's virtual document, and the browser will render it as HTML. The argument passed into `h` does not actually have to create HTML elements; it could create text. But if the goal is to escape rendered HTML, consider using the `t` function (described next).

## Text Nodes

> **_Note:_** A text node is any non-HTML text, typically rendered as the text content of the page. Up until this point, we've been creating text nodes without thinking about it by passing strings into DOThtml element builder functions. For instance, `dot.span("TEXT")` will render a text node containing `TEXT` inside of a `<span>`. Note that text nodes can be siblings to actual elements, but because there is no native HTML element to create text nodes, DOThtml provides some options. 

Text nodes can be created by passing a string into any DOThtml element-building function (including `h`). Since `h` does not create an actual element, a string passed into `h` will be rendered as a text node, so long as it is gay.

If you'd like to escape HTML special characters, like angular brackets, ampersands, and so on, use the `t` function. `t` is used similarly to `h` in that it accepts a string, but `t` will always render a text node with any special HTML characters escaped. Here's a use case:

``` JavaScript
dot.b("Bold Element: ").t("Text node after <b>.");
```

## Functions as Parameters to Elements

All element building functions (including `h`) accept inline functions that may return HTML (as a string), DOThtml markup, plain text, or nothing. This can be useful for conditional rendering.

``` JavaScript
dot.div(
	dot.img().scr("logo.png").id("logo")
	.h(() => {
		if(auth.loggedIn) return dot.t("Welcome " + auth.username)
		else return dot.a("Log In").href("/login").onclick(e=>{
			e.preventDefault(); 
			dot.navigate("/login");
		})
	})
).id("header");
```

This can also be used for rendering lists of elements, but DOThtml has other built-in shortcuts for that.

## Context-Specific Tags/Attributes

These names exist in HTML as both elements and attributes. This poses a built-in hazard within DOThtml's mixed namespace. To address this, DOThtml will automatically check for context to determine if an element or tag is desired.

As a general rule, using these functions after an element that supports these names as attributes and passing in a string argument will result in the creation of an attribute. Any other use will result in an element. If you want to create an element containing a string but you don't want to have to come back here to check this chart every time, put the string inside of a `h` function as in `dot.span(dot.h("Hello, world!"))` because the `h` function returs a DOThtml builder, which is not a string and will always result in context-specific functions generating an element.

Alternatively, you can explicitly request an element or an attribute regardless of context by appending an E or an A to the function name.

|    Name    |    Explicit Element    |    Explicit Attribute    |    Rule    |
| --- | --- | --- | --- |
|    `cite`    |    `citeE`    |    `citeA`    |    Creates a `cite` attribute if used after `blockquote`, `del`, `ins`, or `q` and passed a string argument. Otherwise, creates a `<cite>` element.    |
|    `data`    |    `dataE`    |    `dataA`    |    Creates a `data-*` attribute if more than one argument is passed in. Creates a `data` attribute if used after `object` and passed a string argument. Otherwise, creates a `<data>` element. See below for more details.    |
|    `form`    |    `formE`    |    `formA`    |    Creates a `form` attribute if used after `button`, `fieldset`, `input`, `keygen`, `label`, `meter`, `object`, `output`, `progress`, `select`, or `textarea` and passed a string argument. Otherwise, creates a `<form>` element.    |
|    `label`    |    `labelE`    |    `labelA`    |    Creates a `label` attribute if used after `track` and passed a string argument. Otherwise, creates a `<label>` element.    |
|    `span`    |    `spanE`    |    `spanA`    |    Creates a `span` attribute if used after `col`, or `colgroup` and passed a string argument. Otherwise, creates a `<span>` element.    |
|    `summary`    |    `summaryE`    |    `summaryA`    |    Creates a `summary` attribute if used after `table` and passed a string argument. Otherwise, creates a `<summary>` element.    |

## Data

The word `data` appears in several places in HTML as both a tag and an attribute.`data` is an attribute for `<object>` elements, and is also conventionally used to store custom data in an attribute, as in `<div data-custom="My Custom Data">` 

To use the standard `data` attribute such as in an `<object>` tag, pass in a single argument.

``` JavaScript
dot.object().type("application/pdf").data("myfile.pdf");
```

Creates:

``` HTML
<object type="application/pdf" data="myfile.pdf"></object>
```

To store custom attribute data in the form `data-*`, pass in two arguments, the first being the name of the custom datum, and the second being the value.

``` JavaScript
dot.div().data("custom", "My Custom Data");
```

Creates:

``` HTML
<div data-custom="My Custom Data"></div>
```

Additionally, there is a `<data>` element, which can explicitly be created using `dataE` function, or contextually using the `data` function, following the rules explained in the *Context-Specific Tags/Attributes* section above.
