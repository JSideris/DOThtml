// declare global {
// 	interface Window {
// 		dot: IDotCore;
// 	}
// }

import { dot, Router } from "dothtml";
import Home from "./areas/home/home";
import styles from "./index.css?inline";
import Navbar from "./components/navbar/navbar";

dot.useStyles(document, styles);

const routes = [
	{ path: "/", component: Home, title: "DOThtml - The Modern Web Framework" },
	{ path: "/docs", component: dot.div("Documentation coming soon..."), title: "DOThtml Documentation" }
];

dot(document.body)
	.mount(new Navbar())
	.mount(new Router(), { routes });

// if (module["hot"]) {
// 	module["hot"].accept('./index.ts', () => {
// 		console.log("MODULE HOT SWAP???");
// 	});
// }