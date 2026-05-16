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
		isDarkMode: true
	}),
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
