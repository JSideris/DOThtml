import { dot, IDotComponent } from "dothtml";
import NavBtn from "./nav-btn/nav-btn";
import SmallLogo from "../small-logo/small-logo";

@dot.component
export default class Navbar implements IDotComponent {
	private currentPath = dot.state(window.location.hash || "#/");

	constructor() {
		window.addEventListener("hashchange", () => {
			this.currentPath.value = window.location.hash || "#/";
		});
	}

	navigate(path: string) {
		window.location.hash = `#/${path}`;
	}

	stylize(s: any) {
		return s.class("navbar", n => n
			.position("fixed")
			.topPx(0)
			.leftPx(0)
			.rightPx(0)
			.heightPx(70)
			.display("flex")
			.alignItems("center")
			.zIndex(1000)
			.backgroundColor("rgba(5, 5, 5, 0.8)")
			.backdropFilter("blur(12px)")
			.borderBottom("1px solid rgba(255, 255, 255, 0.05)")
		).class("navbar-inner", i => i
			.display("flex")
			.alignItems("center")
			.justifyContent("space-between")
			.widthP(100)
			.maxWidthPx(1200)
			.margin("0 auto")
			.paddingPx(0, 20)
		).class("nav-links", l => l
			.display("flex")
			.gapPx(10)
		).media("screen and (max-width: 600px)", m => m
			.class("navbar-inner", nb => nb
				.paddingPx(0, 15)
			).class("nav-links", nl => nl
				.gapPx(5)
			)
		);
	}

	build() {
		return dot.nav({ class: "navbar" },
			dot.div({ class: "navbar-inner" },
				dot.mount(new SmallLogo()).on("click", () => this.navigate("")),
				dot.div({ class: "nav-links" },
					dot.mount(new NavBtn({ 
						text: "Home", 
						active: this.currentPath.bindAs(p => p === "#/" || p === "")
					})).on("click", () => this.navigate("")),
					dot.mount(new NavBtn({ 
						text: "Docs", 
						active: this.currentPath.bindAs(p => p.startsWith("#/docs"))
					})).on("click", () => this.navigate("docs")),
					dot.mount(new NavBtn({ 
						text: "Examples",
						active: this.currentPath.bindAs(p => p === "#/examples")
					})).on("click", () => this.navigate("examples")),
					dot.mount(new NavBtn({ 
						text: "Blog",
						active: this.currentPath.bindAs(p => p === "#/blog")
					})).on("click", () => this.navigate("blog")),
					dot.mount(new NavBtn({ text: "🌐" }))
				)
			)
		);
	}
}
