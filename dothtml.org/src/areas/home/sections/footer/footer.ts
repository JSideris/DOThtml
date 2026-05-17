import { dot, DotComponent } from "dothtml";

@dot.component
export default class Footer extends DotComponent {
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
			dot.p(
				dot.span("Released under the ISC License. "),
				dot.a({ href: "https://github.com/JSideris/DOThtml", target: "_blank" }, "View on GitHub")
			)
		);
	}
}
