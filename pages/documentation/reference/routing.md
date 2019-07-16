# Routing

DOThtml comes with a built-in router component named `router`, which generates a `<dothtml-router>` element that is used as a router outlet.

!!!API!!!
router - Built-in component for creating a router outlet.
---
- dot.
- The VDBO.
---
args{} - Arguments defining the behavior of the router.
.routes[] - An array of JSON objects defining each route supported by this router outlet.
..path - A relative URL that can be navigated to.
..component - A string indicating the path of the resource to be loaded form the server. Typically, a .js file that exports DOThtml syntax. Or a server resource that returns HTML. Alternatively, <code>component</code> could be an actual component defined in DOThtml using the <code>component</code> function.
..title - Optional | Title of the document that will be set upon navigating the route. If not specified, the document's title will not be updated.
.autoNavigate - Optional | Default true | Router will automatically navigate when outlet is created.
.onNavigateInit(navParams) - Optional | Function is called before any request is sent, and before the router outlet is emptied.
.onError(navParams) - Optional | Function is called in the event of an HTTP error.
.onResponse(navParams) - Optional | Function is called after a successful HTTP response, but before rendering.
.onComplete(navParams) - Optional | Function is called after an uncancelled route completes without an error.
---
The current VDBO, or dot, if a VDBO does not exist (is chainable).
---
``` JavaScript
dot.router({
	routes: [
		{
			path: "documentation/routing",
			component: "/pages/documentation/routing.js",
			title: "Routing"
		}
		/*...*/
	],
	noHistory: false 
});
```
!!!/API!!!

## The `navParams` Argument

<table class="api-table"><tbody>
	<tr><td class="prop-name"><code>navParams</code></pre></td><td>An object passed into router callbacks, providing information on the matched route, as well as the option to cancel navigation.</td></tr>
	<tr class="argument-or-field"><td class="prop-name">&nbsp;&nbsp;&nbsp;&nbsp;&#x21AA;<pre><code>cancel()</code></pre></td><td>Can be called in <code>onNavigateInit</code> to cancel navigation, or in <code>onResponse</code> to cancel rendering the result to the router outlet.</td></tr>
	<tr class="argument-or-field"><td class="prop-name">&nbsp;&nbsp;&nbsp;&nbsp;&#x21AA;<pre><code>element</code></pre></td><td>Contains a reference to the router outlet element.</td></tr>
	<tr class="argument-or-field"><td class="prop-name">&nbsp;&nbsp;&nbsp;&nbsp;&#x21AA;<pre><code>httpResponse</code></pre></td><td>Available in the <code>onResponse</code>, <code>onError</code> and <code>onComplete</code> callbacks, if an HTTP request was made. Contains a reference to the XMLHttpRequest object used to make the <code>GET</code> request.</td></tr>
	<tr class="argument-or-field"><td class="prop-name">&nbsp;&nbsp;&nbsp;&nbsp;&#x21AA;<pre><code>isNew</code></pre></td><td>Indicates that this route or it's parameters are different from what is currently loaded in the router outlet. If this is false, it means the outlet will not be cleared and navigation will be cancelled. It is possible to override this behavior by setting <code>isNew</code> to true in <code>onNavigateInit</code>.</td></tr>
	<tr class="argument-or-field"><td class="prop-name">&nbsp;&nbsp;&nbsp;&nbsp;&#x21AA;<pre><code>params{}</code></pre></td><td>A JSON object containing the parameters that were found in the given path for the matched route.</td></tr>
	<tr class="argument-or-field"><td class="prop-name">&nbsp;&nbsp;&nbsp;&nbsp;&#x21AA;<pre><code>path</code></pre></td><td>The path being navigated.</td></tr>
</tbody></table>

## Navigation

If the `autoNavigate` property is true (or omitted, since the default value is true), newly-instantiated routers will automatically navigate using the browser's path name (the part of the URL that comes after the domain and/or port). If `autoNavigate` is set to false, the router will be left empty until manual navigation occurs.

You can manually navigate to different paths by calling the `navigate` function.

!!!API!!!
navigate - Navigates all router components. If the matched route is already loaded by a router and all route parameters are the same, the onNavigateInit function will be called. However, the navigation will be cancelled.
---
- dot.
---
path - The path name to navigate to.
---
Nothing (is not chainable).
---
``` JavaScript
dot.navigate("/documentation/routing");
```
!!!/API!!!

## Nested Routers

DOThtml supports multiple routers on the same page and even nested routers.

On pages with nested routers, the document title will be set to the title specified by the innermost router.

> **_Warning:_** It is important to avoid recursive pages. A recursive page is a page containing a router that attempts to load itself. As a result, when the router makes this attempt, it will do so recursively until all browser resources are used up or until you exit the page.

## The `navLink` Component.

!!!API!!!
navLink - Built-in component for conveniently creating a navigation link. Navigation links are just <code>a</code> elements that navigates a path when clicked instead of reloading the page. 
---
- dot.
- The VDBO.
---
content - The content of the link.
href - The navigation path.
---
The current VDBO, or dot, if a VDBO does not exist (is chainable).
---
``` JavaScript
dot.navLink("Routing", "/documentation/routing")
```

Will generate: 

``` HTML

```
!!!/API!!!

The definition for this component is relatively simple, but somewhat tedious.

``` JavaScript
dot.component("navLink", function(content, href){
	return dot.a(content).href(href).onclick(function(e){
		e.preventDefault();
		dot.navigate(href);
	});
});
```

Providing the `href` attribute allows users to load the link in a new tab, and probably helps search engines map your site. `preventDefault` prevents the browser's default navigation function from navigating to the `href`.

## Single Page Applications in Older Browsers

When you navigate using the `navigate` function in a single page application, the URL of the page must be changed without reloading the whole page. Unfortunately, this behavior is not possible in IE9 and earlier. The workaround is to use hashes (#) for navigation, since it is possible to set the browser's hash without reloading the whole page. 

You don't need to worry about this. The built-in router component handles this automatically.

When an older browser loads a page at a specific route (other than the root route - `/`), it will automatically re-navigate to the hashed version of the route. 

So visiting `/documentation/routing` will redirect the browser to `/#/documentation/routing`. Thereafter, the `navigate` function will update the browser's hash, instead of its pathname. Again, this is done automatically. You shouldn't set up your routes using the `#` character.

If a hashed link is loaded into a more modern browsers, the `/#` will simply be removed without redirecting the page. So, make sure that none of the anchors on your main page (`/`) match routes.

## Under the Hood

In the previous section, we mentioned how you can manually navigate to different paths by calling the `navigate` function.

There is a lot happening under the hood when you call this function.

### 1. Navigation

After the `navigate` function is called, it iterates through the list of routers that are currently on the DOM. Each router instance is individually navigated to the specified route. 

### 2. Path Matching

The navigation path is tested against the list of routes for each router instance. The first route that matches the path is then selected.

### 3. Before Navigation

The next step is for the internal navigate function to check if the path specified is already loaded. If so, it will check whether or not the values for the parameters are the same. 

At this time, if an `onNavigateInit` function was provided to the router, it will be called, giving the user the option to cancel the navigation.

If the best-matching route is already loaded and the parameters are exactly the same, or if the user cancels navigation through the `navParams.cancel` function, the navigation for this router will be cancelled (but not for other routers).

Otherwise, the router outlet will be emptied with the `empty` function.

The route is then checked for validity (i.e., not null). If invalid, the navigation will be cancelled for this router, and it will be left empty.

### 4. Fulfilling the Navigation Request

If the `component` property for the route is, in fact, a DOThtml component, the component will be rendered inside the router, and the `onComplete` function will be called immediately, if one was provided for this router.

If the `component` is not a string, the internal navigate function will do nothing.

If the `component` property for the route is a string, a `get` request is sent to the server, using `component` as the request URL. 

After waiting asynchronously, the callback will check to see if the resource has a .js extension. If it does not, the resource will be rendered as HTML (regardless of the file type).

However, if the file does have a js. extension, the response message will be prepended with an exports variable and appended with a routes variable. The resource is then executed as a JavaScript file and rendered as a virtual HTML document. The router outlet is targeted bt the `dot` object.

### 5. Updating the Browser's Title and History

If `noHistory` is not specified to be true, the new path will be appended to the browser's history.

The page title will be updated to whatever was returned by the last router.