import { dot } from "dothtml";
import { FrameworkItems, IComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";
import styles from "./navbar.css";
import NavBtn from "./nav-btn/nav-btn";
import SmallLogo from "../small-logo/small-logo";

@dot.component
@dot.component.useStyles(styles)
class Navbar implements IComponent{
	_?: FrameworkItems;

	navigate(location){
		console.log(location);
	}

	build(...args: any[]): IDotGenericElement {
		return dot.nav(
			dot
			.mount(new SmallLogo())//.on("click", ()=>{ this.navigate("docs"); })
			.mount(new NavBtn("Docs"))//.on("click", ()=>{ this.navigate("docs"); })
			.mount(new NavBtn("Examples"))//.on("click", ()=>{ this.navigate("examples"); })
			.mount(new NavBtn("Blog"))//.on("click", ()=>{ this.navigate("blog"); })
			.mount(new NavBtn("🌐"))
		).id("container");
	}

}

export default Navbar;