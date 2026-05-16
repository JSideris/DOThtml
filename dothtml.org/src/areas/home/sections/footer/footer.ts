import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import styles from "./footer.css?inline";

@dot.component
export default class Footer implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.footer({ class: "footer" },
			dot.p(`© ${new Date().getFullYear()} DOThtml. Built with DOThtml 6.`),
			dot.p("Released under the ISC License.")
		);
	}
}
