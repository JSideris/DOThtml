# Targeting

The `dot` object (when used as a function), accepts a single parameter, which specifies the target to which markup will be rendered. 

!!!API!!!
dot - Creates a VDBO who's virtual document is a specific target on the DOM.
---
- window.
---
target - The target element to use as the virtual document. Can be a CSS selector, the element, or any iterable list of elements.
---
A new VDBO who's virtual document is the target (is chainable).
---
``` JavaScript
// Appends the document's body with a div with ID my-element:
dot("body").div(":-)").id("my-target");

// Deletes the inner content of an element with ID my-element:
dot("#my-element").empty();
```
!!!/API!!!

The following types of selector arguments are supported.

|    Type    |    Description    |    Examples    |
| --- | --- | --- |
|    String    |    CSS selector for the desired element.    |    `dot("#my-element");`    |
|    Element or Node    |    A specific element.    |    `dot(document.getElementById("my-element"));`    |
|    Iterables of Elements    |    Arrays, NodeLists, HTMLCollections, jQuery element lists.    |    `dot([document.body]);`<br>`dot(document.body.children);`<br>`dot(document.querySelectorAll(".greensquares"));`<br>`dot($("#my-element"));`    |

> **_Note:_** Passing multiple targets to `dot` (in the form of an element array, query selector, or otherwise) is currently an undefined behavior. Multiple targets use to be allowed, but broke the `getLast` function, among other related things. While iterable arguments are accepted, ensure that only one element exists per collection.