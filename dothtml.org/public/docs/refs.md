# Refs

Refs (References) provide a way to obtain direct access to DOM elements or component instances created by the VDOM. In DOThtml, refs are **reactive**, **proxy-aware**, and **lifecycle-integrated**.

## Basic Usage

To create a ref, use the `dot.ref()` factory function. You can then bind it to an element using the `ref` attribute.

```javascript
const myInput = dot.ref();

dot.div(
    dot.input({ ref: myInput }),
    dot.button({ 
        onClick: () => myInput.focus() // Direct method call via proxy!
    }, "Focus Input")
);
```

## Reactive Nature

A `Ref` is a specialized `Signal`. This means you can use it anywhere a signal is expected, and you can react to its value changing (e.g., when an element is mounted or unmounted).

```javascript
const myRef = dot.ref();

dot.computed(() => {
    if (myRef.value) {
        console.log("Element is now in the DOM:", myRef.value);
    } else {
        console.log("Element has been removed.");
    }
});
```

## Method Proxying

DOThtml refs use a JavaScript `Proxy` to allow you to call methods of the underlying element or component directly on the ref object itself.

- **Standard way**: `myRef.value.focus()`
- **Proxy way**: `myRef.focus()`

If the ref is currently `null` (not mounted), the proxied call will simply do nothing and return `undefined`, preventing "cannot read property of null" errors.

## Component Refs

Refs can also be used to capture instances of DOThtml components.

```javascript
class MyModal {
    open() { /* ... */ }
    build(dot) { return dot.div("Modal Content"); }
}

const modalRef = dot.ref();
dot.mount(new MyModal(), { ref: modalRef });

// Later...
modalRef.open(); // Calls the 'open' method on the MyModal instance.
```

## Ref Collections

When working with lists, you may need a reference to multiple elements. `dot.refCollection()` provides a keyed Map of refs.

```javascript
const itemRefs = dot.refCollection();

dot.each(items, (item, i) => {
    return dot.div({ ref: itemRefs.get(i) }, item.name);
});

// Access all elements
itemRefs.forEach((el, key) => {
    console.log(`Item ${key} is`, el);
});
```

## Awaiting Mount (`ready`)

If you need to perform an action as soon as a ref is populated, you can use the `.ready()` method, which returns a Promise.

```javascript
const myRef = dot.ref();
dot.div({ ref: myRef });

const el = await myRef.ready();
console.log("Element is ready:", el);
```

## Function Refs

If you prefer a callback-based approach, you can pass a function to the `ref` attribute.

```javascript
dot.div({ 
    ref: (el) => {
        if (el) console.log("Mounted:", el);
        else console.log("Unmounted");
    }
});
```

## Lifecycle Integration

- **Mounting**: Refs are populated immediately after the element is created but before the `mounted()` lifecycle hook is called.
## Next Steps

Now that you have access to your elements, learn how to make them look great with **[Styling](./styling.md)**.
