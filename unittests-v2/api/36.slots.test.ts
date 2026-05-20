import { dot, IDotComponent, IDotCore, IDotDocument } from "../../src";
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

describe("Component Slots", () => {
	test("Default slot rendering.", () => {
		class SlotComponent implements IDotComponent {
			build(dot: IDotCore): IDotDocument {
				return dot.div(
					dot.h1("Title"),
					(dot as any).slot()
				);
			}
		}

		dot(document.body).mount(new SlotComponent(), dot.p("Slotted content"));

		const host = document.body.children[0];
		expect(host.innerHTML).toBe("<p>Slotted content</p>"); // Light DOM
		expect(formatHTML(host.shadowRoot?.innerHTML)).toBe("<div><h1>title</h1><slot></slot></div>"); // Shadow DOM
	});

	test("Named slots rendering.", () => {
		class NamedSlotComponent implements IDotComponent {
			build(dot: IDotCore): IDotDocument {
				return dot.div(
					dot.header((dot as any).slot("header")),
					dot.main((dot as any).slot()),
					dot.footer((dot as any).slot("footer"))
				);
			}
		}

		dot(document.body).mount(new NamedSlotComponent())
			.slot("header", dot.h1("Header Content"))
			.slot("footer", dot.p("Footer Content"))
			.slot(dot.span("Default Content"));

		const host = document.body.children[0];
		// Check light DOM distribution
		expect(host.querySelector('[slot="header"]')?.innerHTML).toBe("Header Content");
		expect(host.querySelector('[slot="footer"]')?.innerHTML).toBe("Footer Content");
		expect(host.querySelector(':not([slot])')?.innerHTML).toBe("Default Content");

		expect(formatHTML(host.shadowRoot?.innerHTML)).toBe("<div><header><slot name=header></slot></header><main><slot></slot></main><footer><slot name=footer></slot></footer></div>");
	});

	test("Slot fallback content.", () => {
		class FallbackComponent implements IDotComponent {
			build(dot: IDotCore): IDotDocument {
				return dot.div(
					(dot as any).slot("optional", dot.span("Fallback"))
				);
			}
		}

		dot(document.body).mount(new FallbackComponent());

		const host = document.body.children[0];
		expect(host.innerHTML).toBe(""); // Light DOM empty
		// Fallback content should be inside the native slot in Shadow DOM
		expect(formatHTML(host.shadowRoot?.innerHTML)).toBe("<div><slot name=optional><span>fallback</span></slot></div>");
	});

	test("Scoped slots (passing data to slot).", () => {
		class ScopedSlotComponent implements IDotComponent {
			items = ["A", "B", "C"];
			build(dot: IDotCore): IDotDocument {
				return dot.ul(
					dot.each(this.items, (item) => 
						dot.li((dot as any).slot("item", { data: item }))
					)
				);
			}
		}

		dot(document.body).mount(new ScopedSlotComponent())
			.slot("item", (scope: any) => dot.text(`Item: ${scope.data}`));

		(dot as any).flushSync();

		const host = document.body.children[0];
		const shadow = host.shadowRoot!;
		
		// Scoped slots are rendered directly into the Shadow DOM in this implementation.
		const items = shadow.querySelectorAll("li");
		expect(items.length).toBe(3);
		expect(items[0].innerHTML).toBe("Item: A");
		expect(items[1].innerHTML).toBe("Item: B");
		expect(items[2].innerHTML).toBe("Item: C");
	});

	test("Reactive slot content.", () => {
		const message = dot.state("Initial");
		class SimpleSlot implements IDotComponent {
			build(dot: IDotCore) { return dot.div((dot as any).slot()); }
		}

		dot(document.body).mount(new SimpleSlot(), dot.p(message));

		const host = document.body.children[0];
		expect(host.querySelector("p")?.innerHTML).toBe("Initial");

		message.value = "Updated";
		(dot as any).flushSync();
		expect(host.querySelector("p")?.innerHTML).toBe("Updated");
	});

	test("Styling slots with ::slotted.", () => {
		class StyledSlot implements IDotComponent {
			stylize(s: any) {
				return s.selector("::slotted(p)", c => c.color("red"));
			}
			build(dot: IDotCore) {
				return dot.div((dot as any).slot());
			}
		}

		dot(document.body).mount(new StyledSlot(), dot.p("Red text"));

		const host = document.body.children[0];
		const shadow = host.shadowRoot!;
		
		// Verify style tag exists in shadow root
		const styleTags = shadow.querySelectorAll("style");
		let hasSlottedRule = false;
		styleTags.forEach(style => {
			if (style.textContent?.includes("::slotted(p)")) {
				hasSlottedRule = true;
			}
		});
		
		// If using adoptedStyleSheets, we should check those too
		if (shadow.adoptedStyleSheets.length > 0) {
			shadow.adoptedStyleSheets.forEach(sheet => {
				for (let i = 0; i < sheet.cssRules.length; i++) {
					if (sheet.cssRules[i].cssText.includes("::slotted(p)")) {
						hasSlottedRule = true;
					}
				}
			});
		}

		expect(hasSlottedRule).toBe(true);
	});

	test("Teleporting slots (moving slot in build).", () => {
		const condition = dot.state(true);
		class TeleportSlot implements IDotComponent {
			build(dot: IDotCore) {
				return dot.div(
					dot.when(condition, dot.div({ id: "loc1" }, (dot as any).slot()))
					   .otherwise(dot.div({ id: "loc2" }, (dot as any).slot()))
				);
			}
		}

		dot(document.body).mount(new TeleportSlot(), dot.p("Content"));

		const host = document.body.children[0];
		const shadow = host.shadowRoot!;
		
		expect(shadow.querySelector("#loc1 slot")).not.toBeNull();
		expect(shadow.querySelector("#loc2")).toBeNull();

		condition.value = false;
		(dot as any).flushSync();

		expect(shadow.querySelector("#loc1")).toBeNull();
		expect(shadow.querySelector("#loc2 slot")).not.toBeNull();
		// Content should still be distributed correctly by the browser
	});

	test("Nested components in slots.", () => {
		class InnerComp implements IDotComponent {
			build(dot: IDotCore) { return dot.span("Inner"); }
		}
		class OuterComp implements IDotComponent {
			build(dot: IDotCore) { return dot.div((dot as any).slot()); }
		}

		dot(document.body).mount(new OuterComp(), new InnerComp());

		const host = document.body.children[0];
		// InnerComp should be in light DOM
		expect(host.innerHTML).toMatch(/<dothtml-[0-9a-f]+><\/dothtml-[0-9a-f]+>/);
		const innerHost = host.children[0];
		expect(formatHTML(innerHost.shadowRoot?.innerHTML)).toBe("<span>inner</span>");
	});

	test("Re-mounting a component with slots.", () => {
		const show = dot.state(true);
		class SimpleSlot implements IDotComponent {
			build(dot: IDotCore) { return dot.div((dot as any).slot()); }
		}

		dot(document.body).when(show, 
			dot.mount(new SimpleSlot(), dot.p("Persistent content"))
		);

		expect(document.body.innerHTML).toContain("Persistent content");

		show.value = false;
		(dot as any).flushSync();
		expect(document.body.innerHTML).toBe("");

		// This should not throw "Node is already rendered"
		show.value = true;
		(dot as any).flushSync();
		expect(document.body.innerHTML).toContain("Persistent content");
	});
});
