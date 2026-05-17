import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import { theme } from "../../store/theme-store";

@dot.component
export default class ThemeControls implements IDotComponent {
	stylize(s: any) {
		return s.class("theme-controls", c => c
			.position("fixed")
			.bottomPx(20)
			.rightPx(20)
			.paddingPx(15)
			.display("flex")
			.flexDirection("column")
			.gapPx(10)
			.zIndex(2000)
			.backgroundColor("rgba(10, 10, 10, 0.8)")
			.backdropFilter("blur(12px)")
			.border("1px solid rgba(255, 255, 255, 0.1)")
			.borderRadiusPx(12)
			.boxShadow("0 10px 30px rgba(0, 0, 0, 0.5)")
		).class("control-item", i => i
			.display("flex")
			.alignItems("center")
			.justifyContent("space-between")
			.gapPx(15)
		).class("label", l => l
			.fontSizePx(12)
			.color(s.v("text-dim"))
			.textTransform("uppercase")
			.letterSpacingPx(1)
		).class("color-input", ci => ci
			.backgroundColor("transparent")
			.border("none")
			.widthPx(30)
			.heightPx(30)
			.cursor("pointer")
		).class("btn-cycle", b => b
			.paddingPx(8, 12)
			.fontSizePx(12)
			.fontWeight(600)
			.borderRadiusPx(6)
			.border("none")
			.cursor("pointer")
			.transition("all 0.2s")
			.backgroundColor(theme.isCycling.bindAs(c => c ? s.v("primary") : "rgba(255, 255, 255, 0.1)"))
			.color(theme.isCycling.bindAs(c => c ? "#000" : s.v("text")))
		);
	}

	build() {
		return dot.div({ class: "theme-controls" },
			dot.div({ class: "control-item" },
				dot.span({ class: "label" }, "Primary Color"),
				dot.input({ 
					type: "color", 
					class: "color-input",
					value: theme.primaryHex,
					onInput: (e: any) => theme.setPrimary(e.target.value)
				})
			),
			dot.button({ 
				class: "btn-cycle",
				onClick: () => theme.toggleCycle()
			}, theme.isCycling.bindAs(c => c ? "Stop Cycling" : "Cycle Colors"))
		);
	}
}
