import { dot, DotComponent } from "dothtml";

@dot.component
export default class MainCodeSample extends DotComponent {
	private count = dot.state(0);

	stylize(s: any) {
		return s.class("code-sample-container", c => c
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
		).class("preview-pane", p => p
			.flex(1)
			.display("flex")
			.flexDirection("column")
			.alignItems("center")
			.justifyContent("center")
			.backgroundColor("rgba(255, 255, 255, 0.02)")
			.borderRadiusPx(12)
			.paddingPx(40)
		).class("counter-display", d => d
			.fontSizePx(48)
			.fontWeight(700)
			.color(s.v("primary"))
			.marginBottomPx(20)
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
		).media("screen and (max-width: 900px)", m => m
			.class("code-sample-container", c => c
				.flexDirection("column")
				.paddingPx(20)
				.gapPx(15)
			).class("counter-display", d => d
				.fontSizePx(36)
			)
		);
	}

	build() {
		const code = `
@dot.component
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
}`;

		return dot.div({ class: "code-sample-container" },
			dot.div({ class: "code-pane" },
				dot.pre(dot.code(code))
			),
			dot.div({ class: "preview-pane" },
				dot.div({ class: "counter-display" }, this.count),
				dot.button({ 
					class: "btn",
					onClick: () => this.count.value++ 
				}, "Increment")
			)
		);
	}
}
