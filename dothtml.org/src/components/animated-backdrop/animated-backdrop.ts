import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import { theme } from "../../store/theme-store";

@dot.component
export default class AnimatedBackdrop implements IDotComponent {
	stylize(s: any) {
		return s.class("backdrop", b => b
			.position("fixed")
			.topPx(0)
			.leftPx(0)
			.widthP(100)
			.heightP(100)
			.zIndex(0)
			.backgroundColor(s.v("bg"))
			.overflow("hidden")
		).class("grid", g => g
			.position("absolute")
			.topP(-50)
			.leftP(-50)
			.widthP(200)
			.heightP(200)
			.backgroundImage(theme.primary.bindAs(p => `linear-gradient(${p}1a 1px, transparent 1px), linear-gradient(90deg, ${p}1a 1px, transparent 1px)`))
			.backgroundSize("50px 50px")
			.transform("perspective(500px) rotateX(60deg)")
			.animation("move-grid 20s linear infinite")
		).class("glow", gl => gl
			.position("absolute")
			.topP(50)
			.leftP(50)
			.widthPx(600)
			.heightPx(600)
			.background(theme.primary.bindAs(p => `radial-gradient(circle, ${p}33 0%, transparent 70%)`))
			.borderRadiusP(50)
			.transform("translate(-50%, -50%)")
			.filter("blur(80px)")
			.animation("pulse-glow 10s ease-in-out infinite")
		);
	}

	build() {
		return dot.div({ class: "backdrop" },
			dot.div({ class: "grid" }),
			dot.div({ class: "glow" })
		);
	}
}

