
import { dot, IDotComponent, IDotDocument } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import formatHTML from "./formatHTML";

afterEach(() => { 
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Reactive VDOM handling.", () => {
	test("Signal returning a primitive should render it.", () => {
		const sig = dot.state<any>("initial");
		dot(document.body).div(sig);
		
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("initial")));
		
		sig.value = "updated";
		(dot as any).flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("updated")));
	});

	test("Signal returning a VDOM object should render it, not stringify it.", () => {
		const sig = dot.state<any>("initial");
		dot(document.body).div(sig);
		
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("initial")));
		
		const span = dot.span("new content");
		sig.value = span;
		(dot as any).flushSync();
		
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(dot.span("new content"))));
	});

	test("Signal returning a Component should render it, not stringify it.", () => {
		class MyComponent implements IDotComponent {
			build(): IDotDocument {
				return dot.span("component content");
			}
		}
		
		const sig = dot.state<any>("initial");
		dot(document.body).div(sig);
		
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("initial")));
		
		const comp = new MyComponent();
		sig.value = comp;
		(dot as any).flushSync();
		
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(new MyComponent())));
		expect(document.body.querySelector(comp.constructor["_dotHtmlComponent"].tagName)).toBeTruthy();
	});

	test("Signal returning an array of mixed content.", () => {
		const sig = dot.state<any>("initial");
		dot(document.body).div(sig);
		
		sig.value = ["text", dot.b("bold"), "more text"];
		(dot as any).flushSync();
		
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(["text", dot.b("bold"), "more text"])));
	});

	test("Switching between types (string -> component -> string).", () => {
		class MyComponent implements IDotComponent {
			build(): IDotDocument {
				return dot.span("comp");
			}
		}
		
		const sig = dot.state<any>("start");
		dot(document.body).div(sig);
		
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("start")));
		
		const comp = new MyComponent();
		sig.value = comp;
		(dot as any).flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div(new MyComponent())));
		
		sig.value = "end";
		(dot as any).flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("end")));
	});

	test("Handling null and undefined.", () => {
		const sig = dot.state<any>("initial");
		dot(document.body).div(sig);
		
		sig.value = null;
		(dot as any).flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div()));
		
		sig.value = undefined;
		(dot as any).flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div()));
		
		sig.value = "back";
		(dot as any).flushSync();
		expect(formatHTML(document.body.innerHTML)).toBe(formatHTML(dot.div("back")));
	});
});
