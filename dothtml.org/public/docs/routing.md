# Routing in DOThtml

DOThtml provides a powerful, reactive routing system that integrates seamlessly with its virtual DOM and watcher-based reactivity.

## Basic Usage

To use the router, define your routes and mount the `Router` component.

```javascript
import { dot, Router } from "dothtml";
import Home from "./Home";
import About from "./About";

const routes = [
    { path: "/", component: Home, title: "Home Page" },
    { path: "/about", component: About, title: "About Us" }
];

dot(document.body).mount(new Router(), { routes });
```

## Navigation with Link

Use the `Link` component for declarative navigation. It automatically handles active classes and prevents full page reloads.

```javascript
import { Link } from "dothtml";

dot.nav(
    dot.mount(new Link({ to: "/", label: "Home", exact: true })),
    dot.mount(new Link({ to: "/about", label: "About" }))
);
```

## Reactive Params

Routes can have parameters defined with `{paramName}` or `:paramName`. These are passed to the component as `routeParams`.

```javascript
const routes = [
    { 
        path: "/user/{id}", 
        component: UserProfile 
    }
];

class UserProfile {
    build(dot) {
        // Access params reactively
        return dot.div(`User ID: ${this.props.routeParams.id}`);
    }
}
```

## Query and Hash Reactivity

You can access query parameters and the URL hash reactively using `dot.useQueryParams()` and `dot.useHash()`.

```javascript
const query = dot.useQueryParams();
const hash = dot.useHash();

dot.div(dot.computed(() => `Search for: ${query.value.q}`));
dot.div(dot.computed(() => `Section: ${hash.value}`));
```

## Lazy Loading

Components can be loaded lazily using dynamic `import()`.

```javascript
const routes = [
    { 
        path: "/admin", 
        component: () => import("./AdminPanel") 
    }
];
```

## Navigation Guards

You can protect routes using `beforeEnter` on individual routes or global `beforeEach` guards.

```javascript
// Global guard
dot.Router.beforeEach((to, from, next) => {
    if (to === "/admin" && !isLoggedIn()) {
        next("/login");
    } else {
        next();
    }
});

// Route-specific guard
const routes = [
    {
        path: "/secret",
        component: SecretPage,
        beforeEnter: (to, from, next) => {
            if (hasAccess()) next();
            else next(false); // Cancel navigation
        }
    }
];
```

## Scroll Restoration

DOThtml automatically manages scroll positions. When navigating to a new page, it scrolls to the top. When using the back/forward buttons, it restores the previous scroll position. It also supports scrolling to elements via the URL hash.
