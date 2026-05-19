import { dot, FrameworkItems } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => { 
	let styles = document.getElementsByTagName("style");

	for(let i = styles.length-1; i >= 0; i--){
		styles[i].parentElement?.removeChild(styles[i]);
	}

	(dot as any).globalStyles = [];
	(dot as any).setTheme(null);

	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Styling Bug Reproduction", () => {

	describe("Reactive Shorthand Objects", () => {
		test("transform() handles reactive objects", () => {
			const transformState = dot.state({ scale: 1.2 });
			
			class TransformComp {
				_?: FrameworkItems;
				stylize(s: any): any {
					return s.class("box", b => b.transform(transformState));
				}
				build(): any {
					return dot.div({ class: "box", id: "target" });
				}
			}

			dot(document.body).mount(new TransformComp() as any);
			dot.flushSync();

			const customEl = document.body.children[0] as HTMLElement;
			// Currently this is expected to FAIL and show [object Object]
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("scale(1.2, 1)");

			transformState.value = { scale: 1.5 };
			dot.flushSync();
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("scale(1.5, 1)");
		});

		test("filter() handles reactive objects", () => {
			const filterState = dot.state({ blur: 5 });
			
			class FilterComp {
				_?: FrameworkItems;
				stylize(s: any): any {
					return s.class("box", b => b.filter(filterState));
				}
				build(): any {
					return dot.div({ class: "box", id: "target" });
				}
			}

			dot(document.body).mount(new FilterComp() as any);
			dot.flushSync();

			const customEl = document.body.children[0] as HTMLElement;
			// Currently this is expected to FAIL and show [object Object]
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("blur(5px)");

			filterState.value = { blur: 10 };
			dot.flushSync();
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("blur(10px)");
		});
	});

	describe("dot.alpha Utility", () => {
		test("dot.alpha generates color-mix with CSS variables", () => {
			// This test will fail initially because dot.alpha is not defined
			const opacity = dot.state(0.5);
			const color = "var(--primary)";
			
			const alphaColor = (dot as any).alpha(color, opacity);
			
			expect(alphaColor.value).toBe("color-mix(in srgb, var(--primary), transparent 50%)");

			opacity.value = 0.8;
			dot.flushSync();
			expect(alphaColor.value).toBe("color-mix(in srgb, var(--primary), transparent 20%)");
		});

		test("dot.alpha works with reactive colors", () => {
			const color = dot.state("red");
			const alphaColor = (dot as any).alpha(color, 0.5);
			
			expect(alphaColor.value).toBe("color-mix(in srgb, red, transparent 50%)");

			color.value = "blue";
			dot.flushSync();
			expect(alphaColor.value).toBe("color-mix(in srgb, blue, transparent 50%)");
		});
	});

	describe("Reactive Units", () => {
		test("animationDurationS() appends 's' unit to reactive values", () => {
			const duration = dot.state(0.6);
			
			class AnimationComp {
				_?: FrameworkItems;
				stylize(s: any): any {
					return s.class("box", b => b.animationDurationS(duration));
				}
				build(): any {
					return dot.div({ class: "box" });
				}
			}

			dot(document.body).mount(new AnimationComp() as any);
			dot.flushSync();

			const customEl = document.body.children[0] as HTMLElement;
			// Currently this is expected to FAIL and show "0.6"
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("0.6s");

			duration.value = 2;
			dot.flushSync();
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("2s");
		});

		test("transitionDelayS() appends 's' unit to reactive values", () => {
			const delay = dot.state(0.1);
			
			class TransitionComp {
				_?: FrameworkItems;
				stylize(s: any): any {
					return s.class("box", b => b.transitionDelayS(delay));
				}
				build(): any {
					return dot.div({ class: "box" });
				}
			}

			dot(document.body).mount(new TransitionComp() as any);
			dot.flushSync();

			const customEl = document.body.children[0] as HTMLElement;
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("0.1s");

			delay.value = 0.5;
			dot.flushSync();
			expect(customEl.style.getPropertyValue("--dh-v1")).toBe("0.5s");
		});
	});
});
