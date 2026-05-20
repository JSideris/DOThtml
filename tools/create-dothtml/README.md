# create-dothtml

The official project initializer for [DOThtml](https://dothtml.org/).

## Usage

```bash
npx create-dothtml <project-name> [options]
```

Or using `npm init`:

```bash
npm init dothtml <project-name> -- [options]
```

## Options

- `--js`: Use JavaScript instead of TypeScript (default).
- `--no-lint`: Skip adding ESLint to the project.

## Features

- **Vite-powered**: Instant dev server and fast builds.
- **DOThtml-friendly Linting**: By default, projects include an ESLint configuration that is specifically tuned to allow DOThtml's signature method chaining (disables `newline-per-chained-call`).
