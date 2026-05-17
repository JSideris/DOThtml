# TypeScript Support

DOThtml is built with TypeScript from the ground up, providing a first-class developer experience with full type safety and autocompletion.

## Setup

When using DOThtml in a TypeScript project, you'll want to ensure your `tsconfig.json` is configured correctly to support decorators, which are a core part of the component system.

### tsconfig.json

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true
  }
}
```

## Defining Components

The recommended way to build components in TypeScript is using the `@dot.component` decorator and extending the `DotComponent` base class.

```typescript
import { dot, DotComponent } from "dothtml";

interface HelloProps {
    name: string;
}

@dot.component
class HelloWorld extends DotComponent<HelloProps> {
    build(dot) {
        return dot.h1(`Hello ${this.props.name}!`);
    }
}

dot(document.body).mount(new HelloWorld({ name: "World" }));
```

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
