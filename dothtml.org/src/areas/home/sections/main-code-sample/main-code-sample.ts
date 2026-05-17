import { dot, DotComponent } from "dothtml";
import MarkdownParser from "../../../../utils/MarkdownParser";

@dot.component
export default class MainCodeSample extends DotComponent {
	private activeExample = dot.state("Counter");

	// Example 1: Counter
	private count = dot.state(0);

	// Example 2: Computed
	private firstName = dot.state("John");
	private lastName = dot.state("Doe");
	private fullName = dot.computed(() => `${this.firstName.value} ${this.lastName.value}`);

	// Example 3: Store
	private static counterStore = dot.store({
		id: "main-demo-counter",
		state: () => ({ count: 0 }),
		actions: {
			inc() { this.count.value++; }
		}
	});

	stylize(s: any) {
		return s.class("code-sample-section", s => s
			.display("flex")
			.flexDirection("column")
			.gapPx(40)
		).class("title", t => t
			.fontSizePx(32)
			.fontWeight(700)
			.textAlign("center")
			.color(s.v("primary"))
		).class("example-tabs", t => t
			.display("flex")
			.justifyContent("center")
			.gapPx(10)
			.marginBottomPx(-20)
			.zIndex(1)
		).class("example-tab", t => t
			.paddingPx(8, 20)
			.borderRadiusPx(10, 10, 0, 0)
			.backgroundColor("rgba(255, 255, 255, 0.05)")
			.color(s.v("text-dim"))
			.cursor("pointer")
			.fontSizePx(14)
			.fontWeight(600)
			.transition("all 0.2s")
			.border("1px solid rgba(255, 255, 255, 0.05)")
			.borderBottom("none")
		).class("example-tab:hover", t => t
			.backgroundColor("rgba(255, 255, 255, 0.1)")
			.color(s.v("text"))
		).class("example-tab.active", t => t
			.backgroundColor("rgba(0, 0, 0, 0.3)")
			.color(s.v("primary"))
			.borderColor("rgba(255, 255, 255, 0.1)")
			.paddingBottomPx(10)
		).class("code-sample-container", c => c
			.display("flex")
			.gapPx(40)
			.paddingPx(60)
			.borderRadiusPx(24)
			.backgroundColor("rgba(0, 0, 0, 0.3)")
			.border("1px solid rgba(255, 255, 255, 0.05)")
		).class("code-pane", p => p
			.flex(1)
			.backgroundColor("#0d0d0d")
			.paddingPx(20)
			.borderRadiusPx(12)
			.fontSizePx(14)
			.color("#d4d4d4")
			.overflow("auto")
			.minHeightPx(350)
		).class("preview-pane", p => p
			.flex(1)
			.display("flex")
			.flexDirection("column")
			.alignItems("center")
			.justifyContent("center")
			.backgroundColor("rgba(255, 255, 255, 0.02)")
			.borderRadiusPx(12)
			.paddingPx(40)
			.minHeightPx(350)
		).class("counter-display", d => d
			.fontSizePx(48)
			.fontWeight(700)
			.color(s.v("primary"))
			.marginBottomPx(20)
		).class("input-group", g => g
			.display("flex")
			.flexDirection("column")
			.gapPx(10)
			.widthP(100)
			.maxWidthPx(300)
		).class("input-field", i => i
			.paddingPx(10, 15)
			.backgroundColor("rgba(255, 255, 255, 0.05)")
			.border("1px solid rgba(255, 255, 255, 0.1)")
			.borderRadiusPx(8)
			.color("#fff")
			.fontSizePx(16)
			.outline("none")
		).class("input-field:focus", i => i
			.borderColor(s.v("primary"))
		).class("full-name", n => n
			.marginTopPx(20)
			.fontSizePx(24)
			.fontWeight(600)
			.color(s.v("primary"))
		).class("btn", b => b
			.paddingPx(10, 20)
			.backgroundColor(s.v("primary"))
			.color("#000")
			.border("none")
			.borderRadiusPx(8)
			.cursor("pointer")
			.fontWeight(600)
			.transition("transform 0.1s")
		).class("btn:active", b => b
			.transform("scale(0.95)")
		).class("pulse-box", p => p
			.widthPx(100)
			.heightPx(100)
			.backgroundColor(s.v("primary"))
			.borderRadiusPx(20)
			.display("flex")
			.alignItems("center")
			.justifyContent("center")
			.color("#000")
			.fontWeight(800)
			.animationName("pulse-demo")
			.animationDurationS(2)
			.animationIterationCount("infinite")
		).keyframes("pulse-demo", k => k
			.from(f => f.transform({ scale: 1 }).boxShadow(`0 0 0 0px ${s.v("primary")}66`))
			.to(t => t.transform({ scale: 1.05 }).boxShadow(`0 0 0 20px ${s.v("primary")}00`))
		).media("screen and (max-width: 900px)", m => m
			.class("code-sample-container", c => c
				.flexDirection("column")
				.paddingPx(20)
				.gapPx(15)
			).class("counter-display", d => d
				.fontSizePx(36)
			).class("example-tabs", t => t
				.flexWrap("wrap")
			)
		);
	}

	build() {
		const examples = {
			"Counter": {
				code: `@dot.component
class Counter extends DotComponent {
  count = dot.state(0);

  build() {
    return dot.div(
      dot.h1(this.count),
      dot.button({ 
        onClick: () => this.count.value++ 
      }, "Increment")
    );
  }
}`,
				preview: () => dot.div(
					dot.div({ class: "counter-display" }, this.count),
					dot.button({ 
						class: "btn",
						onClick: () => this.count.value++ 
					}, "Increment")
				)
			},
			"Computed": {
				code: `@dot.component
class NameDisplay extends DotComponent {
  first = dot.state("John");
  last = dot.state("Doe");
  
  full = dot.computed(() => 
    \`\${this.first.value} \${this.last.value}\`
  );

  build() {
    return dot.div(
      dot.input({ value: this.first }),
      dot.input({ value: this.last }),
      dot.h2("Hello, ", this.full)
    );
  }
}`,
				preview: () => dot.div({ class: "input-group" },
					dot.input({ 
						class: "input-field",
						value: this.firstName,
						onInput: (e: any) => this.firstName.value = e.target.value
					}),
					dot.input({ 
						class: "input-field",
						value: this.lastName,
						onInput: (e: any) => this.lastName.value = e.target.value
					}),
					dot.div({ class: "full-name" }, "Hello, ", this.fullName)
				)
			},
			"Store": {
				code: `const useStore = dot.store({
  id: "counter",
  state: () => ({ count: 0 }),
  actions: {
    inc() { this.count.value++; }
  }
});

@dot.component
class GlobalCounter extends DotComponent {
  counter = useStore();
  build() {
    return dot.button({ 
      onClick: () => this.counter.inc() 
    }, this.counter.count);
  }
}`,
				preview: () => {
					const store = MainCodeSample.counterStore();
					return dot.div(
						dot.div({ class: "counter-display" }, store.count),
						dot.button({ 
							class: "btn",
							onClick: () => store.inc() 
						}, "Global Increment")
					);
				}
			},
			"Styling": {
				code: `@dot.component
class Pulse extends DotComponent {
  stylize(s) {
    return s.class("box", b => b
      .animationName("pulse")
      .animationDurationS(2)
      .animationIterationCount("infinite")
    ).keyframes("pulse", k => k
      .from(f => f.transform({ scale: 1 }))
      .to(t => t.transform({ scale: 1.1 }))
    );
  }

  build() {
    return dot.div({ class: "box" }, "DOT");
  }
}`,
				preview: () => dot.div({ class: "pulse-box" }, "DOT")
			}
		};

		return dot.div({ class: "code-sample-section" },
			dot.h2({ class: "title" }, "Simple & Intuitive"),
			dot.div({ class: "example-tabs" },
				dot.each(Object.keys(examples), name => 
					dot.div({ 
						class: this.activeExample.bindAs(ex => `example-tab ${ex === name ? "active" : ""}`),
						onClick: () => this.activeExample.value = name
					}, name)
				)
			),
			dot.div({ class: "code-sample-container" },
				dot.div({ class: "code-pane" },
					this.activeExample.bindAs(ex => 
						dot.pre(dot.html(MarkdownParser.highlight(examples[ex].code, "ts")))
					)
				),
				dot.div({ class: "preview-pane" },
					this.activeExample.bindAs(ex => examples[ex].preview())
				)
			)
		);
	}
}
