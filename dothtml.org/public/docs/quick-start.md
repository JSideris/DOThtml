# Quick Start & Installation

## Use via CDN

If you want to use DOThtml without a build step, you can include it via a script tag:

```html
<script src="https://unpkg.com/dothtml@latest/build_umd/dothtml.js"></script>
```

This will expose a global `dot` object that you can use immediately:

```javascript
dot("#app").div("Ready to go!");
```

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
