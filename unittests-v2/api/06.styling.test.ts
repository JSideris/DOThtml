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

	test("Using the style builder.", ()=>{
		
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

		dot(document.body).div({ 
			id: "test-el", 
			style: { 
				color: reactiveColor
			}
		});
		
		expect(document.getElementById("test-el")?.style.color).toEqual("red");
		
		reactiveColor.setValue("green");

		expect(document.getElementById("test-el")?.style.color).toEqual("green");
	});

	test("Style builder on element w/ observable value - hidden element.", ()=>{

		let reactiveColor = dot.watch("red");
		let showElement = dot.watch(true);

		dot(document.body).when(showElement, 
			dot.div({ 
				id: "test-el", 
				style: { 
					color: reactiveColor 
				} 
			})
		);
		
		expect(document.getElementById("test-el")?.style.color).toEqual("red");
		
		showElement.setValue(false);
		reactiveColor.setValue("green");
		
		expect(document.getElementById("test-el")).toBeNull();

		showElement.setValue(true);

		expect(document.getElementById("test-el")?.style.color).toEqual("green");
	});

	test("Filter builder on element w/ numeric value.", ()=>{

		dot(document.body).div({ 
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
		dot(document.body).div({ 
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

		let reactiveColor = dot.watch(4, {transformer: v=>`${v}px`});

		dot(document.body).div({ 
			id: "test-el", 
			style: {
				filter: {
					blur: reactiveColor
				}
			}
		});
		
		expect(document.getElementById("test-el")?.style.filter).toEqual("blur(4px)");
		
		reactiveColor.setValue(10);
		
		expect(document.getElementById("test-el")?.style.filter).toEqual("blur(10px)");
	});

	test("Filter builder on element w/ observable value (numeric).", ()=>{

		let reactiveColor = dot.watch(4);

		dot(document.body).div(
			{ id: "test-el", style: {
				filter: {
					blur: reactiveColor
				}
			}}
		);
		expect(document.getElementById("test-el")?.style.filter).toEqual("blur(4px)");
		
		reactiveColor.setValue(10);
		
		expect(document.getElementById("test-el")?.style.filter).toEqual("blur(10px)");
	});

	test("Multi-variat transform w/ observables.", ()=>{
		let x = dot.watch(4);

		dot(document.body).div({ 
			id: "test-el", 
			style: {
				transform: {
					translate: [x, 8]
				}
			}
		});
		
		expect(document.getElementById("test-el")?.style.transform).toEqual("translate(4px, 8px)");
		
		x.setValue(12);

		expect(document.getElementById("test-el")?.style.transform).toEqual("translate(12px, 8px)");
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
		dot(document.body).div({ 
			id: "test-el", 
			style: { 
				width: 100
			}
		});
		
		expect(document.getElementById("test-el")?.style.width).toEqual("100px");
	});	

	test("Cm.", ()=>{
		dot(document.body).div({ 
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
		dot(document.body).div({ 
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
		dot(document.body).div({ 
			id: "test-el", 
			style: {
				widthCm: cms,
				widthIn: inches
			}
		});
		
		expect(document.getElementById("test-el")?.style.width).toEqual("2in");
	});
});