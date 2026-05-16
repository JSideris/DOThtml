import { FrameworkItems, IDotComponent, IDotCss, IDotDocument } from "dothtml-interfaces";
import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

// TODO:
// - Don't forget styles should be able to be applied to classes that affect multiple elements.
// - Tests for all the at rules.
// - Tests for all the complex prop values.

afterEach(() => { 
	let styles = document.getElementsByTagName("style");

	for(let i = styles.length-1; i >= 0; i--){
		styles[i].parentElement?.removeChild(styles[i]);
	}

	(dot as any).globalStyles = [];

	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Style builder.", ()=>{
	// Add style builder tests here.
	// Tests should enruse that the style builder generates well-formed CSS and can to-string it.
});

describe("Global styles.", ()=>{
	test("Global useStyles.", ()=>{
		let css = "#global-test{color: red;}";

		dot.useStyles(document, css);

		let styleTag = document.getElementsByTagName("style")[0] ?? null;

		expect(styleTag).not.toBeNull();

		expect(styleTag.innerHTML).toBe(css);
	});

	test("Meta: Global styles removed after test.", ()=>{

		let styleTag = document.getElementsByTagName("style")[0] ?? null;

		expect(styleTag).toBeNull();
	});

	test("Global useGlobalStyles.", ()=>{
		let css = ".global-class{color: blue;}";
		(dot as any).useGlobalStyles(css);
		expect((dot as any).globalStyles).toContain(css);
	});
});

describe("Component styles.", ()=>{
	test("Component styles.", ()=>{
		let css = "#component-test{color: rgb(255, 0, 0);}";

		class MyComp implements IDotComponent{
			_?: FrameworkItems | undefined;
			stylize() { return css; }
			build(): IDotDocument {
				return dot.div({id: "component-test"});
			}
		}

		dot(document.body).mount(new MyComp());
		dot.flushSync();

		let customEl = document.body.children[0];
		let shadowRoot = customEl.shadowRoot;
		expect(shadowRoot).not.toBeNull();

		let stylesApplied = false;
		if (shadowRoot!.adoptedStyleSheets && shadowRoot!.adoptedStyleSheets.length > 0) {
			stylesApplied = true; // Assume it works if there are sheets.
		}
		if (!stylesApplied) {
			let styleTag = shadowRoot!.querySelector("style");
			if (styleTag) {
				stylesApplied = styleTag.innerHTML.includes("#component-test");
			}
		}

		expect(stylesApplied).toBe(true);
	});

	test("Global style adoption.", ()=>{
		let globalCss = ".global-style{color: rgb(0, 255, 0);}";
		(dot as any).useGlobalStyles(globalCss);

		class MyComp implements IDotComponent{
			_?: FrameworkItems | undefined;
			build(): IDotDocument {
				return dot.div({class: "global-style", id: "global-test"});
			}
		}

		dot(document.body).mount(new MyComp());
		dot.flushSync();

		let customEl = document.body.children[0];
		let shadowRoot = customEl.shadowRoot;
		
		let stylesApplied = false;
		if (shadowRoot!.adoptedStyleSheets && shadowRoot!.adoptedStyleSheets.length > 0) {
			stylesApplied = true;
		}
		if (!stylesApplied) {
			let styleTags = shadowRoot!.querySelectorAll("style");
			for (let i = 0; i < styleTags.length; i++) {
				if (styleTags[i].innerHTML.includes(".global-style")) {
					stylesApplied = true;
					break;
				}
			}
		}

		expect(stylesApplied).toBe(true);
	});

	test("Host variable binding.", ()=>{
		let color = dot.watch("rgb(0, 0, 255)");
		
		class MyComp implements IDotComponent{
			_?: FrameworkItems | undefined;
			stylize() { return ".inner{color: var(--host-color);}"; }
			hostStyle(s: any) { s.variable("host-color", color); }
			build(): IDotDocument {
				return dot.div({class: "inner", id: "host-test"});
			}
		}

		dot(document.body).mount(new MyComp());
		dot.flushSync();

		let customEl = document.body.children[0] as HTMLElement;
		expect(customEl.style.getPropertyValue("--host-color")).toBe("rgb(0, 0, 255)");

		color.value = "rgb(255, 255, 0)";
		dot.flushSync();
		expect(customEl.style.getPropertyValue("--host-color")).toBe("rgb(255, 255, 0)");
	});

	test("Fluent stylize builder.", ()=>{
		class MyComp {
			_?: FrameworkItems | undefined;
			stylize(s: any): any { 
				return s.class("inner", c => c
					.color("rgb(255, 0, 0)")
					.fontSizePx(20)
				);
			}
			build(): IDotDocument {
				return dot.div({class: "inner", id: "fluent-test"});
			}
		}

		dot(document.body).mount(new MyComp() as any);
		dot.flushSync();

		let customEl = document.body.children[0];
		let shadowRoot = customEl.shadowRoot;
		expect(shadowRoot).not.toBeNull();

		let stylesApplied = false;
		if (shadowRoot!.adoptedStyleSheets && shadowRoot!.adoptedStyleSheets.length > 0) {
			stylesApplied = true;
		}
		if (!stylesApplied) {
			let styleTag = shadowRoot!.querySelector("style");
			if (styleTag) {
				stylesApplied = styleTag.innerHTML.includes(".inner") && styleTag.innerHTML.includes("color: rgb(255, 0, 0)");
			}
		}

		expect(stylesApplied).toBe(true);
	});
});

describe("Element styles.", ()=>{
	test("Element style as string", ()=>{
		dot(document.body).div( { id: "test-el", style: "color:red;" });
		
		expect(document.getElementById("test-el")?.style.color).toEqual("red");
	});
	
	test("Style builder on element.", ()=>{
		dot(document.body).div({ 
			id: "test-el", 
			style: { 
				color: "green" 
			}
		});
		
		expect(document.getElementById("test-el")?.style.color).toEqual("green");
	});

	test("Style builder on element w/ observable value.", ()=>{

		let reactiveColor = dot.watch("red");

		(dot(document.body) as any).div({ 
			id: "test-el", 
			style: { 
				color: reactiveColor
			}
		});
		
		expect(document.getElementById("test-el")?.style.color).toEqual("red");
		
		reactiveColor.value = "green";
		dot.flushSync();

		expect(document.getElementById("test-el")?.style.color).toEqual("green");
	});

	test("Style builder on element w/ observable value - hidden element.", ()=>{

		let reactiveColor = dot.watch("red");
		let showElement = dot.watch(true);

		(dot(document.body) as any).when(showElement, 
			(dot as any).div({ 
				id: "test-el", 
				style: { 
					color: reactiveColor 
				} 
			})
		);
		
		expect(document.getElementById("test-el")?.style.color).toEqual("red");
		
		showElement.value = false;
		reactiveColor.value = "green";
		dot.flushSync();
		
		expect(document.getElementById("test-el")).toBeNull();

		showElement.value = true;
		dot.flushSync();

		expect(document.getElementById("test-el")?.style.color).toEqual("green");
	});

	test("Filter builder on element w/ numeric value.", ()=>{

		(dot(document.body) as any).div({ 
			id: "test-el", 
			style: {
				filter: {
					blur: 4
				}
			}
		});
		
		expect(document.getElementById("test-el")?.style.filter).toEqual("blur(4px)");
	});

	test("Multi-variat transform.", ()=>{
		(dot(document.body) as any).div({ 
			id: "test-el", 
			style: {
				transform: {
					translate: [4, 8]
				}
			}
		});
		
		expect(document.getElementById("test-el")?.style.transform).toEqual("translate(4px, 8px)");
	});

	test("Filter builder on element w/ observable value (string).", ()=>{

		let reactiveColor = dot.watch(4) as any;

		(dot(document.body) as any).div({ 
			id: "test-el", 
			style: {
				filter: {
					blur: reactiveColor
				}
			}
		});
		
		expect(document.getElementById("test-el")?.style.filter).toEqual("blur(4px)");
		
		reactiveColor.value = 10;
		dot.flushSync();
		
		expect(document.getElementById("test-el")?.style.filter).toEqual("blur(10px)");
	});

	test("Filter builder on element w/ observable value (numeric).", ()=>{

		let reactiveColor = dot.watch(4);

		(dot(document.body) as any).div(
			{ id: "test-el", style: {
				filter: {
					blur: reactiveColor
				}
			}}
		);
		expect(document.getElementById("test-el")?.style.filter).toEqual("blur(4px)");
		
		reactiveColor.value = 10;
		dot.flushSync();
		
		expect(document.getElementById("test-el")?.style.filter).toEqual("blur(10px)");
	});

	test("Multi-variat transform w/ observables.", ()=>{
		let x = dot.watch(4);

		(dot(document.body) as any).div({ 
			id: "test-el", 
			style: {
				transform: {
					translate: [x, 8]
				}
			}
		});
		
		expect(document.getElementById("test-el")?.style.transform).toEqual("translate(4px, 8px)");
		
		x.value = 12;
		dot.flushSync();

		expect(document.getElementById("test-el")?.style.transform).toEqual("translate(12px, 8px)");
	});

	test("Multi-variat transform w/ observables - specific dimensions.", ()=>{
		let x = dot.watch(4);

		(dot(document.body) as any).div({ 
			id: "test-el", 
			style: {
				transform: {
					translateX: x,
					translateY: 8
				}
			}
		});
		
		expect(document.getElementById("test-el")?.style.transform).toEqual("translateX(4px) translateY(8px)");
		
		x.value = 12;
		dot.flushSync();

		expect(document.getElementById("test-el")?.style.transform).toEqual("translateX(12px) translateY(8px)");
	});

	test("Multi-variat transform w/ observables - specific dimensions with array.", ()=>{
		let x = dot.watch(4);

		(dot(document.body) as any).div({ 
			id: "test-el", 
			style: {
				transform: [
					{
						translateX: x,
						translateY: 8
					}
				]
			}
		});
		
		expect(document.getElementById("test-el")?.style.transform).toEqual("translateX(4px) translateY(8px)");
		
		x.value = 12;
		dot.flushSync();

		expect(document.getElementById("test-el")?.style.transform).toEqual("translateX(12px) translateY(8px)");
	});
});

describe("Data types.", ()=>{
	// Not supported anymore (at least not for now).
	// test("String length.", ()=>{
	// 	dot(document.body).div({ 
	// 		id: "test-el", 
	// 		style: { 
	// 			width: "100pt"
	// 		}
	// 	});
		
	// 	expect(document.getElementById("test-el")?.style.width).toEqual("100pt");
	// });

	test("Px default.", ()=>{
		(dot(document.body) as any).div({ 
			id: "test-el", 
			style: { 
				width: 100
			}
		});
		
		expect(document.getElementById("test-el")?.style.width).toEqual("100px");
	});	

	test("Cm.", ()=>{
		(dot(document.body) as any).div({ 
			id: "test-el", 
			style: { 
				widthCm: 2
			}
		});
		
		expect(document.getElementById("test-el")?.style.width).toEqual("2cm");
	});	

	// TODO: try to add some additional tests if possible.
});

describe("Overloads.", ()=>{
	test("Length overload.", ()=>{
		(dot(document.body) as any).div({ 
			id: "test-el", 
			style: { 
				width: 100,
				widthIn: 2
			}
		});
		
		expect(document.getElementById("test-el")?.style.width).toEqual("2in");
	});
	
	test("Length overload with observable.", ()=>{
		let cms = dot.watch(5);
		let inches = dot.watch(2);
		(dot(document.body) as any).div({ 
			id: "test-el", 
			style: {
				widthCm: cms,
				widthIn: inches
			}
		});
		
		expect(document.getElementById("test-el")?.style.width).toEqual("2in");
	});
});