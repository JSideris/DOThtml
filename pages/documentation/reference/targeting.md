# Targeting

The `dot` object (when used as a function), accepts a single parameter, which specifies the target to which markup will be rendered. The following types of objects are supported.

|    Type    |    Description    |    Examples    |
| --- | --- | --- |
|    String    |    CSS selector for the desired element.    |    `dot("#my-element");`    |
|    Element or Node    |    A specific element.    |    `dot(document.getElementById("my-element"));`    |
|    Iterables of Elements    |    Arrays, NodeLists, HTMLCollections, jQuery element lists.    |    `dot([document.body]);`<br>`dot(document.body.children);`<br>`dot(document.querySelectorAll(".greensquares"));`<br>`dot($("#my-element"));`    |

> **_Note:_** Passing multiple targets to `dot` (in the form of an element array, query selector, or otherwise) is currently an undefined behavior. Multiple targets use to be allowed, but broke the `getLast` function, among other related things. While iterable arguments are accepted, ensure that only one element exists per collection.