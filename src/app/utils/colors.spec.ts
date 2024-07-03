import { rgbToHex } from "./colors";

describe("rgbToHex", () => {
	it("RGBを16進数に変換できる", () => {
		expect(rgbToHex({ red: 255, green: 0, blue: 0 })).toBe("#ff0000");
		expect(rgbToHex({ red: 0, green: 255, blue: 0 })).toBe("#00ff00");
		expect(rgbToHex({ red: 0, green: 0, blue: 255 })).toBe("#0000ff");
	});
});
