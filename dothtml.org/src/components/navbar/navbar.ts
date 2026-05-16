import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import NavBtn from "./nav-btn/nav-btn";
import SmallLogo from "../small-logo/small-logo";
import styles from "./navbar.css?inline";

@dot.component
export default class Navbar implements IDotComponent {
	private currentPath = dot.watch(window.location.hash || "#/");

	constructor() {
		window.addEventListener("hashchange", () => {
			this.currentPath.value = window.location.hash || "#/";
		});
	}

	navigate(path: string) {
		window.location.hash = `#/${path}`;
	}

	stylize() {
		return styles;
	}

	build() {
		return dot.nav({ class: "navbar" },
			dot.mount(new SmallLogo()).on("click", () => this.navigate("")),
			dot.div({ class: "nav-links" },
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
		);
	}
}
