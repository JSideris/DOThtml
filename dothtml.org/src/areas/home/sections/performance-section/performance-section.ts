import { dot, DotComponent, Priority } from "dothtml";
import { DOTHTML_COMPRESSED_SIZE } from "../../../../generated/size";
import { BENCHMARK_DATA } from "../../../../generated/benchmarks";

@dot.component
export default class PerformanceSection extends DotComponent {
	private isVisible = dot.state(false);
	private benchmarksVisible = dot.state(false);
	private moduleRef = dot.ref<HTMLElement>();
	private benchmarksRef = dot.ref<HTMLElement>();

	mounted() {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					if (entry.target === this.moduleRef.value) {
						this.isVisible.setValue(true);
					} else if (entry.target === this.benchmarksRef.value) {
						this.benchmarksVisible.setValue(true);
					}
				}
			});
		}, { threshold: 0.5 });

		if (this.moduleRef.value) {
			observer.observe(this.moduleRef.value);
		}
		if (this.benchmarksRef.value) {
			observer.observe(this.benchmarksRef.value);
		}
	}

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
			.transition("width 1.5s cubic-bezier(0.22, 1, 0.36, 1)")
		).class("bar-fill.competitor", f => f
			.backgroundColor("rgba(255, 255, 255, 0.5)")
		).class("size-comparison-module", m => m
			.marginTopPx(20)
			.display("flex")
			.flexDirection("column")
			.alignItems("center")
			.gapPx(20)
			.widthP(100)
		).class("size-comparison-grid", g => g
			.display("flex")
			.justifyContent("center")
			.alignItems("flex-end")
			.gapPx(60)
			.paddingPx(30, 40)
			.backgroundColor("rgba(255, 255, 255, 0.02)")
			.borderRadiusPx(24)
			.border("1px solid rgba(255, 255, 255, 0.05)")
			.widthP(100)
			.maxWidthPx(500)
		).class("stack-group", g => g
			.display("flex")
			.flexDirection("column")
			.alignItems("center")
			.gapPx(15)
		).class("box-stack", s => s
			.display("flex")
			.flexDirection("column-reverse")
			.gapPx(4)
		).class("box", b => b
			.widthPx(70)
			.heightPx(15)
			.borderRadiusPx(3)
			.border("1px solid rgba(255, 255, 255, 0.1)")
			.opacity(0)
			.transform("translateY(20px)")
			.transition("opacity 0.5s ease-out, transform 0.5s ease-out")
		).class("box.visible", b => b
			.opacity(1)
			.transform("translateY(0)")
		).class("box.dothtml", b => b
			.backgroundColor(s.v("primary"))
			.boxShadow(s.template`0 0 20px ${s.v("primary")}44`)
		).class("box.react", b => b
			.backgroundColor("rgba(255, 255, 255, 0.1)")
		).class("stack-label", l => l
			.fontSizePx(18)
			.fontWeight(700)
			.color(s.v("text"))
		).class("stack-value", v => v
			.fontSizePx(16)
			.color(s.v("text-dim"))
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
		const appendData = BENCHMARK_DATA.APPEND_1000;
		const styleData = BENCHMARK_DATA.BULK_STYLE;

		const appendMax = Math.max(appendData.DOTHTML, appendData.REACT, appendData.SVELTE, appendData.VUE);
		const styleMax = Math.max(styleData.DOTHTML, styleData.REACT, styleData.SVELTE, styleData.VUE);

		const appendFasterThanReact = Math.round(appendData.REACT / appendData.DOTHTML);

		return dot.section({ class: "performance-section" },
			dot.div({ class: "title-group" },
				dot.h2({ class: "title" }, "Built for Speed"),
				dot.p({ class: "subtitle" }, "DOThtml outperforms traditional frameworks by eliminating the Virtual DOM overhead.")
			),
			dot.div({ class: "stats-grid", ref: this.benchmarksRef },
				// Append Rows Card
				dot.div({ class: "stat-card" },
					dot.div({ class: "stat-header" },
						dot.span({ class: "stat-label" }, "Append 1,000 Rows"),
						dot.span({ class: "stat-value" }, `${appendData.DOTHTML} ms`)
					),
					dot.div({ class: "bar-container" },
						this.renderBar("DOThtml", appendData.DOTHTML, appendMax, false),
						this.renderBar("React", appendData.REACT, appendMax, true),
						this.renderBar("Svelte", appendData.SVELTE, appendMax, true),
						this.renderBar("Vue", appendData.VUE, appendMax, true)
					),
					dot.p({ style: "font-size: 14px; color: var(--text-dim); margin-top: 10px;" }, 
						`DOThtml is ${appendFasterThanReact}x faster than React when appending new data to an existing list.`
					)
				),
				// Bulk Style Update Card
				dot.div({ class: "stat-card" },
					dot.div({ class: "stat-header" },
						dot.span({ class: "stat-label" }, "Bulk Style Update"),
						dot.span({ class: "stat-value" }, `${styleData.DOTHTML} ms`)
					),
					dot.div({ class: "bar-container" },
						this.renderBar("DOThtml", styleData.DOTHTML, styleMax, false),
						this.renderBar("React", styleData.REACT, styleMax, true),
						this.renderBar("Svelte", styleData.SVELTE, styleMax, true),
						this.renderBar("Vue", styleData.VUE, styleMax, true)
					),
					dot.p({ style: "font-size: 14px; color: var(--text-dim); margin-top: 10px;" }, 
						"Granular reactivity allows DOThtml to update styles with zero overhead."
					)
				)
			),
			// Size Comparison Module
			dot.div({ class: "size-comparison-module", ref: this.moduleRef },
				dot.div({ class: "size-comparison-grid" },
					// DOThtml Stack (4 boxes ~ 20kB)
					dot.div({ class: "stack-group" },
						dot.div({ class: "box-stack" },
							dot.each(new Array(4).fill(0), (v, i) => dot.div({ 
								class: this.isVisible.bindAs(v => v ? "box dothtml visible" : "box dothtml"),
								style: `transition-delay: ${i * 100}ms`
							}))
						),
						dot.div({ style: "text-align: center" },
							dot.div({ class: "stack-label" }, "DOThtml"),
							dot.div({ class: "stack-value" }, `${DOTHTML_COMPRESSED_SIZE} kB`)
						)
					),
					// React Stack (9 boxes ~ 45kB)
					dot.div({ class: "stack-group" },
						dot.div({ class: "box-stack" },
							dot.each(new Array(9).fill(0), (v, i) => dot.div({ 
								class: this.isVisible.bindAs(v => v ? "box react visible" : "box react"),
								style: `transition-delay: ${i * 100}ms`
							}))
						),
						dot.div({ style: "text-align: center" },
							dot.div({ class: "stack-label" }, "React + DOM"),
							dot.div({ class: "stack-value" }, "42.0 kB")
						)
					)
				),
				dot.p({ class: "subtitle", style: "font-size: 16px" }, "While React requires a heavy runtime to manage its Virtual DOM, DOThtml's lean engine provides more power with less than half the weight.")
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
				dot.span(value + " ms")
			),
			dot.div({ class: "bar-track" },
				dot.div({ 
					class: `bar-fill ${isCompetitor ? "competitor" : ""}`,
					style: this.benchmarksVisible.bindAs(v => `width: ${v ? width : 0}%`)
				})
			)
		);
	}
}
