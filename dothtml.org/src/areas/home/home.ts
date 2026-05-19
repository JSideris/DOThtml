import { dot, DotComponent } from "dothtml"
import HeroSection from "./sections/hero-section/hero-section";
import GetDot from "./sections/get-dot/get-dot";
import MainCodeSample from "./sections/main-code-sample/main-code-sample";
import PerformanceSection from "./sections/performance-section/performance-section";
import MainFeatures from "./sections/main-features/main-features";
import UseCases from "./sections/use-cases/use-cases";
import Footer from "./sections/footer/footer";

@dot.component
export default class Home extends DotComponent {
	stylize(s: any) {
		return s.class("home-container", h => h
			.maxWidthPx(1200)
			.margin("0 auto")
			.paddingPx(100, 20, 40, 20)
			.display("flex")
			.flexDirection("column")
			.gapPx(100)
			.position("relative")
			.zIndex(1)
		).media("screen and (max-width: 800px)", m => m
			.class("home-container", h => h
				.paddingPx(60, 10, 20, 10)
				.gapPx(40)
			)
		);
	}

	build() {
		return dot.div({ class: "home-container" },
			dot.mount(new HeroSection()),
			dot.mount(new GetDot()),
			dot.mount(new MainCodeSample()),
			dot.mount(new PerformanceSection()),
			dot.mount(new MainFeatures()),
			dot.mount(new UseCases()),
			dot.mount(new Footer())
		);
	}
}
