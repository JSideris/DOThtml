import { dot } from "dothtml";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";
import styles from "./hero-features-part.css";

@dot.component
@dot.component.useStyles(styles)
class HeroFeaturesPart implements IDotComponent{
	events?: string[];
	_?: FrameworkItems;
	build() {
		return dot.div(
			{ id: "content" },
			dot
				.div({ class: "info-section" },
					dot
					.h3("Modern")
					.p("Built to be competitive wilth other modern frameworks. DOThtml is component-based (utilizing the shadow DOM). Components are reactive and mutable. Everything is strongly typed and blazingly fast.")
				)
				.div({ class: "info-section" },
					dot
					.h3("Nimble")
					.p("Zero core dependencies. ~20kb bundle size. Plays nicely with other frameworks. Designed to be extremely modular - as in the entire framework can be decoupled from your app using DI.")
				)
				.div({ class: "info-section" },
					dot
					.h3("Fun")
					.p("DOThtml just works the way you expect it to. It does all the major stuff other modern frameworks can do (and pleanty of stuff they can't) with less salt. No more XML-based markup!")
				)
		);
	}

}

export default HeroFeaturesPart;