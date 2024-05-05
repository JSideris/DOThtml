import { dot } from "dothtml";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";
import styles from "./navbar.css";
import NavBtn from "./nav-btn/nav-btn";
import SmallLogo from "../small-logo/small-logo";

// @dot.component
// @dot.component.useStyles(styles)
const Navbar = dot.component(
	class implements IDotComponent{
		_?: FrameworkItems;

		navigate(location){
			console.log(location);
		}

		build() {
			return dot.nav(
				{id: "container"},
				dot
				.mount(new SmallLogo())//.on("click", ()=>{ this.navigate("docs"); })
				.mount(new NavBtn({ 
					text: "Docs", 
					click: ()=>this.navigate("docs")
				}))//.on("click", ()=>{ this.navigate("docs"); })
				.mount(new NavBtn({ 
					text: "Examples",
					click: ()=>this.navigate("examples")
				}))//.on("click", ()=>{ this.navigate("examples"); })
				.mount(new NavBtn({ 
					text: "Blog",
					click: ()=>this.navigate("blog")
				}))//.on("click", ()=>{ this.navigate("blog"); })
				.mount(new NavBtn({ 
					text: "🌐",
					// click: ()=>this.navigate("language")
				}))
			);
		}

	}, [styles]
);

export default Navbar;