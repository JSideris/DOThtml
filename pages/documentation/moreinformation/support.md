# Browser Support

## Browsers

One of the advantages of DOThtml is that it is designed to be compatible with both older and future browsers. It has been tested on many desktop and mobile browsers, including BlackBerry, and Internet Explorer 8.

## Known Compatibility Issues

- Two-way binding doesn't work yet in IE8. Updating the model does not get reflected in the view.

## Considerations

- In IE 9 and earlier, routing uses fragment identifiers (# - hashes) instead of path names (because `history.pushState` wasn't available, and SPAs that update the window's URL were not really possible). Hashes are the only workaround to not reloading the entire page on each navigation. Not an ideal solution, but better than your app just not working. If reverse compatibility is a requirement, be mindful of how you use (and name) page anchors, or avoid building an SPA.

To test DOThtml on any JavaScript-enabled browser, please visit the test [case page].