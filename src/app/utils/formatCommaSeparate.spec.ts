import { formatCommaSeparate } from "./formatCommaSeparate";

describe("formatCommaSeparate", () => {
	it("コンマ区切りに変換できる", () => {
		expect(formatCommaSeparate(1234)).toBe("1,234");
	});

	it("大きい数値もコンマ区切りに変換できる", () => {
		expect(formatCommaSeparate(1234567890)).toBe("1,234,567,890");
	});

	it("マイナスの数値もコンマ区切りに変換できる", () => {
		expect(formatCommaSeparate(-1234)).toBe("-1,234");
	});
});
