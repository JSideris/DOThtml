import { dot } from "dothtml";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";
import styles from "./hero-features-part.css";

@dot.component
@dot.component.useStyles(styles)
class HeroFeaturesPart implements IComponent{
	events?: string[];
	_?: FrameworkItems;
	build(...args: any[]): IDotGenericElement {
		return dot.div(
			dot
				.div(dot
					.h3("Modern")
					.p("Built to be competitive wilth other modern frameworks. DOThtml is component-based (utilizing the shadow DOM). Components are reactive and mutable. Everything is strongly typed and blazingly fast.")
				).class("info-section")
				.div(dot
					.h3("Nimble")
					.p("Zero dependencies. ~20kb bundle size. Plays nicely with other frameworks. Designed to be extremely modular - as in the entire framework can be decoupled from your app using DI.")
				).class("info-section")
				.div(dot
					.h3("Fun")
					.p("DOThtml just works the way you expect it to. It does all the major stuff other modern frameworks can do (and pleanty of stuff they can't) with less salt. No more XML-based markup!")
				).class("info-section")
		).id("content");
	}

}

export default HeroFeaturesPart;