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

## Why Vite?

By using Vite as the underlying build engine, DOThtml projects benefit from:
- **Instant Server Start**: No more waiting for a complex Webpack bundle.
- **Lightning Fast HMR**: See your changes reflected in the browser immediately.
- **Optimized Builds**: Rollup-powered production builds for maximum performance.
