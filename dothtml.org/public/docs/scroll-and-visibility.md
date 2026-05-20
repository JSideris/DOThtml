# Scroll, Visibility & Observers

DOThtml provides full access to standard web APIs like `scroll` events, `IntersectionObserver`, `ResizeObserver`, and `MutationObserver`. By combining these with DOThtml's **Lifecycle Hooks**, **Refs**, and **Signals**, you can create high-performance, responsive, and reactive user experiences.

## Watching Global Scroll

To react to the page's scroll position, use the `mounted()` and `unmounting()` lifecycle hooks to manage a global event listener.

```javascript
import { dot, DotComponent } from "dothtml";

@dot.component
class StickyHeader extends DotComponent {
    isSticky = dot.state(false);

    mounted() {
        this.scrollHandler = () => {
            this.isSticky.value = window.scrollY > 100;
        };
        window.addEventListener("scroll", this.scrollHandler, { passive: true });
    }

    unmounting() {
        window.removeEventListener("scroll", this.scrollHandler);
    }

    stylize(s) {
        return s.class("header", c => c
            .position("fixed")
            .topPx(0)
            .widthP(100)
            .transition("background 0.3s")
        ).class("header.sticky", c => c
            .backgroundColor("rgba(0, 0, 0, 0.8)")
            .boxShadow("0 2px 10px rgba(0,0,0,0.3)")
        );
    }

    build(dot) {
        return dot.header({ 
            class: this.isSticky.bindAs(v => v ? "header sticky" : "header") 
        }, "My Awesome App");
    }
}
```

## Element Visibility (IntersectionObserver)

The `IntersectionObserver` API is the most efficient way to detect when an element enters or leaves the viewport. In DOThtml, you use a **Ref** to target the element and a **Signal** to track its visibility.

### Reveal on Scroll

```javascript
@dot.component
class RevealBox extends DotComponent {
    isVisible = dot.state(false);
    boxRef = dot.ref();

    mounted() {
        this.observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                this.isVisible.value = true;
                this.observer.disconnect(); // Only trigger once
            }
        }, { threshold: 0.1 });

        if (this.boxRef.value) {
            this.observer.observe(this.boxRef.value);
        }
    }

    unmounting() {
        this.observer.disconnect();
    }

    stylize(s) {
        return s.class("box", b => b
            .opacity(0)
            .transform("translateY(30px)")
            .transition("all 0.6s ease-out")
        ).class("box.visible", b => b
            .opacity(1)
            .transform("translateY(0)")
        );
    }

    build(dot) {
        return dot.div({ 
            ref: this.boxRef,
            class: this.isVisible.bindAs(v => v ? "box visible" : "box")
        }, "I appear when you scroll to me!");
    }
}
```

## Element Size (ResizeObserver)

The `ResizeObserver` API allows you to react to changes in an element's dimensions, which is useful for building components that need to adjust their internal layout based on their own size (rather than the viewport size).

```javascript
@dot.component
class ResponsiveWidget extends DotComponent {
    width = dot.state(0);
    containerRef = dot.ref();

    mounted() {
        this.observer = new ResizeObserver(([entry]) => {
            this.width.value = entry.contentRect.width;
        });

        if (this.containerRef.value) {
            this.observer.observe(this.containerRef.value);
        }
    }

    unmounting() {
        this.observer.disconnect();
    }

    build(dot) {
        return dot.div({ 
            ref: this.containerRef,
            class: "widget-container" 
        }, 
            this.width.bindAs(w => w < 400 ? "I am small" : "I am large")
        );
    }
}
```

## DOM Mutations (MutationObserver)

Use `MutationObserver` to watch for changes to the DOM tree, such as elements being added or removed, or attributes being modified. This is particularly useful when integrating with third-party libraries that manipulate the DOM directly.

```javascript
@dot.component
class DOMWatcher extends DotComponent {
    lastMutation = dot.state("None");
    targetRef = dot.ref();

    mounted() {
        this.observer = new MutationObserver((mutations) => {
            this.lastMutation.value = mutations[0].type;
        });

        if (this.targetRef.value) {
            this.observer.observe(this.targetRef.value, { 
                attributes: true, 
                childList: true, 
                subtree: true 
            });
        }
    }

    unmounting() {
        this.observer.disconnect();
    }

    build(dot) {
        return dot.div(
            dot.div({ ref: this.targetRef }, "Watch me!"),
            dot.p("Last mutation: ", this.lastMutation)
        );
    }
}
```

## Performance Best Practices

1.  **Use Signals for Classes**: Instead of manually updating `element.style` inside a scroll listener, update a `Signal` and bind it to a CSS class. This allows DOThtml to batch the update and avoids layout thrashing.
2.  **Leverage `hostStyle` for High-Frequency Updates**: For high-frequency changes like scroll position or mouse movement, use **[hostStyle](./styling.md#host-variable-binding)** to update a CSS variable. This is significantly more performant than re-rendering the component's HTML structure.
3.  **Manual Flushing with `dot.flushSync`**: If you need to measure an element's size or position immediately after updating a signal, use **[dot.flushSync()](./reactivity.md#manual-flushing-dotflushsync)** to force the DOM to update synchronously.
4.  **Clean Up Listeners & Observers**: Always remove event listeners and disconnect observers in `unmounting()` to prevent memory leaks, especially in single-page applications.
5.  **Passive Listeners**: When adding scroll listeners, use `{ passive: true }` if you don't need to call `preventDefault()`, as it improves scroll performance.
6.  **Thresholds**: Use appropriate `threshold` values in `IntersectionObserver` to balance responsiveness and performance.

```javascript
// Example of high-performance scroll tracking using hostStyle
hostStyle(s) {
    s.variable("scroll-y", this.scrollY);
}

mounted() {
    this.scrollHandler = () => {
        this.scrollY.value = window.scrollY;
    };
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
}
```

## Next Steps

Learn more about how to capture elements with **[Refs](./refs.md)**, how to manage complex application state with **[Stores](./stores.md)**, or explore high-performance **[Styling](./styling.md)** techniques.
