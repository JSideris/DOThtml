import { dot, DotComponent } from "dothtml";

@dot.component
export default class HeroFeaturesPart extends DotComponent {
	private features = [
		{ 
			title: "Modern", 
			icon: "✨", 
			description: "Built to be competitive with modern frameworks. Component-based, reactive, mutable, and blazingly fast." 
		},
		{ 
			title: "Nimble", 
			icon: "🍃", 
			description: "Zero core dependencies. ~18kb bundle size. Extremely modular and plays nicely with any project." 
		},
		{ 
			title: "Fun", 
			icon: "🎮", 
			description: "Works the way you expect. All the power of modern frameworks with less salt and no XML markup." 
		}
	];

	stylize(s: any) {
		return s.class("features-container", c => c
			.display("flex")
			.justifyContent("center")
			.gapPx(30)
			.marginTopPx(60)
			.flexWrap("wrap")
			.widthP(100)
		).class("feature-card", f => f
			.flex("1 1 300px")
			.maxWidthPx(350)
			.paddingPx(30)
			.backgroundColor("rgba(255, 255, 255, 0.03)")
			.borderRadiusPx(20)
			.border("1px solid rgba(255, 255, 255, 0.08)")
			.transition("all 0.3s ease")
			.display("flex")
			.flexDirection("column")
			.alignItems("center")
			.textAlign("center")
			.backdropFilter("blur(10px)")
		).class("feature-card:hover", fh => fh
			.transform("translateY(-10px)")
			.backgroundColor("rgba(255, 255, 255, 0.06)")
			.borderColor(s.v("primary"))
			.boxShadow(`0 10px 30px rgba(0, 0, 0, 0.2)`)
		).class("feature-icon", i => i
			.fontSizePx(48)
			.marginBottomPx(20)
			.filter("drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))")
		).class("feature-title", t => t
			.fontSizePx(24)
			.fontWeight(700)
			.marginBottomPx(15)
			.color(s.v("primary"))
			.letterSpacingPx(1)
		).class("feature-description", d => d
			.fontSizePx(16)
			.lineHeight(1.6)
			.color(s.v("text-dim"))
		).media("screen and (max-width: 800px)", m => m
			.class("features-container", c => c
				.marginTopPx(30)
				.gapPx(20)
			).class("feature-card", f => f
				.paddingPx(20)
			)
		);
	}

	build() {
		return dot.div({ class: "features-container" },
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
