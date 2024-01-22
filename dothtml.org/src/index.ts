// declare global {
// 	interface Window {
// 		dot: IDotCore;
// 	}
// }

import { dot } from "dothtml";
import Home from "./areas/home/home";
import styles from "./index.css";
import Navbar from "./components/navbar/navbar";

dot.useStyles(document, styles);

// TODO: switch to using the router.
dot(document.body)
	.mount(new Navbar())
	.mount(new Home());

