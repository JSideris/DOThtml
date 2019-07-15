# Events

DOThtml supports DOM on-event handler attributes such as `<button onclick="/*JavaScript*/">`. Except instead of passing in a string like a regular attribute, you can pass in a named or anonymous function. For instance:

``` JavaScript
dot.button.onclick(myClickHandler);
```

or:

``` JavaScript
dot.button.onclick(e => {
	/*...*/
});
```

Event handlers will be attached using JavaScript's `addEventListener` or `attachEvent` functions (depending on the browser).

All on-event attributes (such as `onclick`, `onmousemove`, `onfocus`, `onchange`, etc.) are available in DOThtml. 

You can pass an entire anonymous function in the following (an argument containing the event is passed into the function): 

Passing a function as a parameter for other attributes (or unrecognized on-events) is also supported. However, this is not recommended. In these cases, DOThtml will give your function a name, and assign the attribute value to a single line of JavaScript that calls the named function: 

``` HTML
<button myweirdevent="dot.anonAttrFuncs[0](arguments[0]);">
```.