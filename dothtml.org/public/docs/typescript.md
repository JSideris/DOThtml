# TypeScript Reference

DOThtml is built with TypeScript from the ground up, providing a first-class developer experience with full type safety and autocompletion.

## Core Interfaces

DOThtml exports several interfaces that you can use to type your application:

- `DotComponent<P, R>`: The base class for components, where `P` is the type of props and `R` is the type of refs.
- `IDotCore`: The type of the `dot` object passed to the `build` method.
- `IReactive<T>`: The base interface for reactive values (Signals and Bindings).
- `ISignal<T>`: A reactive value that can be updated.

## Type-Safe Props and Refs

By providing generic arguments to `DotComponent`, you get full type safety for `this.props` and `this.refs` within your component.

```typescript
interface MyProps {
    title: string;
}

interface MyRefs {
    myInput: HTMLInputElement;
}

@dot.component
class MyComponent extends DotComponent<MyProps, MyRefs> {
    build(dot) {
        return dot.div(
            dot.h1(this.props.title),
            dot.input({ ref: "myInput" })
        );
    }

    mounted() {
        this.refs.myInput.focus();
    }
}
```

## Next Steps

Now that you've explored the TypeScript reference, learn about performance and advanced features:

[Detailed Features & Performance](./detailed-features.md)
