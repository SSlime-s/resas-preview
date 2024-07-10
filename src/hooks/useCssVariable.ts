import { useEffect, useState } from "react";

function getVariableFromCssVars<Key extends string>(
	keys: Readonly<Key[]>
): Partial<Record<Key, string>> {
	if (typeof window === "undefined") {
		return {};
	}

	const style = window.getComputedStyle(document.documentElement);

	return Object.fromEntries(
		keys.map((key) => [key, style.getPropertyValue(key)] as const)
	) as Partial<Record<Key, string>>;
}

export function useCssVariable<Key extends string>(
	keys: Readonly<Key[]>
): Partial<Record<Key, string | undefined>> {
	const [color, setColor] = useState<Partial<Record<Key, string | undefined>>>(
		() => getVariableFromCssVars(keys)
	);

	useEffect(() => {
		if (
			typeof window === "undefined" ||
			typeof window.matchMedia !== "function"
		) {
			return;
		}

		function onChange() {
			setColor(getVariableFromCssVars(keys));
		}

		const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
		if (typeof mediaQueryList.addEventListener !== "function") {
			return;
		}

		mediaQueryList.addEventListener("change", onChange);

		return () => {
			mediaQueryList.removeEventListener("change", onChange);
		};
		// NOTE: key の変更では再実行しない
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return color;
}
