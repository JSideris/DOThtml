import { dot } from "../../src";
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

describe("Append and Prepend", () => {
	test("append on a VDOM node.", () => {
		const d = dot.div("initial");
		dot(document.body).append(d);
		d.append(dot.p("appended"));
		expect(formatHTML(document.body.innerHTML)).toBe("<div>initial<p>appended</p></div>");
	});

	test("prepend on a VDOM node.", () => {
		const d = dot.div("initial");
		dot(document.body).append(d);
		d.prepend(dot.p("prepended"));
		expect(formatHTML(document.body.innerHTML)).toBe("<div><p>prepended</p>initial</div>");
	});

	test("append and prepend on a Ref.", async () => {
		const myRef = dot.ref<HTMLDivElement>();
		dot(document.body).div({ ref: myRef }, "middle");
		
		await myRef.ready();
		myRef.append(dot.p("after"));
		myRef.prepend(dot.p("before"));

		expect(formatHTML(document.body.innerHTML)).toBe("<div><p>before</p>middle<p>after</p></div>");
	});

	test("chainability.", () => {
		const d = dot.div("middle");
		dot(document.body).append(d);
		d.append(dot.p("end"))
		 .prepend(dot.p("start"));
		
		expect(formatHTML(document.body.innerHTML)).toBe("<div><p>start</p>middle<p>end</p></div>");
	});
});
