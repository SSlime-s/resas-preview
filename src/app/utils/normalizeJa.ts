export function normalizeToKatakana(raw: string): string {
	return raw
		.normalize("NFKC")
		.replace(/\p{Script=Hiragana}/gu, (c) =>
			String.fromCodePoint(c.codePointAt(0)! + 0x60)
		);
}
