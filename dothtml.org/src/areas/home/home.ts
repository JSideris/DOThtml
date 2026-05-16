import { dot } from "dothtml"
import { IDotComponent } from "dothtml-interfaces";
import HeroSection from "./sections/hero-section/hero-section";
import GetDot from "./sections/get-dot/get-dot";
import MainCodeSample from "./sections/main-code-sample/main-code-sample";
import MainFeatures from "./sections/main-features/main-features";
import UseCases from "./sections/use-cases/use-cases";
import DetailedFeatures from "./sections/detailed-features/detailed-features";
import LearnMore from "./sections/learn-more/learn-more";
import Contribute from "./sections/contribute/contribute";
import Footer from "./sections/footer/footer";
import styles from "./home.css?inline";

@dot.component
export default class Home implements IDotComponent {
	stylize() {
		return styles;
	}

	build() {
		return dot.div({ class: "home-container" },
			dot.mount(new HeroSection()),
			dot.mount(new GetDot()),
			dot.mount(new MainCodeSample()),
			dot.mount(new MainFeatures()),
			dot.mount(new UseCases()),
			dot.mount(new DetailedFeatures()),
			dot.mount(new LearnMore()),
			dot.mount(new Contribute()),
			dot.mount(new Footer())
		);
	}
}
