# Quick Start & Installation

## Start Something New (Recommended)

The fastest way to build a modern DOThtml application is with the official CLI. It scaffolds a project powered by **Vite**, providing instant Hot Module Replacement (HMR) and a professional build pipeline.

```bash
npm init dothtml my-app
cd my-app
npm install
npm run dev
```

By default, this scaffolds a **TypeScript** project. To use JavaScript instead, add the `--js` flag:

```bash
npm init dothtml my-app -- --js
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

[Rendering Basics](./rendering-basics.md)
