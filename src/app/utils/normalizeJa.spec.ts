import { normalizeToKatakana } from "./normalizeJa";

describe("normalizeToKatakana", () => {
	it("ひらがなをカタカナにできる", () => {
		expect(normalizeToKatakana("こんにちは、ば、ぱ、ゃっ")).toBe(
			"コンニチハ、バ、パ、ャッ"
		);
	});
	it("カタカナはそのまま", () => {
		expect(normalizeToKatakana("コンニチハ")).toBe("コンニチハ");
	});
	it("ひらがなとカタカナが混ざっていても変換できる", () => {
		expect(normalizeToKatakana("こんにちは、コンニチハ")).toBe(
			"コンニチハ、コンニチハ"
		);
	});
	it("漢字とひらがなが混ざっていても変換できる", () => {
		expect(normalizeToKatakana("こんにちは、今日は")).toBe(
			"コンニチハ、今日ハ"
		);
	});
});
