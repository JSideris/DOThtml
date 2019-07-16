# Special Functions

DOThtml incorporates special build-in functions to help you create dynamic web pages. These functions are available from the `dot` namespace as well as the VDBO.

!!!API!!!
each - Iterates through an array, calling <code>callback</code> for each item, and generating markup.
---
- dot.
- The VDBO.
---
array - Any array to iterate over.
callback(item, i) - The callback to be called for each element in the array. Return value is processed as DOThtml syntax and added to the current virtual document.
.item - The current array element.
.i - The array element's index.
---
The current VDBO, or a new one if one does not exist (is chainable).
---
``` JavaScript
var numbers = ["one", "two", "three"];

dot.ol(
	dot.iterate(numbers, (numb, i) => {
		return dot.li(numb);
	})
);
```

Will generate:

``` HTML
<ol>
	<li>one</li>
	<li>two</li>
	<li>three</li>
</ol>
```
!!!/API!!!

!!!API!!!
iterate - Calls a callback function several times and generates markup.
---
- dot.
- The VDBO.
---
count - The number of times to call the <code>callback</code> function.
callback(i) - The callback to be called. Return value is processed as DOThtml syntax and added to the current virtual document.
.i - The number for this iteration, starting at 0 and incrementing by 1 each time.
---
The current VDBO, or a new one if one does not exist (is chainable).
---
``` JavaScript
dot.iterate(128, i => {
	return dot.div().style(`height:2px;width:100%;background-color:rgb(${i * 2},0,0)`)
});
```

Will generate a cool gradient effect.
!!!/API!!!

!!!API!!!
wait - Adds an empty <code>&lt;dotmtml-timeout&gt;</code> tag (which implements the <code>HTMLUnknownElement</code> interface) to the current VDBO document as a placeholder and then waits <code>timeout</code> milliseconds, after which <code>callback</code> function is called and the <code>&lt;dotmtml-timeout&gt;</code> tag is deleted and replaced with whatever DOThtml syntax was returned by <code>callback</code>.
---
- dot.
- The VDBO.
---
timeout - The number of milliseconds to wait before calling <code>callback</code>.
callback() - The callback to be called. Return value is processed as DOThtml syntax and added to the current virtual document.
---
The current VDBO, or a new one if one does not exist (is chainable).
---
``` JavaScript
dot.ol(
	dot.wait(1000, ()=>dot.li("one"))
	.wait(2000, ()=>dot.li("two"))
	.wait(3000, ()=>dot.li("three"))
);
```

Will generate:

``` HTML
<ol>
	<li>one</li>
	<li>two</li>
	<li>three</li>
</ol>
```

one element at a time over the duration of three seconds.
!!!/API!!!

!!!API!!!
empty - Clears all contents within the last element in the VDBO. If one of the descendants being deleted is a DOThtml router, DOThtml is notified that the router is no longer on the DOM as to prevent memory leaks.
---
- The VDBO.
---
---
The current VDBO, or a new one if one does not exist (is chainable).
---
``` JavaScript
// Clears the contents of whatever element has the "target" ID.
dot("#target").empty();
```
!!!/API!!!