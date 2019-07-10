# Custom Elements and Attributes

## Elements

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
dot.el("span", "Example!");
```

## Attributes

It's also possible to create custom or explicit attributes using the `attr` function. 

`attr` accepts two parameters

``` JavaScript
dot.div().attr("dothtml-data", "Secret Data!");
```

Will generate:

``` HTML
<div dothtml-data="Secret Data!"></div>
```