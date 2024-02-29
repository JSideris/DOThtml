import { FrameworkItems, IComponent, IDotCss, IDotDocument, IReactive } from "dothtml-interfaces";
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

// TODO: typed props and events would be GREAT. But it's not easy to do. Some thought has to go into it.

let TextDisplay = dot.component<["txt"]>(class implements IComponent{
	// constructor(txt: string){}
	_: FrameworkItems;
	build(): IDotDocument {
		return dot.div(this._.props.txt);
	}
});

let YesNoButton = dot.component<["defaultValue", "yesText", "noText"], []>(class implements IComponent{
	value = dot.watch(true);
	_: FrameworkItems;

	build(): IDotDocument {
		this.value.setValue(this._.props.defaultValue);
		return dot.div(dot.when(this.value, this._.props.yesText).otherwise(this._.props.noText))
	}
});

describe("Components", ()=>{
	test("Mount a component.", ()=>{
		
		dot(document.body).mount(new YesNoButton({ defaultValue: true, yesText: "yes" }));

		// expect(formatHTML(document.body.innerHTML)).toBe("<dothtml-10001><div>yes</div></dothtml-10001>")
		expect(formatHTML(document.body.innerHTML)).toBe("<dothtml-10001></dothtml-10001>");
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toBe("<div>yes</div>");
	});
	
	test("Mount a component in a div.", ()=>{
		
		dot(document.body).div(new YesNoButton({ defaultValue: true, yesText: "yes" }));

		expect(formatHTML(document.body.innerHTML)).toBe("<div><dothtml-10001></dothtml-10001></div>")
		expect(formatHTML(document.body.children[0].children[0].shadowRoot?.innerHTML)).toBe("<div>yes</div>");
	});
	
	test("Try mounting a component twice.", ()=>{
		let c = new YesNoButton();
		
		expect(()=>{
			dot(document.body).mount(c).mount(c);
		}).toThrow();
	});

	test("Two instances.", ()=>{
		let c1 = new TextDisplay({txt: "abc"});
		let c2 = new TextDisplay({txt: "def"});
		
		dot(document.body)
			.mount(c1)
			.mount(c2);

		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>abc</div>");
		expect(document.body.children[1].shadowRoot?.innerHTML).toBe("<div>def</div>");
	});

	test("Nested mount.", ()=>{
		
		dot(document.body).div(dot.mount(new YesNoButton({ defaultValue: true, yesText: "yes" })));

		expect(formatHTML(document.body.innerHTML)).toBe("<div><dothtml-10001></dothtml-10001></div>");
		expect(document.body.children[0].children[0].shadowRoot?.innerHTML).toBe("<div>yes</div>");
	});
	
	test("Mount two components.", ()=>{
		let c1 = new YesNoButton({defaultValue: true, yesText: "yes", noText: "no"});
		let c2 = new YesNoButton({defaultValue: false, yesText: "yes", noText: "no"});

		dot(document.body).mount(c1).mount(c2);

		expect(formatHTML(document.body.innerHTML)).toBe("<dothtml-10001></dothtml-10001><dothtml-10001></dothtml-10001>")
		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>yes</div>");
		expect(document.body.children[1].shadowRoot?.innerHTML).toBe("<div>no</div>");
	});

	test("Text binding.", ()=>{
		let txt = dot.watch("abc");
		let c1 = new TextDisplay({txt: txt});
		
		dot(document.body)
			.mount(c1);

		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>abc</div>");
		
		txt.setValue("def");

		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>def</div>");
	});
});

// TODO:
// Test (conditional) deletions.
// Test hooks.
// Arrays of components.
// Test nested components.
// Test binding a component.