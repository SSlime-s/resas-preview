// Source: https://madefor.github.io/jisx0401/api/v1/jisx0401.json (https://github.com/madefor/jisx0401)
import jisx from "./jisx.json";

interface Yomi {
	katakana: string;
	english: string;
}
export function getPrefYomiMap(): Map<string, Yomi> {
	return new Map(
		Object.entries(jisx).map(([_, { en, ja, "ja-kana": jaKana }]) => [
			ja,
			{ katakana: jaKana, english: en },
		])
	);
}
