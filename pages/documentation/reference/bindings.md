# Data Binding

Data binding (also known as two-way binding) is a when an object is bound to each input on the user interface and, when a modification on either side (i.e., the object or the input) occurs, both reflect the same value. 

DOThtml has built-in two-way binding for all input types.

## Model-View-Controller (MVC)

The two-way binding uses the **MVC (Model-View-Controller)** architectural pattern and allows automatic pushes for both ways (from object to input and input to object).

### Model

The binding object is the model, which has a variable name and value assigned to it. It listens for instructions from the controller, but does not trigger an onchange event when its changed values are sent to the input fields that are bound to it.

### View

The view contains input fields to receive information from the user.

Here are some examples of input fields:

* Radio buttons
* Checkboxes
* Text fields
* Sliders
* Drop-down fields

When the user changes the value of an input field that is bound to an object, an automatic onchange event occurs. This change event will update the model.

### Controller

The controller is what handles the functions, such as `dot.binding()`. This function contains the default value. `dot.binding()` is the representative of the model and, essentially, serves as the "middle man" between the object and the input fields.

**_Note:_** The `dot.binding` function sends data to more than one input field as a means of preventing infinite loops.