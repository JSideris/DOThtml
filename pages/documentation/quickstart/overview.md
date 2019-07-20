# Overview

## HTML Builder

At its core, DOThtml is a chainable HTML builder with a namespace that contains all HTML tags and attributes.

``` JavaScript
dot("#content")
.ul(
	dot.li("Hello,").style("color: red;")
	.li("world!").style("color: blue;")
);
```

The above dot syntax will generate the following HTML inside of an element with the id attribute set to `content`:

``` HTML
<ul>
	<li style="color:red;">Hello,</li>
	<li style="color:blue;">world!</li>
</ul>
```

The object `dot` is only called as a function when you are choosing a target to write to. A lot is happening behind the scenes, so check out the [general concepts](/documentation/concepts) page for a more thorough understanding of the *dot builder object*.

## Events

DOThtml supports events, which are used similarly to attributes.

``` JavaScript
var count = 0;

dot("body")
.button("Click Me!").onclick(e => {
	count++;
	dot("#message-out").empty()
	.span("You clicked " + count + " times!")
})
.div().id("message-out");
```

However, instead of rendering the function as an HTML attribute, event handlers are attached with `addEventListener` or `attachEvent` (depending on the browser).

Check out the [events](/documentation/events) page for more details.

## Data Binding

DOThtml has built-in two-way binding for all input types. The following example binds two different inputs to a binding object so that they'll always show the same value. Clicking the button will reset the binding, as well as the two inputs, to the default value.

``` JavaScript
var defaultValue = "Name?";
var name = dot.binding(defaultValue);

dot.input().bindTo(name)
.input().bindTo(name)
.button("Reset").onclick(e => { name.value = defaultValue; });
```

Visit [bindings](/documentation/bindings) for more details.

## Components

Components extend the `dot` namespace with custom stuff. Here is a component named `countbtn`, which generates a `<button>` with a number that increments for each time the button is clicked. Then, three `countbtn` components are created with different starting numbers.

``` JavaScript
dot.component({
	name: "countbtn",
	builder: function(init){
		this.count = init;
		return dot.button(init).onclick(e => {
			this.count++;
			dot(e.target).empty().t(this.count); // The t function just renders text.
		});
	},
	ready: function(){
		// Executes after the component is on the DOM. Optional.
	}
});

dot("body").countbtn(1)
.br()
.countbtn(2)
.br()
.countbtn(3);
```

Advanced usage information can be found on the [components](/documentation/components) page.

## Routing

Routers are built-in components that allow you to render another component, partial web page, or .js file exporting DOThtml. They're very useful for building single-page applications.

``` JavaScript
dot("body").button("Page 1").onclick(e => { navigate("html-page"); })
.button("Page 2").onclick(e => { navigate("js-page"); })
.button("Page 3").onclick(e => { navigate("component-page/TESTPARAM"); })
.br()

.router({
	routes: [
		{ title: "Page 1", path: "html-page", component: "/pages/page1.html" },
		{ title: "Page 2", path: "js-page", component: "/pages/page2.js" },
		{ title: "Page 3", path: "component-page/{myparam}", component: dot.page3 }
	]
});
```

`/pages/page1.html` might contain:

``` HTML
<h1>Page 1</h1>
<p>Welcome to page 1!</p>
```

`/pages/page2.js` might contain:

``` JavaScript
exports = dot.h1("Page 2")
	.p("Welcome to page 2!");
```

And `page3` is defined as follows:

``` JavaScript
dot.component({
	name: "page3",
	builder: function(route){
		return dot.h1("Page 3")
		.p("Welcome to page 3!")
		.p("The parameter is " + route.params["myparam"] + "!")
	}
});
```

This is one of the more advanced and flexible features of DOThtml. Routers support all kinds of content, appending your browser's history (or not), multiple (even nested) routers, parameterized routes, wildcards, and more. Head over to [routing](/documentation/routing) for the full specification.