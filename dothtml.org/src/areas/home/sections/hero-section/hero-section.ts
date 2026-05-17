import { dot, DotComponent } from "dothtml";
import LargeLogoPart from "./large-logo-part/large-logo-part";
import QuickStartPart from "./quick-start-part/quick-start-part";
import HeroFeaturesPart from "./hero-features-part/hero-features-part";

@dot.component
export default class HeroSection extends DotComponent {
	stylize(s: any) {
		return s.class("hero-section", h => h
			.display("flex")
			.flexDirection("column")
			.alignItems("center")
			.justifyContent("center")
			.minHeightPx(600)
			.widthP(100)
		).class("hero-main", m => m
			.display("flex")
			.alignItems("center")
			.justifyContent("space-between")
			.widthP(100)
			.gapPx(40)
		).class("logo-pane", l => l
			.flex(2)
		).class("quickstart-pane", q => q
			.flex(1)
		).class("features-pane", f => f
			.widthP(100)
		).class("hero-actions", a => a
			.display("flex")
			.gapPx(20)
			.marginTopPx(40)
		).class("btn", b => b
			.paddingPx(15, 30)
			.borderRadiusPx(8)
			.fontSizePx(18)
			.fontWeight(600)
			.cursor("pointer")
			.transition("all 0.2s")
		).class("btn-primary", p => p
			.backgroundColor(s.v("primary"))
			.color("#000")
			.border("none")
		).class("btn-secondary", se => se
			.backgroundColor("transparent")
			.color(s.v("text"))
			.border(`2px solid ${s.v("primary")}`)
		).class("btn:hover", bh => bh
			.transform("translateY(-2px)")
			.boxShadow(`0 5px 15px rgba(255, 152, 0, 0.3)`)
		).media("screen and (max-width: 1000px)", m => m
			.class("hero-section", h => h
				.minHeightPx(400)
			).class("hero-main", hm => hm
				.flexDirection("column")
				.gapPx(20)
			).class("quickstart-pane", qp => qp
				.widthP(100)
			)
		);
	}

	build() {
		return dot.div({ class: "hero-section" },
			dot.div({ class: "hero-main" },
				dot.div({ class: "logo-pane" }, dot.mount(new LargeLogoPart())),
				dot.div({ class: "quickstart-pane" }, dot.mount(new QuickStartPart()))
			),
			dot.div({ class: "hero-actions" },
				dot.button({ class: "btn btn-primary", onClick: () => window.location.hash = "#/docs/quick-start" }, "Get Started"),
				dot.button({ class: "btn btn-secondary", onClick: () => window.location.hash = "#/docs" }, "View Docs")
			),
			dot.div({ class: "features-pane" }, dot.mount(new HeroFeaturesPart()))
		);
	}
}
