# Setup

This section discusses the following: how to set up DOThtml as a client-side library and how to configure your web server.

## DOThtml as a Client-Side Library

1. Download the [latest DOThtml](https://github.com/JSideris/DOThtml/releases/latest) from GitHub.
2. Place `dothtml.js` or `dothtml.min.js` into your project's scripts folder.
3. Link the library script into your project by using a `<script>` tag.
4. It's recommended that you put your main `<script>` element that uses DOThtml to generate markup at the bottom of your document's `<body>`.

> **_Pro tip:_** You can add some starter markup to your page's `<body>` to be displayed when your page is loading on an extremely slow connection.

A basic starter application might look like this:

``` HTML
<!doctype html>
<html>
	<body>
		<img src="/images/loading.gif" />

		<script src="/scripts/dothtml.js"></script>
		<script>
			dot("body").h1("Hello, world!");
		</script>
	</body>
</html>
```

You can also load DOThtml as deferred, but be sure that you defer your `dot` markup execution until after DOThtml is ready.

## Webserver Configuration

If you plan on using [routing](/documentation/routing) to build a single-page application, some configuration will be requried on your web server.

Your web server should serve your application's root file (usually index.html) for all supported routes. Therefore, if a user navigates to one of your pages from off-site, by typing in the URL, refreshing the page, etc., the application will be able to load, render the router outlet(s), and request the appropriate content for the page.

Your server should be configured to prioritize serving files in your application's public directory (if they exist), as well as any other server-side routes or APIs. 

>*_Warning:_* Be careful not to overlap DOThtml router paths and actual hosted files or server-side API routes.

Avoid the practice of serving your application's root file by default any time a file at the browser's path name does not exist as a resource on the server. This is messy, eliminates legitimate 404 errors, and, in some setups, opens the door to infinite recursive loading of your full application inside nested router outlets. Instead, configure your server to serve your application's root for all valid client-side routes.

Consider the following scenarios:

|    Scenario    |    Result    |
| --- | --- |
|    *Scenario 1 - The user types in a valid URL that is not a resource on the server, but is identified as being a potential client-side route.*    |    <ol><li>The request hits the server.</li><li>The server identifies the path as a valid route and serves index.html.</li><li>The router is loaded.</li><li>The router navigate is initiated automatically based on the URL's pathname. Either no route is found *[see scenario 2]* or a route is found for a resource that does not exist *[see scenario 3]*.</li></ol>    |
|    *Scenario 2 - The `navigate` function is used for a path that does not resolve to a route.*    |    <ol><li>The router tries to resolve the pathname to a route, but cannot find one.</li><li>The router loads a default fall-through page (or nothing).</li></ol>    |
|    *Scenario 3 - The `navigate` function is used to load a server resource that does not exist.*    |    <ol><li>The router tries to resolve the pathname to a route, finds one, and attempts to `get` the resource.</li><li>The request hits the server.</li><li>The server cannot find the requested resource, but the path is not a valid client-side route. The server responds with a 404 error.</li><li>The router handles the 404 error.</li></ol>    |
|    *Scenario 4 - The user types in a URL that is not a resource on the server and is not identified as being a potential client-side route.*    |    <ol><li>The request hits the server.</li><li>The server cannot find the requested resource, and the path is not a valid client-side route. The server returns a 404 error.</li></ol>    | 

## Relative URLs in Single-Page Applications (SPAs)

When building a SPA using the DOThtml router component, special consideration should be given to relative URL paths that may not be necessary in regular multi-page apps. This is because when the browser's pathname is set to any subdirectory (whether or not that directory exists on the server), certain techniques for specifying relative URLs tend to concatenate the relative URL to the existing pathname. This is a hazard in SPAs because the paths being served may not exist as actual directories on the server, and the same files may need to be served from various path names.

The following table illustrates what works, and what doesn't.

| Example of a Path | How it's resolved by browsers. | Will it Work? |
| --- | --- | --- |
| **https://example.com/myfile.png** | Absolute path directly to file. Does not get concatenated to anything. | <b style="color:orange;">YES, BUT NOT RECOMMENDED</b> - Unless you are linking to an external resource, it's recommended that all paths be kept relative so that they will work in different environments. |
| **/myfile.png** | Relative path will be appended to the host name (consisting of the domain, TLD, and sometimes the port). | <b style="color:green;">YES</b> - This is the recommended way to refer to all relative paths. |
| **./myfile.png** or **myfile.png** | Concatenates the relative path to whatever comes before the last / character in the pathname. | <b style="color:red;">NO</b> - The resulting paths may not exist as resources on the server, or may end up resolving to the root file (index.html) by the server. |