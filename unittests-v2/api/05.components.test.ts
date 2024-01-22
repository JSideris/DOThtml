import { FrameworkItems, IComponent, IDotCss, IDotGenericElement, IReactive } from "dothtml-interfaces";
import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";
import { component } from "../../src/decoration/component";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

// Test components

// Need to turn this off first!!!
component["_addTimestamp"] = false;

let TextDisplay = dot.component(class implements IComponent{
	events?: string[] | undefined;
	_?: FrameworkItems | undefined;
	// constructor(txt: string){}
	build(txt: string): IDotGenericElement {
		return dot.div(txt);
	}

});

let YesNoButton = dot.component(class implements IComponent{
	events?: string[] | undefined;
	$?: FrameworkItems | undefined;
	value: IReactive = dot.watch({value: true});

	build(defaultValue: boolean, yesText: IReactive|string = "yes", noText: IReactive|string = "no"): IDotGenericElement {
		this.value.setValue(defaultValue);
		return dot.div(dot.when(this.value, yesText).otherwise(noText))
	}
	style?(css: IDotCss): void {
	}
	creating?(...args: any[]): void {
	}
	ready?(): void {
	}
	deleting?(): void {
	}
	deleted?(): void {
	}
	built?(): void {
	}

});

describe("Components", ()=>{
	// test("Mount a component.", ()=>{
		
	// 	dot(document.body).mount(new YesNoButton(true));

	// 	expect(formatHTML(document.body.innerHTML)).toBe("<dothtml-10001><div>yes</div></dothtml-10001>")
	// });
	
	// test("Mount a component in a div.", ()=>{
		
	// 	dot(document.body).div(new YesNoButton(true));

	// 	expect(formatHTML(document.body.innerHTML)).toBe("<div><dothtml-10001><div>yes</div></dothtml-10001></div>")
	// });
	
	// test("Try mounting a component twice.", ()=>{
	// 	let c = new YesNoButton(true);
		
	// 	expect(()=>{
	// 		dot(document.body).mount(c).mount(c);
	// 	}).toThrow();
	// });

	test("Two instances.", ()=>{
		let c1 = new TextDisplay("abc");
		let c2 = new TextDisplay("def");
		
		dot(document.body).mount(c1).mount(c2);

		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>abc</div>");
		expect(document.body.children[1].shadowRoot?.innerHTML).toBe("<div>def</div>");
	});

	// test("Nested mount.", ()=>{
		
	// 	dot(document.body).div(dot.mount(new YesNoButton(true)));

	// 	expect(formatHTML(document.body.innerHTML)).toBe("<div><dothtml-10001><div>yes</div></dothtml-10001></div>")
	// });
	
	// test("Mount two components.", ()=>{
	// 	let c1 = new YesNoButton(true);
	// 	let c2 = new YesNoButton(false);

	// 	dot(document.body).mount(c1).mount(c2);

	// 	expect(formatHTML(document.body.innerHTML)).toBe("<dothtml-10001><div>yes</div></dothtml-10001><dothtml-10001><div>no</div></dothtml-10001>")
	// });
});