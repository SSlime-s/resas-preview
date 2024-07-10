import { atom, useAtomValue } from "jotai";

type ColorScheme = "light" | "dark";

function getColorScheme(): ColorScheme {
	if (typeof window === "undefined") {
		return "light";
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

const colorSchemeAtom = atom(getColorScheme());
colorSchemeAtom.onMount = (set) => {
	if (
		typeof window === "undefined" ||
		typeof window.matchMedia !== "function"
	) {
		return;
	}

	function onChange(e: MediaQueryListEvent) {
		set(e.matches ? "dark" : "light");
	}
	const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

	if (typeof mediaQueryList.addEventListener !== "function") {
		return;
	}

	mediaQueryList.addEventListener("change", onChange);
	return () => {
		mediaQueryList.removeEventListener("change", onChange);
	};
};

export function useColorScheme() {
	return useAtomValue(colorSchemeAtom);
}
