import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../../../../components/MarkdownViewer/MarkdownViewer";

@dot.component
export default class QuickStartPart implements IDotComponent {
	stylize(s: any) {
		return s.class("terminal-container", t => t
			.backgroundColor("rgba(0, 0, 0, 0.4)")
			.backdropFilter("blur(10px)")
			.border("1px solid rgba(255, 255, 255, 0.1)")
			.borderRadiusPx(12)
			.paddingPx(20)
			.widthP(100)
			.maxWidthPx(450)
			.boxShadow("0 20px 50px rgba(0, 0, 0, 0.5)")
		).class("terminal-header", h => h
			.display("flex")
			.gapPx(8)
			.marginBottomPx(15)
		).class("dot", d => d
			.widthPx(12)
			.heightPx(12)
			.borderRadiusP(50)
		).class("dot-red", r => r.backgroundColor("#ff5f56")
		).class("dot-yellow", y => y.backgroundColor("#ffbd2e")
		).class("dot-green", g => g.backgroundColor("#27c93f")
		).media("screen and (max-width: 600px)", m => m
			.class("terminal-container", t => t
				.widthP(100)
				.maxWidthPx(450)
				.paddingPx(10)
			)
		);
	}

	build() {
		return dot.div({ class: "terminal-container" },
			dot.div({ class: "terminal-header" },
				dot.div({ class: "dot dot-red" }),
				dot.div({ class: "dot dot-yellow" }),
				dot.div({ class: "dot dot-green" })
			),
			dot.mount(new MarkdownViewer({ src: "/docs/quick-start.md" }))
		);
	}
}
