# Routing

## Defining a Router

The DOThtml router function instantiates a built-in component, which generates a `<dothtml-router>` element that is used as a router outlet.

## Creating a Router

To create a router, you must use the built-in `dot.router` component. The `dot.router` accepts JSON objects (see the example below):


``` JavaScript
{
	routes: [
		{
			path: "documentation/routing",
			title: "Routing",
			component: "/pages/documentation/routing.js"
		}
		/*...*/
	],
	noHistory: false 
}
```

There are two main objects: `routes` and `noHistory`:

### Routes

The `routes` object contains an array of fields: `path`, `title`, and `component`. 

The `path` field accepts a relative URL (i.e., the URL that the dot.router navigates to), the `title` field sets your browser's title when the dot.router is navigating to the route, and the `component` field contains the relative/absolute file path of what was imported or the DOThtml component.

### noHistory

The `noHistory` object is *optional* , and the value is automatically set to `false` (that is the default). However, if you wish to keep track of your navigation history, you may set the value to `true`.

## Navigation

Once the `<dothtml-router>` is on the DOM, DOThtml automatically navigates to the route (based on the browser's path name, which is the part of the URL that comes after the domain and/or port). 

You can manually navigate to different paths by calling the `dot.navigate("/*...*/")` function and passing in the path name.

## Nested Routers

DOThtml supports multiple routers on the same page and even nested routers. Any nested routers are added to DOThtml's internal list of routers.

> **_Warning:_** It is important to avoid recursive pages. A recursive page is a page containing a router that attempts to load itself. As a result, when the router makes this attempt, it will do so recursively until all brower resources are used up or until you exit the page.

## Under the Hood

In the previous section, we mentioned how you can manually navigate to different paths by calling the `dot.navigate` function.

There is a lot happening under the hood when you call this function.

### Event Handling

In DOThtml, when you click on a button, that button triggers an event, and the event handler calls the `dot.navigate("/*...*/") function.

### Internal Navigation

After the navigate function in DOThtml is called, it iterates through the list of routers that are currently on the DOM. For each router instance, an *internal* navigate function (not to be confused with the `dot.navigate` function, which is external) is called. 

### Segmentation

After each internal navigate function is called, the navigation path is broken down into segments. Those segments are then tested against the router instances' list of routes. The first route that matches the path is then selected.

### Checking the Route

The next step is for the internal navigate function to check if the path specified is already loaded. If so, it will check whether or not the values for the parameters are the same. If the values for the parameters are the same, it will do nothing. If, however, the route has not been loaded, or if the values for the parameters are not the same, the router outlet will be emptied with the `dot.empty()` function.

Once the router outlet has been emptied, the internal navigate function will check whether or not the route is valid (i.e., not null). If invalid, it will do nothing. However, if it is valid, it will then check to see if the component is a DOThtml component.

### Checking the Component

If the component is, in fact, a DOThtml component, the internal navigate function will pass in the route information and the component will be rendered.

If the component is not a DOThtml component, the internal navigate function will check if it is a string. If the component is not a string, the internal navigate function will do nothing. If, however, it is a string, an XML http GET request is made to the server.

After waiting asyncronously, the callback will check to see if the resource has a .js extension. If it does not, the resource will be rendered as HTML (regardless of the file type).

However, if the file does have a js. extension, the response message will be prepended with an exports variable and appended with a routes variable. The resource is then executed as a JavaScript file and rendered as a virtual HTML document. The router outlet is targetted bt the `dot` object.