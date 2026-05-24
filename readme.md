[https://dothtml.org/](https://dothtml.org/) for documentation.

## Quick Start

### Via CDN
The fastest way to use DOThtml is via a CDN. Add this to your HTML:

```html
<script src="https://unpkg.com/dothtml@latest/build_umd/dothtml.js"></script>
<script>
  dot("body").h1("Hello DOThtml!");
</script>
```

### Via NPM
```bash
npm install dothtml
```

## The DOThtml Paradigm

Most modern web frameworks are "all or nothing." DOThtml is different. It is a **UI Engine** designed to provide a component-based, reactive workflow to projects that have their own primary architecture. 

Whether you are building a high-performance game, a browser extension, or modernizing a legacy enterprise app, DOThtml stays out of your way while giving you the power of modern web components. Of course, it also works perfectly as a full-scale framework for building entire web applications from scratch.

DOThtml bridges the feature gap with larger frameworks by providing built-in **VDOM Transitions**, allowing for declarative entry and exit animations without manual state management.

## Performance

DOThtml is engineered for high-performance applications. By bypassing the Virtual DOM and updating elements directly via Signals, it achieves superior performance at scale while maintaining a tiny footprint.

### Comparison (10,000 Rows)

| Framework | Render Time | Bundle Size |
| :--- | :--- | :--- |
| **DOThtml (v6.0.7)** | **~660ms** | **22.4kB** |
| React | ~1100ms | ~42kB |
| Vue | ~680ms | ~33kB |
| Svelte | ~900ms | ~2kB* |

*\*Svelte has a small runtime, but component code size grows significantly with application complexity.*

For more details, see our [Full Benchmark Report](https://dothtml.org/#/docs/benchmarks).

# Project Status

This project is a work in progress with several phases: 

1. Basic web building framework in JavaScript. ✅
2. Provide some JQuery-like syntax and functionality. ✅
3. Add routing and components. ✅
4. Bridge the gap between DOThtml and modern frameworks, like Vue. ✅
5. Lots of testing, tweaking, documentation. 🔲
6. Take over the world. 🔲

Special thanks to [dosy](https://www.npmjs.com/~dosy) for giving me the module on NPM. Please check out ViewFinderJs - [a remote isolated browser with co-browsing](https://github.com/i5ik/ViewFinderJS).

# Current Known Limitations

## CSS
The Style builder is powerful and useful, but still not fully developed. Consider importing stylesheets separately if affected by any of the below limitations.
- Pseudo selectors like :hover aren't supported by the style builder since there's no straightforward way to set them in JavaScript in a neat way that supports component isolation.
- All length properties take a single value. Two and four argument lengths (for things like margin) are not yet supported. 
- A lot of CSS properties don't enforce proper typing and will allow any string. This is a WIP and will naturally get better over time.
- CSS @font-face is not yet supported in the style builder. Use `dot.useGlobalStyles()` or external stylesheets for custom fonts.

- Support for header elements (including stylesheets) is planned.

## 🚀 Release Process

DOThtml uses a monorepo structure and leverages [Changesets](https://github.com/changesets/changesets) to coordinate versioning and publishing between `dothtml`, `dothtml-interfaces`, and `create-dothtml`.

### All-in-One Release (Recommended)
To handle the entire release process in one command, run:
```bash
npm run release-all
```
This command will:
1. Check if a new version is needed by comparing local versions with NPM.
2. Prompt you to create a **Changeset** (if needed).
3. **Bump versions** and update changelogs (if needed).
4. **Build** all packages.
5. **Publish** all packages to NPM.

*Note: If the process fails during the final publish step, you can simply run `npm run release` to retry the publish without bumping versions again.*

### Manual Release Steps (Alternative)

#### 1. Create a Changeset
When you make changes that should be included in the next release, run:
```bash
npx changeset
```
Follow the prompts to select which packages have changed and whether the change is a `patch`, `minor`, or `major` bump. This will create a temporary markdown file in the `.changeset` directory.

#### 2. Versioning (Bumping)
When you are ready to prepare a release, run the following command from the root:
```bash
npm run version-packages
```
This command will consolidate all pending changesets, bump the version numbers in all packages (keeping them in sync), and update the changelogs.

#### 3. Publishing
Finally, to build the packages and publish them to NPM, run:
```bash
npm run release
```
This command will run the build script for the framework and execute `changeset publish` to upload the new versions to the NPM registry.
