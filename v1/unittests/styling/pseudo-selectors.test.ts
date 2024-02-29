
import addTest from "../core";
import {dot} from "../../src/dothtml";

describe("Pseudo Selectors", () => {
    test.todo("pass");
});

// Possible syntaxes:
// 1. Multiple style functions.
// 	- dot(target).style(dot.css...)
// 	- dot(target).styleHover(dot.css...)
// 	P: Simple syntax.
// 	C: How would this work in a component's style builder? Multiple style builders seems messed up.
// 2. Pseudo functions.
// 	- dot(target).style(dot.css...pseudoHover(css=>css...).pseudoVisited(css=>css...)...)
//  P: Works for component style functions.
//  C: Builder syntax is somewhat heavy.
// 3. DOThtml style.
// 	- dot(target).style(dot.css...pseudoHover...pseudoVisted...pseudoNone...)
//  P: No weird function syntax.
//  P: Consistent with dothtml.
//  C: Inconsistent with dotcss.
//  C: Just weird.
// 4. Pseudo functions v2.
// 	- dot(target).style(dot.css...pseudo("hover", css=>css...).pseudo("visited", css=>css...)...)
// 	P/C: same as 2.

// I think 2 is the winner.

// addTest("Dotcss returns stringable value.", function(){
// 	return dot.a("Hover over me!").style(dot.css.pseudoHover(c=>c.color("green")));
// }, `<a style="color:"rgb(0, 255, 0);">Hover over me!</a>`); // TODO: need a way to inject the hover event.