# Data Binding

DOThtml supports 2-way data binding between interactive elements and model objects. This allows automatically setting the value of interactive elements just by assigning a value to the property that they are bound to, and likewise, ensuring the model always contains the value of the element it is bound to.

Data binding works with pretty much any element the user read and write data to/from.

* Input elements (text, checkbox, radio, range, etc).
* Select boxes.
* Option elements within select boxes.
* Text areas.

Use the `bindTo` function in the VDBO to bind the last element on the virtual document to a named value within your model. 

!!!API!!!
bindTo - Establishes two-way binding between the last element on the virtual document and a model provided by the user.
---
- The VDBO.
---
model - An object containing a field to bind to.
fieldName - The name of the field within the model.
---
The current VDBO (is chainable).
---
``` JavaScript
var loginModel = {
	username: "",
	password: ""
};

dot.div(
	dot.span("Username: ")
	.input().type("text").bindTo(loginModel, "username")
	
	.br().span("Password: ")
	.input().type("password").bindTo(loginModel, "password")
);
```
!!!/API!!!