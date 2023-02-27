[https://dothtml.org/](https://dothtml.org/) for documentation (currently somewhat out of date since DOTcss was merged in and library was ported to TypeScript and put on NPM).

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
- CSS @ rules like @keyframes, @media, @font-face, etc are currently not supported because they are currently not configurable in JavaScript. A workaround that generates dynamic CSS is planned.

- Support for header elements (including stylesheets) is planned.