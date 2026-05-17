import { dot, DotComponent } from "dothtml";

@dot.component
export default class UseCases extends DotComponent {
	private cases = [
		{ title: "Legacy Integration", description: "Drop DOThtml into any existing project to power complex widgets.", icon: "🔄" },
		{ title: "Micro-frontends", description: "Build independent, encapsulated UI modules that play well with others.", icon: "🧩" },
		{ title: "High-performance SPAs", description: "Create lightning-fast single page applications with built-in routing.", icon: "🏎️" },
		{ title: "Design Systems", description: "Develop consistent, reusable component libraries with scoped styles.", icon: "📐" }
	];

	stylize(s: any) {
		return s.class("use-cases-section", u => u
			.display("flex")
			.flexDirection("column")
			.gapPx(40)
		).class("title", t => t
			.fontSizePx(32)
			.fontWeight(700)
			.textAlign("center")
		).class("cases-grid", g => g
			.display("grid")
			.gridTemplateColumns("repeat(auto-fit, minmax(250px, 1fr))")
			.gapPx(20)
		).class("case-tile", c => c
			.paddingPx(30)
			.backgroundColor(s.v("surface"))
			.borderRadiusPx(16)
			.border(`1px solid ${s.v("glass-border")}`)
			.transition("all 0.2s")
		).class("case-tile:hover", ch => ch
			.borderColor(s.v("secondary"))
			.backgroundColor(s.v("surface-light"))
		).class("case-title", ct => ct
			.fontSizePx(18)
			.fontWeight(600)
			.marginBottomPx(10)
			.color(s.v("secondary"))
		).media("screen and (max-width: 600px)", m => m
			.class("use-cases-section", u => u
				.gapPx(20)
			).class("title", t => t
				.fontSizePx(24)
			).class("case-tile", c => c
				.paddingPx(20)
			)
		);
	}

	build() {
		return dot.div({ class: "use-cases-section" },
			dot.h2({ class: "title" }, "Built for Every Scale"),
			dot.div({ class: "cases-grid" },
				dot.each(this.cases, c => 
					dot.div({ class: "case-tile" },
						dot.h4({ class: "case-title" }, `${c.icon} ${c.title}`),
						dot.p(c.description)
					)
				)
			)
		);
	}
}
