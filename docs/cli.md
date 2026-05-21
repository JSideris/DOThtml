# DOThtml CLI

The official command-line interface for DOThtml is the fastest way to build modern, reactive web applications. It handles project scaffolding and component generation.

## Installation

You don't need to install the CLI globally. You can run it directly using `npm init` or `npx`.

## Creating a New Project

To create a new project, run:

```bash
npm init dothtml my-app
```

This will create a new directory called `my-app` with a modern development environment powered by **Vite**.

### Options
- `--js`: Scaffolds a JavaScript project instead of the default TypeScript.
- `--no-lint`: Skips adding ESLint to the project.

*Note: When passing options through `npm init`, you must use a double dash `--` to separate npm arguments from CLI arguments:*
```bash
npm init dothtml my-app -- --js
```

## Generating Components

Once inside a project directory, you can use the CLI to generate new components:

```bash
npx create-dothtml generate component MyNewComponent
```

This will create a new file in `src/components/` with a standard boilerplate, respecting whether your project is using TypeScript or JavaScript.

## Project Scripts

Projects created with the CLI come with several pre-configured scripts:

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles your project for production.
- `npm test`: Runs your test suite using Vitest.
- `npm run lint`: Checks your code for potential errors using ESLint.
- `npm run preview`: Locally previews your production build.

## Development Experience

DOThtml is designed to provide a world-class developer experience, leveraging modern tooling to make building and debugging as seamless as possible.

### Hot Module Replacement (HMR)

When running `npm run dev`, DOThtml uses **Vite** to provide instant Hot Module Replacement. This means that when you save a file, the changed component is updated in the browser almost instantly without a full page refresh.

### State Preservation

DOThtml's HMR implementation is "state-aware." When a component is hot-swapped, the framework attempts to preserve its internal state, including:

- **Signals**: Values stored in `dot.state` or `this.count = dot.state(0)` are migrated to the new version of the component.
- **Props**: Data passed from parent components is maintained.
- **RefCollections**: Any references to DOM elements or other components are kept intact.

This allows you to tweak your component's structure or styles without losing your place in a complex UI flow.

### Stable Tag Names

In development mode, DOThtml generates stable, sanitized custom element tag names based on the component's file path (e.g., `<dothtml-src-components-mycomp-ts-mycomp>`). This ensures consistency across reloads and makes it easier to identify components when inspecting the DOM. In production, these are replaced with shorter, optimized IDs for performance.
