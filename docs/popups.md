# Popup Window Management

DOThtml provides a powerful "Multi-Window Orchestration Layer" that allows you to treat popup windows as seamless extensions of your main application. Unlike standard `window.open` calls, DOThtml popups support shared state, style inheritance, and robust lifecycle management.

## Basic Usage

To create a new window, use the `dot.window()` factory. This returns a wrapper object that you can use to control the window.

```typescript
import { dot } from "dothtml";
import { MyPopupComponent } from "./components/MyPopupComponent";

const myWindow = dot.window({
	content: new MyPopupComponent(),
	width: 800,
	height: 600,
	title: "Editor Tool"
});

// The window is not opened until you call .open()
await myWindow.open();
```

## Configuration Options

The `dot.window()` method accepts several options to customize the behavior of the popup:

| Option | Type | Description |
| :--- | :--- | :--- |
| `content` | `IDotComponent` | The root component to render inside the popup. |
| `width` | `number` | The width of the window in pixels (default: 600). |
| `height` | `number` | The height of the window in pixels (default: 400). |
| `title` | `string` | The title of the window document. |
| `position` | `string \| object` | Smart positioning: `"center"`, `"parent-center"`, `"beside-parent"`, or `{left, top}`. |
| `syncStyles` | `boolean` | If `true`, clones all styles and CSS variables from the parent window. |
| `tether` | `boolean` | If `true`, the popup will automatically close when the parent window is closed. |

## Controlling the Window

The window wrapper provides several methods to manage the popup's lifecycle and state:

```typescript
// Programmatically close the window
myWindow.close();

// Focus the window or bring it to the front
myWindow.focus();
myWindow.bringToFront();

// Resize or move the window
myWindow.resizeTo(1024, 768);
myWindow.moveTo(100, 100);
```

## Cross-Window Reactivity

One of the most powerful features of DOThtml popups is that they share the same reactive context as the main application.

*   **Signals**: If you pass a `Signal` from the main app into the popup component's props, the popup will reactively update whenever that signal changes.
*   **Stores**: Global stores are shared across all windows. Updating a store in a popup will instantly reflect in the main window and vice versa.

## Style & Theme Synchronization

When `syncStyles: true` is enabled, DOThtml automatically ensures the popup looks exactly like your main application by:
1.  Copying the `class` list from the parent `<body>` (perfect for dark mode syncing).
2.  Cloning all `adoptedStyleSheets`.
3.  Injecting all `<style>` and `<link rel="stylesheet">` tags from the parent `<head>`.
4.  Syncing all CSS variables (custom properties) defined on `:root`.

## Event Handling

You can listen for events on the popup window directly from the main application using the `.on()` method.

```typescript
myWindow.on("click", (e) => {
	console.log("The popup was clicked!");
});

// Custom events triggered inside the popup also bubble up
myWindow.on("save-data", (data) => {
	saveToDatabase(data);
});
```
