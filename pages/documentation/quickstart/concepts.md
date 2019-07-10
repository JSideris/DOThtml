# General Concepts

This page explains the underlying principals required to effectively understand and use DOThtml.

## The `dot` Object as a Function and a Namespace

The `dot` object is both a function, and an object containing all of DOThtml's tools. 

As a function, calling `dot` is how you tell DOThtml where to render the HTML it generates. Often, this will be the document's `<body>` tag. One way to select a target is by passing the CSS selector of the target into the `dot` function. So to target `<body id="content"></body>`, you could write `dot("#content")`.

This function returns a special object called the *virtual document builder object* (VDBO) that is discussed below. For now, understand that this object is a namespace containing a function for each HTML tag and attribute, a few other useful tools, and any custom components you've added. These functions are used to append the target element with a child. For instance, going back to the above example, `dot("#content").div()` adds a div element to the element with its `id` attribute equal to `content`.

The `dot` object is also a collection (key value pair) containing all of the same page-building functions that exist in the VDBO, as well as some other special functions that are not required for page building, such as the `navigate` function. 

## HTML Generation and the Virtual Document Builder Object (VDBO)

Whether using `dot` as a namespace or as a function, we have access to HTML builder functions for each HTML element and attribute. 

The functions that are named after HTML elements append the target element (typically on the DOM) with a new element corresponding to the function name. So, `dot("#content").p()` adds a `<p>`, `dot("#content").img()` adds an `<img>`, and so on.

Each element function accepts an optional parameter for the content of the element. This can be a string, which will be rendered as HTML, or nested DOThtml markup. More on that later.

These element functions return an instance of the VDBO, which means it's possible to chain them together. 

The line

``` JavaScript
dot("#content")
.h1("title")
.p("p1")
.p("p2");
```

will create: 

``` HTML
<h1>title</h1>
<p>p1</p>
<p>p2</p>
```

The VDBO and `dot` namespaces also contain attribute-building functions. Any attributes created will be added to the previously-added element.

The line

``` JavaScript
dot("#content")
.div("Content.").id("div-1").class("my-div")
.div("More content.").id("div-2").style("height: 100px; width: 100px;");
```

will create:

``` HTML
<div id="div-1" class="my-div">Content.</div>
<div id="div-2" style="height: 100px; width: 100px;">More content.</div>
```

Finally, it's possible to create a hierarchy of elements by passing DOThtml syntax as an argument to any element-building function. For this, you would use `dot` as a namespace on the nested elements. So, to have three `<td>` elements inside a `<tr>` inside a `<tbody>` inside a `<table>`, you could do this:

``` JavaScript
dot("#content")
.table(dot.tbody(
	dot.tr(
		dot.td(1)
		.td(2)
		.td(3).style("color: red;")
	)
));
```

which will create:

``` HTML
<table><tbody>
	<tr>
		<td>1</td>
		<td>2</td>
		<td style="color: red;">3</td>
	</tr>
</tbody></table>
```

## Top-Down Page Generation and the Virtual Document

DOThtml builds web pages left-to-right, top-to-bottom. That means that when nested elements are encountered, they are instantiated before their parents.

This might sound counter-intuitive, but with some context it is easy to see why this design decision was introduced, and how it works.

One of the early beta versions of DOThtml built documents from the bottom up, like most other page-building framework. The syntax for building the table in the previous example would have looked something like this:

``` JavaScript
dot("#content").table(function(){
	return dot.tbody(function(){
		return dot.tr(function(){
			return dot.td(1)
			.td(2)
			.td(3).style("color: red;")
		})
	})
});
```

A lot has changed since then, but this worked by first making a `<table>` element and adding it to the DOM, then the anonymous function would be called, appending the `<table>` with that function's return value. 

Well, the return value in this case is creating a `<tbody>` using the `dot.tbody` function. So the `<tbody>` would be added to the DOM inside of the `<table>`, then it's content function would be called. 

The same process would add a `<tr>` to the `<tbody>`. Then the three `<td>` elements would be added to the `<tr>`, one at a time.

The flow was logical, but filled with syntax noise. What if we could get rid of all the `function(){return ...}` bits?

``` JavaScript
dot("#content")
.table(dot.tbody(
	dot.tr(
		dot.td(1)
		.td(2)
		.td(3).style("color: red;")
	)
));
```

Better, but now how the flow of this is counterintuitive.

First, the target element on the DOM is selected by `dot("#content")` as before. But now, in order to call the `table` function, the parameter must be evaluated as it is no longer a function that can just be deferred. 

So the `dot.tbody` function is encountered, but it is also being passed an argument that much be evaluated. 

The same for the `dot.tr`. The three `td` functions must be evaluated first.

The first `td` function is called, creating a virtual document that is not attached to the DOM. A `<td>1</td>` is added to this document, and then the `td` function returns an instance of the VDBO, which contains a reference to this virtual document. The second and third `td` functions are called, and the virtual document is appended. 

So at this point the entire virtual document contains:

``` HTML
<td>1</td><td>2</td><td>3</td>
```

The VDBO in passed into the `tr` function, which executes. It creates a `<tr>` and fills it with the contents of the virtual document of the VDBO that was passed into it. The new virtual document contains:

``` HTML
<tr><td>1</td><td>2</td><td>3</td></tr>
```

The process trickles up until we end up with: 

``` HTML
<table><tbody><tr><td>1</td><td>2</td><td>3</td></tr></tbody></table>
```

The "virtual document" for the VDBO that the `table` function is calling is actually the target element selected by the function `dot("#content")`. So the new `<table>` and all its contents will be appended directly there.