import { FrameworkItems, IComponent, IDotCss, IDotGenericElement, IReactive } from "dothtml-interfaces";
import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";
import { component } from "../../src/decoration/component";

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
		dot(document.body).div().id("test-el").style("color:red;");
		
		expect(document.getElementById("test-el")?.style.color).toEqual("red");
	});
	
	test("Style builder on element.", ()=>{
		dot(document.body).div().id("test-el").style(dot.css.color("green"));
		
		expect(document.getElementById("test-el")?.style.color).toEqual("green");
	});

	test("Style builder on element w/ observable value.", ()=>{

		let reactiveColor = dot.watch({value: "red" as string});

		dot(document.body).div().id("test-el").style(dot.css.color(reactiveColor as any));
		
		expect(document.getElementById("test-el")?.style.color).toEqual("red");
		
		reactiveColor.setValue("green");

		expect(document.getElementById("test-el")?.style.color).toEqual("green");
	});

	test("Style builder on element w/ observable value - hidden element.", ()=>{

		let reactiveColor = dot.watch({value: "red" as string});
		let showElement = dot.watch({value: true as boolean});

		dot(document.body).when(showElement, 
			dot.div().id("test-el").style(dot.css.color(reactiveColor as any))
		);
		
		expect(document.getElementById("test-el")?.style.color).toEqual("red");
		
		showElement.setValue(false);
		reactiveColor.setValue("green");
		
		expect(document.getElementById("test-el")).toBeNull();

		showElement.setValue(true);

		expect(document.getElementById("test-el")?.style.color).toEqual("green");
	});
});