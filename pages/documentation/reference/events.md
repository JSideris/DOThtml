# Events

As mentioned in the overview page, DOThtml supports events, which are used similarly to attributes. 

Any on - attributes (such as `onclick`, `onmousemove`, `onfocus`, etc.) can be used to attach events. All event handlers will be attached with using JavaScript, and the attribute will not be added to the element.

You can pass an entire anonymous function in the following (an argument containing the event is passed into the function): 

```
dot.input().onchange(e=> {
	/*…/*
}
```

> **_Note:_** Passing a function as a parameter for unrecognized events is also supported. However, this will result in JavaScript as the attribute value, which is not recommended. 