# Special Functions

DOThtml incorporates special build-in functions to help you create dynamic web pages. These functions are available from the `dot` namespace as well as the VDBO.

|    Name    |    Arguments    |    Notes    |
| --- | --- |
|    `each`    |    `array`, `callback`    |    Iterates the first argument (`array`) and calls the `callback` argument several for each element in `array`, passing the array element in as an argument. The return values of `callback` are added to the VDBO as siblings.    |
|    `iterate`    |    `iterations`, `callback`    |    Calls the `callback` function `iterations` times, and passes the current iteration as an integer into `callback` as an argument, starting from `0` to `iterations - 1`. The return values of `callback` are added to the VDBO as siblings.     |
|    `wait`    |    `timeout`, `callback`    |    Adds an empty `<dotmtml-timeout>` tag (which implements the `HTMLUnknownElement` interface) to the current VDBO document as a placeholder and then waits `timeout` milliseconds, after which `callback` function is called and the `<dothtml-timeout>` tag is deleted and replaced with whatever DOThtml syntax was returned by `callback`.
|    `empty`    |    *none*    |    Clears all contents within the last element in the VDBO. Can also be used to clear an entire target by doing `dot("#target").empty()`. If one of the descendents being deleted is a DOThtml router, DOThtml is notified that the router is no longer on the DOM as to prevent memory leaks.    |