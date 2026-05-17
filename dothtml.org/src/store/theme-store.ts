import { dot } from "dothtml";

function hslToHex(h: number, s: number, l: number) {
	l /= 100;
	const a = s * Math.min(l, 1 - l) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color).toString(16).padStart(2, '0');
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string) {
	let r = parseInt(hex.slice(1, 3), 16) / 255;
	let g = parseInt(hex.slice(3, 5), 16) / 255;
	let b = parseInt(hex.slice(5, 7), 16) / 255;
	let max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;
	if (max == min) {
		h = s = 0;
	} else {
		let d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}
	return { h: h * 360, s: s * 100, l: l * 100 };
}

export const useThemeStore = dot.store({
	id: "theme",
	state: () => ({
		background: "#050505",
		surface: "#0a0a0a",
		surfaceLight: "#151515",
		primary: "#ff9800", // DOThtml Orange
		secondary: "#00f2ff", // Cyber Cyan
		text: "#ffffff",
		textDim: "#a0a0a0",
		glassBackground: "rgba(10, 10, 10, 0.7)",
		glassBorder: "rgba(255, 255, 255, 0.1)",
		isDarkMode: true,
		isCycling: false
	}),
	actions: {
		setPrimary(color: string) {
			if (!color) return;
			this.primary.value = color;
		},
		toggleCycle() {
			this.isCycling.value = !this.isCycling.value;
			if (this.isCycling.value) {
				this.startCycling();
			}
		},
		startCycling() {
			const currentHsl = hexToHsl(this.primary.value);
			let hue = currentHsl.h;
			const cycle = () => {
				if (!this.isCycling.value) return;
				hue = (hue + 1) % 360;
				let pVal = hslToHex(hue, 100, 50);
				let sVal = hslToHex((hue + 180) % 360, 100, 50);
				this.primary.value = pVal;
				this.secondary.value = sVal;
				requestAnimationFrame(cycle);
			};
			requestAnimationFrame(cycle);
		}
	},
	getters: {
		glassStyle: (state: any) => ({
			backgroundColor: state.glassBackground.value,
			backdropFilter: "blur(12px)",
			border: `1px solid ${state.glassBorder.value}`,
			borderRadius: "12px"
		})
	}
});

export const theme = useThemeStore();
