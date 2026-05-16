[https://dothtml.org/](https://dothtml.org/) for documentation.

## The DOThtml Paradigm

Most modern web frameworks are "all or nothing." DOThtml is different. It is a **UI Engine** designed to provide a component-based, reactive workflow to projects that have their own primary architecture. 

Whether you are building a high-performance game, a browser extension, or modernizing a legacy enterprise app, DOThtml stays out of your way while giving you the power of modern web components. Of course, it also works perfectly as a full-scale framework for building entire web applications from scratch.

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
- Animations kind of broke when merging DOTcss in, and don't support the increased complexity which is now allowed.
- All length properties take a single value. Two and four argument lengths (for things like margin) are not yet supported. 
- A lot of CSS properties don't enforce proper typing and will allow any string. This is a WIP and will naturally get better over time.
- CSS @ rules like @keyframes, @font-face, etc are currently not supported because they are currently not configurable in JavaScript. A workaround that generates dynamic CSS is planned.

- Support for header elements (including stylesheets) is planned.
