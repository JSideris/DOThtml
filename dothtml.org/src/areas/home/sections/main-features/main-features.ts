import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";

@dot.component
export default class MainFeatures implements IDotComponent {
	private features = [
		{ title: "Zero Dependencies", description: "A ~20kb footprint that won't bloat your project.", icon: "📦" },
		{ title: "Reactive State", description: "Data-driven updates that just work, with built-in batching.", icon: "⚡" },
		{ title: "Shadow DOM Native", description: "Built-in encapsulation ensures your components work perfectly.", icon: "🛡️" },
		{ title: "Strongly Typed", description: "Built with TypeScript for maximum developer productivity.", icon: "📘" },
		{ title: "Fluent Styling", description: "Type-safe, reactive styling system integrated with reactivity.", icon: "🎨" },
		{ title: "Concurrent Rendering", description: "Keeps your UI responsive even during large updates.", icon: "🚀" }
	];

	stylize(s: any) {
		return s.class("features-grid", g => g
			.display("grid")
			.gridTemplateColumns("repeat(auto-fit, minmax(300px, 1fr))")
			.gapPx(30)
			.widthP(100)
		).class("feature-card", c => c
			.paddingPx(40)
			.backgroundColor("rgba(255, 255, 255, 0.02)")
			.border("1px solid rgba(255, 255, 255, 0.05)")
			.borderRadiusPx(24)
			.transition("all 0.3s ease")
			.display("flex")
			.flexDirection("column")
			.gapPx(15)
		).class("feature-card:hover", ch => ch
			.backgroundColor("rgba(255, 255, 255, 0.04)")
			.borderColor(s.v("primary"))
			.transform("translateY(-5px)")
		).class("feature-icon", i => i
			.fontSizePx(40)
			.marginBottomPx(10)
		).class("feature-title", t => t
			.fontSizePx(22)
			.fontWeight(700)
			.color(s.v("primary"))
		).class("feature-description", d => d
			.color(s.v("text-dim"))
			.lineHeight(1.6)
		).media("screen and (max-width: 600px)", m => m
			.class("features-grid", g => g
				.gridTemplateColumns("1fr")
				.gapPx(20)
			).class("feature-card", c => c
				.paddingPx(30)
			)
		);
	}

	build() {
		return dot.div({ class: "features-grid" },
			dot.each(this.features, feature => 
				dot.div({ class: "feature-card" },
					dot.div({ class: "feature-icon" }, feature.icon),
					dot.h3({ class: "feature-title" }, feature.title),
					dot.p({ class: "feature-description" }, feature.description)
				)
			)
		);
	}
}
