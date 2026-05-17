import { dot, DotComponent } from "dothtml";

interface NavBtnProps {
	text: string;
	active?: boolean;
}

@dot.component
export default class NavBtn extends DotComponent<NavBtnProps> {
	static props = {
		text: { type: String, required: true },
		active: { type: Boolean, default: false }
	};

	stylize(s: any) {
		return s.class("nav-btn", b => b
			.paddingPx(8, 16)
			.borderRadiusPx(8)
			.color(s.v("text-dim"))
			.fontSizePx(15)
			.fontWeight(500)
			.cursor("pointer")
			.transition("all 0.2s")
			.display("flex")
			.alignItems("center")
			.justifyContent("center")
		).class("nav-btn:hover", bh => bh
			.color(s.v("text"))
			.backgroundColor("rgba(255, 255, 255, 0.05)")
		).class("nav-btn.active", ba => ba
			.color(s.v("primary"))
			.backgroundColor("rgba(255, 152, 0, 0.1)")
			.fontWeight(600)
		).media("screen and (max-width: 600px)", m => m
			.class("nav-btn", b => b
				.paddingPx(6, 10)
				.fontSizePx(13)
			)
		);
	}

	build() {
		return dot.a({ 
			class: ["nav-btn", { active: this.props.active }] 
		}, this.props.text);
	}
}
