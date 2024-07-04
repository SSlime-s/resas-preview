import { createTheme } from "@kuma-ui/core";

const theme = createTheme({
	breakpoints: {
		// NOTE: from charcoal https://pixiv.github.io/charcoal/?path=/docs/tailwind-config-screens--docs
		screen1: "0px",
		screen2: "744px",
		screen3: "952px",
		screen4: "1160px",
		screen5: "1368px",
	},
});

type UserTheme = typeof theme;

declare module "@kuma-ui/core" {
	export interface Theme extends UserTheme {}
}

export default theme;
