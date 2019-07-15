# jQuery Helpers

The following functions extend DOThtml by wrapping jQuery functions, if jQuery is available. For instance, `dot.$css()` calls `$.css()` and returns the dot builder. The helper methods have a similar behavior to DOThtml attributes, and will target whatever element DOThtml is currently targetting (or escalate to the parent element). Any arguments passed into the dot wrapper will be passed into the inner jQuery function. These helpers provide a familiar jQuery interface that runs in-line in a DOThtml-like way.

Consider the following example:

```javascript
dot.div("Red text!").$css("color", "red"); 
```

> **_Note:_** Extending DOThtml with jQuery is optional. jQuery must be available in the global namespace in order for these helper methods to be available. 

## Events

* $blur
* $keydown
* $mouseover
* $hover
* $change
* $keypress
* $mouseup
* $mouseout
* $click
* $keyup
* $on
* $one
* $show
* $dblclick
* $mousedown
* $resize
* $focus
* $mouseenter
* $scroll
* $focusin
* $mouseleave
* $select
* $focusout
* $mousemove
* $submit

## Display Helpers

* $animate
* $css
* $empty
* $fade In
* $fade Out
* $fade To  
* $hide