// declare global {
// 	interface Window {
// 		dot: IDotCore;
// 	}
// }

import { dot, Router } from "dothtml";
import Home from "./areas/home/home";
import Docs from "./areas/docs/docs";
import Navbar from "./components/navbar/navbar";
import AnimatedBackdrop from "./components/animated-backdrop/animated-backdrop";
import { theme } from "./store/theme-store";

// Global Theme Setup
dot.css.variable("bg", theme.background)
	.variable("surface", theme.surface)
	.variable("surface-light", theme.surfaceLight)
	.variable("primary", theme.primary)
	.variable("secondary", theme.secondary)
	.variable("text", theme.text)
	.variable("text-dim", theme.textDim)
	.variable("glass-bg", theme.glassBackground)
	.variable("glass-border", theme.glassBorder);

dot.useGlobalStyles(`
	:host {
		--bg: ${dot.css.v("bg")};
		--surface: ${dot.css.v("surface")};
		--surface-light: ${dot.css.v("surface-light")};
		--primary: ${dot.css.v("primary")};
		--secondary: ${dot.css.v("secondary")};
		--text: ${dot.css.v("text")};
		--text-dim: ${dot.css.v("text-dim")};
		--glass-bg: ${dot.css.v("glass-bg")};
		--glass-border: ${dot.css.v("glass-border")};
	}

	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	body {
		background-color: var(--bg);
		color: var(--text);
		font-family: 'Inter', sans-serif;
		line-height: 1.6;
		overflow-x: hidden;
	}

	code, pre {
		font-family: 'JetBrains Mono', monospace;
	}

	a {
		color: var(--primary);
		text-decoration: none;
		transition: color 0.2s;
	}

	a:hover {
		color: var(--secondary);
	}

	.glass {
		background: var(--glass-bg);
		backdrop-filter: blur(12px);
		border: 1px solid var(--glass-border);
		border-radius: 12px;
	}
`);

const routes = [
	{ path: "/", component: Home, title: "DOThtml - The Modern Web Framework" },
	{ path: "/docs", component: Docs, title: "DOThtml Documentation" },
	{ path: "/docs/:doc", component: Docs, title: "DOThtml Documentation" }
];

dot(document.body)
	.mount(new AnimatedBackdrop())
	.mount(new Navbar())
	.mount(new Router(), { routes });

// if (module["hot"]) {
// 	module["hot"].accept('./index.ts', () => {
// 		console.log("MODULE HOT SWAP???");
// 	});
// }