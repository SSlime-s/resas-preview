import hclToRgb from "@fantasy-color/hcl-to-rgb";

import { clamp } from "./clamp";

export interface Rgb {
	red: number;
	green: number;
	blue: number;
}

export interface Hcl {
	hue: number;
	chroma: number;
	luminance: number;
}

export const COLORS_HCL: Readonly<Hcl[]> = Object.freeze([
	...Array.from({ length: 16 }, (_, i) => ({
		hue: (i * 360) / 16,
		chroma: 134,
		luminance: 60,
	})),
	...Array.from({ length: 16 }, (_, i) => ({
		hue: (i * 360) / 16,
		chroma: 134,
		luminance: 70,
	})),
	...Array.from({ length: 16 }, (_, i) => ({
		hue: (i * 360) / 16,
		chroma: 134,
		luminance: 50,
	})),
]);
export const COLORS_RGB: Readonly<Rgb[]> = Object.freeze(
	COLORS_HCL.map((hcl) => {
		const { red, green, blue } = hclToRgb(hcl);
		const range = [0, 255] as const;
		return {
			red: clamp(red, range),
			green: clamp(green, range),
			blue: clamp(blue, range),
		};
	})
);
export const COLORS_HEX: Readonly<`#${string}`[]> = Object.freeze(
	COLORS_RGB.map(rgbToHex)
);

export function rgbToHex(rgb: Rgb): `#${string}` {
	const { red, green, blue } = rgb;
	return `#${((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1)}`;
}
