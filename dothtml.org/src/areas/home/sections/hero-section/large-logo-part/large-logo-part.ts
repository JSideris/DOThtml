import { dot, IDotComponent, IReactive } from "dothtml";
import { theme } from "../../../../../store/theme-store";

type Orbiter = {
	x: IReactive<number>
	y: IReactive<number>
	z: IReactive<number>
};

@dot.component
export default class LargeLogoPart implements IDotComponent {
	private orbiter1: Orbiter = { x: dot.state(0), y: dot.state(0), z: dot.state(0) };
	private orbiter2: Orbiter = { x: dot.state(0), y: dot.state(0), z: dot.state(0) };
	private mouseX = dot.state(0);
	private mouseY = dot.state(0);

	private orbiter1Transform = dot.computed(() => 
		`rotateX(60deg) rotateY(60deg) translate3d(${this.orbiter1.x.value}px, ${this.orbiter1.y.value}px, 0px) rotateY(-60deg) rotateX(-60deg)`
	);

	private orbiter2Transform = dot.computed(() => 
		`rotateX(-60deg) rotateY(50deg) translate3d(${this.orbiter2.x.value}px, ${this.orbiter2.y.value}px, 0px) rotateY(-50deg) rotateX(60deg)`
	);

	private logoTransform = dot.computed(() => 
		`rotateY(${this.mouseX.value}deg) rotateX(${-this.mouseY.value}deg)`
	);

	mounted(): void {
		this.animate();
		window.addEventListener("mousemove", (e) => {
			this.mouseX.setValue((e.clientX / window.innerWidth - 0.5) * 20);
			this.mouseY.setValue((e.clientY / window.innerHeight - 0.5) * 20);
		});
	}

	animate() {
		requestAnimationFrame(() => this.animate());
		let t = Date.now();
		this.calculateOrbitPosition(160, 0.2, 1300, t, this.orbiter1);
		this.calculateOrbitPosition(160, 0.3, 1400, t, this.orbiter2);
	}

	calculateOrbitPosition(a: number, e: number, T: number, t: number, out: Orbiter) {
		let n = 2 * Math.PI / T;
		let M = n * t;
		let E = M;
		for (let i = 0; i < 10; i++) {
			E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
		}
		let trueAnomaly = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
		let r = a * (1 - e * e) / (1 + e * Math.cos(trueAnomaly));
		out.x.setValue(r * Math.cos(trueAnomaly));
		out.y.setValue(r * Math.sin(trueAnomaly));
		out.z.setValue(0);
	}

	stylize(s: any) {
		return s.class("logo-container", c => c
			.display("flex")
			.flexDirection("column")
			.alignItems("center")
			.justifyContent("center")
			.paddingPx(40)
			.perspective(1000)
		).class("logo-main", m => m
			.display("flex")
			.alignItems("center")
			.fontSizePx(120)
			.fontWeight(900)
			.letterSpacingPx(-5)
			.position("relative")
			.userSelect("none")
			.transformStyle("preserve-3d")
		).class("dot-text", d => d
			.color(s.v("primary"))
			.textShadow(theme.primary.bindAs(p => `0 0 30px ${p}4d`))
			.display("flex")
			.alignItems("center")
			.transformStyle("preserve-3d")
		).class("o-wrapper", o => o
			.position("relative")
			.display("inline-flex")
			.alignItems("center")
			.justifyContent("center")
			.transformStyle("preserve-3d")
		).class("html-text", h => h
			.color(s.v("text"))
		).class("orbiter", o => o
			.position("absolute")
			.widthPx(12)
			.heightPx(12)
			.backgroundColor(s.v("secondary"))
			.borderRadiusP(50)
			.boxShadow(`0 0 20px ${s.v("secondary")}, 0 0 40px ${s.v("secondary")}66`)
			.display("flex")
			.alignItems("center")
			.justifyContent("center")
			.color("transparent")
		).class("tagline", t => t
			.fontSizePx(24)
			.color(s.v("text-dim"))
			.marginTopPx(20)
			.fontWeight(300)
			.letterSpacingPx(2)
		).media("screen and (max-width: 1000px)", m => m
			.class("logo-container", c => c
				.paddingPx(20)
			).class("logo-main", lm => lm
				.fontSizePx(80)
			).class("tagline", tl => tl
				.fontSizePx(18)
			)
		);
	}

	build() {
		return dot.div({ class: "logo-container" },
			dot.div({ 
				class: "logo-main",
				style: s => s.transform(this.logoTransform)
			},
				dot.span({ class: "dot-text" }, 
					dot.span({ style: s => s.transform(t => t.translateZ("1px")) }, "D"),
					dot.span({ class: "o-wrapper" }, 
						dot.span({ style: s => s.transform(t => t.translateZ("1px")) }, "O"),
						dot.div({
							class: "orbiter",
							style: s => s.transform(this.orbiter1Transform)
						}),
						dot.div({
							class: "orbiter",
							style: s => s.transform(this.orbiter2Transform)
						})
					),
					dot.span({ style: s => s.transform(t => t.translateZ("1px")) }, "T")
				),
				dot.span({ class: "html-text", style: s => s.transform(t => t.translateZ("1px")) }, "html")
			),
			dot.div({ class: "tagline" }, "Redefine web development.")
		);
	}
}
