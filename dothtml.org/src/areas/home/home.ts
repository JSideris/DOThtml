import { dot } from "dothtml"
import { FrameworkItems, IComponent, 
	IDotGenericElement } from "dothtml-interfaces";
import homeStyles from "./home.css";
import HeroSection from "./sections/hero-section/hero-section";
import GetDot from "./sections/get-dot/get-dot";
import MainCodeSample from "./sections/main-code-sample/main-code-sample";
import MainFeatures from "./sections/main-features/main-features";
import DetailedFeatures from "./sections/detailed-features/detailed-features";
import LearnMore from "./sections/learn-more/learn-more";
import Contribute from "./sections/contribute/contribute";
import Footer from "./sections/footer/footer";

@dot.component
@dot.component.useStyles(homeStyles)
class Home implements IComponent{
	_?: FrameworkItems;
	build(): IDotGenericElement {
		return dot.div(
			dot.mount(new HeroSection())
			.mount(new GetDot())
			.mount(new MainCodeSample())
			.mount(new MainFeatures())
			.mount(new DetailedFeatures())
			.mount(new LearnMore())
			.mount(new Contribute())
			.mount(new Footer())
		).class("central-pane");
	}
}


// const Home = dot.component(
// 	class implements IComponent{
// 		_?: FrameworkItems;
// 		build(...args: any[]): IDotGenericElement {
// 			return dot.div("HELLO, WORLD!");
// 		}
// 	}, 
// 	[homeStyles]
// );
			
export default Home;