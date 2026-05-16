import { FrameworkItems, IDotComponent, IDotCss, IDotDocument, IReactive } from "dothtml-interfaces";
import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

// TODO:
// Test (conditional) deletions.
// Test hooks.
// Arrays of components.
// Test nested components.
// Test binding a component.
// Test events.
// Test calling a component method.
// Test refs.

afterEach(() => { 
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

// Test components

// Need to turn this off first!!!
// component["_addTimestamp"] = false;

// TODO: typed props and events would be GREAT. But it's not easy to do. Some thought has to go into it.

class TextDisplay implements IDotComponent{
	args: any;

	constructor(txt: any){
		// TODO: this isn't the final version of this.
		// Ever since we moved to a full DI implementation, this is up in the air.
		this.args = txt;
	}
	_: FrameworkItems;
	build(): IDotDocument {
		return dot.div(this.args.txt);
	}
}

class YesNoButton implements IDotComponent{
	value = dot.watch(true);
	_: FrameworkItems;
	defaultValue: boolean | undefined;
	yesText: string;
	noText: string;

	constructor(props?: {defaultValue?: boolean, yesText?: string, noText?: string}){
		this.defaultValue = props?.defaultValue;
		this.yesText = props?.yesText || "";
		this.noText = props?.noText || "";
	}

	build(): IDotDocument {
		this.value.value = (this.defaultValue);
		return dot.div(dot.when(this.value, this.yesText).otherwise(this.noText))
	}
}

describe("Components", ()=>{
	test("Mount a component.", ()=>{
		
		dot(document.body).mount(new YesNoButton({ defaultValue: true, yesText: "yes" }));

		// expect(formatHTML(document.body.innerHTML)).toBe("<dothtml-10001><div>yes</div></dothtml-10001>")
		expect(formatHTML(document.body.innerHTML)).toMatch(/<dothtml-[0-9a-f]+><\/dothtml-[0-9a-f]+>/);
		expect(formatHTML(document.body.children[0].shadowRoot?.innerHTML)).toBe("<div>yes</div>");
	});
	
	test("Mount a component in a div.", ()=>{
		
		dot(document.body).div(new YesNoButton({ defaultValue: true, yesText: "yes" }));

		expect(formatHTML(document.body.innerHTML)).toMatch(/<div><dothtml-[0-9a-f]+><\/dothtml-[0-9a-f]+><\/div>/)
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

		expect(formatHTML(document.body.innerHTML)).toMatch(/<div><dothtml-[0-9a-f]+><\/dothtml-[0-9a-f]+><\/div>/);
		expect(document.body.children[0].children[0].shadowRoot?.innerHTML).toBe("<div>yes</div>");
	});
	
	test("Mount two components.", ()=>{
		let c1 = new YesNoButton({defaultValue: true, yesText: "yes", noText: "no"});
		let c2 = new YesNoButton({defaultValue: false, yesText: "yes", noText: "no"});

		dot(document.body).mount(c1).mount(c2);

		expect(formatHTML(document.body.innerHTML)).toMatch(/<dothtml-[0-9a-f]+><\/dothtml-[0-9a-f]+><dothtml-[0-9a-f]+><\/dothtml-[0-9a-f]+>/)
		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>yes</div>");
		expect(document.body.children[1].shadowRoot?.innerHTML).toBe("<div>no</div>");
	});

	test("Text binding.", ()=>{
		let txt = dot.watch("abc");
		let c1 = new TextDisplay({txt: txt});
		
		dot(document.body)
			.mount(c1);

		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>abc</div>");
		
		txt.value = ("def");
		(dot as any).flushSync();

		expect(document.body.children[0].shadowRoot?.innerHTML).toBe("<div>def</div>");
	});
});

