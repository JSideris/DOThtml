import { dot, IDotComponent } from "dothtml";
import MarkdownViewer from "../../../../../components/MarkdownViewer/MarkdownViewer";

@dot.component
export default class HeroFeaturesPart implements IDotComponent {
	stylize(s: any) {
		return s.class("features-container", c => c
			.display("flex")
			.justifyContent("center")
			.gapPx(20)
			.marginTopPx(40)
			.flexWrap("wrap")
		);
	}

	build() {
		return dot.div({ class: "features-container" },
			dot.mount(new MarkdownViewer({ src: "/docs/hero-features.md" }))
		);
	}
}
