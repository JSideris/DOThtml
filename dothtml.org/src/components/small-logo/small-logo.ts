import { dot, IDotComponent } from "dothtml";

@dot.component
export default class SmallLogo implements IDotComponent {
	stylize(s: any) {
		return s.class("logo-container", c => c
			.cursor("pointer")
			.display("flex")
			.alignItems("center")
		).class("logo-text", t => t
			.fontSizePx(24)
			.fontWeight(800)
			.letterSpacingPx(-1)
		).class("dot", d => d
			.color(s.v("primary"))
		).class("html", h => h
			.color(s.v("text"))
		);
	}

	build() {
		return dot.div({ class: "logo-container" },
			dot.div({ class: "logo-text" },
				dot.span({ class: "dot" }, "DOT")
				.span({ class: "html" }, "html")
			)
		);
	}
}
