# Special Functions

DOThtml incorporates special functions to help you create dynamic web pages.

This page serves as a reference point to help you learn more about the DOThtml framework and how it can help you generate HTML more efficiently for your own projects.

## Special Elements & Attributes

|    Name    |    Notes    |
| --- | --- |
|    acceptcharset    |    Creates an `accept-charset` attribute. Since a hyphen character is not valid character in JavaScript names, it is possible to create this tag by using all lowercase letters.     |
|    attr    |    Adds an attribute to the last element created.    |
|    el    |    Creates a custom element.    |
|    h    |    Adds custom markup without an enclosing element.    |    
|    script    |    Immediately runs a callback function. The `Return` value is inserted as markup.    |
|    t    |    Adds text without an enclosing element. HTML is escaped.   |

## Conditional & Interative Markup

|    Name    |    Notes    |
| --- | --- |
|    if    |    Runs code inline if a conditional function returns `true`.    |
|    else    |    Runs a callback function if a previous `if` or `ifelse` statement is evaluated to be `false`.    |
|    else if    |    Runs a callback function if a previous `if` or `ifelse` statement is evaluated to be `false`.    |
|    each    |    Iterates the first argument and passes each element into a function (i.e., the second argument). The return values of the second function are evaluated as markup siblings.    |
|    iterate    |    Iterates, starting from 0 to the `int` provided. Calls the provided callback while passing in an `i` argument and an optional argument list.    |
|    wait    |    Runs a function or inserts `DOT` syntax after an interval; a temporary `<timeout>` tag (i.e., HTMLUnknownElementn interface) is placed and then removed upon the timeout being reached. One argument is taken, which is evaluated into markup in place of the `<timeout>`.

## Deleting Pages

|    Name    |    Notes    |
| --- | --- |
|    empty    |    Clears all contents within the element. If a router is deleted from this function, DOThtml is notified that the router is no longer on the DOM.    |

## Data

|    Name    |    Notes    |
| --- | --- |
|    data    |    An overloaded special function that can be used as an attribute (for an `<object>`) or as a `data-*` when two parameters are provided.    |
|    bindTo    |    Binds input to a binding object so that they'll always show the same value.     |

## Components

|    Name    |    Notes    |
| --- | --- |
|    component    |    Extends the dot namespace. Defines a component and accepts an argument consisting of a JSON object.    |
|    router    |    Generates a `<dothtml-router>` element that is used as a router outlet. Allows you to render another component, partial web page, or .js file exporting DOThtml.    |

## Context-Specific Tags/Attributes

These names exist in HTML as both elements and attributes. This poses a built-in hazard within DOThtml's mixed namespace. To address this, DOThtml will automatically check for context to determine if an element or tag is desired.

As a general rule, using these functions after an element that supports these names as attributes and passing in a string argument will result in the creation of an attribute. Any other use will result in an element. If you want to create an element containing a string but you don't want to have to come back here to check this chart every time, put the string inside of a `h` function as in `dot.span(dot.h("Hello, world!"))` because the `h` function returs a DOThtml builder, which is not a string and will always result in context-specific functions generating an element.

Alternatively, you can explicitly request an element or an attribute regardless of context by appending an E or an A to the function name.

|    Name    |    Explicit Element    |    Explicit Attribute    |    Rule    |
| --- | --- | --- | --- |
|    `cite`    |    `citeE`    |    `citeA`    |    Creates a `cite` attribute if used after `blockquote`, `del`, `ins`, or `q` and passed a string argument. Otherwise, creates a `<cite>` element.    |
|    `form`    |    `formE`    |    `formA`    |    Creates a `form` attribute if used after `button`, `fieldset`, `input`, `keygen`, `label`, `meter`, `object`, `output`, `progress`, `select`, or `textarea` and passed a string argument. Otherwise, creates a `<form>` element.    |
|    `label`    |    `labelE`    |    `labelA`    |    Creates a `label` attribute if used after `track` and passed a string argument. Otherwise, creates a `<label>` element.    |
|    `span`    |    `spanE`    |    `spanA`    |    Creates a `span` attribute if used after `col`, or `colgroup` and passed a string argument. Otherwise, creates a `<span>` element.    |
|    `summary`    |    `summaryE`    |    `summaryA`    |    Creates a `summary` attribute if used after `table` and passed a string argument. Otherwise, creates a `<summary>` element.    |

## Data Tag/Attributes

The `data` function is a special context-specific function

Additionally, there is a `data` function, which is an overloaded special function that can be used as an attribute (for an `<object>`) or as a `data-*` when two parameters are provided.

