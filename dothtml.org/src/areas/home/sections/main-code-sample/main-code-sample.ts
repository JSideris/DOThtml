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

	// Example 4: Styling
	private pulseFast = dot.state(false);

	// Example 3: Store (Notification Service)
	private static alertStore = dot.store({
		id: "main-demo-alerts",
		state: () => ({ list: dot.state([] as Array<{id: number, text: string}>, "id") }),
		getters: {
			count: (s: any) => s.list.value.length
		},
		actions: {
			push(text: string) {
				const id = Date.now() + Math.random();
				const newAlert = { id, text };
				this.list.value = [...this.list.value, newAlert];
				setTimeout(() => {
					this.list.value = this.list.value.filter((m: any) => m.id !== id);
				}, 3000);
			}
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
			.maxHeightPx(500)
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
			.maxHeightPx(500)
			.position("relative")
			.overflow("hidden")
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
			.backgroundColor(this.pulseFast.bindAs(f => f ? s.v("secondary") : s.v("primary")))
			.borderRadiusPx(20)
			.display("flex")
			.alignItems("center")
			.justifyContent("center")
			.color("#000")
			.fontWeight(800)
			.cursor("pointer")
			.animationName("pulse-demo")
			.animationDurationS(this.pulseFast.bindAs(f => f ? 0.6 : 2))
			.animationIterationCount("infinite")
		).keyframes("pulse-demo", k => k
			.at(0, f => f.transform({ scale: 1, rotate: 0 }).boxShadow(s.template`0 0 0 0px color-mix(in srgb, ${s.v("primary")}, transparent 60%)`))
			.at(50, m => m.transform(this.pulseFast.bindAs(f => ({ scale: f ? 1.3 : 1.1, rotate: f ? 10 : 0 })) as any).boxShadow(this.pulseFast.bindAs(f => `0 0 20px ${f ? "15px" : "10px"} color-mix(in srgb, ${f ? s.v("secondary") : s.v("primary")}, transparent 50%)`) as any))
			.at(100, t => t.transform({ scale: 1, rotate: 0 }).boxShadow(s.template`0 0 0 0px color-mix(in srgb, ${s.v("primary")}, transparent 60%)`))
		).class("toast-container", tc => tc
			.position("absolute")
			.bottomPx(20)
			.rightPx(20)
			.display("flex")
			.flexDirection("column")
			.gapPx(10)
			.alignItems("flex-end")
		).class("toast", t => t
			.paddingPx(10, 20)
			.backgroundColor(s.v("primary"))
			.color("#000")
			.borderRadiusPx(8)
			.fontSizePx(12)
			.fontWeight(600)
			.boxShadow("0 4px 12px rgba(0,0,0,0.3)")
			.animationName("toast-in")
			.animationDurationS(0.3)
		).keyframes("toast-in", k => k
			.from(f => f.transform({ translateX: 20 }).opacity(0))
			.to(t => t.transform({ translateX: 0 }).opacity(1))
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
      dot.input({ bind: this.first }),
      dot.input({ bind: this.last }),
      dot.h2("Hello, ", this.full)
    );
  }
}`,
				preview: () => dot.div({ class: "input-group" },
					dot.input({ 
						class: "input-field",
						bind: this.firstName
					} as any),
					dot.input({ 
						class: "input-field",
						bind: this.lastName
					} as any),
					dot.div({ class: "full-name" }, "Hello, ", this.fullName)
				)
			},
			"Store": {
				code: `const useAlerts = dot.store({
  id: "alerts",
  // Use "id" as a stable key
  state: () => ({ 
    list: dot.state([], "id") 
  }),
  getters: {
    count: (s) => s.list.value.length
  },
  actions: {
    push(text) {
      const id = Date.now();
      const newAlert = { id, text };
      this.list.value = [...this.list.value, newAlert];
      setTimeout(() => 
        this.list.value = this.list.value
          .filter(a => a.id !== id), 3000
      );
    }
  }
});

@dot.component
class App extends DotComponent {
  alerts = useAlerts();
  build() {
    return dot.div(
      dot.button({ 
        onClick: () => this.alerts.push("Success!") 
      }, "Trigger Alert"),
      dot.p("Active alerts: ", this.alerts.count),
      dot.div({ class: "toast-container" },
        dot.each(this.alerts.list, alert => 
          dot.div({ class: "toast" }, alert.text)
        )
      )
    );
  }
}`,
				preview: () => {
					const alerts = MainCodeSample.alertStore();
					return dot.div(
						dot.button({ 
							class: "btn",
							onClick: () => alerts.push(`Alert ${Date.now().toString().slice(-4)}`) 
						}, "Trigger Alert"),
						dot.p({ style: "margin-top: 20px; color: #a0a0a0;" }, "Active alerts: ", alerts.count),
						dot.div({ class: "toast-container" },
							dot.each(alerts.list, (alert: any) => 
								dot.div({ class: "toast" }, alert.text)
							)
						)
					);
				}
			},
			"Styling": {
				code: `@dot.component
class Pulse extends DotComponent {
  isFast = dot.state(false);

  stylize(s) {
    return s.class("box", b => b
      .backgroundColor(this.isFast.bindAs(f => 
        f ? s.v("secondary") : s.v("primary")
      ))
      .animationDurationS(this.isFast.bindAs(f => 
        f ? 0.6 : 2
      ))
    ).keyframes("pulse", k => k
      .at(0,   f => f.transform({ scale: 1, rotate: 0 }))
      .at(50,  m => m.transform(this.isFast.bindAs(f => 
        ({ scale: f ? 1.3 : 1.1, rotate: f ? 10 : 0 })
      )))
      .at(100, t => t.transform({ scale: 1, rotate: 0 }))
    );
  }

  build() {
    return dot.div({ 
      class: "box", 
      onClick: () => this.isFast.value = !this.isFast.value 
    }, "DOT");
  }
}`,
				preview: () => dot.div(
					dot.div({ 
						class: "pulse-box",
						onClick: () => this.pulseFast.value = !this.pulseFast.value
					}, "DOT"),
					dot.p({ style: "margin-top: 20px; color: #a0a0a0; font-size: 12px;" }, "Click the box to toggle Turbo Mode")
				)
			}
		};

		return dot.div({ id: "examples", class: "code-sample-section" },
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
