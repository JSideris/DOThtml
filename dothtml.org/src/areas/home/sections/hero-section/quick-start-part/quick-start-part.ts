import { dot, DotComponent } from "dothtml";
import TerminalWidget from "../../../../../components/ui/terminal-widget";

@dot.component
export default class QuickStartPart extends DotComponent {
	private activeTab = dot.state("CLI");

	stylize(s: any) {
		return s.class("terminal-container", t => t
			.backgroundColor("rgba(0, 0, 0, 0.4)")
			.backdropFilter("blur(10px)")
			.border("1px solid rgba(255, 255, 255, 0.1)")
			.borderRadiusPx(12)
			.paddingPx(20)
			.widthPx(450)
			.maxWidthP(100)
			.boxShadow("0 20px 50px rgba(0, 0, 0, 0.5)")
		).class("terminal-header", h => h
			.display("flex")
			.justifyContent("space-between")
			.alignItems("center")
			.marginBottomPx(15)
		).class("dots", d => d
			.display("flex")
			.gapPx(8)
		).class("dot", d => d
			.widthPx(12)
			.heightPx(12)
			.borderRadiusP(50)
		).class("dot-red", r => r.backgroundColor("#ff5f56")
		).class("dot-yellow", y => y.backgroundColor("#ffbd2e")
		).class("dot-green", g => g.backgroundColor("#27c93f")
		).class("tabs", t => t
			.display("flex")
			.gapPx(10)
		).class("tab", t => t
			.paddingPx(4, 10)
			.borderRadiusPx(6)
			.cursor("pointer")
			.fontSizePx(12)
			.color(s.v("text-dim"))
			.transition("all 0.2s")
			.border("1px solid transparent")
		).class("tab:hover", t => t
			.backgroundColor("rgba(255, 255, 255, 0.05)")
			.color(s.v("text"))
		).class("tab.active", t => t
			.backgroundColor("rgba(255, 152, 0, 0.1)")
			.color(s.v("primary"))
			.borderColor("rgba(255, 152, 0, 0.2)")
			.fontWeight(600)
		).media("screen and (max-width: 600px)", m => m
			.class("terminal-container", t => t
				.widthP(100)
				.maxWidthPx(450)
				.paddingPx(15)
			).class("terminal-header", h => h
				.flexDirection("column")
				.alignItems("flex-start")
				.gapPx(15)
			)
		);
	}

	build() {
		const commands: Record<string, string> = {
			"CLI": "npx create-dothtml-app MyApp",
			"NPM": "npm install dothtml",
			"CDN": '<script src="https://unpkg.com/dothtml"></script>'
		};

		return dot.div({ class: "terminal-container" },
			dot.div({ class: "terminal-header" },
				dot.div({ class: "dots" },
					dot.div({ class: "dot dot-red" }),
					dot.div({ class: "dot dot-yellow" }),
					dot.div({ class: "dot dot-green" })
				),
				dot.div({ class: "tabs" },
					dot.each(Object.keys(commands), tab => 
						dot.span({ 
							class: this.activeTab.bindAs(t => `tab ${t === tab ? "active" : ""}`),
							onClick: () => this.activeTab.value = tab
						}, tab)
					)
				)
			),
			this.activeTab.bindAs(tab => 
				dot.mount(new TerminalWidget({ command: commands[tab] }))
			),
			dot.p({ style: "margin-top: 15px; font-size: 11px; color: rgba(255,255,255,0.3); text-align: center; font-style: italic;" }, 
				"Click the terminal to copy command"
			)
		);
	}
}
