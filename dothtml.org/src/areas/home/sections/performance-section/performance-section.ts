import { dot, DotComponent } from "dothtml";

@dot.component
export default class PerformanceSection extends DotComponent {
	stylize(s: any) {
		return s.class("performance-section", p => p
			.display("flex")
			.flexDirection("column")
			.alignItems("center")
			.gapPx(60)
			.paddingPx(80, 0)
		).class("title-group", t => t
			.textAlign("center")
		).class("title", t => t
			.fontSizePx(48)
			.fontWeight(800)
			.marginBottomPx(10)
			.color(s.v("primary"))
		).class("subtitle", t => t
			.fontSizePx(20)
			.color(s.v("text-dim"))
			.maxWidthPx(600)
			.margin("0 auto")
		).class("stats-grid", g => g
			.display("grid")
			.gridTemplateColumns("repeat(auto-fit, minmax(300px, 1fr))")
			.gapPx(40)
			.widthP(100)
		).class("stat-card", c => c
			.backgroundColor("rgba(255, 255, 255, 0.02)")
			.border("1px solid rgba(255, 255, 255, 0.05)")
			.borderRadiusPx(24)
			.paddingPx(40)
			.display("flex")
			.flexDirection("column")
			.gapPx(20)
			.transition("transform 0.3s, border-color 0.3s")
		).class("stat-card:hover", c => c
			.transform("translateY(-5px)")
			.borderColor("rgba(255, 152, 0, 0.2)")
		).class("stat-header", h => h
			.display("flex")
			.justifyContent("space-between")
			.alignItems("center")
		).class("stat-label", l => l
			.fontSizePx(18)
			.fontWeight(600)
			.color(s.v("text"))
		).class("stat-value", v => v
			.fontSizePx(32)
			.fontWeight(800)
			.color(s.v("primary"))
		).class("bar-container", b => b
			.display("flex")
			.flexDirection("column")
			.gapPx(12)
		).class("bar-item", i => i
			.display("flex")
			.flexDirection("column")
			.gapPx(4)
		).class("bar-label-group", l => l
			.display("flex")
			.justifyContent("space-between")
			.fontSizePx(12)
			.color(s.v("text-dim"))
		).class("bar-track", t => t
			.heightPx(8)
			.backgroundColor("rgba(255, 255, 255, 0.05)")
			.borderRadiusPx(4)
			.overflow("hidden")
		).class("bar-fill", f => f
			.heightP(100)
			.backgroundColor(s.v("primary"))
			.borderRadiusPx(4)
			.transition("width 1s ease-out")
		).class("bar-fill.competitor", f => f
			.backgroundColor("rgba(255, 255, 255, 0.5)")
		).class("cta-group", c => c
			.marginTopPx(20)
		).class("btn-outline", b => b
			.paddingPx(12, 32)
			.border(s.template`2px solid ${s.v("primary")}`)
			.borderRadiusPx(100)
			.color(s.v("primary"))
			.fontWeight(700)
			.textDecoration("none")
			.transition("all 0.2s")
		).class("btn-outline:hover", b => b
			.backgroundColor(s.v("primary"))
			.color("#000")
		).media("screen and (max-width: 800px)", m => m
			.class("performance-section", p => p
				.paddingPx(40, 0)
			).class("title", t => t
				.fontSizePx(32)
			)
		);
	}

	build() {
		return dot.section({ class: "performance-section" },
			dot.div({ class: "title-group" },
				dot.h2({ class: "title" }, "Built for Speed"),
				dot.p({ class: "subtitle" }, "DOThtml outperforms traditional frameworks by eliminating the Virtual DOM overhead.")
			),
			dot.div({ class: "stats-grid" },
				// Rendering Performance Card
				dot.div({ class: "stat-card" },
					dot.div({ class: "stat-header" },
						dot.span({ class: "stat-label" }, "10k Row Creation"),
						dot.span({ class: "stat-value" }, "661ms")
					),
					dot.div({ class: "bar-container" },
						this.renderBar("DOThtml", 661, 1100, false),
						this.renderBar("React", 1100, 1100, true),
						this.renderBar("Svelte", 902, 1100, true),
						this.renderBar("Vue", 679, 1100, true)
					),
					dot.p({ style: "font-size: 14px; color: var(--text-dim); margin-top: 10px;" }, 
						"DOThtml is 40% faster than React when rendering large datasets."
					)
				),
				// Bundle Size Card
				dot.div({ class: "stat-card" },
					dot.div({ class: "stat-header" },
						dot.span({ class: "stat-label" }, "Bundle Size"),
						dot.span({ class: "stat-value" }, "18.6kB")
					),
					dot.div({ class: "bar-container" },
						this.renderBar("DOThtml", 18.6, 42, false),
						this.renderBar("React + DOM", 42, 42, true),
						this.renderBar("Vue", 33, 42, true),
						this.renderBar("Svelte", 2, 42, true)
					),
					dot.p({ style: "font-size: 14px; color: var(--text-dim); margin-top: 10px;" }, 
						"Ultra-lightweight footprint for instant loading and minimal resource usage."
					)
				)
			),
			dot.div({ class: "cta-group" },
				dot.a({ href: "#/docs/benchmarks", class: "btn-outline" }, "View Full Benchmarks")
			)
		);
	}

	private renderBar(label: string, value: number, max: number, isCompetitor: boolean) {
		const width = (value / max) * 100;
		return dot.div({ class: "bar-item" },
			dot.div({ class: "bar-label-group" },
				dot.span(label),
				dot.span(value + (max > 100 ? "ms" : "kB"))
			),
			dot.div({ class: "bar-track" },
				dot.div({ 
					class: `bar-fill ${isCompetitor ? "competitor" : ""}`,
					style: `width: ${width}%`
				})
			)
		);
	}
}
