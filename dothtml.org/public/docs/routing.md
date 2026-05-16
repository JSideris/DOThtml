# Routing in DOThtml

DOThtml provides a powerful, reactive routing system that integrates seamlessly with its virtual DOM and signal-based reactivity.

## Basic Usage

To use the router, define your routes and mount the `Router` component.

```javascript
import { dot, Router } from "dothtml";
import Home from "./Home";
import About from "./About";

const routes = [
    { path: "/", component: Home, title: "Home Page" },
    { path: "/about", component: About, title: "About Us" },
    // Declarative redirect
    { path: "/old-about", redirect: "/about" }
];

dot(document.body).mount(new Router(), { routes });
```

## Redirects

Routes can specify a `redirect` property to automatically forward users to another path. This can be a static string or a function that returns a path.

```javascript
const routes = [
    { path: "/old-profile", redirect: "/profile" },
    { 
        path: "/user/:id", 
        redirect: (params) => `/profile/${params.id}` 
    }
];
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

You can protect routes using `beforeEnter` on individual routes or global `beforeEach` guards. Guards support synchronous return values, asynchronous promises, and the traditional `next()` callback.

### Return-based API (Recommended)

Guards can return a `boolean` to allow/cancel navigation, or a `string` to redirect.

```javascript
// Global guard
dot.Router.beforeEach((to, from) => {
    if (to === "/admin" && !isLoggedIn()) {
        return "/login"; // Redirect
    }
    if (to === "/forbidden") {
        return false; // Cancel
    }
    return true; // Allow
});
```

### Async Guards

Guards can be `async` functions, allowing you to perform checks against an API or database.

```javascript
dot.Router.beforeEach(async (to) => {
    const user = await auth.getUser();
    if (to.startsWith("/admin") && !user?.isAdmin) {
        return "/unauthorized";
    }
});
```

### Callback-based API

The traditional `next()` callback is still supported for compatibility.

```javascript
dot.Router.beforeEach((to, from, next) => {
    if (hasAccess()) next();
    else next(false);
});
```

## Performance

The DOThtml router is highly optimized for performance. It caches route matching results during the build phase, ensuring that nested components and parameter resolution are extremely fast even in large applications with complex routing tables.

## Scroll Restoration

DOThtml automatically manages scroll positions. When navigating to a new page, it scrolls to the top. When using the back/forward buttons, it restores the previous scroll position. It also supports scrolling to elements via the URL hash.
