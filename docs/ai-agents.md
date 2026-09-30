# AI Agent Guide

This page is written specifically for AI coding agents (Cursor, Copilot, etc.) to help you build DOThtml applications correctly and efficiently. It provides ranked defaults, common traps to avoid, and a comprehensive React→DOThtml migration guide.

**For full documentation**, see [https://dothtml.org/llms.txt](https://dothtml.org/llms.txt) or the [full text version](https://dothtml.org/llms-full.txt).

## Installation

Use the published npm package `dothtml` (current line ≥6.7.4). Do not rely on local monorepo source paths.

```bash
npm install dothtml
```

## Ranked Defaults (Prefer / Avoid)

When building DOThtml applications, use these canonical patterns. Each section shows the **preferred** approach first and what to **avoid**.

### 1. Components

**✅ Prefer: `@dot.component` + `DotComponent` + `new`**

For TypeScript, use the decorator pattern with `DotComponent` base class:

```typescript
import { dot, DotComponent } from "dothtml";

interface MyProps {
	name: string;
}

@dot.component
class MyComponent extends DotComponent<MyProps> {
	build(dot) {
		return dot.div(`Hello, ${this.props.name}!`);
	}
}

// Instantiate with 'new'
dot(document.body).mount(new MyComponent({ name: "World" }));
```

For plain JavaScript (no decorators), wrap your class with `dot.component()`:

```javascript
const MyComponent = dot.component(
	class {
		static props = {
			name: { type: String, required: true }
		};

		build(dot) {
			return dot.div(`Hello, ${this.props.name}!`);
		}
	}
);

// Instantiate with 'new'
dot(document.body).mount(new MyComponent({ name: "World" }));
```

**❌ Avoid: `IDotComponent` interface + `dot.create` as the default**

The `IDotComponent` interface and `dot.create` factory exist for advanced dependency injection scenarios, but are not the recommended starting point. Prefer the patterns above.

**See:** [components.md](./components.md)

### 2. Lists

**✅ Prefer: `each(signal)` or `each(() => …)` with keyed `dot.state(rows, "id")`**

Lists must be reactive to update when data changes. Use `dot.each` with a signal or a zero-argument getter:

```javascript
// The list itself is a signal
const items = dot.state([
	{ id: "a", name: "Alice" },
	{ id: "b", name: "Bob" }
], "id");

dot.ul(
	dot.each(items, item => dot.li(item.name))
);
```

```javascript
// Derived list via getter (wrapped in dot.computed automatically)
dot.ul(
	dot.each(() => this.payload.value.items, item => dot.li(item.name))
);
```

For efficient keyed diffing, pass the key property name as the second argument to `dot.state`:

```javascript
const rows = dot.state([], "id");
```

**❌ Avoid: Plain array without signal**

This is a **silent non-reactive trap**. The list renders once and never updates:

```javascript
// WRONG: renders once, never updates when items change
const items = dot.state([{ id: "a", name: "Alice" }]);
dot.each(items.value, item => dot.li(item.name)); // ❌ .value is a snapshot
```

```javascript
// WRONG: passing the raw signal property directly (not unwrapped)
dot.each(this.payload.items, item => dot.li(item.name)); // ❌ not reactive
```

**See:** [lists-and-conditionals.md](./lists-and-conditionals.md)

### 3. Conditionals

**✅ Prefer: `when(condition, eagerMarkup)`**

The `when` / `otherwiseWhen` / `otherwise` constructs expect **eager content**, not factory functions:

```javascript
const visible = dot.state(true);

dot.when(visible, dot.p("I am shown"));

dot.when(() => this.mode.value === "edit", 
	dot.input({ type: "text" })
).otherwise(
	dot.p("View mode")
);
```

Chain `otherwiseWhen` for multiple branches:

```javascript
dot.when(() => status === "loading", dot.p("Loading..."))
	.otherwiseWhen(() => status === "error", dot.p("Error!"))
	.otherwise(dot.p("Ready"));
```

**❌ Avoid: Lazy factory functions (React-style `&&` pattern)**

Passing a factory function to `when` throws **error 13**:

```javascript
// WRONG: this throws error 13
dot.when(visible, () => dot.p("x")); // ❌ not a factory
```

The content is eager, not lazy. Build the markup directly.

**See:** [lists-and-conditionals.md](./lists-and-conditionals.md)

### 4. Forms

**✅ Prefer: `{ bind: signal }` for two-way binding**

For two-way data binding on inputs, use the `bind` property:

```javascript
const name = dot.state("");

dot.input({ type: "text", bind: name });
dot.p(() => `Hello, ${name.value}!`);
```

This keeps the input and signal synchronized automatically.

**❌ Avoid: `value:` for two-way binding**

Setting `value:` alone is **one-way only**. It sets the initial value but does not update the signal when the user types:

```javascript
// WRONG: one-way, signal is not updated on input
const name = dot.state("");
dot.input({ type: "text", value: name }); // ❌ not two-way
```

Use `bind` for two-way, or combine `value` + `onInput` manually if you need custom logic.

**See:** [reactivity.md](./reactivity.md)

### 5. Lifecycle

**✅ Prefer: `mounted` / `unmounting`**

DOThtml provides two primary lifecycle hooks:

- **`mounted()`**: Called after the component's shadow root is attached to the DOM.
- **`unmounting()`**: Called just before the component is removed from the DOM.

```javascript
@dot.component
class MyComponent extends DotComponent {
	mounted() {
		console.log("Component is now in the DOM");
	}

	unmounting() {
		console.log("Component is about to be removed");
	}

	build(dot) {
		return dot.div("Hello");
	}
}
```

**❌ Avoid: `onMount` / React or Vue naming conventions**

DOThtml does not use `onMount`, `componentDidMount`, `onUnmount`, etc. Use `mounted` and `unmounting`.

**See:** [components.md](./components.md)

### 6. Error Handling

**✅ Prefer: `errorCaught` for child errors in build/mount/reactive updates**

To create an error boundary, implement the `errorCaught(error)` hook. It catches errors in:

- Child component `build()` methods
- Child `mounted()` lifecycle hooks
- Reactive updates triggered by signal changes
- Child `unmounting()` hooks

```javascript
@dot.component
class ErrorBoundary extends DotComponent {
	errorCaught(error) {
		console.error("Caught:", error);
		// Return fallback markup (not a boolean)
		return dot.div({ class: "error" },
			dot.h2("Something went wrong"),
			dot.p(error.message)
		);
	}

	build(dot) {
		return dot.slot(); // Render children
	}
}
```

**Important:** `errorCaught` must **return markup** (DotContent), not a boolean.

**❌ Avoid: Expecting `errorCaught` to catch event handlers**

Event handlers like `onClick`, `onInput`, etc., and async code outside the reactive update path are **not** caught by `errorCaught`. Use `try/catch` or error signals for those:

```javascript
{
	onClick: () => {
		try {
			riskyOperation();
		} catch (err) {
			this.errorSignal.value = err.message;
		}
	}
}
```

**See:** [error-handling.md](./error-handling.md)

### 7. Routing

**✅ Prefer: `navigate` / `dot.navigate` and `new Link()` with mount props**

For programmatic navigation, use the `navigate` function:

```javascript
import { navigate } from "dothtml";

navigate("/dashboard");

// Replace current entry instead of pushing
navigate("/login", true);
```

Or via `dot.navigate`:

```javascript
dot.navigate("/profile");
```

For declarative links, use the `Link` component with mount props:

```javascript
import { Link } from "dothtml";

dot.nav(
	dot.mount(new Link(), { to: "/", label: "Home", exact: true }),
	dot.mount(new Link(), { to: "/about", label: "About" })
);
```

The default `activeClass` is `"active"`. You can customize it:

```javascript
dot.mount(new Link(), { 
	to: "/settings", 
	label: "Settings",
	activeClass: "current" 
});
```

**❌ Avoid: Raw `history.pushState` as the first choice**

While `history.pushState` works, prefer `navigate` to ensure DOThtml's routing state stays synchronized.

**❌ Avoid: Only documenting constructor-only Link props**

`Link` supports both constructor props and mount props. The mount-prop pattern is preferred for clarity.

**See:** [routing.md](./routing.md)

### 8. Styling

**✅ Prefer: `stylize` and CSS variables (`dot.css.variable` + `s.v`)**

For component-scoped styles, use the `stylize(s)` method with the stylesheet builder:

```javascript
@dot.component
class StyledComponent extends DotComponent {
	stylize(s) {
		s.class("header", b => b
			.color("blue")
			.fontSizePx(20)
			.fontWeight("bold")
		);

		s.rule(".content", b => b
			.paddingPx(16)
			.backgroundColor("#f0f0f0")
		);
	}

	build(dot) {
		return dot.div(
			dot.div({ class: "header" }, "Title"),
			dot.div({ class: "content" }, "Body")
		);
	}
}
```

For CSS variables, use `dot.css.variable` and `s.v`:

```javascript
const accentColor = dot.css.variable("--accent", "blue");

s.class("button", b => b
	.backgroundColor(s.v(accentColor))
);
```

**❌ Avoid: Deep imports of StyleVNode as the default**

Deep imports like `dothtml/v-meta-nodes/style-v-node` are **not valid published exports**. Use the public API (`stylize`, `dot.css`, etc.).

**❌ Avoid: Theme API sprawl as the first choice**

While DOThtml supports advanced theming, start with `stylize` and CSS variables for most use cases.

**See:** [styling.md](./styling.md)

---

## React → DOThtml Migration Guide

If you're familiar with React, this section maps common React patterns to their DOThtml equivalents. DOThtml is **not** React—it uses signals instead of immutable state, eager execution instead of lazy factories, and a fluent builder API instead of JSX.

### State Management

**React:**
```javascript
const [count, setCount] = useState(0);
```

**DOThtml:**
```javascript
const count = dot.state(0);
```

**Key differences:**
- DOThtml signals are **mutable**. Update with `count.value = 1`.
- No setter function—assign directly to `.value`.
- Reactive dependencies are tracked automatically.

---

### Props and Children

**React:**
```javascript
function Card({ title, children }) {
	return <div className="card"><h2>{title}</h2>{children}</div>;
}
```

**DOThtml:**
```javascript
@dot.component
class Card extends DotComponent<{ title: string }> {
	build(dot) {
		return dot.div({ class: "card" },
			dot.h2(this.props.title),
			dot.slot() // children go here
		);
	}
}
```

**Key differences:**
- Use `class`, not `className`.
- Use `dot.slot()` instead of `children` to render child content.
- Props are accessed via `this.props`.

---

### Lifecycle Hooks

**React:**
```javascript
useEffect(() => {
	console.log("Mounted");
	return () => console.log("Unmounting");
}, []);
```

**DOThtml:**
```javascript
mounted() {
	console.log("Mounted");
}

unmounting() {
	console.log("Unmounting");
}
```

**Key differences:**
- DOThtml uses method names `mounted` and `unmounting`.
- No dependency arrays—reactivity is tracked automatically.
- No `useEffect`, `componentDidMount`, or `onMount`.

---

### Conditional Rendering

**React (lazy):**
```javascript
{visible && <p>I am shown</p>}
```

**DOThtml (eager):**
```javascript
dot.when(visible, dot.p("I am shown"));
```

**Key differences:**
- DOThtml `when` expects **eager markup**, not a factory function.
- **Do not** write `dot.when(visible, () => dot.p("x"))`—this throws error 13.
- The markup is built immediately, not lazily.

**React (ternary):**
```javascript
{mode === "edit" ? <Input /> : <p>View</p>}
```

**DOThtml:**
```javascript
dot.when(() => mode.value === "edit", 
	dot.mount(new Input())
).otherwise(
	dot.p("View")
);
```

---

### List Rendering

**React:**
```javascript
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

**DOThtml:**
```javascript
const items = dot.state([
	{ id: "a", name: "Alice" },
	{ id: "b", name: "Bob" }
], "id"); // keyed by "id"

dot.ul(
	dot.each(items, item => dot.li(item.name))
);
```

**Key differences:**
- Use `dot.each`, not `.map()`.
- The list must be a **signal** or a **zero-arg getter**, not a plain array.
- **Silent trap:** `dot.each(items.value, …)` renders once and never updates.
- **Silent trap:** `dot.each(this.items, …)` (accessing signal property directly) is not reactive.
- Pass the key property name to `dot.state([], "id")` for efficient keyed diffing.

---

### Form Inputs (Two-Way Binding)

**React:**
```javascript
const [name, setName] = useState("");

<input 
	type="text" 
	value={name} 
	onChange={e => setName(e.target.value)} 
/>
```

**DOThtml:**
```javascript
const name = dot.state("");

dot.input({ type: "text", bind: name });
```

**Key differences:**
- Use `{ bind: signal }` for two-way binding.
- **Trap:** `{ value: signal }` is **one-way only**. It does not update the signal when the user types.
- No need for `onChange` / `onInput` when using `bind`.

---

### CSS Classes

**React:**
```javascript
<div className="card active">Content</div>
```

**DOThtml:**
```javascript
dot.div({ class: "card active" }, "Content");
```

**Key differences:**
- Use `class`, not `className`.
- For dynamic classes, use an object: `{ class: { active: () => isActive.value } }`.

---

### Event Handlers

**React:**
```javascript
<button onClick={() => setCount(count + 1)}>
	Increment
</button>
```

**DOThtml:**
```javascript
const count = dot.state(0);

dot.button({ 
	onClick: () => count.value++ 
}, "Increment");
```

**Key differences:**
- Event names are the same (`onClick`, `onInput`, etc.).
- Signals are mutable—update with `count.value++`.

---

### Refs

**React:**
```javascript
const inputRef = useRef(null);

<input ref={inputRef} />
```

**DOThtml:**
```javascript
const inputRef = dot.state<HTMLInputElement>();

dot.input({ ref: inputRef });

// Access with inputRef.value
```

**Key differences:**
- DOThtml refs are signals.
- Access the DOM element with `.value` after mounting.

---

### Error Boundaries

**React:**
```javascript
componentDidCatch(error, errorInfo) {
	this.setState({ hasError: true });
}
```

**DOThtml:**
```javascript
errorCaught(error) {
	console.error("Caught:", error);
	return dot.div("Something went wrong"); // must return markup
}
```

**Key differences:**
- `errorCaught` must **return markup**, not set state and render conditionally.
- **Does not catch** event handler errors—use `try/catch` for those.

---

### Common Traps Summary

| React Pattern | DOThtml Equivalent | Common Mistake |
|---------------|-------------------|----------------|
| `useState(x)` | `dot.state(x)` | Using `.value` in lists: `dot.each(items.value, …)` ❌ |
| `className` | `class` | Using `className` ❌ |
| `children` | `dot.slot()` | Expecting `this.props.children` ❌ |
| `useEffect` / `onMount` | `mounted` | Using `onMount` ❌ |
| `{cond && <El />}` | `dot.when(cond, dot.el())` | Lazy factory: `() => dot.el()` ❌ |
| `value + onChange` | `{ bind: signal }` | Using `{ value: signal }` for two-way ❌ |
| `items.map(x => <li />)` | `dot.each(signal, x => …)` | Passing plain array without signal ❌ |

---

## High-Value Pages for Agents

When working on DOThtml projects, these pages contain the most critical information:

- **[llms.txt](https://dothtml.org/llms.txt)**: Links to all documentation
- **[llms-full.txt](https://dothtml.org/llms-full.txt)**: Full concatenated docs for LLM ingestion
- **[lists-and-conditionals.md](./lists-and-conditionals.md)**: Reactive patterns and anti-examples
- **[components.md](./components.md)**: Component definition, props, lifecycle
- **[error-handling.md](./error-handling.md)**: Error boundaries and `errorCaught` scope
- **[reactivity.md](./reactivity.md)**: Signals, computed, and bindings
- **[routing.md](./routing.md)**: Navigation, Link component, route params

---

## Quick Reference

**Install:**
```bash
npm install dothtml
```

**Component (TypeScript):**
```typescript
@dot.component
class MyComponent extends DotComponent<PropsType> {
	build(dot) { return dot.div("Hello"); }
}
```

**Component (JavaScript):**
```javascript
const MyComponent = dot.component(class {
	build(dot) { return dot.div("Hello"); }
});
```

**State:**
```javascript
const count = dot.state(0);
count.value++; // mutable
```

**Lists (reactive):**
```javascript
const items = dot.state([], "id");
dot.each(items, item => dot.li(item.name));
```

**Conditionals (eager):**
```javascript
dot.when(condition, dot.p("shown"));
```

**Forms (two-way):**
```javascript
dot.input({ type: "text", bind: name });
```

**Navigation:**
```javascript
import { navigate } from "dothtml";
navigate("/path");
```

**Styling:**
```javascript
stylize(s) {
	s.class("my-class", b => b.color("blue"));
}
```

---

This guide should help you avoid the most common traps and follow DOThtml's canonical patterns. For deeper details, always refer to the full documentation at [dothtml.org](https://dothtml.org).
