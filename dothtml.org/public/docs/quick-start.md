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

### Manual TypeScript Setup

When using DOThtml in a TypeScript project, you'll want to ensure your `tsconfig.json` is configured correctly to support decorators, which are a core part of the component system.

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

### Usage

```typescript
import { dot } from "dothtml";

dot(document.body)
.h1("Hello from TypeScript!");
```

For more advanced TypeScript usage, including component decorators, see the [TypeScript Reference](./typescript.md) guide.

## Use via CDN

If you want to use DOThtml without a build step, you can include it via a script tag:

```html
<script src="https://unpkg.com/dothtml@latest/dist/index.global.js"></script>
```

This will expose a global `dot` object that you can use immediately:

```javascript
dot("#app")
.div("Ready to go!");
```

## Next Steps

Now that you have DOThtml installed, learn about the core features:

[Main Features](./main-features.md)
