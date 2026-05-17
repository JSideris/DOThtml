import { dot } from "dothtml";

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
		glassStyle: (state: any) => ({
			backgroundColor: state.glassBackground.value,
			backdropFilter: "blur(12px)",
			border: `1px solid ${state.glassBorder.value}`,
			borderRadius: "12px"
		})
	}
});

export const theme = useThemeStore();
