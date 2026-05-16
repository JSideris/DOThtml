import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";

@dot.component
export default class Footer implements IDotComponent {
	stylize(s: any) {
		return s.class("footer", f => f
			.paddingPx(60, 20)
			.textAlign("center")
			.color(s.v("text-dim"))
			.fontSizePx(14)
			.borderTop("1px solid rgba(255, 255, 255, 0.05)")
			.marginTopPx(100)
		);
	}

	build() {
		return dot.footer({ class: "footer" },
			dot.p(`© ${new Date().getFullYear()} DOThtml. Built with DOThtml 6.`),
			dot.p("Released under the ISC License.")
		);
	}
}
