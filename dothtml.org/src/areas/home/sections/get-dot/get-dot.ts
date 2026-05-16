import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import TerminalWidget from "../../../../components/ui/terminal-widget";

@dot.component
export default class GetDot implements IDotComponent {
	stylize(s: any) {
		return s.class("get-dot-section", g => g
			.backgroundColor("rgba(255, 152, 0, 0.05)")
			.border("1px solid rgba(255, 152, 0, 0.1)")
			.borderRadiusPx(24)
			.paddingPx(60)
			.textAlign("center")
			.position("relative")
			.overflow("hidden")
			.display("flex")
			.flexDirection("column")
			.alignItems("center")
			.gapPx(30)
		).class("title", t => t
			.fontSizePx(32)
			.fontWeight(700)
			.color(s.v("primary"))
		).media("screen and (max-width: 600px)", m => m
			.class("get-dot-section", g => g
				.paddingPx(40, 20)
				.gapPx(20)
			).class("title", t => t
				.fontSizePx(24)
			)
		);
	}

	build() {
		return dot.div({ class: "get-dot-section" },
			dot.h2({ class: "title" }, "Quick Install"),
			dot.p("Get up and running in seconds with a single command."),
			dot.mount(new TerminalWidget({ command: "npm install dothtml" }))
		);
	}
}
