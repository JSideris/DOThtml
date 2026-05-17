# Quick Start & Installation

## Start Something New in TypeScript

```bash
npm i -g create-dothtml-app
npx create-dothtml-app MyApp
cd MyApp
npm start
```

## Add DOThtml to an existing Node.js Project

DOThtml is available via NPM.

```bash
npm i dothtml
```

### TypeScript Support

DOThtml is written in TypeScript and provides built-in type definitions. All core interfaces and base classes (like `DotComponent`, `IReactive`, etc.) are exported directly from the `dothtml` package.

```typescript
import { dot, DotComponent } from "dothtml";

@dot.component
class HelloWorld extends DotComponent {
    build(dot) {
        return dot.h1("Hello World!");
    }
}

dot(document.body).mount(new HelloWorld());
```
