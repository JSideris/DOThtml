import { dot } from "dothtml";
import { IDotComponent } from "dothtml-interfaces";
import styles from "./main-code-sample.css?inline";

@dot.component
export default class MainCodeSample implements IDotComponent {
	private count = dot.watch(0);

	stylize() {
		return styles;
	}

	build() {
		const code = `
@dot.component
class Counter implements IDotComponent {
  count = dot.watch(0);

  build() {
    return dot.div(
      dot.h1(this.count),
      dot.button({ 
        onClick: () => this.count.value++ 
      }, "Increment")
    );
  }
}`;

		return dot.div({ class: "code-sample-container" },
			dot.div({ class: "code-pane" },
				dot.pre(dot.code(code))
			),
			dot.div({ class: "preview-pane" },
				dot.div({ class: "counter-display" }, this.count),
				dot.button({ 
					class: "btn",
					onClick: () => this.count.value++ 
				}, "Increment")
			)
		);
	}
}
