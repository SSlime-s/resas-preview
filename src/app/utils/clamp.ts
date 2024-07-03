export function clamp(value: number, range: readonly [number, number]) {
	return Math.max(range[0], Math.min(range[1], value));
}
