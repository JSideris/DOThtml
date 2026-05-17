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
			this.primary.value = color;
		},
		toggleCycle() {
			this.isCycling.value = !this.isCycling.value;
			if (this.isCycling.value) {
				this.startCycling();
			}
		},
		startCycling() {
			let hue = 0;
			const cycle = () => {
				if (!this.isCycling.value) return;
				hue = (hue + 1) % 360;
				this.primary.value = `hsl(${hue}, 100%, 50%)`;
				this.secondary.value = `hsl(${(hue + 180) % 360}, 100%, 50%)`;
				requestAnimationFrame(cycle);
			};
			requestAnimationFrame(cycle);
		}
	},
	getters: {
		primaryHex: (state: any) => {
			const val = state.primary.value;
			if (val.startsWith("hsl")) {
				const match = val.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
				if (match) return hslToHex(Number(match[1]), Number(match[2]), Number(match[3]));
			}
			return val;
		},
		glassStyle: (state: any) => ({
			backgroundColor: state.glassBackground.value,
			backdropFilter: "blur(12px)",
			border: `1px solid ${state.glassBorder.value}`,
			borderRadius: "12px"
		})
	}
});

export const theme = useThemeStore();
