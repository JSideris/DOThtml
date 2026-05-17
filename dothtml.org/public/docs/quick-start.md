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

DOThtml is written in TypeScript and provides built-in type definitions.

```typescript
import { dot } from "dothtml";

dot(document.body)
.h1("Hello from TypeScript!");
```

For more advanced TypeScript usage, including component decorators, see the [TypeScript](./typescript.md) guide.

## Use via CDN

If you want to use DOThtml without a build step, you can include it via a script tag:

```html
<script src="https://unpkg.com/dothtml@latest/build_umd/dothtml.js"></script>
```

This will expose a global `dot` object that you can use immediately:

```javascript
dot("#app")
.div("Ready to go!");
```

## Next Steps

Now that you have DOThtml installed, learn how to build your first component:

[Create your first Component](./components.md)
